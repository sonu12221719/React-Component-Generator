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
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
PORT=5000
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
📦client/
 ┣ 📂components/
 ┃ ┣ 📄EditorPanel.jsx
 ┃ ┣ 📄PreviewPanel.jsx
 ┃ ┗ 📄PromptInput.jsx
 ┣ 📂pages/
 ┃ ┗ 📄Playground.jsx
 ┗ 📄App.jsx

📦server/
 ┣ 📂controllers/
 ┣ 📂models/
 ┣ 📂routes/
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


