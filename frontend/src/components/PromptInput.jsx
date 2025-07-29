import React, { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  MdFlashOn,
  MdLightbulb,
  MdLightbulbOutline,
  MdSend,
  MdSmartToy
} from "react-icons/md";

export default function PromptInput({ projectId, filePath, nodeId, onSuccess }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/code/modify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId,
          filePath,
          nodeId,
          instruction: prompt,
        }),
      });

      const data = await res.json();
      console.log("LLM response:", data);

      if (res.ok) {
        setPrompt("");
        onSuccess(data.updatedCode, data.updatedNodeMap);
      } else {
        console.error("LLM Error:", data.error);
        alert("LLM failed: " + data.error);
      }
    } catch (err) {
      console.error("Request failed:", err.message);
      alert("Failed to send prompt");
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Add a button with hover effects",
    "Make it responsive",
    "Add smooth animations",
    "Change the color scheme",
    "Add form validation",
    "Improve accessibility"
  ];

  const handleQuickPrompt = (quickPrompt) => {
    setPrompt(quickPrompt);
  };

  return (
    <div className="border-t border-gray-200 bg-white">
      {/* Quick Prompts */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center space-x-2 mb-2">
          <MdLightbulbOutline className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-medium text-gray-700">Quick Suggestions</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleQuickPrompt(suggestion)}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors duration-200"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <MdSmartToy className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                placeholder="Describe what you want to change or add to your component..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                rows="2"
                disabled={loading}
              />
            </div>
            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <MdLightbulb className="h-3 w-3" />
                <span>AI-powered code generation</span>
              </div>
              <div className="flex items-center space-x-1">
                <MdFlashOn className="h-3 w-3" />
                <span>Press Enter to send</span>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
          >
            {loading ? (
              <>
                <AiOutlineLoading3Quarters className="h-5 w-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <MdSend className="h-5 w-5" />
                <span>Generate Code</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
