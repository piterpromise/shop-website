import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Onboarding from "./pages/Onboarding.tsx"
import Home from "./pages/Home.tsx"
import Auth from "./pages/Auth.tsx"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/home" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<div style={{color: 'red', fontSize: '24px', padding: '20px'}}>404 Not Found. Current path is: {window.location.pathname}</div>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
