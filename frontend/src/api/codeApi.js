const BASE_URL = "http://localhost:5000/api/llm";

// Generate new code snippet (e.g., initial code from prompt)
export const generateCode = async (token, projectId, filePath, prompt) => {
  const res = await fetch(`${BASE_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ projectId, filePath, prompt }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Code generation failed");
  return data;
};

// Modify existing component node with LLM instruction
export const modifyComponent = async (token, projectId, filePath, nodeId, instruction) => {
  const res = await fetch(`${BASE_URL}/modify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ projectId, filePath, nodeId, instruction }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Component modification failed");
  return data;
};

// Download full project code (optional)
export const downloadProjectCode = async (token, projectId) => {
  const res = await fetch(`${BASE_URL}/download/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Download failed");
  return res.blob(); // client can create ObjectURL to download file
};
