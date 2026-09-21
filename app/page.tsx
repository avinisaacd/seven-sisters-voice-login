"use client";
import { useState, useRef, useEffect } from "react";
type Msg = { id:number; from:string; to:string; text:string; time:string; };
type Post = { id:number; user:string; text:string; time:string; image?:string; video?:string; };
type Story = { id:number; user:string; name:string; image:string; time:string; viewed?:boolean; };

export default function SevenSistersVoice() {
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("123456");
  const [fullName, setFullName] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<string|null>(null);
  const [newMsg, setNewMsg] = useState("");
  const [inCall, setInCall] = useState<string|null>(null);
  const [callTime, setCallTime] = useState(0);
  const [newText, setNewText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string|null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string|null>(null);
  const [activeStory, setActiveStory] = useState<Story|null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const storyInputRef = useRef<HTMLInputElement>(null);

  const [allUsers] = useState([
    {email:"priya@test.com", name:"Priya", state:"meghalaya"},
    {email:"rahul@test.com", name:"Rahul", state:"assam"},
    {email:"john@test.com", name:"John", state:"nagaland"},
  ]);
  const [friends, setFriends] = useState(["john@test.com","rahul@test.com","priya@test.com"]);
  const [messages, setMessages] = useState<Msg[]>([{id:1, from:"john@test.com", to:"admin@test.com", text:"Hey! 🎉", time:"10:30 AM"}]);
  const [posts, setPosts] = useState<Post[]>([{id:1, user:"admin@test.com", text:"Welcome! Stories added 🔥", time:"Just now"}]);
  const [stories, setStories] = useState<Story[]>([
    {id:1, user:"priya@test.com", name:"Priya", image:"https://picsum.photos/400/700?random=1", time:"2h ago"},
    {id:2, user:"rahul@test.com", name:"Rahul", image:"https://picsum.photos/400/700?random=2", time:"5h ago"},
    {id:3, user:"john@test.com", name:"John", image:"https://picsum.photos/400/700?random=3", time:"1h ago"},
  ]);

  const chatWith = (f:string)=> messages.filter(m=> (m.from===email && m.to===f) || (m.from===f && m.to===email));

  useEffect(()=>{ let t:any; if(inCall){ t=setInterval(()=>setCallTime(s=>s+1),1000);} else setCallTime(0); return()=>clearInterval(t); },[inCall]);

  // Story auto progress
  useEffect(()=>{
    let timer:any;
    if(activeStory){
      setStoryProgress(0);
      timer = setInterval(()=>{ setStoryProgress(p=>{ if(p>=100){ closeStory(); return 0; } return p+1; }); }, 50); // 5 sec story
    }
    return ()=> clearInterval(timer);
  },[activeStory]);

  const startCall = async (f:string) => { setInCall(f); try{ const s = await navigator.mediaDevices.getUserMedia({video:true, audio:true}); if(localVideoRef.current) localVideoRef.current.srcObject=s; }catch{ alert("Allow camera!"); } };
  const endCall = () => { if(localVideoRef.current?.srcObject){ (localVideoRef.current.srcObject as MediaStream).getTracks().forEach(tr=>tr.stop()); } setInCall(null); };
  const handleLogin = (e:any)=>{ e.preventDefault(); setView("feed"); };
  const sendMsg = () => { if(!newMsg.trim()||!selectedChat) return; setMessages([...messages,{id:Date.now(),from:email,to:selectedChat,text:newMsg,time:new Date().toLocaleTimeString()}]); setNewMsg(""); };

  const handleImageSelect = (e:any) => { const file = e.target.files[0]; if(file){ setSelectedImage(URL.createObjectURL(file)); setSelectedVideo(null); } };
  const handleVideoSelect = (e:any) => { const file = e.target.files[0]; if(file){ setSelectedVideo(URL.createObjectURL(file)); setSelectedImage(null); } };
  const handleStorySelect = (e:any) => {
    const file = e.target.files[0];
    if(file){
      const url = URL.createObjectURL(file);
      const newStory:Story = {id:Date.now(), user:email, name:"You", image:url, time:"Just now"};
      setStories([newStory,...stories]);
      alert("Story Added! ✅ It will show on top for 24h");
    }
  };
  const createPost = () => {
    if(!newText.trim() &&!selectedImage &&!selectedVideo) return;
    setPosts([{id:Date.now(), user:email, text:newText, time:"Just now", image:selectedImage||undefined, video:selectedVideo||undefined},...posts]);
    setNewText(""); setSelectedImage(null); setSelectedVideo(null);
  };
  const openStory = (s:Story) => { setActiveStory(s); setStories(stories.map(st=> st.id===s.id?{...st,viewed:true}:st)); };
  const closeStory = () => setActiveStory(null);

  if(view!=="feed"){
    return (<div className="min-h-screen flex items-center justify-center p-4" style={{background:"#fff5eb"}}><div className="bg-white rounded-xl shadow p-4 w-full max-w-[400px]"><h1 className="text-[26px] font-black text-center">Seven Sisters Voice</h1><p className="text-center text-xs text-gray-500 mb-4">Now with Stories 🔥</p><div className="flex gap-2 mb-4 p-1 bg-[#fff9f0] rounded-full border"><button onClick={()=>setView("login")} className={`flex-1 py-2 rounded-full font-bold text-xs ${view==="login"?"bg-black text-white":""}`}>Log in</button><button onClick={()=>setView("signup")} className={`flex-1 py-2 rounded-full font-bold text-xs ${view==="signup"?"bg-black text-white":""}`}>Sign Up</button></div><form onSubmit={handleLogin} className="space-y-3">{view==="signup"&&<input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Full Name" className="w-full border rounded-lg px-4 py-3" required/>}<input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-lg px-4 py-3" required/><input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full border rounded-lg px-4 py-3" required/><button className="w-full font-bold py-3 rounded-lg bg-[#ffeaa7] border">{view==="login"?"Log in":"Sign Up"}</button></form></div></div>);
  }

  if(activeStory){
    return (
      <div className="fixed inset-0 bg-black z-[200] flex flex-col">
        <div className="p-3 flex flex-col gap-2">
          <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden"><div className="h-full bg-white transition-all" style={{width:`${storyProgress}%`}}></div></div>
          <div className="flex justify-between items-center text-white">
            <div className="flex gap-2 items-center"><div className="w-9 h-9 rounded-full bg-[#ffeaa7] text-black flex items-center justify-center font-black text-xs">{activeStory.name[0]}</div><div><p className="font-bold text-sm">{activeStory.name}</p><p className="text-[10px] text-white/60">{activeStory.time}</p></div></div>
            <button onClick={closeStory} className="w-8 h-8 bg-white/20 rounded-full">X</button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-2"><img src={activeStory.image} className="max-h-full max-w-full rounded-xl object-contain"/></div>
        <div className="p-4 flex gap-2"><input placeholder={`Reply to ${activeStory.name}...`} className="flex-1 bg-white/10 text-white rounded-full px-4 py-3 text-sm border border-white/20 outline-none"/><button className="bg-white text-black px-5 py-3 rounded-full font-bold text-sm">Send</button></div>
      </div>
    );
  }

  if(inCall){
    const friend = allUsers.find(u=>u.email===inCall);
    return (<div className="fixed inset-0 bg-black z-[100] flex flex-col"><div className="flex-1 bg-gray-900 flex items-center justify-center relative"><div className="text-center"><div className="w-24 h-24 rounded-full bg-[#ffeaa7] mx-auto flex items-center justify-center text-3xl font-black">{friend?.name[0]}</div><p className="text-white font-bold mt-4">{friend?.name}</p><p className="text-white/60 text-sm">● {String(Math.floor(callTime/60)).padStart(2,"0")}:{String(callTime%60).padStart(2,"0")}</p></div><video ref={localVideoRef} autoPlay muted playsInline className="absolute bottom-4 right-4 w-[110px] h-[150px] rounded-2xl bg-black object-cover border-2 border-white/30"/></div><div className="bg-[#1a1a1a] p-6 flex justify-center"><button onClick={endCall} className="w-14 h-14 rounded-full bg-red-600 text-white">📞</button></div></div>);
  }

  if(selectedChat){
    const friend = allUsers.find(u=>u.email===selectedChat);
    const conv = chatWith(selectedChat);
    return (<main className="min-h-screen flex flex-col" style={{background:"#fff5eb"}}><div className="bg-white border-b px-3 py-2.5 flex items-center gap-2 sticky top-0"><button onClick={()=>setSelectedChat(null)} className="w-8 h-8 bg-gray-100 rounded-full">←</button><div className="w-9 h-9 rounded-full bg-[#ffeaa7] flex items-center justify-center font-black text-xs">{friend?.name[0]}</div><div className="flex-1"><p className="font-bold text-sm">{friend?.name}</p><p className="text-[10px] text-green-600">● Online</p></div><button onClick={()=>startCall(selectedChat)} className="w-9 h-9 bg-black text-white rounded-full">📹</button></div><div className="flex-1 overflow-y-auto p-3 space-y-2 max-w-[500px] w-full mx-auto">{conv.map(m=>(<div key={m.id} className={`flex ${m.from===email?"justify-end":"justify-start"}`}><div className={`px-4 py-2 rounded-[18px] text-[13px] ${m.from===email?"bg-black text-white rounded-br-[4px]":"bg-white border"}`}>{m.text}</div></div>))}</div><div className="bg-white border-t p-2 sticky bottom-0"><div className="max-w-[500px] mx-auto flex gap-2"><input value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} placeholder="Message..." className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm outline-none"/><button onClick={sendMsg} className="bg-black text-white w-10 h-10 rounded-full">↑</button></div></div></main>);
  }

  return (
    <main className="min-h-screen pb-20" style={{background:"#fff5eb"}}>
      <div className="sticky top-0 z-40 bg-white shadow px-2 py-2 flex justify-between items-center">
        <h1 className="font-black text-[12px]">Seven Sisters Voice</h1>
        <div className="flex gap-1">
          <button onClick={()=>setActiveTab("home")} className={`px-4 py-2 rounded-full text-[11px] font-bold ${activeTab==="home"?"bg-black text-white":"bg-[#ffeaa7]"}`}>Home</button>
          <button onClick={()=>setActiveTab("friends")} className={`px-3 py-2 rounded-full text-[11px] font-bold ${activeTab==="friends"?"bg-black text-white":"bg-[#ffeaa7]"}`}>Friends</button>
          <button onClick={()=>setActiveTab("chat")} className={`px-3 py-2 rounded-full text-[11px] font-bold ${activeTab==="chat"?"bg-black text-white":"bg-[#ffeaa7]"}`}>Chat 📹</button>
          <button onClick={()=>setView("login")} className="px-2 py-2 rounded-full text-[10px] bg-gray-100">Logout</button>
        </div>
      </div>

      <div className="max-w-[500px] mx-auto p-2 pt-3 space-y-3">
        {activeTab==="home" && <>
          {/* STORIES BAR - Like FB/Insta */}
          <div className="bg-white rounded-[18px] p-3 border overflow-hidden">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
              {/* Add Story */}
              <div className="flex flex-col items-center gap-1 min-w-[62px]">
                <div onClick={()=>storyInputRef.current?.click()} className="w-[62px] h-[62px] rounded-full bg-[#fff9f0] border-2 border-dashed border-black flex flex-col items-center justify-center cursor-pointer hover:bg-[#ffeaa7]">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-black text-lg">+</div>
                  <p className="text-[8px] font-bold mt-1">Add Story</p>
                </div>
                <p className="text-[10px] font-bold">You</p>
              </div>
              {stories.map(s=>(
                <div key={s.id} onClick={()=>openStory(s)} className="flex flex-col items-center gap-1 min-w-[62px] cursor-pointer">
                  <div className={`w-[62px] h-[62px] rounded-full p-[3px] ${s.viewed?"bg-gray-300":"bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500"}`}>
                    <div className="w-full h-full rounded-full bg-white p-[2px]"><img src={s.image} className="w-full h-full rounded-full object-cover"/></div>
                  </div>
                  <p className="text-[10px] font-bold truncate max-w-[62px]">{s.name}</p>
                </div>
              ))}
            </div>
            <input ref={storyInputRef} type="file" accept="image/*" onChange={handleStorySelect} className="hidden"/>
          </div>

          {/* CREATE POST */}
          <div className="bg-white rounded-[18px] p-4 border space-y-3">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ffeaa7] flex items-center justify-center font-black border">{email[0].toUpperCase()}</div>
              <textarea value={newText} onChange={e=>setNewText(e.target.value)} placeholder="What's on your mind?" className="flex-1 bg-[#fff9f0] rounded-xl px-4 py-3 text-sm outline-none min-h-[50px] border"/>
            </div>
            {selectedImage && <div className="relative rounded-xl overflow-hidden border"><img src={selectedImage} className="w-full max-h-[300px] object-cover"/><button onClick={()=>setSelectedImage(null)} className="absolute top-2 right-2 w-8 h-8 bg-black text-white rounded-full">X</button></div>}
            {selectedVideo && <div className="relative rounded-xl overflow-hidden border"><video src={selectedVideo} controls className="w-full max-h-[300px]"/><button onClick={()=>setSelectedVideo(null)} className="absolute top-2 right-2 w-8 h-8 bg-black text-white rounded-full">X</button></div>}
            <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden"/>
            <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoSelect} className="hidden"/>
            <div className="flex gap-2 border-t pt-3">
              <button onClick={()=>imageInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 bg-[#fff9f0] py-2.5 rounded-full text-[12px] font-bold border">📸 Photo</button>
              <button onClick={()=>videoInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 bg-[#fff9f0] py-2.5 rounded-full text-[12px] font-bold border">🎥 Video</button>
              <button onClick={createPost} className="flex-1 bg-black text-white py-2.5 rounded-full text-[12px] font-black">Post 🚀</button>
            </div>
          </div>

          {posts.map(p=><div key={p.id} className="bg-white rounded-2xl border overflow-hidden"><div className="p-4"><div className="flex gap-2 items-center"><div className="w-9 h-9 rounded-full bg-[#ffeaa7] flex items-center justify-center font-black text-xs border">{p.user[0].toUpperCase()}</div><div><p className="font-bold text-xs">{p.user.split("@")[0]}</p><p className="text-[10px] text-gray-400">{p.time}</p></div></div>{p.text && <p className="text-[13px] mt-3">{p.text}</p>}</div>{p.image && <img src={p.image} className="w-full max-h-[400px] object-cover"/>}{p.video && <video src={p.video} controls className="w-full max-h-[400px] bg-black"/><div className="p-3 flex gap-4 border-t bg-[#fff9f0] text-[11px] font-bold text-gray-500"><span>👍 Like</span><span>💬 Comment</span><span>↗️ Share</span></div></div>)}
        </>}

        {activeTab==="friends" && <div className="bg-white rounded-2xl p-4 border space-y-2">{friends.map(f=>{ const u=allUsers.find(x=>x.email===f); return <div key={f} className="flex justify-between p-3 bg-[#fff9f0] rounded-xl border"><p className="font-bold text-xs">{u?.name||f}</p><div className="flex gap-1"><button onClick={()=>setSelectedChat(f)} className="bg-white border px-3 py-1 rounded-full text-[10px]">💬</button><button onClick={()=>startCall(f)} className="bg-black text-white px-3 py-1 rounded-full text-[10px]">📹</button></div></div>})}</div>}

        {activeTab==="chat" && <div className="bg-white rounded-2xl border overflow-hidden"><div className="p-3 border-b font-black text-sm">Messages 📹</div>{friends.map(f=>{ const u=allUsers.find(x=>x.email===f); return <div key={f} className="flex gap-3 p-3 border-b"><div className="w-12 h-12 rounded-full bg-[#ffeaa7] flex items-center justify-center font-black border">{u?.name[0]}</div><div className="flex-1" onClick={()=>setSelectedChat(f)}><p className="font-bold text-[13px]">{u?.name}</p><p className="text-[11px] text-gray-500">Tap to chat</p></div><button onClick={()=>startCall(f)} className="w-9 h-9 bg-black text-white rounded-full">📹</button></div>; })}</div>}
      </div>
    </main>
  );
                                                       }
