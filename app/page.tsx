"use client";
import { useState, useRef, useEffect } from "react";

type Story = { id: number; user: string; type: "photo"|"video"|"text"; content: string; bg?: string; filter: string; music: string; border: string; time: number; }
type Post = { id: number; user: string; text: string; image?: string; video?: string; likes: number; liked: boolean; comments: string[]; time: string; }
type FriendReq = { id: number; from: string; to: string; status: "pending"|"accepted"|"rejected"; }

export default function SevenSistersVoice() {
  const [view, setView] = useState<"login"|"signup"|"forgot"|"feed">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"home"|"friends"|"settings">("home");

  // SETTINGS
  const [profileName, setProfileName] = useState("Seven Sisters User");
  const [myState, setMyState] = useState("assam");
  const [themeColor, setThemeColor] = useState("peach");
  const [language, setLanguage] = useState("English");
  const themes:any = {
    peach: { bg:"#fff5eb", card:"#ffeaa7", btn:"linear-gradient(90deg,#ff9a9e,#fecfef)", light:"#ffeaa7"},
    mint: { bg:"#e8fffa", card:"#a1f0c4", btn:"linear-gradient(90deg,#a1f0c4,#b2f7ef)", light:"#a1f0c4"},
    lavender: { bg:"#f5e8ff", card:"#e2d1f9", btn:"linear-gradient(90deg,#c3b1e1,#e2d1f9)", light:"#e2d1f9"},
    sky: { bg:"#e8f4ff", card:"#a1d4ff", btn:"linear-gradient(90deg,#a1d4ff,#c2e9fb)", light:"#a1d4ff"},
  };
  const currentTheme = themes[themeColor];

  // FRIENDS SYSTEM
  const [allUsers] = useState([
    {email:"priya@test.com", name:"Priya Meghalaya", state:"meghalaya", avatar:"P"},
    {email:"rahul@test.com", name:"Rahul Assam", state:"assam", avatar:"R"},
    {email:"john@test.com", name:"John Nagaland", state:"nagaland", avatar:"J"},
    {email:"mizo@test.com", name:"Mizo Boy", state:"mizoram", avatar:"M"},
    {email:"manipur@test.com", name:"Leima Manipur", state:"manipur", avatar:"L"},
    {email:"arun@test.com", name:"Tashi Arunachal", state:"arunachal", avatar:"T"},
    {email:"tripura@test.com", name:"Riya Tripura", state:"tripura", avatar:"R"},
  ]);
  const [friendReqs, setFriendReqs] = useState<FriendReq[]>([
    {id:1, from:"priya@test.com", to:"admin@test.com", status:"pending"},
    {id:2, from:"rahul@test.com", to:"admin@test.com", status:"pending"},
  ]);
  const [friends, setFriends] = useState<string[]>(["john@test.com"]);
  const myEmail = email || "admin@test.com";
  const myIncomingReqs = friendReqs.filter(r=> r.to===myEmail && r.status==="pending");
  const myFriendsEmails = [...friends, myEmail];

  // STORIES - 12HR - FRIENDS ONLY - PHOTO/VIDEO/TEXT + FILTER + MUSIC + BORDER
  const [stories, setStories] = useState<Story[]>([
    {id:1, user:"priya@test.com", type:"photo", content:"https://picsum.photos/300/500?random=2", filter:"none", music:"Bihu Beat", border:"meghalaya", time: Date.now()-1000*60*30},
    {id:2, user:"john@test.com", type:"text", content:"Seven Sisters Voice!", bg:"linear-gradient(135deg,#ff9a9e,#fecfef)", filter:"none", music:"Naga Folk", border:"nagaland", time: Date.now()-1000*60*60*2},
  ]);
  const [showStoryCreate, setShowStoryCreate] = useState(false);
  const [storyType, setStoryType] = useState<"photo"|"video"|"text">("photo");
  const [storyContent, setStoryContent] = useState("");
  const [storyBg, setStoryBg] = useState("linear-gradient(135deg,#ff9a9e,#fecfef)");
  const [storyFilter, setStoryFilter] = useState("none");
  const [storyMusic, setStoryMusic] = useState("No Music");
  const [storyBorder, setStoryBorder] = useState("assam");
  const [viewStory, setViewStory] = useState<Story|null>(null);

  const storyBorders:any = {
    assam:"border-4 border-[#ff6b6b] shadow-[0_0_0_3px_#ffe66d]",
    arunachal:"border-4 border-[#48dbfb] shadow-[0_0_0_3px_#feca57]",
    manipur:"border-4 border-[#feca57] shadow-[0_0_0_3px_#ff6b6b]",
    meghalaya:"border-4 border-[#1dd1a1] shadow-[0_0_0_3px_#feca57]",
    mizoram:"border-4 border-[#a55eea] shadow-[0_0_0_3px_white]",
    nagaland:"border-4 border-black shadow-[0_0_0_3px_#ff6b6b]",
    tripura:"border-4 border-[#ff9f43] shadow-[0_0_0_3px_white]",
  };
  const filters = [{name:"Normal",val:"none"},{name:"B&W",val:"grayscale(100%)"},{name:"Warm",val:"sepia(60%)"},{name:"Bright",val:"brightness(1.3)"}];
  const musics = ["No Music","Bihu Beat","Naga Folk","Mizo Love Song","Meghalaya Rock","Manipuri Folk"];
  const bgs = ["linear-gradient(135deg,#ff9a9e,#fecfef)","linear-gradient(135deg,#ffecd2,#fcb69f)","linear-gradient(135deg,#a1c4fd,#c2e9fb)","linear-gradient(135deg,#84fab0,#8fd3f4)","linear-gradient(135deg,#a6c0fe,#f68084)"];

  // POSTS - PHOTO/VIDEO UP TO 60SEC
  const [posts, setPosts] = useState<Post[]>([
    { id:1, user:"admin@test.com", text:"Welcome to Seven Sisters Voice! 🎉 Light & warm for Northeast. Add friends to see friends-only posts! 12Hr stories with music & filters!", likes:12, liked:false, comments:[], time:"Just now" },
    { id:2, user:"john@test.com", text:"I am your friend! Only friends can see this post 😊", likes:5, liked:false, comments:[], time:"1h ago" },
  ]);
  const [newText, setNewText] = useState("");
  const [newImage, setNewImage] = useState<string|undefined>();
  const [newVideo, setNewVideo] = useState<string|undefined>();
  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const storyFileRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{ const i=setInterval(()=>{ setStories(s=> s.filter(st=> Date.now()-st.time < 12*60*60*1000)); },60000); return()=>clearInterval(i); },[]);

  const handleLogin = (e:any) => { e.preventDefault(); if(email) { setProfileName(email.split("@")[0]); setView("feed"); } };
  const handleStoryFile = (e:any)=>{ const file=e.target.files[0]; if(!file) return; const r=new FileReader(); r.onload=ev=>{ const res=ev.target?.result as string; if(file.type.startsWith("video")){ const vid=document.createElement("video"); vid.onloadedmetadata=()=>{ if(vid.duration>30){ alert("Story max 30 sec!"); return; } setStoryContent(res); setStoryType("video"); }; vid.src=res; } else { setStoryContent(res); setStoryType("photo"); } }; r.readAsDataURL(file); };
  const addStory = ()=>{ if(!storyContent && storyType!=="text") return; setStories([{ id: Date.now(), user: myEmail, type: storyType, content: storyType==="text"? (storyContent || "Seven Sisters Voice!") : storyContent, bg: storyBg, filter: storyFilter, music: storyMusic, border: storyBorder, time: Date.now() },...stories]); setShowStoryCreate(false); setStoryContent(""); };
  const handleImage = (e:any) => { const file=e.target.files[0]; if(file){ const r=new FileReader(); r.onload=ev=> setNewImage(ev.target?.result as string); r.readAsDataURL(file); } };
  const handleVideo = (e:any) => { const file=e.target.files[0]; if(!file) return; const v=document.createElement("video"); v.preload="metadata"; v.onloadedmetadata=()=>{ if(v.duration>61){ alert(`Video too long ${Math.round(v.duration)}s! Only 60s allowed.`); return; } const r=new FileReader(); r.onload=ev=> setNewVideo(ev.target?.result as string); r.readAsDataURL(file); }; v.src=URL.createObjectURL(file); };
  const createPost = () => { if(!newText &&!newImage &&!newVideo) return; setPosts([{ id: Date.now(), user: myEmail, text: newText, image: newImage, video: newVideo, likes:0, liked:false, comments:[], time:"Just now" },...posts]); setNewText(""); setNewImage(undefined); setNewVideo(undefined); };
  const like = (id:number) => setPosts(posts.map(p=> p.id===id? {...p, likes: p.liked? p.likes-1 : p.likes+1, liked:!p.liked} : p));
  const sendRequest = (toEmail: string) => { if(friendReqs.find(r=> r.from===myEmail && r.to===toEmail) || friends.includes(toEmail)) return; setFriendReqs([...friendReqs, {id: Date.now(), from: myEmail, to: toEmail, status:"pending"}]); alert(`Request sent to ${toEmail}!`); };
  const acceptRequest = (id: number) => { const req=friendReqs.find(r=>r.id===id); if(req){ setFriends([...friends, req.from]); setFriendReqs(friendReqs.map(r=> r.id===id? {...r, status:"accepted"}: r)); } };
  const rejectRequest = (id: number) => { setFriendReqs(friendReqs.map(r=> r.id===id? {...r, status:"rejected"}: r)); };

  const visiblePosts = posts.filter(p=> myFriendsEmails.includes(p.user) || p.user===myEmail);
  const visibleStories = stories.filter(s=> myFriendsEmails.includes(s.user));

  // ================= EXTERIOR - LOGIN PAGE - FULL FACEBOOK STYLE =================
  if(view!=="feed"){
    return (
      <div className="min-h-screen flex flex-col" style={{background:"#fff5eb"}}>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-[1100px] flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-24">
            <div className="flex-1 text-center lg:text-left max-w-[520px]">
              <h1 className="text-[44px] lg:text-[62px] font-black leading-[0.9] tracking-tight" style={{color:"#2d3436"}}>Seven Sisters Voice</h1>
              <h2 className="text-[20px] lg:text-[26px] mt-4 leading-[1.2] font-normal text-[#2d3436]/80">Connect with friends and the world around you on Seven Sisters Voice. A light and warm voice for Northeast India.</h2>
              <div className="hidden lg:flex gap-2 mt-6 flex-wrap"><span className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow">🌄 Assam</span><span className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow">⛰️ Meghalaya</span><span className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow">🎸 Nagaland</span><span className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow">🌸 Mizoram</span><span className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow">🌼 Manipur</span></div>
            </div>
            <div className="w-full max-w-[400px]">
              <div className="bg-white rounded-[12px] shadow-[0_2px_20px_rgba(0,0,0,0.15)] p-4">
                <div className="flex gap-2 mb-4 p-1 bg-[#fff9f0] rounded-full">
                  <button onClick={()=>setView("login")} className={`flex-1 py-2.5 rounded-full font-bold text-[15px] ${view==="login"?"bg-[#2d3436] text-white shadow":"text-[#2d3436]"}`}>Log in</button>
                  <button onClick={()=>setView("signup")} className={`flex-1 py-2.5 rounded-full font-bold text-[15px] ${view==="signup"?"bg-[#2d3436] text-white shadow":"text-[#2d3436]"}`}>Sign Up</button>
                </div>
                <form onSubmit={handleLogin} className="space-y-3">
                  <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address or phone number" className="w-full border border-[#dddfe2] rounded-[8px] px-4 py-3.5 text-[17px] bg-white focus:outline-none focus:border-[#fab1a0]" required/>
                  {view!=="forgot" && <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full border border-[#dddfe2] rounded-[8px] px-4 py-3.5 text-[17px] bg-white focus:outline-none focus:border-[#fab1a0]" required/>}
                  <button type="submit" className="w-full text-[#2d3436] text-[20px] font-bold rounded-[8px] py-3 shadow-sm" style={{background: currentTheme.btn}}>{view==="login"?"Log in":view==="signup"?"Sign Up":"Reset Password"}</button>
                  {view==="login" && <><div className="text-center"><button type="button" onClick={()=>setView("forgot")} className="text-[#ff6b6b] text-[14px] font-medium hover:underline">Forgotten password?</button></div><hr className="border-[#dadde1] my-4"/><div className="text-center"><button type="button" onClick={()=>setView("signup")} className="bg-[#ffeaa7] hover:bg-[#fdcb6e] text-[#2d3436] font-bold px-5 py-3 rounded-[8px] text-[17px]">Create new account</button></div><div className="mt-4 bg-[#fff9f0] border border-[#ffeaa7] rounded-lg p-3"><p className="text-[12px] font-black">🔑 DEMO LOGIN FOR TESTING:</p><p className="text-[12px] text-[#636e72] mt-1">Email: <b>admin@test.com</b><br/>Password: <b>123456</b><br/>Or use any email you want</p></div></>}
                  {view==="signup" && <><p className="text-[11px] text-[#777]">By clicking Sign Up, you agree to our Terms. Learn how we collect and use your data.</p><div className="text-center"><button type="button" onClick={()=>setView("login")} className="text-[#ff6b6b] text-sm font-medium">Already have an account?</button></div></>}
                  {view==="forgot" && <div className="text-center"><button type="button" onClick={()=>setView("login")} className="bg-gray-100 px-5 py-2 rounded-full text-sm font-bold">Back to Login</button></div>}
                </form>
              </div>
              <div className="text-center mt-6 px-4"><p className="text-[14px]"><span className="font-bold">Create a Page</span> for a celebrity, brand or business from Northeast.</p></div>
            </div>
          </div>
        </main>
        <footer className="bg-white mt-8 py-6 px-4 border-t"><div className="max-w-[1100px] mx-auto"><div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-[#737373]"><span>English (UK)</span><span className="text-[#ff9a9e] border px-2 rounded">অসমীয়া</span><span>বাংলা</span><span>हिन्दी</span><span>नेपाली</span><span>Mizo tawng</span><span>Nagamese</span><span>Meiteilon</span><span className="border px-2">+</span></div><hr className="my-3"/><div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-[#737373]"><span>Sign Up</span><span>Log in</span><span>Messenger</span><span>Seven Sisters Voice Lite</span><span>Video</span><span>Places</span><span>Games</span><span>Marketplace</span><span>Groups</span><span>Privacy</span><span>Terms</span><span>Help</span></div><p className="text-[11px] text-[#737373] mt-4">Seven Sisters Voice © 2026 • Made for Northeast India with ❤️ • Light Theme • No Blue • Exterior + Interior Complete</p></div></footer>
      </div>
    );
  }

  // ================= INTERIOR - FEED + FRIENDS + SETTINGS =================
  return (
    <main className="min-h-screen" style={{background: currentTheme.bg}}>
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur shadow-sm px-3 py-2 flex items-center justify-between">
        <h1 className="text-[18px] font-black" style={{color:"#2d3436"}}>Seven Sisters Voice</h1>
        <div className="flex gap-1 items-center">
          <button onClick={()=>setActiveTab("home")} className={`px-4 py-1.5 rounded-full font-bold text-xs ${activeTab==="home"?"bg-[#2d3436] text-white":"bg-[#fff9f0] border"}`}>🏠 Home</button>
          <button onClick={()=>setActiveTab("friends")} className={`px-4 py-1.5 rounded-full font-bold text-xs relative ${activeTab==="friends"?"bg-[#2d3436] text-white":"bg-[#fff9f0] border"}`}>👥 Friends {myIncomingReqs.length>0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">{myIncomingReqs.length}</span>}</button>
          <button onClick={()=>setActiveTab("settings")} className={`px-4 py-1.5 rounded-full font-bold text-xs ${activeTab==="settings"?"bg-[#2d3436] text-white":"bg-[#fff9f0] border"}`}>⚙️ Settings</button>
        </div>
      </div>

      <div className="max-w-[680px] mx-auto pt-3 px-2 pb-20 space-y-4">
        {activeTab==="home" && (
          <>
            <div className="bg-white rounded-2xl shadow-sm p-3 border">
              <p className="text-xs font-bold mb-2">Friends Stories - 12Hr • Music • Filter • Border • Only Friends {visibleStories.length}</p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                <div onClick={()=>setShowStoryCreate(true)} className="min-w-[100px] h-[170px] bg-[#fff9f0] rounded-2xl border-2 border-dashed border-[#fab1a0] flex flex-col items-center justify-center cursor-pointer shrink-0"><div className="w-10 h-10 bg-[#2d3436] text-white rounded-full flex items-center justify-center font-bold">+</div><p className="text-xs font-bold mt-2">Create Story</p><p className="text-[9px] text-gray-400">Photo/Video/Text</p></div>
                {visibleStories.map(s=>{ const hoursLeft = 12 - Math.floor((Date.now()-s.time)/3600000); return (
                  <div key={s.id} onClick={()=>setViewStory(s)} className={`min-w-[100px] h-[170px] rounded-2xl relative overflow-hidden cursor-pointer shrink-0 ${storyBorders[s.border]}`}>
                    {s.type==="photo" && <img src={s.content} style={{filter:s.filter}} className="w-full h-full object-cover"/>}
                    {s.type==="video" && <video src={s.content} style={{filter:s.filter}} className="w-full h-full object-cover"/>}
                    {s.type==="text" && <div style={{background:s.bg}} className="w-full h-full flex items-center justify-center p-2 font-bold text-center text-sm">{s.content}</div>}
                    <div className="absolute top-1 left-1 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded-full">🎵 {s.music}</div>
                    <div className="absolute bottom-1 left-1 right-1"><p className="text-white text-[10px] font-bold truncate bg-black/60 rounded px-1">{s.user.split("@")[0]} • {hoursLeft}h</p></div>
                  </div>
                ); })}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-4 border">
              <div className="flex gap-3"><div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0" style={{background: currentTheme.btn}}>{profileName[0]?.toUpperCase()}</div><textarea value={newText} onChange={e=>setNewText(e.target.value)} placeholder={`What's on your mind, ${profileName}? (Friends only)`} className="flex-1 bg-[#fff9f0] rounded-2xl px-4 py-3 outline-none border min-h-[50px] text-sm"/></div>
              {(newImage || newVideo) && <div className="mt-3 relative">{newImage && <img src={newImage} className="w-full rounded-xl"/>}{newVideo && <video src={newVideo} controls className="w-full rounded-xl bg-black"/>}<button onClick={()=>{setNewImage(undefined); setNewVideo(undefined);}} className="absolute top-2 right-2 bg-black text-white rounded-full w-8 h-8 text-xs">X</button></div>}
              <div className="flex justify-between mt-3"><div className="flex gap-2"><button onClick={()=>imageRef.current?.click()} className="px-3 py-2 bg-[#fff9f0] rounded-full text-xs font-bold border">🖼️ Photo</button><button onClick={()=>videoRef.current?.click()} className="px-3 py-2 bg-[#fff9f0] rounded-full text-xs font-bold border">🎥 1Min Video</button></div><button onClick={createPost} className="px-6 py-2 rounded-full font-bold text-xs" style={{background: currentTheme.card}}>Post to Friends</button></div>
              <input ref={imageRef} type="file" accept="image/*" onChange={handleImage} className="hidden"/><input ref={videoRef} type="file" accept="video/*" onChange={handleVideo} className="hidden"/>
            </div>

            {visiblePosts.map(post=>(<div key={post.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden"><div className="p-3 flex gap-2"><div className="w-10 h-10 rounded-full bg-[#ffeaa7] flex items-center justify-center font-bold text-xs">{post.user[0].toUpperCase()}</div><div><p className="font-bold text-[14px]">{post.user===myEmail?profileName:post.user}</p><p className="text-xs text-gray-400">{post.time} • {myState} • Friends 🔒</p></div></div>{post.text && <p className="px-4 pb-3 text-[14px] leading-snug">{post.text}</p>}{post.image && <img src={post.image} className="w-full"/>}{post.video && <video src={post.video} controls className="w-full bg-black"/>}<div className="flex p-1 border-t"><button onClick={()=>like(post.id)} className={`flex-1 py-2 rounded-xl font-bold text-xs ${post.liked?"text-[#ff6b6b]":"text-gray-500"}`}>❤️ {post.likes} Like</button><button className="flex-1 py-2 text-xs text-gray-500 font-bold">💬 Comment</button><button className="flex-1 py-2 text-xs text-gray-500 font-bold">↗️ Share</button
