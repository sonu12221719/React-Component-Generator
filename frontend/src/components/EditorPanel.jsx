import Editor from "@monaco-editor/react";
import React, { useRef } from "react";
import {
    MdCode,
    MdContentCopy,
    MdDescription,
    MdDownload,
    MdSettings
} from "react-icons/md";

export default function EditorPanel({
  code,
  onCodeChange,
  nodeMap,
  selectedNodeId,
  setSelectedNodeId,
}) {
  const editorRef = useRef(null);

  const handleEditorMount = (editor) => {
    editorRef.current = editor;

    // Simple click listener to simulate selecting data-node-id (for demo)
    editor.onMouseDown((e) => {
      const position = e.target.position;
      const model = editor.getModel();
      const word = model.getWordAtPosition(position);
      const codeText = model.getValue();

      // Try to find the nearest `data-node-id="..."` above clicked line
      const lines = codeText.split("\n").slice(0, position.lineNumber).reverse();
      for (const line of lines) {
        const match = line.match(/data-node-id="(.+?)"/);
        if (match) {
          setSelectedNodeId(match[1]);
          return;
        }
      }
    });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="w-1/2 border-r border-gray-200 bg-white">
      {/* Editor Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <MdCode className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Editor</span>
            </div>
            
            <div className="h-4 w-px bg-gray-300"></div>
            
            <div className="flex items-center space-x-2">
              <MdDescription className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600 font-mono">Button.jsx</span>
            </div>
            
            {selectedNodeId && (
              <>
                <div className="h-4 w-px bg-gray-300"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-700 font-medium">Node Selected</span>
                  <span className="text-xs text-gray-500 font-mono">{selectedNodeId}</span>
                </div>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={copyCode}
              className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors duration-200"
              title="Copy code"
            >
              <MdContentCopy className="h-3 w-3" />
              <span>Copy</span>
            </button>
            
            <button className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors duration-200">
              <MdDownload className="h-3 w-3" />
              <span>Export</span>
            </button>
            
            <button className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors duration-200">
              <MdSettings className="h-3 w-3" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="h-full">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={onCodeChange}
          onMount={handleEditorMount}
          theme="vs-dark"
          options={{
            fontSize: 14,
            wordWrap: "on",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            lineNumbers: "on",
            roundedSelection: false,
            scrollbar: {
              vertical: "visible",
              horizontal: "visible",
            },
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            overviewRulerLanes: 0,
            renderLineHighlight: "all",
            selectionHighlight: false,
            occurrencesHighlight: false,
            folding: true,
            foldingStrategy: "indentation",
            showFoldingControls: "always",
            foldingHighlight: true,
            foldingImportsByDefault: true,
            foldingMaximumRegions: 5000,
            unfoldOnClickAfterEnd: false,
            links: true,
            colorDecorators: true,
            lightbulb: {
              enabled: true,
            },
            suggest: {
              showKeywords: true,
              showSnippets: true,
              showClasses: true,
              showFunctions: true,
              showVariables: true,
              showModules: true,
              showConstants: true,
              showEnums: true,
              showEnumMembers: true,
              showColors: true,
              showFiles: true,
              showReferences: true,
              showFolders: true,
              showTypeParameters: true,
              showWords: true,
              showUsers: true,
              showIssues: true,
            },
          }}
        />
      </div>
    </div>
  );
}
