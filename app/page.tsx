"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = 'https://dqmontzomebmbfdijlbc.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxbW9udHpvbWVibWJmZGlqbGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5NjU3NjIsImV4cCI6MjEwNTU0MTc2Mn0.cr3jaRqb5RjDGHEGV7gmII9VlpcuPWR1P8453OP3XL8';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  async function loadPosts() {
    const { data } = await supabase.from('posts').select('*,comments(*)').order('created_at', { ascending: false }).limit(50);
    if (data) setPosts(data);
    setLoading(false);
  }

  useEffect(() => {
    const saved = localStorage.getItem('ssv_user') || "";
    setUsername(saved);
    loadPosts();
    const channel = supabase.channel('posts').on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, loadPosts).on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, loadPosts).subscribe();
    return () => { supabase.removeChannel(channel) };
  }, []);

  async function createPost() {
    if (!content.trim()) return;
    let name = username.trim() || "Anonymous";
    localStorage.setItem('ssv_user', name);
    setShowModal(false);
    await supabase.from('posts').insert([{ username: name, content }]);
    setContent("");
    loadPosts();
  }

  async function addComment(postId: string, text: string) {
    if (!text.trim()) return;
    let name = username || prompt("Your name?") || "Guest";
    await supabase.from('comments').insert([{ post_id: postId, username: name, text }]);
    loadPosts();
  }

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: '#000', borderBottom: '1px solid #222', padding: '12px 15px', display: 'flex', justifyContent: 'space-between', zIndex: 100 }}>
        <div style={{ fontWeight: 900 }}>SEVEN SISTERS <span style={{ color: '#ff3b30' }}>VOICE - REAL</span></div>
        <div style={{ fontSize: 12, color: '#777' }}>{username || "Guest"}</div>
      </div>

      <div style={{ padding: '70px 0', maxWidth: 600, margin: '0 auto' }}>
        {loading ? <div style={{ textAlign: 'center', padding: 40, color: '#777' }}>Loading REAL posts...</div> :
          posts.length === 0 ? <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, margin: 10, padding: 30, textAlign: 'center' }}><h3>No posts yet! Be first!</h3><button onClick={() => setShowModal(true)} style={{ marginTop: 15, padding: '10px 20px', background: '#ff3b30', color: '#fff', border: 0, borderRadius: 20, fontWeight: 700 }}>Create First Post</button></div> :
            posts.map(p => (
              <div key={p.id} style={{ background: '#111', border: '1px solid #222', borderRadius: 12, margin: 10, padding: 12 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(45deg,#ff3b30,#ff9500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{(p.username || 'U').charAt(0).toUpperCase()}</div><div><b>{p.username}</b><div style={{ color: '#777', fontSize: 12 }}>{new Date(p.created_at).toLocaleString()}</div></div></div>
                <div style={{ margin: '10px 0', whiteSpace: 'pre-wrap' }}>{p.content}</div>
                <div style={{ color: '#777', fontSize: 13, borderTop: '1px solid #222', paddingTop: 8 }}>💬 {p.comments?.length || 0} comments</div>
                <div>{(p.comments || []).map((c: any) => <div key={c.id} style={{ fontSize: 13, marginTop: 6, background: '#1a1a1a', padding: '6px 10px', borderRadius: 8 }}><b>{c.username}:</b> {c.text}</div>)}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}><input id={`input-${p.id}`} placeholder="Comment..." style={{ flex: 1, background: '#000', border: '1px solid #333', borderRadius: 20, padding: '8px 12px', color: '#fff' }} onKeyDown={(e) => { if (e.key === 'Enter') { const inp = e.target as HTMLInputElement; addComment(p.id, inp.value); inp.value = ''; } }} /><button onClick={() => { const inp = document.getElementById(`input-${p.id}`) as HTMLInputElement; addComment(p.id, inp.value); inp.value = ''; }} style={{ background: '#ff3b30', color: '#fff', border: 0, borderRadius: 20, padding: '8px 15px' }}>Post</button></div>
              </div>
            ))}
      </div>

      <div onClick={() => setShowModal(true)} style={{ position: 'fixed', bottom: 30, right: 20, width: 56, height: 56, background: '#ff3b30', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, cursor: 'pointer', zIndex: 90 }}>+</div>

      {showModal && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}><div style={{ background: '#111', border: '1px solid #333', borderRadius: 16, width: '100%', maxWidth: 400, padding: 20 }}><h3>REAL Post - Everyone sees!</h3><input value={username} onChange={e => setUsername(e.target.value)} placeholder="Your name" style={{ width: '100%', background: '#000', border: '1px solid #333', borderRadius: 10, padding: 12, color: '#fff', margin: '10px 0' }} /><textarea value={content} onChange={e => setContent(e.target.value)} placeholder="What's happening?" style={{ width: '100%', height: 100, background: '#000', border: '1px solid #333', borderRadius: 10, padding: 12, color: '#fff' }} /><div style={{ display: 'flex', gap: 10, marginTop: 15 }}><button onClick={() => setShowModal(false)} style={{ flex: 1, padding: 10, borderRadius: 20, background: '#222', color: '#fff', border: 0 }}>Cancel</button><button onClick={createPost} style={{ flex: 1, padding: 10, background: '#ff3b30', color: '#fff', border: 0, borderRadius: 20, fontWeight: 700 }}>Post LIVE</button></div></div></div>}
    </div>
  );
}
