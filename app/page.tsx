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
  const [sortBy,setSortBy]=useState("latest");

  async function loadPosts(){
    const {data} = await supabase.from('posts').select('*,comments(*)').order('created_at',{ascending:false}).limit(100);
    if(data) setPosts(data);
    setLoading(false);
  }

  useEffect(()=>{
    const s = typeof window!=='undefined'? localStorage.getItem('ssv_user'):null;
    if(s) setUsername(s);
    loadPosts();
  },[]);

  async function createPost(){
    if(!content.trim()) return;
    const name = username.trim()||"Anonymous";
    localStorage.setItem('ssv_user',name);
    let image_url=null;
    if(imageFile){
      const fName=Date.now()+"_"+imageFile.name;
      const {data} = await supabase.storage.from('post-images').upload(fName,imageFile);
      if(data){
        const {data:u} = supabase.storage.from('post-images').getPublicUrl(fName);
        image_url=u.publicUrl;
      }
    }
    setShowModal(false);
    await supabase.from('posts').insert([{username:name,content,topic,state,image_url,likes:0}]);
    setContent(""); setImageFile(null);
    loadPosts();
  }

  const filtered = posts.filter((p:any)=>(filterTopic==="All"||p.topic===filterTopic)&&(filterState==="All"||p.state===filterState)).sort((a:any,b:any)=> sortBy==="trending"? (b.likes||0)-(a.likes||0):0);

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'system-ui' }}>
      
      {/* HEADER - YOUR DESIGN */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #222', padding: '12px 16px', zIndex: 100 }}>
        <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><div style={{ fontWeight: 900, fontSize: 20, letterSpacing: 0.5 }}>SEVEN SISTERS <span style={{ color: '#ff3b30' }}>VOICE</span></div><div style={{ fontSize: 10, color: '#666', letterSpacing: 2 }}>NORTHEAST REAL SOCIAL</div></div>
          <div style={{ background: '#111', border: '1px solid #222', padding: '6px 14px', borderRadius: 20, fontSize: 11, color: '#aaa' }}>{username||"Guest"} • LIVE</div>
        </div>
        
        {/* STORIES ROW - FACEBOOK TYPE FEATURE */}
        <div style={{ maxWidth: 640, margin: '12px auto 0', display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
          <div style={{ minWidth: 110, height: 150, background: 'linear-gradient(180deg,#ff3b30,#111)', borderRadius: 14, padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', border: '1px solid #333' }}>
            <div style={{ width: 32, height: 32, background: '#fff', color: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, marginBottom: 6 }}>+</div>
            <div style={{ fontSize: 11, fontWeight: 700 }}>Create Story</div>
          </div>
          {STATES.filter(s=>s!=="All").map(s=><div key={s} style={{ minWidth: 110, height: 150, background: `linear-gradient(180deg, transparent, #000), url('https://picsum.photos/seed/${
