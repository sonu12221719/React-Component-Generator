// /services/codegen.js
import * as parser from '@babel/parser'; // for validating snippet
import prettier from 'prettier';
import File from '../models/File.js';
import NodeMap from '../models/NodeMap.js';
import Project from '../models/Project.js';
import Revision from '../models/Revision.js';
import Run from '../models/Run.js';
import { injectNodeIds } from './ast.js';
import { extractJSXByNodeId, replaceJSXByNodeId } from './astReplace.js';
import { llmGenerateComponent, llmModifyComponent } from './llm.js';

async function formatCode(code) {
  try {
    return await prettier.format(code, { parser: 'babel' });
  } catch {
    // fallback if prettier fails
    return code;
  }
}

export async function generateComponent({ projectId, prompt, userId, settings = {} }) {
  const run = await Run.create({ projectId, userId, type: 'generate' });

  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) throw new Error('Project not found or not owned by user');

  const parentRevisionId = project.currentRevisionId || null;
  const revision = await Revision.create({
    projectId,
    parentRevisionId,
    createdBy: 'llm',
    message: `Generate: ${prompt.slice(0, 80)}`,
  });

  try {
    const output = await llmGenerateComponent(prompt, settings);
    const { files = [], deps = {} } = output;

    let filesChanged = 0;

    for (const f of files) {
      const formatted = await formatCode(f.code);
      const { code: withIds, nodes } = injectNodeIds(formatted);

      await File.create({
        projectId,
        revisionId: revision._id,
        path: f.path,
        code: withIds,
        isEntry: filesChanged === 0, // mark first file as entry (optional)
      });

      await NodeMap.create({
        revisionId: revision._id,
        filePath: f.path,
        nodes,
      });

      filesChanged++;
    }

    revision.filesChanged = filesChanged;
    await revision.save();

    project.currentRevisionId = revision._id;
    await project.save();

    run.status = 'ok';
    await run.save();

    // Return latest files for preview
    const savedFiles = await File.find({ projectId, revisionId: revision._id });
    return {
      revisionId: revision._id,
      files: savedFiles.map((f) => ({ path: f.path, code: f.code })),
      deps,
    };
  } catch (err) {
    run.status = 'error';
    run.errorMessage = err.message;
    await run.save();
    throw err;
  }
}

export async function modifyComponent({ projectId, filePath, nodeId, instruction, userId }) {
    const run = await Run.create({ projectId, userId, type: 'modify' });
  
    const project = await Project.findOne({ _id: projectId, userId });
    if (!project) throw new Error('Project not found or not owned by user');
  
    const currentRevisionId = project.currentRevisionId;
    if (!currentRevisionId) throw new Error('No revision to modify');
  
    const fileDoc = await File.findOne({ projectId, revisionId: currentRevisionId, path: filePath });
    if (!fileDoc) throw new Error('File not found in current revision');

    let selectedCode = '';
    let patchedSnippet = '';

    try {
      const fullCode = fileDoc.code;

      // 1) Extract the JSX of the node (safe, AST-based)
      const { code: jsxToEdit } = extractJSXByNodeId(fullCode, nodeId);
      selectedCode = jsxToEdit;

      // 2) Ask LLM to modify
      const res = await llmModifyComponent(selectedCode, instruction);
      if (!res || typeof res.code !== 'string') {
        throw new Error('LLM did not return a valid { code } payload');
      }
      patchedSnippet = res.code;

      // 3) Validate snippet parses as a JSX expression
      parser.parseExpression(patchedSnippet, { plugins: ['jsx'] });

      // 4) Replace by nodeId at AST level (no brittle slicing)
      const newCodeRaw = replaceJSXByNodeId(fullCode, nodeId, patchedSnippet);

      // 5) Format, re-inject node ids, persist
      const formatted = await formatCode(newCodeRaw);
      const { code: withIds, nodes } = injectNodeIds(formatted);

      const revision = await Revision.create({
        projectId,
        parentRevisionId: currentRevisionId,
        createdBy: 'llm',
        message: `Modify(${filePath}): ${instruction.slice(0, 80)}`,
        filesChanged: 1,
      });

      await File.create({
        projectId,
        revisionId: revision._id,
        path: filePath,
        code: withIds,
        isEntry: fileDoc.isEntry,
      });

      await NodeMap.create({
        revisionId: revision._id,
        filePath,
        nodes,
      });

      // copy rest unchanged
      const otherFiles = await File.find({
        projectId,
        revisionId: currentRevisionId,
        path: { $ne: filePath },
      });

      for (const f of otherFiles) {
        await File.create({
          projectId,
          revisionId: revision._id,
          path: f.path,
          code: f.code,
          isEntry: f.isEntry,
        });

        const nm = await NodeMap.findOne({ revisionId: currentRevisionId, filePath: f.path });
        if (nm) {
          await NodeMap.create({
            revisionId: revision._id,
            filePath: f.path,
            nodes: nm.nodes,
          });
        }
      }

      project.currentRevisionId = revision._id;
      await project.save();

      run.status = 'ok';
      await run.save();

      const savedFiles = await File.find({ projectId, revisionId: revision._id });
      return {
        revisionId: revision._id,
        files: savedFiles.map((f) => ({ path: f.path, code: f.code })),
      };
    } catch (err) {
      console.error('Error during modifyComponent:', err);
      console.log('Original selectedCode:', selectedCode);
      console.log('Modified snippet from LLM:', patchedSnippet);
      run.status = 'error';
      run.errorMessage = err.message;
      await run.save();
      throw err;
    }
}
  