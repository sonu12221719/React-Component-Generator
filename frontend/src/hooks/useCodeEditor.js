import { useState, useCallback } from "react";

export default function useCodeEditor(initialCode = "") {
  const [code, setCode] = useState(initialCode);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Update code handler
  const onCodeChange = useCallback((newCode) => {
    setCode(newCode);
  }, []);

  // Select node handler
  const selectNode = useCallback((nodeId) => {
    setSelectedNodeId(nodeId);
  }, []);

  // Reset editor to initial code
  const resetCode = useCallback(() => {
    setCode(initialCode);
    setSelectedNodeId(null);
  }, [initialCode]);

  return {
    code,
    selectedNodeId,
    setCode,
    onCodeChange,
    setSelectedNodeId,
    selectNode,
    resetCode,
  };
}
