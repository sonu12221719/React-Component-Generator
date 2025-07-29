const BASE_URL = "http://localhost:5000/api/projects";

// Get all projects of logged-in user
export const getProjects = async (token) => {
  const res = await fetch(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch projects");
  return data.projects;
};

// Create new project
export const createProject = async (token, projectName) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: projectName }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create project");
  return data.project;
};

// Get project file code + nodeMap
export const getProjectFile = async (token, projectId, filePath) => {
  const res = await fetch(`${BASE_URL}/${projectId}/${filePath}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load project file");
  return data;
};
