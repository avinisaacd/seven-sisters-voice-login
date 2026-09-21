"use client";
import { useState, useRef, useEffect } from "react";
type Story = { id: number; user: string; type: "photo"|"video"|"text"; content: string; bg?: string; filter: string; music: string; border: string; time: number; }
type Post = { id: number; user: string; text: string; image?: string; video?: string; likes: number; liked: boolean; comments: string[]; time: string; }
type FriendReq = { id: number; from: string; to: string; status: "pending"|"accepted"|"rejected"; }

export default function SevenSistersVoice() {
  const [view, setView] = useState<"login"|"feed">("login");
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("123456");
  const [activeTab, setActiveTab] = useState<"home"|"friends"|"settings">("home");
  const [profileName, setProfileName] = useState("Admin");
  const [myState, setMyState] = useState("assam");
  const [themeColor, setThemeColor] = useState("peach");
  const themes:any = { peach: { bg:"#fff5eb", card:"#ffeaa7", btn:"linear-gradient(90deg,#ff9a9e,#fecfef)" }, mint: { bg:"#e8fffa", card:"#a1f0c4", btn:"linear-gradient(90deg,#a1f0c4,#b2f7ef)" }, lavender: { bg:"#f5e8ff", card:"#e2d1f9", btn:"linear-gradient(90deg,#c3b1e1,#e2d1f9)" } };
  const currentTheme = themes[themeColor];
  const [allUsers] = useState([{email:"priya@test.com", name:"Priya Meghalaya", state:"meghalaya"}, {email:"rahul@test.com", name:"Rahul Assam", state:"assam"}, {email:"john@test.com", name:"John Nagaland", state:"nagaland"}]);
  const [friendReqs, setFriendReqs] = useState<FriendReq[]>([{id:1, from:"priya@test.com", to:"admin@test.com", status:"pending"}, {id:2, from:"rahul@test.com", to:"admin@test.com", status:"pending"}]);
  const [friends, setFriends] = useState<string[]>(["john@test.com"]);
  const myEmail = email || "admin@test.com";
  const myIncomingReqs = friendReqs.filter(r=> r.to===myEmail && r.status==="pending");
  const [stories, setStories] = useState<Story[]>([{id:1, user:"priya@test.com", type:"photo", content:"https://picsum.photos/300/500?random=5", filter:"none", music:"Bihu Beat", border:"meghalaya", time: Date.now()-1000*60*30}, {id:2, user:"rahul@test.com", type:"text", content:"Seven Sisters Voice!", bg:"linear-gradient(135deg,#ff9a9e,#fecfef)", filter:"none", music:"Local Folk", border:"assam", time: Date.now()-1000*60*60*2}]);
  const [posts, setPosts] = useState<Post[]>([{ id:1, user:"admin@test.com", text:"Welcome to Seven Sisters Voice! 🎉 Our light & beautiful Northeast social site!", likes:12, liked:false, comments:[], time:"Just now • Friends" }]);
  const [newText, setNewText] = useState(""); const [newImage, setNewImage] = useState<string|undefined>(); const [newVideo, setNewVideo] = useState<string|undefined>();
  const [showStoryCreate, setShowStoryCreate] = useState(false); const [viewStory, setViewStory] = useState<Story|null>(null);
  const [storyType, setStoryType] = useState<"photo"|"video"|"text">("photo"); const [storyContent, setStoryContent] = useState(""); const [storyBg, setStoryBg] = useState("linear-gradient(135deg,#ff9a9e,#fecfef)"); const [storyFilter, setStoryFilter] = useState("none"); const [storyMusic, setStoryMusic] = useState("Bihu Beat"); const [storyBorder, setStoryBorder] = useState("assam");
  const imageRef = useRef<HTMLInputElement>(null); const videoRef = useRef<HTMLInputElement>(null); const storyFileRef = useRef<HTMLInputElement>(null);
  const storyBorders:any = { assam:"border-4 border-yellow-400", meghalaya:"border-4 border-yellow-400", nagaland:"border-4 border-red-400" };
  useEffect(()=>{ const i=setInterval(()=>{ setStories(s=> s.filter(st=> Date.now()-st.time < 12*60*60*1000)); },60000); return()=>clearInterval(i); },[]);
  const handleLogin = (e:any)=>{ e.preventDefault(); setView("feed"); }; const handleImage=(e:any)=>{ const f=e.target.files[0]; if(f){ const r=new FileReader(); r.onload=ev=>setNewImage(ev.target?.result as string); r.readAsDataURL(f);} }; const handleVideo=(e:any)=>{ const f=e.target.files[0]; if(f){ const v=document.createElement("video"); v.preload="metadata"; v.onloadedmetadata=()=>{ if(v.duration>61){ alert("Video max 60 sec!"); return; } const r=new FileReader(); r.onload=ev=>setNewVideo(ev.target?.result as string); r.readAsDataURL(f); }; v.src=URL.createObjectURL(f);} }; const handleStoryFile=(e:any)=>{ const f=e.target.files[0]; if(f){ const r=new FileReader(); r.onload=ev=>setStoryContent(ev.target?.result as string); r.readAsDataURL(f);} }; const createPost=()=>{ if(!newText &&!newImage &&!newVideo) return; setPosts([{id:Date.now(), user:myEmail, text:newText, image:newImage, video:newVideo, likes:0, liked:false, comments:[], time:"Just now • Friends"},...posts]); setNewText(""); setNewImage(undefined); setNewVideo(undefined); }; const like=(id:number)=>setPosts(posts.map(p=>p.id===id?{...p, likes:p.liked?p.likes-1:p.likes+1, liked:!p.liked}:p));

  if(view!=="feed"){
    return (
      <div className="min-h-screen flex flex-col" style={{background:"#fff5eb"}}>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-[1100px] flex flex-col lg:flex-row items-center justify-center gap-10">
            <div className="flex-1"><h1 className="text-[48px] font-black leading-[0.9]">Seven Sisters Voice</h1><h2 className="text-[22px] mt-4">Connect with friends around Northeast on light & warm voice.</h2></div>
            <div className="w-full max-w-[400px] bg-white rounded-xl shadow p-4">
              <form onSubmit={handleLogin} className="space-y-3">
                <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-lg px-4 py-3.5"/>
                <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full border rounded-lg px-4 py-3.5"/>
                <button className="w-full font-bold py-3 rounded-lg" style={{background:currentTheme.btn}}>Log in</button>
                <div className="bg-[#fff9f0] border p-2 rounded text-xs">Demo: admin@test.com / 123456</div>
              </form>
            </div>
          </div>
        </main>
        <footer className="bg-white p-4 text-xs text-gray-500 text-center border-t">Seven Sisters Voice © 2026 • Light Theme No Blue</footer>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-20" style={{background:currentTheme.bg}}>
      <div className="sticky top-0 z-40 bg-white shadow px-3 py-2 flex justify-between items-center">
        <h1 className="font-black text-[20px]">Seven Sisters Voice</h1>
        <div className="flex gap-2">
          <button onClick={()=>setActiveTab("home")} className={`px-4 py-2 rounded-full text-xs font-bold ${activeTab==="home"?"bg-black text-white":"bg-[#ffeaa7]"}`}>Home</button>
          <button onClick={()=>setActiveTab("friends")} className={`px-4 py-2 rounded-full text-xs font-bold relative ${activeTab==="friends"?"bg-black text-white":"bg-[#ffeaa7]"}`}>Friends {myIncomingReqs.length>0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center">{myIncomingReqs.length}</span>}</button>
          <button onClick={()=>setActiveTab("settings")} className={`px-4 py-2 rounded-full text-xs font-bold ${activeTab==="settings"?"bg-black text-white":"bg-[#ffeaa7]"}`}>Settings</button>
          <button onClick={()=>setView("login")} className="px-4 py-2 rounded-full text-xs font-bold bg-[#ffeaa7]">Logout</button>
        </div>
      </div>

      <div className="max-w-[500px] mx-auto p-2 pt-3 space-y-3">
        {activeTab==="home" && <>
          <div className="bg-white rounded-[18px] p-3 border flex gap-3 overflow-x-auto">
            <div onClick={()=>setShowStoryCreate(true)} className="min-w-[110px] h-[180px] rounded-[16px] bg-[#fff5eb] flex flex-col overflow-hidden border shrink-0 cursor-pointer"><div className="flex-1 flex items-center justify-center bg-gradient-to-b from-orange-100 to-pink-100"><div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white text-xl">+</div></div><div className="bg-white p-2 text-center"><p className="text-xs font-bold">Create Story</p></div></div>
            {stories.map(s=>(
              <div key={s.id} onClick={()=>setViewStory(s)} className={`min-w-[110px] h-[180px] rounded-[16px] overflow-hidden relative shrink-0 cursor-pointer ${storyBorders[s.border]}`}>
                {s.type==="photo"? <img src={s.content} className="w-full h-full object-cover"/> : <div style={{background:s.bg}} className="w-full h-full flex items-center justify-center p-2 font-bold text-sm text-center">{s.content}</div>}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent"><p className="text-white text-xs font-bold">{s.user.split("@")[0]}</p><p className="text-white/70 text-[10px]">🎵 {s.music} • 12h</p></div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-[18px] p-3 border">
            <div className="flex gap-3"><div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center font-bold">A</div><input value={newText} onChange={e=>setNewText(e.target.value)} placeholder="What's on your mind?" className="flex-1 bg-[#fff9f0] rounded-full px-4 outline-none text-sm"/></div>
            {(newImage||newVideo)&&<div className="mt-3">{newImage&&<img src={newImage} className="w-full rounded-xl"/>}{newVideo&&<video src={newVideo} controls className="w-full rounded-xl"/>}</div>}
            <div className="flex gap-2 mt-3"><button onClick={()=>imageRef.current?.click()} className="px-4 py-2 bg-gray-50 rounded-full text-xs font-bold border">🖼️ Photo</button><button onClick={()=>videoRef.current?.click()} className="px-4 py-2 bg-gray-50 rounded-full text-xs font-bold border">🎥 1Min Video</button><button onClick={createPost} className="ml-auto px-6 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-orange-200 to-yellow-200">Post</button></div>
            <input ref={imageRef} type="file" accept="image/*" onChange={handleImage} className="hidden"/><input ref={videoRef} type="file" accept="video/*" onChange={handleVideo} className="hidden"/>
          </div>

          {posts.map(p=>(<div key={p.id} className="bg-white rounded-[18px] border overflow-hidden"><div className="p-3 flex gap-2"><div className="w-9 h-9 bg-[#ffeaa7] rounded-full flex items-center justify-center font-bold">a</div><div><p className="text-sm font-bold">{p.user}</p><p className="text-xs text-gray-400">{p.time}</p></div></div><p className="px-4 pb-3 text-[15px]">{p.text}</p>{p.image&&<img src={p.image} className="w-full"/>}{p.video&&<video src={p.video} controls className="w-full"/>}<div className="flex border-t text-sm"><button onClick={()=>like(p.id)} className="flex-1 py-3 font-bold">❤️ {p.likes} Like</button><button className="flex-1 py-3">💬 Comment</button><button className="flex-1 py-3">↗️ Share</button></div></div>))}
        </>}

        {activeTab==="friends" && <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 border"><h2 className="font-black mb-3">Friend Requests ({myIncomingReqs.length}) - Click Accept to see their posts</h2>{myIncomingReqs.map(r=><div key={r.id} className="flex justify-between items-center p-3 bg-[#fff9f0] rounded-xl mb-2"><p className="font-bold text-sm">{r.from}</p><div className="flex gap-2"><button onClick={()=>{setFriends([...friends, r.from]); setFriendReqs(friendReqs.map(x=>x.id===r.id?{...x,status:"accepted"}:x));}} className="bg-black text-white px-4 py-1 rounded-full text-xs">Accept</button><button onClick={()=>setFriendReqs(friendReqs.map(x=>x.id===r.id?{...x,status:"rejected"}:x))} className="bg-gray-200 px-4 py-1 rounded-full text-xs">Reject</button></div></div>)}{myIncomingReqs.length===0&&<p className="text-xs text-gray-400">No requests</p>}</div>
          <div className="bg-white rounded-2xl p-4 border"><h2 className="font-black mb-2">My Friends ({friends.length}) - You can see their posts & stories</h2><div className="flex flex-wrap gap-2">{friends.map(f=><span key={f} className="bg-[#ffeaa7] px-3 py-1 rounded-full text-xs">🟢 {f}</span>)}</div></div>
          <div className="bg-white rounded-2xl p-4 border"><h2 className="font-black mb-2">People You May Know - 7 Sisters - Click Add Friend</h2>{allUsers.filter(u=>!friends.includes(u.email)&&u.email!==myEmail).map(u=><div key={u.email} className="flex justify-between p-3 border rounded-xl mb-2"><div><p className="font-bold text-sm">{u.name}</p><p className="text-xs capitalize">{u.state}</p></div><button onClick={()=>{ if(!friendReqs.find(r=>r.from===myEmail&&r.to===u.email)) setFriendReqs([...friendReqs,{id:Date.now(), from:myEmail, to:u.email, status:"pending"}]); }} className="bg-[#ffeaa7] px-4 py-1 rounded-full text-xs font-bold">Add Friend</button></div>)}</div>
        </div>}

        {activeTab==="settings" && <div className="bg-white rounded-2xl p-5 border space-y-4"><h2 className="font-black text-xl">⚙️ Settings - All Features Here</h2><div><label className="text-xs font-bold">Display Name</label><input value={profileName} onChange={e=>setProfileName(e.target.value)} className="w-full border rounded-xl px-4 py-2 mt-1"/></div><div><label className="text-xs font-bold">Your State</label><select value={myState} onChange={e=>setMyState(e.target.value)} className="w-full border rounded-xl px-4 py-2 mt-1"><option value="assam">Assam</option><option value="meghalaya">Meghalaya</option><option value="nagaland">Nagaland</option><option value="mizoram">Mizoram</option><option value="manipur">Manipur</option><option value="arunachal">Arunachal</option><option value="tripura">Tripura</option></select></div><div><label className="text-xs font-bold">Light Colour Theme (No Blue)</label><div className="flex gap-2 mt-2">{Object.keys(themes).map(t=><button key={t} onClick={()=>setThemeColor(t)} className={`flex-1 py-3 rounded-xl font-bold capitalize border-2 ${themeColor===t?"border-black":""}`} style={{background:themes[t].card}}>{t}</button>)}</div></div><button className="w-full py-3 rounded-full font-black" style={{background:currentTheme.card}}>Save Settings</button></div>}
      </div>

      {showStoryCreate && <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-2xl w-full max-w-[350px] p-4 space-y-3"><div className="flex justify-between"><h2 className="font-black">Create Story</h2><button onClick={()=>setShowStoryCreate(false)} className="w-8 h-8 bg-gray-100 rounded-full">X</button></div><div onClick={()=>storyFileRef.current?.click()} className="h-[200px] bg-[#fff9f0] rounded-xl flex items-center justify-center border-2 border-dashed cursor-pointer overflow-hidden">{storyContent? <img src={storyContent} className="w-full h-full object-cover"/> : "Upload Photo"}</div><input ref={storyFileRef} type="file" accept="image/*,video/*" onChange={handleStoryFile} className="hidden"/><button onClick={()=>{ setStories([{id:Date.now(), user:myEmail, type:"photo", content:storyContent, filter:storyFilter, music:storyMusic, border:storyBorder, time:Date.now()},...stories]); setShowStoryCreate(false); setStoryContent("");}} className="w-full py-3 rounded-full font-bold bg-[#ffeaa7]">Share Story 12Hr Friends Only</button></div></div>}
      {viewStory && <div className="fixed inset-0 bg-black z-50 flex items-center justify-center"><div className="relative w-full max-w-[400px] h-full bg-black flex items-center justify-center"><img src={viewStory.content} className="w-full"/><button onClick={()=>setViewStory(null)} className="absolute top-4 right-4 w-8 h-8 bg-white/20 text-white rounded-full">X</button></div></div>}
    </main>
  );
}
