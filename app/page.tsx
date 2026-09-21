"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient('https://dqmontzomebmbfdijlbc.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxbW9udHpvbWVibWJmZGlqbGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5NjU3NjIsImV4cCI6MjEwNTU0MTc2Mn0.cr3jaRqb5RjDGHEGV7gmII9VlpcuPWR1P8453OP3XL8');

const TOPICS = ["All","Culture","Tourism","Food","Music","Politics","Sports","Breaking News"];
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

  async function loadPosts(){
    const {data} = await supabase.from('posts').select('*,comments(*)').order('created_at',{ascending:false}).limit(100);
    if(data) setPosts(data);
    setLoading(false);
  }

  useEffect(()=>{
    if(typeof window!=='undefined'){
      const s = localStorage.getItem('ssv_user');
      if(s) setUsername(s);
    }
    loadPosts();
  },[]);

  async function createPost(){
    if(!content.trim()) return;
    const name = username.trim()||"Guest";
    if(typeof window!=='undefined') localStorage.setItem('ssv_user',name);
    let image_url=null;
    if(imageFile){
      const fName=Date.now()+"_"+imageFile.name;
      const {error} = await supabase.storage.from('post-images').upload(fName,imageFile);
      if(!error){
        const {data} = supabase.storage.from('post-images').getPublicUrl(fName);
        image_url=data.publicUrl;
      }
    }
    setShowModal(false);
    await supabase.from('posts').insert([{username:name,content,topic,state,image_url,likes:0}]);
    setContent(""); setImageFile(null);
    loadPosts();
  }

  const filtered = posts.filter((p:any)=>(filterTopic==="All"||p.topic===filterTopic)&&(filterState==="All"||p.state===filterState));

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'system-ui' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: '#0a0a0a', borderBottom: '1px solid #222', padding: '12px 16px', zIndex: 100 }}>
        <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><div style={{ fontWeight: 900, fontSize: 18 }}>SEVEN SISTERS <span style={{ color: '#ff3b30' }}>VOICE</span></div><div style={{ fontSize: 10, color: '#666', letterSpacing: 2 }}>NORTHEAST REAL SOCIAL</div></div>
          <div style={{ background: '#1a1a1a', border: '1px solid #333', padding: '6px 12px', borderRadius: 20, fontSize: 11 }}>{username||"Guest"} LIVE</div>
        </div>
        <div style={{ maxWidth: 640, margin: '12px auto 0', display: 'flex', gap: 8, overflowX: 'auto' }}>
          {TOPICS.map(t=><button key={t} onClick={()=>setFilterTopic(t)} style={{ background: filterTopic===t?'#ff3b30':'#1a1a1a', color: '#fff', border: '1px solid #333', borderRadius: 20, padding: '8px 16px', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>{t}</button>)}
        </div>
        <div style={{ maxWidth: 640, margin: '8px auto 0', display: 'flex', gap: 8, overflowX: 'auto' }}>
          {STATES.map(s=><button key={s} onClick={()=>setFilterState(s)} style={{ background: filterState===s?'#fff':'#1a1a1a', color: filterState===s?'#000':'#fff', border: '1px solid #333', borderRadius: 20, padding: '6px 14px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>{s}</button>)}
        </div>
      </div>

      <div style={{ padding: '150px 0 100px', maxWidth: 640, margin: '0 auto' }}>
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: 16, margin: 12, padding: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#ff3b30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{username?.[0]?.toUpperCase()||"G"}</div>
          <div onClick={()=>setShowModal(true)} style={{ flex: 1, background: '#000', border: '1px solid #333', borderRadius: 20, padding: '10px 16px', color: '#777', fontSize: 14 }}>What's happening in Northeast?</div>
          <button onClick={()=>setShowModal(true)} style={{ background: '#ff3b30', border: 0, color: '#fff
