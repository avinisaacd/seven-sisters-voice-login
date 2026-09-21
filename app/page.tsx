"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient('https://dqmontzomebmbfdijlbc.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxbW9udHpvbWVibWJmZGlqbGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5NjU3NjIsImV4cCI6MjEwNTU0MTc2Mn0.cr3jaRqb5RjDGHEGV7gmII9VlpcuPWR1P8453OP3XL8');

const TOPICS = ["All","Breaking News","Culture","Tourism","Food","Music","Politics","Sports"];
const STATES = ["All","Assam","Meghalaya","Nagaland","Manipur","Mizoram","Tripura","Arunachal"];

export default function Home() {
  const [posts,setPosts]=useState<any[]>([]);
  const [content,setContent]=useState("");
  const [username,setUsername]=useState("");
  const [topic,setTopic]=useState("Culture");
  const [state,setState]=useState("Assam");
  const [imageFile,setImageFile]=useState<File|null>(null);
  const [loading,setLoading]=useState(true);
  const [showModal,setShowModal]=useState(false);
  const [filterTopic,setFilterTopic]=useState("All");
  const [filterState,setFilterState]=useState("All");
  const [sortBy,setSortBy]=useState("latest");

  async function loadPosts(){
    const {data} = await supabase.from('posts').select('*,comments(*)').order('created_at',{ascending:false}).limit(100);
    if(data) setPosts(data);
    setLoading(false);
  }

  useEffect(()=>{
    if(typeof window!== 'undefined'){
      const s = localStorage.getItem('ssv_user');
      if(s) setUsername(s);
    }
    loadPosts();
  },[]);

  async function createPost(){
    if(!content.trim()) return;
    const name=username.trim()||"Anonymous";
    if(typeof window!== 'undefined') localStorage.setItem('ssv_user',name);
    let image_url = null;
    if(imageFile){
      const fName=Date.now()+"_"+imageFile.name;
      const {data} = await supabase.storage.from('post-images').upload(fName,imageFile);
      if(data){
        const {data:urlData}=supabase.storage.from('post-images').getPublicUrl(fName);
        image_url=urlData.publicUrl;
      }
    }
    setShowModal(false);
    await supabase.from('posts').insert([{username:name,content,topic,state,image_url,likes:0}]);
    setContent(""); setImageFile(null);
    loadPosts();
  }

  const filtered = posts.filter((p:any)=>(filterTopic==="All"||p.topic===filterTopic)&&(filterState==="All"||p.state===filterState)).sort((a:any,b:any)=> sortBy==="trending"? (b.likes||0)-(a.likes||0) : 0 );

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.9)', borderBottom: '1px solid #222', padding: '12px 16px', zIndex: 100 }}>
        <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><div style={{ fontWeight: 900, fontSize: 18 }}>SEVEN SISTERS <span style={{ color: '#ff3b30' }}>VOICE</span></div><div style={{ fontSize: 10, color: '#666' }}>NORTHEAST REAL SOCIAL</div></div>
          <div style={{ background: '#111', border: '1px solid #222', padding: '6px 12px', borderRadius: 20, fontSize: 11 }}>{username||"Guest"} LIVE</div>
        </div>
        <div style={{ maxWidth: 640, margin: '10px auto 0', display: 'flex', gap: 8, overflowX: 'auto' }}>
          <select value={filterTopic} onChange={e=>setFilterTopic(e.target.value)} style={{ background: '#111', color: '#fff', border: '1px solid #333', borderRadius: 20, padding: '6px 14px', fontSize: 12 }}>{TOPICS.map(t=><option key={t}>{t}</option>)}</select>
          <select value={filterState} onChange={e=>setFilterState(e.target.value)} style={{ background: '#111', color: '#fff', border: '1px solid #333', borderRadius: 20, padding: '6px 14px', fontSize: 12 }}>{STATES.map(s=><option key={s}>{s}</option>)}</select>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ background: sortBy==='trending'? '#ff3b30':'#111', color: '#fff', border: '1px solid #333', borderRadius: 20, padding: '6px 14px', fontSize: 12 }}><option value="latest">Latest</option><option value="trending">Trending</option></select>
        </div>
      </div>

      <div style={{ padding: '110px 0 100px', maxWidth: 640, margin: '0 auto' }}>
        {loading? <div style={{ textAlign: 'center', padding: 60, color: '#666' }}>Loading...</div> :
        filtered.length===0? <div style={{ background: '#111', border: '1px solid #222', borderRadius: 20, margin: 14, padding: 40, textAlign: 'center' }}><div style={{ fontSize: 40 }}>🌄</div><b>No posts</b><br/><button onClick={()=>setShowModal(true)} style={{ marginTop: 12, padding: '10px 20px', background: '#ff3b30', border: 0, borderRadius: 20, color: '#fff', fontWeight: 700 }}>Create First</button></div> :
        filtered.map((p:any)=>(
          <div key={p.id} style={{ background: '#111', border: '1px solid #222', borderRadius: 20, margin: 12, padding: 14 }}>
            <div style={{ display: 'flex', gap: 10 }}><div style={{ width: 38, height: 38, borderRadius: '50%', background: '#ff3b30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{p.username[0]?.toUpperCase()}</div><div><b style={{ fontSize: 14 }}>{p.username} <span style={{ background: '#222', color: '#ff6b6b', fontSize: 9, padding: '2px 6px', borderRadius: 10 }}>{p.topic}</span></b><div style={{ fontSize: 11, color: '#777' }}>{p.state} - {new Date(p.created_at).toLocaleDateString()}</div></div></div>
            <div style={{ margin: '12px 0 0', fontSize: 15, whiteSpace: 'pre-wrap' }}>{p.content}</div>
            {p.image_url && <img src={p.image_url} style={{ width: '100%', borderRadius: 14, marginTop: 12 }} alt="post"/>}
            <div style={{ display: 'flex', gap: 12, marginTop: 14, paddingTop: 12, borderTop: '1px solid #222', fontSize: 13 }}>
              <button onClick={async()=>{ await supabase.from('posts').update({likes:(p.likes||0)+1}).eq('id',p.id); loadPosts(); }} style={{ background: '#1a0000', border: '1px solid #331111', color: '#ff6b6b', padding: '6px 14px', borderRadius: 20 }}>❤️ {p.likes||0}</button>
              <span style={{ background: '#111', padding: '6px 14px', borderRadius: 20, color: '#aaa' }}>💬 {p.comments?.length||0}</span>
            </div>
          </div>
        ))}
      </div>

      <div onClick={()=>setShowModal(true)} style={{ position: 'fixed', bottom: 28, right: 20, width: 58, height: 58, background: '#ff3b30', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, cursor: 'pointer', zIndex: 90 }}>+</div>

      {showModal && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}><div style={{ background: '#111', border: '1px solid #333', borderRadius: 24, width: '100%', maxWidth: 420, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><h3 style={{ margin: 0 }}>New Voice</h3><button onClick={()=>setShowModal(false)} style={{ background: '#222', border: 0, color: '#fff', width: 28, height: 28, borderRadius: '50%' }}>X</button></div>
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Your name" style={{ width: '100%', background: '#000', border: '1px solid #333', borderRadius: 12, padding: 12, color: '#fff', marginTop: 14, boxSizing: 'border-box' }} />
        <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="What's happening in Northeast?" style={{ width: '100%', height: 90, background: '#000', border: '1px solid #333', borderRadius: 12, padding: 12, color: '#fff', marginTop: 10, boxSizing: 'border-box' }} />
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}><select value={topic} onChange={e=>setTopic(e.target.value)} style={{ flex: 1, background: '#000', color: '#fff', border: '1px solid #333', borderRadius: 10, padding: 10 }}>{TOPICS.filter(t=>t!=="All").map(t=><option key={t}>{t}</option>)}</select><select value={state} onChange={e=>setState(e.target.value)} style={{ flex: 1, background: '#000', color: '#fff', border: '1px solid #333', borderRadius: 10, padding: 10 }}>{STATES.filter(s=>s!=="All").map(s=><option key={s}>{s}</option>)}</select></div>
        <input type="file" accept="image/*" onChange={e=>setImageFile(e.target.files?.[0]||null)} style={{ marginTop: 10, width: '100%', fontSize: 12 }} />
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}><button onClick={()=>setShowModal(false)} style={{ flex: 1, padding: 12, borderRadius: 20, background: '#222', color: '#fff', border: 0 }}>Cancel</button><button onClick={createPost} style={{ flex: 2, padding: 12, borderRadius: 20, background: '#ff3b30', color: '#fff', border: 0, fontWeight: 800 }}>POST LIVE</button></div>
      </div></div>}
    </div>
  );
}
