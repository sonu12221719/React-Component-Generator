import React, { createContext, useState, useEffect, useContext } from "react";
import { getProjects, getProjectFile, createProject } from "../api/projectApi";
import { AuthContext } from "./AuthContext";

export const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null); // entire project object
  const [currentFileCode, setCurrentFileCode] = useState("");
  const [currentFileNodeMap, setCurrentFileNodeMap] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all projects when user or token changes
  useEffect(() => {
    if (!token || !user) {
      setProjects([]);
      setCurrentProject(null);
      return;
    }

    const fetchProjects = async () => {
      setLoading(true);
      try {
        const projs = await getProjects(token);
        setProjects(projs);
      } catch (err) {
        console.error("Failed to fetch projects:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user, token]);

  // Load project file code & nodeMap
  const loadProjectFile = async (projectId, filePath) => {
    setLoading(true);
    try {
      const data = await getProjectFile(token, projectId, filePath);
      setCurrentFileCode(data.code);
      setCurrentFileNodeMap(data.nodeMap);
      setCurrentProject(projects.find((p) => p._id === projectId) || null);
    } catch (err) {
      console.error("Failed to load project file:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new project & refresh list
  const addProject = async (projectName) => {
    setLoading(true);
    try {
      const newProj = await createProject(token, projectName);
      setProjects((prev) => [...prev, newProj]);
      setCurrentProject(newProj);
    } catch (err) {
      console.error("Failed to create project:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        currentFileCode,
        currentFileNodeMap,
        loading,
        loadProjectFile,
        setCurrentFileCode,
        setCurrentFileNodeMap,
        addProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
