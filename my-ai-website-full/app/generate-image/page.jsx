"use client";
import { useState } from "react";

export default function ImageGen() {
  const [prompt, setPrompt] = useState("");
  const [imageURL, setImageURL] = useState(null);

  async function generate() {
    setImageURL(null);
    setImageURL("https://via.placeholder.com/512"); // placeholder
  }

  return (
    <div>
      <h1>AI Image Generator</h1>
      <input value={prompt} onChange={e=>setPrompt(e.target.value)} style={{ padding:"10px", marginTop:"20px" }} />
      <button onClick={generate} style={{ marginLeft:"10px", padding:"10px" }}>Generate</button>

      {imageURL && (
        <div style={{ marginTop:"20px" }}>
          <img src={imageURL} width="300" />
        </div>
      )}
    </div>
  );
}
