"use client";
import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input) return;
    setMessages([...messages, { role: "user", text: input }]);
    setInput("");
    setMessages(m => [...m, { role: "assistant", text: "AI reply coming soon..." }]);
  }

  return (
    <div>
      <h1>AI Chat</h1>
      <div style={{ marginTop:"20px", padding:"20px", background:"white", borderRadius:"10px" }}>
        {messages.map((m,i)=>(
          <p key={i}><b>{m.role}:</b> {m.text}</p>
        ))}
      </div>
      <input value={input} onChange={e=>setInput(e.target.value)} style={{ marginTop:"20px", padding:"10px" }} />
      <button onClick={sendMessage} style={{ marginLeft:"10px", padding:"10px" }}>Send</button>
    </div>
  );
}
