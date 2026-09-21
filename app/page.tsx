"use client";
import { useState, useRef, useEffect } from "react";

export default function SevenSistersVoice() {
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("123456");
  const [fullName, setFullName] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [profileName, setProfileName] = useState("Admin");
  const [myState, setMyState] = useState("assam");
  const [themeColor, setThemeColor] = useState("peach");

  const themes: any = {
    peach: { bg:"#fff5eb", card:"#ffeaa7", btn:"linear-gradient(90deg,#ff9a9e,#fecfef)" },
    mint: { bg:"#e8fffa", card:"#a1f0c4", btn:"linear-gradient(90deg,#a1f0c4,#b2f7ef)" },
    lavender: { bg:"#f5e8ff", card:"#e2d1f9", btn:"linear-gradient(90deg,#c3b1e1,#e2d1f9)" }
  };
  const currentTheme = themes[themeColor];

  const [friendReqs, setFriendReqs] = useState([
    {id:1, from:"priya@test.com", to:"admin@test.com", status:"pending"},
    {id:2, from:"rahul@test.com", to:"admin@test.com", status:"pending"}
  ]);
  const [friends, setFriends] = useState(["john@test.com"]);
  const myIncomingReqs = friendReqs.filter(r=> r.to===email && r.status==="pending");

  const [stories, setStories] = useState([
    {id:1, user:"priya@test.com", content:"https://picsum.photos/300/500?random=5", music:"Bihu Beat", time: Date.now()-1000*60*30},
  ]);
  const [posts, setPosts] = useState([
    { id:1, user:"admin@test.com", text:"Welcome to Seven Sisters Voice! 🎉 Light & beautiful!", likes:12, liked:false, time:"Just now" }
  ]);
  const [newText, setNewText] = useState("");
  const [newImage, setNewImage] = useState("");
  const [showStoryCreate, setShowStoryCreate] = useState(false);
  const [viewStory, setViewStory] = useState<any>(null);
  const [storyContent, setStoryContent] = useState("");

  const imageRef = useRef<HTMLInputElement>(null);
  const storyFileRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{
    const i=setInterval(()=>{ setStories(s=> s.filter(st=> Date.now()-st.time < 12*60*60*1000)); },60000);
    return()=>clearInterval(i);
  },[]);

  const handleLogin = (e:any)=>{
    e.preventDefault();
    if(view==="signup"){ alert("Account created for " + fullName + "! Now Log in"); setView("login"); return; }
    if(view==="forgot"){ alert("Reset link sent to " + email); setView("login"); return; }
    setView("feed");
  };

  if(view!=="feed"){
    return (
      <div className="min-h-screen flex flex-col" style={{background:"#fff5eb"}}>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-[1100px] flex flex-col lg:flex-row items-center justify-center gap-10">
            <div className="flex-1 text-center lg:text-left max-w-[500px]">
              <h1 className="text-[48px] lg:text-[60px] font-black leading-[0.9]">Seven Sisters Voice</h1>
              <h2 className="text-[20px] mt-4 leading-[1.2]">Connect with friends and the world around you.</h2>
            </div>
            <div className="w-full max-w-[400px]">
              <div className="bg-white rounded-[12px] shadow-[0_2px_20px_rgba(0,0,0,0.15)] p-4">
                <div className="flex gap-2 mb-4 p-1 bg-[#fff9f0] rounded-full border">
                  <button onClick={()=>setView("login")} className={`flex-1 py-2.5 rounded-full font-bold text-[14px] ${view==="login"?"bg-black text-white":""}`}>Log in</button>
                  <button onClick={()=>setView("signup")} className={`flex-1 py-2.5 rounded-full font-bold text-[14px] ${view==="signup"?"bg-black text-white":""}`}>Sign Up</button>
                </div>
                <form onSubmit={handleLogin} className="space-y-3">
                  {view==="signup" && <input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Full Name" className="w-full border rounded-[8px] px-4 py-3.5" required/>}
                  <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" className="w-full border rounded-[8px] px-4 py-3.5" required/>
                  {view!=="forgot" && <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full border rounded-[8px] px-4 py-3.5" required/>}
                  <button type="submit" className="w-full text-black font-bold rounded-[8px] py-3.5" style={{background:currentTheme.btn}}>{view==="login"?"Log in":view==="signup"?"Sign Up":"Send Reset Link"}</button>
                  {view==="login" && <>
                    <div className="text-center"><button type="button" onClick={()=>setView("forgot")} className="text-red-500 text-[14px]">Forgotten password?</button></div>
                    <hr/>
                    <div className="text-center"><button type="button" onClick={()=>setView("signup")} className="bg-[#ffeaa7] px-5 py-3 rounded-[8px] font-bold">Create new account</button></div>
                  </>}
                  {view==="signup" && <div className="text-center"><button type="button" onClick={()=>setView("login")} className="text-red-500 text-sm">Already have account? Log in</button></div>}
                  {view==="forgot" && <div className="text-center flex gap-2 justify-center"><button type="button" onClick={()=>setView("login")} className="bg-gray-100 px-5 py-2 rounded-full text-sm font-bold">Back to Login</button></div>}
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-20" style={{background:currentTheme.bg}}>
      <div className="sticky top-0 z-40 bg-white shadow px-3 py-2 flex justify-between items-center">
        <h1 className="font-black">Seven Sisters Voice</h1>
        <div className="flex gap-2">
          <button onClick={()=>setActiveTab("home")} className={`px-3 py-2 rounded-full text-xs font-bold ${activeTab==="home"?"bg-black text-white":"bg-[#ffeaa7]"}`}>Home</button>
          <button onClick={()=>setActiveTab("friends")} className={`px-3 py-2 rounded-full text-xs font-bold ${activeTab==="friends"?"bg-black text-white":"bg-[#ffeaa7]"}`}>Friends {myIncomingReqs.length>0 && `(${myIncomingReqs.length})`}</button>
          <button onClick={()=>setActiveTab("settings")} className={`px-3 py-2 rounded-full text-xs font-bold ${activeTab==="settings"?"bg-black text-white":"bg-[#ffeaa7]"}`}>Settings</button>
          <button onClick={()=>setView("login")} className="px-3 py-2 rounded-full text-xs font-bold bg-[#ffeaa7]">Logout</button>
        </div>
      </div>
      <div className="max-w-[500px] mx-auto p-2 pt-3 space-y-3">
        {activeTab==="home" && <>
          <div className="bg-white rounded-[18px] p-3 border flex gap-3 overflow-x-auto">
            <div onClick={()=>setShowStoryCreate(true)} className="min-w-[110px] h-[180px] rounded-[16px] bg-[#fff5eb] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer"><div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white">+</div><p className="text-xs font-bold mt-2">Create Story</p></div>
            {stories.map((s:any)=>(<div key={s.id} onClick={()=>setViewStory(s)} className="min-w-[110px] h-[180px] rounded-[16px] overflow-hidden relative shrink-0 cursor-pointer"><img src={s.content} className="w-full h-full object-cover"/></div>))}
          </div>
          <div className="bg-white rounded-[18px] p-3 border"><div className="flex gap-3"><input value={newText} onChange={e=>setNewText(e.target.value)} placeholder="What's on your mind?" className="flex-1 bg-[#fff9f0] rounded-full px-4 text-sm"/></div><div className="flex gap-2 mt-3"><button onClick={()=>imageRef.current?.click()} className="px-4 py-2 bg-gray-50 rounded-full text-xs font-bold border">Photo</button><button onClick={()=>{ if(!newText) return; setPosts([{id:Date.now(), user:email, text:newText, likes:0, liked:false, time:"Just now"},...posts]); setNewText(""); }} className="ml-auto px-6 py-2 rounded-full text-xs font-bold bg-yellow-200">Post</button></div><input ref={imageRef} type="file" accept="image/*" onChange={(e:any)=>{ const f=e.target.files[0]; if(f){ const r=new FileReader(); r.onload=ev=>setNewImage(ev.target?.result as string); r.readAsDataURL(f);} }} className="hidden"/></div>
          {posts.map(p=>(<div key={p.id} className="bg-white rounded-[18px] border p-3"><p className="text-sm font-bold">{p.user}</p><p className="mt-2">{p.text}</p></div>))}
        </>}
        {activeTab==="friends" && <div className="bg-white rounded-2xl p-4 border"><h2 className="font-black mb-3">Friend Requests ({myIncomingReqs.length})</h2>{myIncomingReqs.map((r:any)=><div key={r.id} className="flex justify-between p-3 bg-[#fff9f0] rounded-xl mb-2"><p className="text-sm font-bold">{r.from}</p><div className="flex gap-2"><button onClick={()=>{setFriends([...friends, r.from]); setFriendReqs(friendReqs.map(x=>x.id===r.id?{...x,status:"accepted"}:x));}} className="bg-black text-white px-4 py-1 rounded-full text-xs">Accept</button></div></div>)}</div>}
        {activeTab==="settings" && <div className="bg-white rounded-2xl p-5 border space-y-4"><h2 className="font-black">Settings</h2><select value={myState} onChange={e=>setMyState(e.target.value)} className="w-full border rounded-xl px-4 py-2"><option value="assam">Assam</option><option value="meghalaya">Meghalaya</option></select><div className="flex gap-2">{Object.keys(themes).map(t=><button key={t} onClick={()=>setThemeColor(t)} className={`flex-1 py-3 rounded-xl font-bold capitalize border-2 ${themeColor===t?"border-black":""}`} style={{background:themes[t].card}}>{t}</button>)}</div></div>}
      </div>
    </main>
  );
}
