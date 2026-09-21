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

  async function loadPosts(){ const {data}=await supabase.from('posts').select('*,comments(*)').order('created_at',{ascending:false}).limit(100); if(data) setPosts(data); setLoading(false); }
  useEffect(()=>{ setUsername(localStorage.getItem('ssv_user')||""); loadPosts(); const ch=supabase.channel('final').on('postgres_changes',{event:'*',schema:'public',table:'posts'},loadPosts).on('postgres_changes',{event:'*',schema:'public',table:'comments'},loadPosts).subscribe(); return()=>{supabase.removeChannel(ch)} },[]);

  async function createPost(){
    if(!content.trim()) return; 
    const name=username.trim()||"Anonymous"; 
    localStorage.setItem('ssv_user',name); 
    let image_url=null;
    if(imageFile){ 
      const fName=Date.now()+"_"+imageFile.name; 
      const {data}=await supabase.storage.from('post-images').upload(fName,imageFile); 
      if(data){ const {data:urlData}=supabase.storage.from('post-images').getPublicUrl(fName); image_url=urlData.publicUrl; } 
    }
    setShowModal(false); 
    await supabase.from('posts').insert([{username:name,content,topic,state,image_url,likes:0}]); 
    setContent(""); setImageFile(null);
  }

  const filtered=posts.filter(p=>(filterTopic==="All"||p.topic===filterTopic)&&(filterState==="All"||p.state===filterState)).sort((a,b)=>sortBy==="trending"? (b.likes+b.comments?.length)-(a.likes+a.comments?.length):0);

  return (
    <div style={{ background: 'radial-gradient(1200px 600px at 20% -10%, #1a0a00 0%, #000 60%), radial-gradient(800px 400px at 100% 0%, #1a0033 0%, #000 70%)', color: '#fff', minHeight: '100vh' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap'); *{font-family:Inter,sans-serif} ::-webkit-scrollbar{display:none}`}</style>

      {/* =====
