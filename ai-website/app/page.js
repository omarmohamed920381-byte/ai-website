"use client";
import { useState } from "react";
export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  async function generate() {
    setLoading(true);
    const res = await fetch("/api/image", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setImage(data.url);
    setLoading(false);
  }
  return (
    <div className="card" style={{ maxWidth: 600, margin: "auto" }}>
      <h1 style={{ fontSize: 32 }}>🍏 Apple-Style AI Generator</h1>
      <input placeholder="Describe your image..." onChange={(e)=>setPrompt(e.target.value)} style={{ width:"100%", marginTop:20 }}/>
      <button onClick={generate} style={{ width:"100%", marginTop:20 }}>Generate</button>
      {loading && <p style={{ marginTop:20 }}>Generating…</p>}
      {image && (<img src={image} style={{ marginTop:20, borderRadius:16, width:"100%" }}/>)}
    </div>
  );
}