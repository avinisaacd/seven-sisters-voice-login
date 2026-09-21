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

  // Settings
  const [profileName, setProfileName] = useState("Seven Sisters User");
  const [myState, setMyState] = useState("assam");
  const [themeColor, setThemeColor] = useState("peach");
  const themes:any = {
    peach: { bg:"#fff5eb", card:"#ffeaa7", btn:"linear-gradient(90deg,#ff9a9e,#fecfef)", light:"#ffeaa7"},
    mint: { bg:"#e8fffa", card:"#a1f0c4", btn:"linear-gradient(90deg,#a1f0c4,#b2f7ef)", light:"#a1f0c4"},
    lavender: { bg:"#f5e8ff", card:"#e2d1f9", btn:"linear-gradient(90deg,#c3b1e1,#e2d1f9)", light:"#e2d1f9"},
  };
  const currentTheme = themes[themeColor];

  // Friends
  const [allUsers] = useState([
    {email:"priya@test.com", name:"Priya Meghalaya", state:"meghalaya"},
    {email:"rahul@test.com", name:"Rahul Assam", state:"assam"},
    {email:"john@test.com", name:"John Nagaland", state:"nagaland"},
    {email:"mizo@test.com", name:"Mizo Boy", state:"mizoram"},
    {email:"manipur@test.com", name:"Leima Manipur", state:"manipur"},
    {email:"arun@test.com", name:"Tashi Arunachal", state:"arunachal"},
    {email:"tripura@test.com", name:"Riya Tripura", state:"tripura"},
  ]);
  const [friendReqs, setFriendReqs] = useState<FriendReq[]>([
    {id:1, from:"priya@test.com", to:"admin@test.com", status:"pending"},
    {id:2, from:"rahul@test.com", to:"admin@test.com", status:"pending"},
  ]);
  const [friends, setFriends] = useState<string[]>(["john@test.com"]);
  const myEmail = email || "admin@test.com";
  const myIncomingReqs = friendReqs.filter(r=> r.to===myEmail && r.status==="pending");

  // Stories & Posts
  const [stories, setStories] = useState<Story[]>([
    {id:1, user:"priya@test.com", type:"photo", content:"https://picsum.photos/300/500?random=1", filter:"none", music:"Bihu Beat", border:"meghalaya", time: Date.now()-1000*60*30},
    {id:2, user:"john@test.com", type:"text", content:"Seven Sisters Voice!", bg:"linear-gradient(135deg,#ff9a9e,#fecfef)", filter:"none", music:"Naga Folk", border:"nagaland", time: Date.now()-1000*60*60},
  ]);
  const [posts, setPosts] = useState<Post[]>([
    { id:1, user:"admin@test.com", text:"Welcome to Seven Sisters Voice! 🎉 Connect with all 7 Sisters. Friends only posts & 12Hr stories!", likes:12, liked:false, comments:[], time:"Just now" },
  ]);
  const [newText, setNewText] = useState("");
  const [newImage, setNewImage] = useState<string|undefined>();
  const [newVideo, setNewVideo] = useState<string|undefined>();
  const [showStoryCreate, setShowStoryCreate] = useState(false);
  const [viewStory, setViewStory] = useState<Story|null>(null);
  const [storyType, setStoryType] = useState<"photo"|"video"|"text">("photo");
  const [storyContent, setStoryContent] = useState("");
  const [storyBg, setStoryBg] = useState("linear-gradient(135deg,#ff9a9e,#fecfef)");

  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const storyFileRef = useRef<HTMLInputElement>(null);
  const storyBorders:any = {
    assam:"border-4 border-[#ff6b6b]", meghalaya:"border-4 border-[#1dd1a1]", nagaland:"border-4 border-black",
    mizoram:"border-4 border-purple-500", manipur:"border-4 border-yellow-500", arunachal:"border-4 border-blue-400", tripura:"border-4 border-orange-400"
  };

  useEffect(()=>{ const i=setInterval(()=>{ setStories(s=>s.filter(st=>Date.now()-st.time < 12*60*60*1000)); },60000); return()=>clearInterval(i); },[]);

  const handleLogin = (e:any)=>{ e.preventDefault(); if(view==="login" || view==="signup"){ if(email) setView("feed"); } else setView("login"); };
  const acceptReq = (id:number)=>{ const req=friendReqs.find(r=>r.id===id); if(req){ setFriends([...friends, req.from]); setFriendReqs(friendReqs.map(r=>r.id===id?{...r,status:"accepted"}:r)); } };
  const rejectReq = (id:number)=> setFriendReqs(friendReqs.map(r=>r.id===id?{...r,status:"rejected"}:r));
  const sendReq = (to:string)=> { if(!friendReqs.find(r=>r.from===myEmail && r.to===to)) setFriendReqs([...friendReqs, {id:Date.now(), from:myEmail, to, status:"pending"}]); };
  const createPost = ()=>{ if(!newText &&!newImage &&!newVideo) return; setPosts([{id:Date.now(), user:myEmail, text:newText, image:newImage, video:newVideo, likes:0, liked:false, comments:[], time:"Just now"},...posts]); setNewText(""); setNewImage(undefined); setNewVideo(undefined); };
  const handleImage = (e:any)=>{ const f=e.target.files[0]; if(f){ const r=new FileReader(); r.onload=ev=>setNewImage(ev.target?.result as string); r.readAsDataURL(f);} };
  const handleVideo = (e:any)=>{ const f=e.target.files[0]; if(f){ const vid=document.createElement("video"); vid.preload="metadata"; vid.onloadedmetadata=()=>{ if(vid.duration>61){ alert("Video max 60 sec!"); return; } const r=new FileReader(); r.onload=ev=>setNewVideo(ev.target?.result as string); r.readAsDataURL(f); }; vid.src=URL.createObjectURL(f);} };
  const handleStoryFile = (e:any)=>{ const f=e.target.files[0]; if(f){ const r=new FileReader(); r.onload=ev=>{ const res=ev.target?.result as string; if(f.type.startsWith("video")){ const v=document.createElement("video"); v.onloadedmetadata=()=>{ if(v.duration>30){ alert("Story max 30 sec"); return; } setStoryContent(res); setStoryType("video"); }; v.src=res; } else { setStoryContent(res); setStoryType("photo"); } }; r.readAsDataURL(f);} };
  const like = (id:number)=> setPosts(posts.map(p=>p.id===id?{...p, likes:p.liked?p.likes-1:p.likes+1, liked:!p.liked}:p));

  if(view!=="feed"){
    return (
      <div className="min-h-screen flex flex-col" style={{background:"#fff5eb"}}>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-[1100px] flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-24">
            <div className="flex-1 text-center lg:text-left max-w-[520px]">
              <h1 className="text-[44px] lg:text-[60px] font-black leading-[0.9] tracking-tight" style={{color:"#2d3436"}}>Seven Sisters Voice</h1>
              <h2 className="text-[20px] lg:text-[24px] mt-4 leading-snug text-[#2d3436]/80">Connect with friends and the world around you on Seven Sisters Voice. A light and warm voice for Northeast India.</h2>
            </div>
            <div className="w-full max-w-[400px]">
              <div className="bg-white rounded-[12px] shadow-[0_2px_20px_rgba(0,0,0,0.15)] p-4">
                <div className="flex gap-2 mb-4 p-1 bg-[#fff9f0] rounded-full">
                  <button onClick={()=>setView("login")} className={`flex-1 py-2.5 rounded-full font-bold text-[15px] ${view==="login"?"bg-[#2d3436] text-white":"text-[#2d3436]"}`}>Log in</button>
                  <button onClick={()=>setView("signup")} className={`flex-1 py-2.5 rounded-full font-bold text-[15px] ${view==="signup"?"bg-[#2d3436] text-white":"text-[#2d3436]"}`}>Sign Up</button>
                </div>
                <form onSubmit={handleLogin} className="space-y-3">
                  <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address or phone number" className="w-full border border-[#dddfe2] rounded-[8px] px-4 py-3.5 text-[17px] focus:outline-none focus:border-[#fab1a0]" required/>
                  {view!=="forgot" && <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full border border-[#dddfe2] rounded-[8px] px-4 py-3.5 text-[17px] focus:outline-none focus:border-[#fab1a0]" required/>}
                  <button className="w-full text-[#2d3436] text-[20px] font-bold rounded-[8px] py-3" style={{background: currentTheme.btn}}>{view==="login"?"Log in":view==="signup"?"Sign Up":"Reset"}</button>
                  {view==="login" && <>
                    <div className="text-center"><button type="button" onClick={()=>setView("forgot")} className="text-[#ff6b6b] text-[14px]">Forgotten password?</button></div>
                    <hr className="my-4"/><div className="text-center"><button type="button" onClick={()=>setView("signup")} className="bg-[#ffeaa7] text-[#2d3436] font-bold px-5 py-3 rounded-[8px] text-[17px]">Create new account</button></div>
                    <div className="mt-3 bg-[#fff9f0] border border-[#ffeaa7] rounded-lg p-3"><p className="text-[11px] font-black">🔑 DEMO LOGIN:</p><p className="text-[11px] text-[#636e72]">Email: admin@test.com<br/>Password: 123456<br/>Or any email</p></div>
                  </>}
                </form>
              </div>
              <p className="text-center mt-5 text-[14px]"><b>Create a Page</b> for a celebrity, brand or business.</p>
            </div>
          </div>
        </main>
        <footer className="bg-white py-5 px-4 border-t mt-8"><div className="max-w-[1100px] mx-auto"><div className="flex flex-wrap gap-2 text-[12px] text-[#737373]"><span>English</span><span className="text-[#ff9a9e] border px-2">অসমীয়া</span><span>বাংলা</span><span>हिन्दी</span><span>Mizo</span><span>Nagamese</span><span>Meiteilon</span></div><hr className="my-3"/><div className="flex flex-wrap gap-3 text-[12px] text-[#737373]"><span>Sign Up</span><span>Log in</span><span>Messenger</span><span>Video</span><span>Marketplace</span><span>Groups</span><span>Privacy</span><span>Terms</span><span>Help</span></div><p className="text-[11px] text-[#737373] mt-3">Seven Sisters Voice © 2026 • Light Theme • No Blue • Made for Northeast ❤️</p></div></footer>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-20" style={{background: currentTheme.bg}}>
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur shadow-sm px-3 py-2 flex justify-between items-center">
        <h1 className="font-black text-[18px]">Seven Sisters Voice</h1>
        <div className="flex gap-1">
          <button onClick={()=>setActiveTab("home")} className={`px-3 py-1.5 rounded-full text-xs font-bold ${activeTab==="home"?"bg-black text-white":"bg-gray-100"}`}>Home</button>
          <button onClick={()=>setActiveTab("friends")} className={`px-3 py-1.5 rounded-full text-xs font-bold relative ${activeTab==="friends"?"bg-black text-white":"bg-gray-100"}`}>Friends {myIncomingReqs.length>0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px]">{myIncomingReqs.length}</span>}</button>
          <button onClick={()=>setActiveTab("settings")} className={`px-3 py-1.5 rounded-full text-xs font-bold ${activeTab==="settings"?"bg-black text-white":"bg-gray-100"}`}>⚙️</button>
          <button onClick={()=>setView("login")} className="ml-1 bg-[#ffeaa7] px-3 py-1.5 rounded-full text-xs font-bold">Logout</button>
        </div>
      </div>

      <div className="max-w-[680px] mx-auto p-2 space-y-3 pt-3">
        {activeTab==="home" && <>
          <div className="bg-white rounded-2xl p-3 border flex gap-2 overflow-x-auto">
            <div onClick={()=>setShowStoryCreate(true)} className="min-w-[95px] h-[160px] bg-[#fff9f0] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer"><div className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center font-bold">+</div><p className="text-[11px] font-bold mt-1">Create Story</p><p className="text-[9px] text-gray-400">12Hr Friends Only</p></div>
            {stories.filter(s=> [...friends, myEmail].includes(s.user)).map(s=>(
              <div key={s.id} onClick={()=>setViewStory(s)} className={`min-w-[95px] h-[160px] rounded-2xl overflow-hidden cursor-pointer relative ${storyBorders[s.border]}`}>
                {s.type==="photo" && <img src={s.content} className="w-full h-full object-cover"/>}
                {s.type==="video" && <video src={s.content} className="w-full h-full object-cover"/>}
                {s.type==="text" && <div style={{background:s.bg}} className="w-full h-full flex items-center justify-center p-2 text-sm font-bold text-center">{s.content}</div>}
                <div className="absolute bottom-0 bg-black/50 w-full p-1"><p className="text-white text-[10px] truncate font-bold">{s.user.split("@")[0]}</p></div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-4 border">
            <div className="flex gap-2"><div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{background:"linear-gradient(90deg,#ff9a9e,#fecfef)"}}>{profileName[0]}</div><textarea value={newText} onChange={e=>setNewText(e.target.value)} placeholder={`What's on your mind, ${profileName}?`} className="flex-1 bg-[#fff9f0] rounded-2xl px-4 py-3 outline-none border min-h-[50px] text-sm"/></div>
            {(newImage || newVideo) && <div className="mt-3 relative">{newImage && <img src={newImage} className="w-full rounded-xl"/>}{newVideo && <video src={newVideo} controls className="w-full rounded-xl"/>}<button onClick={()=>{setNewImage(undefined); setNewVideo(undefined);}} className="absolute top-2 right-2 bg-black text-white w-7 h-7 rounded-full text-xs">X</button></div>}
            <div className="flex justify-between mt-3"><div className="flex gap-2"><button onClick={()=>imageRef.current?.click()} className="px-3 py-2 bg-gray-50 rounded-full text-xs font-bold border">🖼️ Photo</button><button onClick={()=>videoRef.current?.click()} className="px-3 py-2 bg-gray-50 rounded-full text-xs font-bold border">🎥 1Min Video</button></div><button onClick={createPost} className="px-6 py-2 rounded-full font-bold text-xs" style={{background: currentTheme.card}}>Post to Friends</button></div>
            <input ref={imageRef} type="file" accept="image/*" onChange={handleImage} className="hidden"/><input ref={videoRef} type="file" accept="video/*" onChange={handleVideo} className="hidden"/>
          </div>

          {posts.map(p=>(
            <div key={p.id} className="bg-white rounded-2xl border overflow-hidden">
              <div className="p-3 flex gap-2"><div className="w-9 h-9 rounded-full bg-[#ffeaa7] flex items-center justify-center font-bold text-xs">{p.user[0].toUpperCase()}</div><div><p className="font-bold text-[14px]">{p.user===myEmail?profileName:p.user}</p><p className="text-[11px] text-gray-400">{p.time} • {myState} • Friends 🔒</p></div></div>
              {p.text && <p className="px-4 pb-3 text-[14px]">{p.text}</p>}
              {p.image && <img src={p.image} className="w-full"/>}{p.video && <video src={p.video} controls className="w-full bg-black"/>}
              <div className="flex border-t"><button onClick={()=>like(p.id)} className={`flex-1 py-2.5 text-xs font-bold ${p.liked?"text-red-500":"text-gray-500"}`}>❤️ {p.likes} Like</button><button className="flex-1 py-2.5 text-xs text-gray-500">💬 Comment</button><button className="flex-1 py-2.5 text-xs text-gray-500">↗️ Share</button></div>
            </div>
          ))}
        </>}

        {activeTab==="friends" && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-4 border"><h2 className="font-black mb-3">Friend Requests ({myIncomingReqs.length})</h2>{myIncomingReqs.length===0?<p className="text-xs text-gray-400">No requests</p>:myIncomingReqs.map(r=><div key={r.id} className="flex justify-between items-center p-3 bg-[#fff9f0] rounded-xl mb-2 border"><div><p className="font-bold text-sm">{r.from}</p><p className="text-[11px] text-gray-500">Wants to be friends</p></div><div className="flex gap-2"><button onClick={()=>acceptReq(r.id)} className="bg-black text-white px-4 py-1.5 rounded-full text-xs font-bold">Accept</button><button onClick={()=>rejectReq(r.id)} className="bg-gray-200 px-4 py-1.5 rounded-full text-xs font-bold">Reject</button></div></div>)}</div>
            <div className="bg-white rounded-2xl p-4 border"><h2 className="font-black mb-3">My Friends ({friends.length})</h2><div className="flex flex-wrap gap-2">{friends.map(f=><span key={f} className="bg-[#ffeaa7] px-3 py-1 rounded-full text-xs font-bold">🟢 {f.split("@")[0]}</span>)}</div></div>
            <div className="bg-white rounded-2xl p-4 border"><h2 className="font-black mb-3">People You May Know - 7 Sisters</h2>{allUsers.filter(u=>!friends.includes(u.email) && u.email!==myEmail).map(u=>{ const pending=!!friendReqs.find(r=>r.from===myEmail && r.to===u.email && r.status==="pending"); return <div key={u.email} className="flex justify-between items-center p-3 border rounded-xl mb-2 hover:bg-[#fff9f0]"><div><p className="font-bold text-sm">{u.name}</p><p className="text-[11px] text-gray-500 capitalize">{u.state} • 2 mutual</p></div><button disabled={pending} onClick={()=>sendReq(u.email)} className={`px-4 py-1.5 rounded-full text-xs font-bold ${pending?"bg-gray-200":"bg-[#ffeaa7]"}`}>{pending?"Requested":"Add Friend"}</button></div>; })}</div>
          </div>
        )}

        {activeTab==="settings" && (
          <div className="bg-white rounded-2xl p-5 border space-y-5">
            <h2 className="font-black text-xl">⚙️ Settings</h2>
            <div><label className="text-xs font-bold text-gray-500">Display Name</label><input value={profileName} onChange={e=>setProfileName(e.target.value)} className="w-full border rounded-xl px-4 py-2.5 mt-1 bg-[#fffef5]"/></div>
            <div><label className="text-xs font-bold text-gray-500">Your State</label><select value={myState} onChange={e=>setMyState(e.target.value)} className="w-full border rounded-xl px-4 py-2.5 mt-1 bg-[#fffef5]"><option value="assam">Assam</option><option value="meghalaya">Meghalaya</option><option value="nagaland">Nagaland</option><option value="mizoram">Mizoram</option><option value="manipur">Manipur</option><option value="arunachal">Arunachal Pradesh</option><option value="tripura">Tripura</option></select></div>
            <div><label className="text-xs font-bold text-gray-500">Light Colour Theme - No Blue</label><div className="flex gap-2 mt-2">{Object.keys(themes).map(t=><button key={t} onClick={()=>setThemeColor(t)} className={`flex-1 py-3 rounded-xl capitalize font-bold border-2 text-xs ${themeColor===t?"border-black":"border-transparent"}`} style={{background: themes[t].card}}>{t}</button>)}</div></div>
            <div className="pt-2 space-y-2"><button onClick={()=>alert("Settings Saved!")} className="w-full py-3 rounded-full font-black text-sm" style={{background: currentTheme.card}}>💾 Save Settings</button><button onClick={()=>setView("login")} className="w-full py-3 rounded-full font-bold text-sm bg-black text-white">Logout - Seven Sisters Voice</button><p className="text-[10px] text-center text-gray-400">Seven Sisters Voice © 2026 • Light Theme • v2.0 • {myEmail}</p></div>
          </div>
        )}
      </div>

      {showStoryCreate && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[360px] p-5 space-y-3">
            <div className="flex justify-between"><h2 className="font-black">Create Story - 12Hr Friends Only</h2><button onClick={()=>setShowStoryCreate(false)} className="w-8 h-8 bg-gray-100 rounded-full font-bold">X</button></div>
            <div className="flex gap-2"><button onClick={()=>setStoryType("photo")} className={`flex-1 py-2 rounded-full font-bold text-xs ${storyType==="photo"?
