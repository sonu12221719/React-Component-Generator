import {
    SandpackLayout,
    SandpackPreview,
    SandpackProvider,
} from "@codesandbox/sandpack-react";
import React from "react";
import { 
  MdVisibility, 
  MdRefresh, 
  MdFullscreen, 
  MdPhone, 
  MdComputer, 
  MdTablet 
} from "react-icons/md";

export default function PreviewPanel({ code }) {
  const [viewMode, setViewMode] = React.useState('desktop'); // desktop, tablet, mobile
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Ensure code is a string and has proper React component format
  const formattedCode = React.useMemo(() => {
    console.log("PreviewPanel received code:", typeof code, code);
    
    if (!code || typeof code !== 'string') {
      console.warn("PreviewPanel: Invalid code format, using fallback");
      const codeValue = code ? JSON.stringify(code) : 'null';
      return `import React from 'react';

export default function App() {
  return (
    <div>
      <h1>No code available</h1>
      <p>Code type: ${typeof code}</p>
      <pre>{${codeValue}}</pre>
    </div>
  );
}`;
    }

    // Check if the code already has proper React component structure
    const hasReactImport = code.includes('import React') || code.includes('import * as React');
    const hasDefaultExport = code.includes('export default') || code.includes('export default function') || code.includes('export default class');
    
    if (hasReactImport && hasDefaultExport) {
      console.log("PreviewPanel: Code has proper React structure");
      return code;
    }

    // If it's just JSX without proper React setup, wrap it
    if (code.includes('return') || code.includes('<')) {
      console.log("PreviewPanel: Wrapping JSX code with React imports");
      return `import React from 'react';

export default function App() {
  ${code}
}`;
    }

    // If it's just a string or object, create a simple component
    console.log("PreviewPanel: Creating wrapper component for non-JSX code");
    const codeValue = JSON.stringify(code);
    return `import React from 'react';

export default function App() {
  return (
    <div>
      <h1>Component</h1>
      <pre>{${codeValue}}</pre>
    </div>
  );
}`;
  }, [code]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getViewModeStyles = () => {
    switch (viewMode) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-md mx-auto';
      default:
        return 'w-full';
    }
  };

  console.log("PreviewPanel formatted code:", formattedCode);

  return (
    <div className="w-1/2 h-full bg-white">
      {/* Preview Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <MdVisibility className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-900">Preview</span>
            </div>
            
            <div className="h-4 w-px bg-gray-300"></div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-1 rounded ${viewMode === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                title="Desktop view"
              >
                <MdComputer className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => setViewMode('tablet')}
                className={`p-1 rounded ${viewMode === 'tablet' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                title="Tablet view"
              >
                <MdTablet className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-1 rounded ${viewMode === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                title="Mobile view"
              >
                <MdPhone className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              className={`flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors duration-200 ${isRefreshing ? 'animate-spin' : ''}`}
              title="Refresh preview"
            >
              <MdRefresh className="h-3 w-3" />
              <span>Refresh</span>
            </button>
            
            <button className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors duration-200">
              <MdFullscreen className="h-3 w-3" />
              <span>Fullscreen</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="h-full bg-gray-100">
        <div className={`h-full ${getViewModeStyles()}`}>
          <SandpackProvider
            template="react"
            files={{
              "/App.js": formattedCode,
            }}
            theme="light"
          >
            <SandpackLayout>
              <SandpackPreview />
            </SandpackLayout>
          </SandpackProvider>
        </div>
      </div>
    </div>
  );
}
