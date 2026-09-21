"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  'https://dqmontzomebmbfdijlbc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxbW9udHpvbWVibWJmZGlqbGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5NjU3NjIsImV4cCI6MjEwNTU0MTc2Mn0.cr3jaRqb5RjDGHEGV7gmII9VlpcuPWR1P8453OP3XL8'
);

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
    setUsername(localStorage.getItem('ssv_user') || "");
    loadPosts();
    const ch = supabase.channel('real').on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, loadPosts).on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, loadPosts).subscribe();
    return () => { supabase.removeChannel(ch) };
  }, []);

  async function createPost() {
    if (!content.trim()) return;
    const name = username.trim() || "Anonymous";
    localStorage.setItem('ssv_user', name);
    setShowModal(false);
    await supabase.from('posts').insert([{ username: name, content }]);
    setContent("");
  }

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: '#000', borderBottom: '1px solid #222', padding: '15px', display: 'flex', justifyContent: 'space-between', zIndex: 100, fontWeight: 900 }}>
        <span>SEVEN SISTERS <span style={{ color: '#ff3b30' }}>VOICE - REAL</span></span>
        <span style={{ fontSize: 12, color: '#888' }}>{username || "Guest"}</span>
      </div>

      <div style={{ padding: '70px 0 100px', maxWidth: 600, margin: '0 auto' }}>
        {loading? <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>Loading REAL posts from Supabase...</div> :
        posts.length === 0? <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, margin: 15, padding: 30, textAlign: 'center' }}>No posts yet!<br/><button onClick={() => setShowModal(true)} style={{ marginTop: 15, padding: '10px 25px', background: '#ff3b30', border: 0, borderRadius: 20, color: '#fff', fontWeight: 700 }}>Create First REAL Post</button></div> :
        posts.map((p: any) => (
          <div key={p.id} style={{ background: '#111', border: '1px solid #222', borderRadius: 12, margin: 10, padding: 12 }}>
            <div style={{ display: 'flex', gap: 10 }}><div style={{ width: 36, height: 36, borderRadius: '50%', background: '#ff3b30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{p.username[0]?.toUpperCase()}</div><div><b>{p.username}</b><div style={{ fontSize: 11, color: '#666' }}>{new Date(p.created_at).toLocaleString()}</div></div></div>
            <div style={{ margin: '10px 0' }}>{p.content}</div>
            {p.comments?.map((c: any) => <div key={c.id} style={{ background: '#1a1a1a', padding: '6px 10px', borderRadius: 8, marginTop: 6, fontSize: 13 }}><b>{c.username}:</b> {c.text}</div>)}
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}><input id={'c-'+p.id} placeholder="Comment..." style={{ flex: 1, background: '#000', border: '1px solid #333', borderRadius: 20, padding: '8px 12px', color: '#fff' }} onKeyDown={(e) => { if(e.key==='Enter'){ const i=e.target as HTMLInputElement; supabase.from('comments').insert([{ post_id: p.id, username: username||'Guest', text: i.value }]).then(()=>{ i.value=''; loadPosts() }); }}} /><button onClick={()=>{ const i=document.getElementById('c-'+p.id) as HTMLInputElement; supabase.from('comments').insert([{ post_id: p.id, username: username||'Guest', text: i.value }]).then(()=>{ i.value=''; loadPosts() }); }} style={{ background: '#ff3b30', border: 0, borderRadius: 20, padding: '8px 14px', color: '#fff' }}>Post</button></div>
          </div>
        ))}
      </div>

      <div onClick={() => setShowModal(true)} style={{ position: 'fixed', bottom: 25, right: 20, width: 56, height: 56, background: '#ff3b30', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, cursor: 'pointer' }}>+</div>

      {showModal && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}><div style={{ background: '#111', border: '1px solid #333', borderRadius: 16, width: '100%', maxWidth: 380, padding: 20 }}><h3 style={{ margin: 0 }}>New REAL Post</h3><input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Your name" style={{ width: '100%', background: '#000', border: '1px solid #333', borderRadius: 8, padding: 10, color: '#fff', marginTop: 10, boxSizing: 'border-box' }} /><textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="What is happening in Northeast?" style={{ width: '100%', height: 90, background: '#000', border: '1px solid #333', borderRadius: 8, padding: 10, color: '#fff', marginTop: 10, boxSizing: 'border-box' }} /><div style={{ display: 'flex', gap: 10, marginTop: 15 }}><button onClick={()=>setShowModal(false)} style={{ flex: 1, padding: 10, borderRadius: 20, background: '#222', color: '#fff', border: 0 }}>Cancel</button><button onClick={createPost} style={{ flex: 1, padding: 10, borderRadius: 20, background: '#ff3b30', color: '#fff', border: 0, fontWeight: 700 }}>POST LIVE</button></div></div></div>}
    </div>
  );
}
