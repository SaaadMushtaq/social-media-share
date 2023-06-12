import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Camera from "./screens/Camera";
import VideoRecorder from "./screens/VideoRecorder";
import "./App.css";

export default function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Camera />} />
        <Route path="/videoRecorder" element={<VideoRecorder />} />
      </Routes>
    </div>
  );
}
