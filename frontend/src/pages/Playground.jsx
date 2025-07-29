import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditorPanel from "../components/EditorPanel";
import PreviewPanel from "../components/PreviewPanel";
import PromptInput from "../components/PromptInput";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdArrowBack, MdCode, MdSave, MdSettings } from "react-icons/md";

export default function Playground() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [code, setCode] = useState(""); // full file code
  const [filePath, setFilePath] = useState("Button.jsx"); // default file
  const [nodeMap, setNodeMap] = useState([]); // array of node objects
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState("");

  const token = localStorage.getItem("token");

  // Helper function to format code from backend
  const formatCodeFromBackend = (rawCode) => {
    console.log("formatCodeFromBackend input:", typeof rawCode, rawCode);
    
    if (!rawCode) {
      console.log("formatCodeFromBackend: No code provided");
      return "";
    }
    
    // If it's already a string, return as is
    if (typeof rawCode === 'string') {
      console.log("formatCodeFromBackend: Code is string, returning as is");
      return rawCode;
    }
    
    // If it's an object, try to extract code property
    if (typeof rawCode === 'object' && rawCode !== null) {
      console.log("formatCodeFromBackend: Code is object, extracting properties");
      if (rawCode.code) {
        console.log("formatCodeFromBackend: Found code property");
        return rawCode.code;
      }
      if (rawCode.content) {
        console.log("formatCodeFromBackend: Found content property");
        return rawCode.content;
      }
      if (rawCode.text) {
        console.log("formatCodeFromBackend: Found text property");
        return rawCode.text;
      }
      
      // If it's an object with component structure, convert to string
      console.log("formatCodeFromBackend: Converting object to string");
      return `import React from 'react';

export default function App() {
  return (
    <div>
      <pre>{JSON.stringify(rawCode, null, 2)}</pre>
    </div>
  );
}`;
    }
    
    // If it's any other type, convert to string
    console.log("formatCodeFromBackend: Converting to string");
    return String(rawCode);
  };

  useEffect(() => {
    const fetchProjectAndRevision = async () => {
      try {
        setLoading(true);
        console.log("Fetching project and revision for projectId:", projectId);
        
        // Step 1: Fetch project
        const projectRes = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!projectRes.ok) throw new Error("Failed to fetch project");

        const project = await projectRes.json();
        console.log("Project data:", project);
        setProjectName(project.name);
        const revisionId = project.currentRevisionId;

        // Check if project has a current revision
        if (!revisionId) {
          console.log("Project has no current revision, creating initial code");
          
          // Create initial code for the project
          try {
            const generateRes = await fetch("http://localhost:5000/api/code/generate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                projectId,
                prompt: "Create a simple React component with a button that says 'Hello World'",
                settings: {}
              }),
            });
            
            if (generateRes.ok) {
              const generateData = await generateRes.json();
              console.log("Generated initial code:", generateData);
              
              // Fetch the updated project to get the new revision
              const updatedProjectRes = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              
              if (updatedProjectRes.ok) {
                const updatedProject = await updatedProjectRes.json();
                const newRevisionId = updatedProject.currentRevisionId;
                
                // Fetch the new revision
                const newRevisionRes = await fetch(`http://localhost:5000/api/revisions/${newRevisionId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                
                if (newRevisionRes.ok) {
                  const newRevisionData = await newRevisionRes.json();
                  const { files, nodeMaps } = newRevisionData;
                  
                  const file = files.find((f) => f.path === filePath);
                  if (file) {
                    const formattedCode = formatCodeFromBackend(file.code);
                    setCode(formattedCode);
                    const nodeMap = nodeMaps.find((nm) => nm.filePath === filePath);
                    setNodeMap(nodeMap?.nodes || []);
                    return;
                  }
                }
              }
            }
          } catch (err) {
            console.error("Failed to generate initial code:", err);
          }
          
          // Fallback to default code if generation fails
          setCode(`import React from 'react';

export default function App() {
  return (
    <div>
      <h1>Welcome to your new project!</h1>
      <p>This project doesn't have any code yet. Start by creating some components.</p>
    </div>
  );
}`);
          setNodeMap([]);
          return;
        }

        // Step 2: Fetch revision details (includes files and nodeMaps)
        const revisionRes = await fetch(`http://localhost:5000/api/revisions/${revisionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!revisionRes.ok) throw new Error("Failed to fetch revision");

        const revisionData = await revisionRes.json();
        console.log("Revision data:", revisionData);
        const { files, nodeMaps } = revisionData;

        // Step 3: Find file by path
        const file = files.find((f) => f.path === filePath);
        if (!file) {
          console.warn(`File "${filePath}" not found in revision`);
          setCode("");
          setNodeMap([]);
          return;
        }

        console.log("Found file:", file);

        // Step 4: Find node map by filePath
        const nodeMap = nodeMaps.find((nm) => nm.filePath === filePath);

        // Step 5: Format and set code and nodeMap in state
        const formattedCode = formatCodeFromBackend(file.code);
        console.log("Final formatted code:", formattedCode);
        setCode(formattedCode);
        
        setNodeMap(nodeMap?.nodes || []);

        console.log("Loaded file code:", formattedCode);
        console.log("Loaded nodes:", nodeMap?.nodes || []);
      } catch (err) {
        console.error("Error loading project or revision:", err.message);
        // Set a default code if there's an error
        setCode(`import React from 'react';

export default function App() {
  return (
    <div>
      <h1>Error loading component</h1>
      <p>${err.message}</p>
    </div>
  );
}`);
      } finally {
        setLoading(false);
      }
    };

    if (projectId && token) {
      fetchProjectAndRevision();
    }
  }, [projectId, filePath, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <AiOutlineLoading3Quarters className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <div className="text-xl font-semibold text-gray-700">Loading your project...</div>
          <div className="text-sm text-gray-500 mt-2">Setting up the development environment</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <MdArrowBack className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>
            
            <div className="h-6 w-px bg-gray-300"></div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <MdCode className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{projectName || 'Untitled Project'}</h1>
                <p className="text-sm text-gray-500">React Component Editor</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
              <MdSave className="h-4 w-4" />
              <span className="text-sm">Save</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
              <MdSettings className="h-4 w-4" />
              <span className="text-sm">Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex overflow-hidden">
        <EditorPanel
          code={code}
          onCodeChange={setCode}
          nodeMap={nodeMap}
          selectedNodeId={selectedNodeId}
          setSelectedNodeId={setSelectedNodeId}
        />
        <PreviewPanel code={code} />
      </div>
      
      {/* Prompt Input */}
      <div className="bg-white border-t border-gray-200">
        <PromptInput
          projectId={projectId}
          filePath={filePath}
          nodeId={selectedNodeId}
          onSuccess={(updatedCode, updatedNodeMap) => {
            const formattedCode = formatCodeFromBackend(updatedCode);
            setCode(formattedCode);
            setNodeMap(updatedNodeMap.nodes);
          }}
        />
      </div>
    </div>
  );
}
