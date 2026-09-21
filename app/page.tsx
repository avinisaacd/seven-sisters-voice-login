"use client";
import { useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState([
    { id: 1, name: "Assam Explorer", state: "Assam", topic: "Tourism", content: "Welcome to Seven Sisters Voice! 🌄 First post from Northeast!", likes: 12, time: "Just now" },
    { id: 2, name: "Meghalaya Roots", state: "Meghalaya", topic: "Culture", content: "Cherrapunji is so beautiful today! Who's from Meghalaya?", likes: 8, time: "2h ago" },
  ]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [show, setShow] = useState(false);
  const [filter, setFilter] = useState("All");

  const filtered = posts.filter(p => filter === "All" || p.topic === filter || p.state === filter);

  function addPost() {
    if (!text.trim()) return;
    setPosts([{ id: Date.now(), name: name || "Guest", state: "Assam", topic: "Culture", content: text, likes: 0, time: "Just now" },...posts]);
    setText(""); setShow(false);
  }

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", fontFamily: "system-ui" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, background: "#0a0a0a", borderBottom: "1px solid #222", padding: "12px 16px", zIndex: 10 }}>
        <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", justifyContent: "space-between" }}>
          <div><b>SEVEN SISTERS <span style={{ color: "#ff3b30" }}>VOICE</span></b><div style={{ fontSize: 10, color: "#666" }}>NORTHEAST FACEBOOK TYPE</div></div>
          <div style={{ fontSize: 12, background: "#1a1a1a", padding: "6px 12px", borderRadius: 20, border: "1px solid #333" }}>{name || "Guest"} • LIVE</div>
        </div>
        <div style={{ maxWidth: 600, margin: "12px auto 0", display: "flex", gap: 8, overflowX: "auto" }}>
          {["All", "Culture", "Tourism", "Food", "Music", "Assam", "Meghalaya"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f? "#ff3b30" : "#1a1a1a", color: "#fff", border: "1px solid #333", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600 }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "120px 0 80px", maxWidth: 600, margin: "0 auto" }}>
        <div style={{ background: "#111", border: "1px solid #222", borderRadius: 16, margin: 12, padding: 12, display: "flex", gap: 10 }}>
          <div style={{ width: 40, height: 40, background: "#ff3b30", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>{(name || "G")[0]}</div>
          <div onClick={() => setShow(true)} style={{ flex: 1, background: "#000", border: "1px solid #333", borderRadius: 20, padding: "10px 14px", color: "#777" }}>What's on your mind?</div>
        </div>

        {filtered.map(p => (
          <div key={p.id} style={{ background: "#111", border: "1px solid #222", borderRadius: 16, margin: "0 12px 12px", padding: 12 }}>
            <div style={{ display: "flex", gap: 10 }}><div style={{ width: 40, height: 40, background: "#ff3b30", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>{p.name[0]}</div><div><div style={{ fontWeight: 700, fontSize: 14 }}>{p.name} <span style={{ fontSize: 10, background: "#1a1a1a", border: "1px solid #333", padding: "2px 6px", borderRadius: 8, color: "#ff3b30" }}>{p.topic}</span></div><div style={{ fontSize: 11, color: "#777" }}>{p.state} • {p.time} • 🌎</div></div></div>
            <div style={{ marginTop: 10, fontSize: 15, lineHeight: 1.4 }}>{p.content}</div>
            <div style={{ display: "flex", borderTop: "1px solid #222", marginTop: 12 }}>
              <button onClick={() => setPosts(posts.map(x => x.id === p.id? {...x, likes: x.likes + 1 } : x))} style={{ flex: 1, background: "transparent", border: 0, color: "#aaa", padding: 10, fontWeight: 600 }}>❤️ {p.likes} Like</button>
              <button style={{ flex: 1, background: "transparent", border: 0, borderLeft: "1px solid #222", borderRight: "1px solid #222", color: "#aaa", padding: 10, fontWeight: 600 }}>💬 Comment</button>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link copied!"); }} style={{ flex: 1, background: "transparent", border: 0, color: "#aaa", padding: 10, fontWeight: 600 }}>↗️ Share</button>
            </div>
          </div>
        ))}
      </div>

      <div onClick={() => setShow(true)} style={{ position: "fixed", bottom: 20, right: 16, width: 56, height: 56, background: "#ff3b30", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>+</div>

      {show && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}><div style={{ background: "#111", border: "1px solid #333", borderRadius: 20, width: "100%", maxWidth: 400, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}><b>Create Post</b><button onClick={() => setShow(false)} style={{ background: "#222", color: "#fff", border: 0, width: 28, height: 28, borderRadius: "50%" }}>X</button></div>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={{ width: "100%", background: "#000", border: "1px solid #333", borderRadius: 12, padding: 12, color: "#fff", marginTop: 14, boxSizing: "border-box" }} />
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Share Northeast story..." style={{ width: "100%", height: 80, background: "#000", border: "1px solid #333", borderRadius: 12, padding: 12, color: "#fff", marginTop: 10, boxSizing: "border-box" }} />
        <button onClick={addPost} style={{ width: "100%", marginTop: 12, padding: 14, background: "#ff3b30", border: 0, borderRadius: 20, color: "#fff", fontWeight: 800 }}>POST</button>
      </div></div>}
    </div>
  );
}
