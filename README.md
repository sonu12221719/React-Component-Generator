# React-Component-Generator

A full-stack MERN (MongoDB, Express.js, React, Node.js) web application that allows users to **generate, edit, preview, and manage React components** using natural language prompts powered by OpenAI. It supports versioning, node mapping, and file-based component manipulation.

---

## 📌 Features

- ✍️ Generate React components via natural language prompts (OpenAI API)
- 🧠 Maintains AST-based nodeMap for granular editing
- 🪄 Live code editing & preview (custom JSX execution or Sandpack)
- 📂 Multiple files per project, with revision/version control
- 🔐 Authenticated user access with secure JWT tokens
- 💾 MongoDB storage of projects, files, nodes, and user sessions

---

## 🧱 Architecture

### 🖥️ Frontend (React + TailwindCSS)

- **Playground Page** – Central UI for component generation & editing
- **EditorPanel** – Shows editable code with node highlights
- **PreviewPanel** – Renders live output of JSX via custom runner
- **PromptInput** – Sends user prompts to backend/OpenAI
- **React Router v6** – For routing (Login, Register, Playground, etc.)

---

### 🔙 Backend (Node.js + Express + MongoDB)


- **/api/auth** – Login/Register with JWT
- **/api/projects** – CRUD operations for projects
- **/api/revisions** – Handles file versions, nodes
- **/api/openai** – Routes prompt to OpenAI and stores result
- **MongoDB** – Stores Users, Projects, Revisions, Files, NodeMaps

---

## 🔐 Prompt Flow Architecture

```text
[User Input] → [PromptInput.jsx] → POST /api/openai
                → OpenAI API call
                → Response with code + nodes
                → Save to DB (File + NodeMap)
                → Return → update UI (code + nodeMap)



---

## 🔧 Installation

### 📦 Backend Setup

```bash
cd server
npm install
touch .env
````

Create a `.env` file inside the `server/` directory with the following:

```ini
PORT=5000
MONGO_URI=your_mongodb_uri
MONGODB_DB=datebase_name
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
CLOUDINARY_CLOUD_NAME=cloud_name
CLOUDINARY_API_KEY=cloudinary_api_key
CLOUDINARY_API_SECRET=cloudinary_api_secret
```

#### ▶️ Start Backend:

```bash
npm run dev
```

---

### 💻 Frontend Setup

```bash
cd client
npm install
```

Update the API URL if needed in the service files (e.g., `http://localhost:5000`).

#### ▶️ Start Frontend:

```bash
npm run dev
```

---

## 🧪 Folder Structure (Quick View)

```
📦frontend/
 ┣ 📂api/
 ┃ ┣ 📄authApi.js
 ┃ ┣ 📄codeApi.js
 ┃ ┗ 📄projectApi.js
 ┣ 📂components/
 ┃ ┣ 📄EditorPanel.jsx
 ┃ ┣ 📄Loader.jsx
 ┃ ┣ 📄Navbar.jsx
 ┃ ┣ 📄PreviewPanel.jsx
 ┃ ┗ 📄PromptInput.jsx
 ┃ ┗ 📄Sidebar.jsx
 ┣ 📂context/
 ┃ ┣ 📄authContext.jsx
 ┃ ┗ 📄projectContext.jsx
 ┣ 📂hooks/
 ┃ ┣ 📄useAuth.jsx
 ┃ ┣ 📄useCodeEditor.jsx
 ┃ ┗ 📄useProject.jsx
 ┣ 📂pages/
 ┃ ┣ 📂Auth/
 ┃ ┃ ┣ 📄Login.jsx
 ┃ ┃ ┣ 📄Register.jsx
 ┃ ┣ 📄Dashboard.jsx
 ┃ ┗ 📄Playground.jsx
 ┗ 📄App.jsx

📦backend/
 ┣ 📂config/
 ┃ ┣ 📄db.js
 ┃ ┗ 📄cloudinary.js
 ┣ 📂controllers/
 ┃ ┣ 📄authController.js
 ┃ ┣ 📄codeController.js
 ┃ ┣ 📄projectController.js
 ┃ ┗ 📄revisionController.js
 ┣ 📂middlewares/
 ┃ ┣ 📄authMiddleware.js
 ┃ ┣ 📄errorMiddleware.js
 ┃ ┗ 📄rateLimit.js
 ┣ 📂models/
 ┃ ┣ 📄File.js
 ┃ ┣ 📄NodeMap.js
 ┃ ┣ 📄Project.js
 ┃ ┣ 📄Revision.js
 ┃ ┣ 📄Run.js
 ┃ ┗ 📄User.js
 ┣ 📂routes/
 ┃ ┣ 📄authRoute.js
 ┃ ┣ 📄projectRoute.js
 ┃ ┣ 📄codeRoute.js
 ┃ ┗ 📄revisionRoute.js
 ┣ 📂services/
 ┃ ┣ 📂debug/
 ┃ ┃ ┗ 📄parser.js
 ┃ ┣ 📄ast.js
 ┃ ┣ 📄astReplace.js
 ┃ ┣ 📄codegen.js
 ┃ ┣ 📄llm.js
 ┃ ┗ 📄zip.js
 ┗ 📄index.js
```

---

## ✨ Future Improvements

* 🔍 Visual tree-based node selection
* 💾 Export generated code as ZIP or push directly to GitHub
* 🧪 Unit tests (Jest, React Testing Library)
* 🌍 Deploy to **Vercel** (Frontend) and **Render** (Backend)

---

## 👨‍💻 Author

Developed by **Sonu Kumar**


