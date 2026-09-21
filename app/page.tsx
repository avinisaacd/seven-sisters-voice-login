"use client";
import { useState, useRef, useEffect } from "react";

type Story = { id: number; user: string; type: "photo"|"video"|"text"; content: string; bg?: string; filter: string; music: string; border: string; time: number; }
type Post = { id: number; user: string; text: string; image?: string; video?: string; likes: number; liked: boolean; time: string; }
type FriendReq = { id: number; from: string; to: string; status: "pending"|"accepted"|"rejected"; }

export default function SevenSistersVoice() {
  const [view, setView] = useState<"login"|"signup"|"forgot"|"feed">("login");
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("123456");
  const [fullName, setFullName] = useState("");
  const [activeTab, setActiveTab] = useState<"home"|"friends"|"settings">("home");
  const [profileName, setProfileName] = useState("Admin");
  const [myState, setMyState] = useState("assam");
  const [themeColor, setThemeColor] = useState("peach");

  const themes:any = {
    peach: { bg:"#fff5eb", card:"#ffeaa7", btn:"linear-gradient(90deg,#ff9a9e,#fecfef)" },
    mint: { bg:"#e8fffa", card:"#a1f0c4", btn:"linear-gradient(90deg,#a1f0c4,#b2f7ef)" },
    lavender: { bg:"#f5e8ff", card:"#e2d1f9", btn:"linear-gradient(90deg,#c3b1e1,#e2d1f9)" }
  };
  const currentTheme = themes[themeColor];

  const [allUsers] = useState([
    {email:"priya@test.com", name:"Priya Meghalaya", state:"meghalaya"},
    {email:"rahul@test.com", name:"Rahul Assam", state:"assam"},
    {email:"john@test.com", name:"John Nagaland", state:"nagaland"}
  ]);
  const [friendReqs, setFriendReqs] = useState<FriendReq[]>([
    {id:1, from:"priya@test.com", to:"admin@test.com", status:"pending"},
    {id:2, from:"rahul@test.com", to:"admin@test.com", status:"pending"}
  ]);
  const [friends, setFriends] = useState<string[]>(["john@test.com"]);
  const myEmail = email || "admin@test.com";
  const myIncomingReqs = friendReqs.filter(r=> r.to===myEmail && r.status==="pending");

  const [stories, setStories] = useState<Story[]>([
    {id:1, user:"priya@test.com", type:"photo", content:"https://picsum.photos/300/500?random=5", filter:"none", music:"Bihu Beat", border:"meghalaya", time: Date.now()-1000*60*30},
    {id:2, user:"rahul@test.com", type:"text", content:"Seven Sisters Voice!", bg:"linear-gradient(135deg,#ff9a9e,#fecfef)", filter:"none", music:"Local Folk", border:"assam", time: Date.now()-1000*60*60*2}
  ]);
  const [posts, setPosts] = useState<Post[]>([
    { id:1, user:"admin@test.com", text:"Welcome to Seven Sisters Voice! 🎉 Light & beautiful Northeast social site! 12Hr Stories + Friends Only!", likes:12, liked:false, time:"Just now • Friends" }
  ]);
  const [newText, setNewText] = useState("");
  const [newImage, setNewImage] = useState<string|undefined>();
  const [newVideo, setNewVideo] = useState<string|undefined>();
  const [showStoryCreate, setShowStoryCreate] = useState(false);
  const [viewStory, setViewStory] = useState<Story|null>(null);
  const [storyContent, setStoryContent] = useState("");

  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const storyFileRef = useRef<HTMLInputElement>(null);

  const storyBorders:any = { assam:"border-4 border-yellow-400", meghalaya:"border-4 border-yellow-400", nagaland:"border-4 border-red-400", mizoram:"border-4 border-blue-400" };

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
  const handleImage=(e:any)=>{ const f=e.target.files[0]; if(f){ const r=new FileReader(); r.onload=ev=>setNewImage(ev.target?.result as string); r.readAsDataURL(f);} };
  const handleVideo=(e:any)=>{
    const f=e.target.files[0];
    if(f){
      const v=document.createElement("video"); v.preload="metadata";
      v.onloadedmetadata=()=>{
        if(v.duration>61){ alert("Video max 60 sec!"); return; }
        const r=new FileReader(); r.onload=ev=>setNewVideo(ev.target?.result as string); r.readAsDataURL(f);
      };
      v.src=URL.createObjectURL(f);
    }
  };
  const handleStoryFile=(e:any)=>{ const f=e.target.files[0]; if(f){ const r=new FileReader(); r.onload=ev=>setStoryContent(ev.target?.result as string); r.readAsDataURL(f);} };
  const createPost=()=>{
    if(!newText &&!newImage &&!newVideo) return;
    setPosts([{id:Date.now(), user:myEmail, text:newText, image:newImage, video:newVideo, likes:0, liked:false, time:"Just now • Friends"},...posts]);
    setNewText(""); setNewImage(undefined); setNewVideo(undefined);
  };
  const like=(id:number)=>setPosts(posts.map(p=>p.id===id?{...p, likes:p.liked?p.likes-1:p.likes+1, liked:!p.liked}:p));

  // EXTERIOR LOGIN
  if(view!=="feed"){
    return (
      <div className="min-h-screen flex flex-col" style={{background:"#fff5eb"}}>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-[1100px] flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20">
            <div className="flex-1 text-center lg:text-left max-w-[500px]">
              <h1 className="text-[48px] lg:text-[60px] font-black leading-[0.9] tracking-tight">Seven Sisters Voice</h1>
              <h2 className="text-[20px] lg:text-[24px] mt-4 leading-[1.2] text-[#2d3436]/80">Connect with friends and the world around you on Seven Sisters Voice. Light & warm for Northeast.</h2>
            </div>
            <div className="w-full max-w-[400px]">
              <div className="bg-white rounded-[12px] shadow-[0_2px_20px_rgba(0,0,0,0.15)] p-4">
                <div className="flex gap-2 mb-4 p-1 bg-[#fff9f0] rounded-full border">
                  <button onClick={()=>setView("login")} className={`flex-1 py-2.5 rounded-full font-bold text-[14px] transition ${view==="login"?"bg-[#2d3436] text-white shadow":"text-black"}`}>Log in</button>
                  <button onClick={()=>setView("signup")} className={`flex-1 py-2.5 rounded-full font-bold text-[14px] transition ${view==="signup"?"bg-[#2d3436] text-white shadow":"text-black"}`}>Sign Up</button>
                </div>
                <form onSubmit={handleLogin} className="space-y-3">
                  {view==="signup" && <input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Full Name - ex: Priya Assam" className="w-full border border-[#dddfe2] rounded-[8px] px-4 py-3.5 text-[16px] focus:outline-none focus:border-black" required/>}
                  <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address or phone number" className="w-full border border-[#dddfe2] rounded-[8px] px-4 py-3.5 text-[16px] focus:outline-none focus:border-black" required/>
                  {view!=="forgot" && <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full border border-[#dddfe2] rounded-[8px] px-4 py-3.5 text-[16px] focus:outline-none focus:border-black" required/>}

                  <button type="submit" className="w-full text-black text-[18px] font-bold rounded-[8px] py-3.5 shadow-sm hover:opacity-90" style={{background:currentTheme.btn}}>
                    {view==="login"?"Log in":view==="signup"?"Sign Up":"Send Reset Link"}
                  </button>

                  {view==="login" && <>
                    <div className="text-center py-2"><button type="button" onClick={()=>setView("forgot")} className="text-[#ff6b6b] text-[14px] hover:underline font-medium">Forgotten password?</button></div>
                    <hr className="my-4 border-[#dddfe2]"/>
                    <div className="text-center"><button type="button" onClick={()=>setView("signup")} className="bg-[#ffeaa7] hover:bg-[#ffdf7e] px-6 py-3 rounded-[8px] font-bold text-[15px] border">Create new account</button></div>
                    <div className="mt-4 bg-[#fff9f0] border border-[#ffeaa7] rounded-lg p-3 text-[12px] leading-[1.4]"><b>🔑 DEMO LOGIN:</b><br/>Email: admin@test.com<br/>Pass: 123456<br/><b>Click Log in</b> to see Interior</div>
                  </>}
                  {view==="signup" && <>
                    <p className="text-[11px] text-[#777] leading-[1.3] text-center">By clicking Sign Up, you agree to our Terms, Data Policy and Cookie Policy. Light theme no blue.</p>
                    <div className="text-center pt-2"><button type="button" onClick={()=>setView("login")} className="text-[#ff6b6b] text-[13px] font-medium">Already have an account? Log in</button></div>
                  </>}
                  {view==="forgot" && <>
                    <p className="text-[13px] text-gray-600 text-center leading-[1.4]">Enter your email and we will send you a reset link for Northeast account. Link valid for 12Hr.</p>
                    <div className="flex gap-2 justify-center pt-2"><button type="button" onClick={()=>setView("login")} className="bg-gray-100 hover:bg-gray-200 px-5 py-2.5 rounded-full text-[13px] font-bold border">Back to Login</button><button type="button" onClick={()=>setView("signup")} className="bg-[#ffeaa7] px-5 py-2.5 rounded-full text-[13px] font-bold border">Sign Up</button></div>
                  </>}
                </form>
              </div>
              <p className="text-center mt-5 text-[13px] leading-[1.3]"><b>Create a Page</b> for a celebrity, brand or business.</p>
            </div>
          </div>
        </main>
        <footer className="bg-white mt-8 py-6 px-4 border-t text-center"><p className="text-[11px] text-gray-500">Seven Sisters Voice © 2026 • Light Theme No Blue • Exterior: Login + SignUp + Forgot • Interior: Home + Friends + Settings</p><div className="flex flex-wrap gap-x-3 gap-y-1 justify-center mt-3 text-[12px] text-gray-500"><span className="cursor-pointer" onClick={()=>setView("signup")}>Sign Up</span><span className="cursor-pointer" onClick={()=>setView("login")}>Log in</span><span>Messenger</span><span>Privacy</span><span>Terms</span><span onClick={()=>setView("forgot")} className="text-[#ff6b6b] cursor-pointer underline">Forgot Password</span></div></footer>
      </div>
    );
  }

  // INTERIOR FEED
  return (
    <main className="min-h-screen pb-20" style={{background:currentTheme.bg}}>
      <div className="sticky top-0 z-40 bg-white shadow-sm px-3 py-2.5 flex justify-between items-center border-b">
        <h1 className="font-black text-[18px] tracking-tight">Seven Sisters Voice</h1>
        <div className="flex gap-1.5">
          <button onClick={()=>setActiveTab("home")} className={`px-3.5 py-2 rounded-full text-[11px] font-bold transition ${activeTab==="home"?"bg-black text-white":"bg-[#ffeaa7] border"}`}>Home</button>
          <button onClick={()=>setActiveTab("friends")} className={`px-3.5 py-2 rounded-full text-[11px] font-bold relative transition ${activeTab==="friends"?"bg-black text-white":"bg-[#ffeaa7] border"}`}>Friends {myIncomingReqs.length>0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black border-2 border-white">{myIncomingReqs.length}</span>}</button>
          <button onClick={()=>setActiveTab("settings")} className={`px-3.5 py-2 rounded-full text-[11px] font-bold transition ${activeTab==="settings"?"bg-black text-white":"bg-[#ffeaa7] border"}`}>Settings</button>
          <button onClick={()=>setView("login")} className="px-3.5 py-2 rounded-full text-[11px] font-bold bg-[#ffeaa7] border">Logout</button>
        </div>
      </div>
      <div className="max-w-[500px] mx-auto p-2 pt-3 space-y-3">
        {activeTab==="home" && <>
          <div className="bg-white rounded-[18px] p-3 border shadow-sm flex gap-3 overflow-x-auto scrollbar-hide">
            <div onClick={()=>setShowStoryCreate(true)} className="min-w-[110px] h-[180px] rounded-[16px] bg-[#fff5eb] flex flex-col overflow-hidden border-2 border-dashed shrink-0 cursor-pointer hover:bg-[#ffecd2]"><div className="flex-1 flex items-center justify-center bg-gradient-to-b from-orange-100 to-pink-100"><div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white text-xl shadow">+</div></div><div className="bg-white p-2 text-center border-t"><p className="text-[11px] font-black">Create Story</p><p className="text-[9px] text-gray-400">12Hr • Friends</p></div></div>
            {stories.map(s=>(<div key={s.id} onClick={()=>setViewStory(s)} className={`min-w-[110px] h-[180px] rounded-[16px] overflow-hidden relative shrink-0 cursor-pointer shadow-sm ${storyBorders[s.border]}`}><img src={s.content} className="w-full h-full object-cover"/><div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent"><p className="text-white text-[11px] font-bold truncate">{s.user.split("@")[0]}</p><p className="text-white/80 text-[9px]">🎵 {s.music} • 12h</p></div></div>))}
          </div>
          <div className="bg-white rounded-[18px] p-3 border shadow-sm"><div className="flex gap-3"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-200 to-yellow-200 flex items-center justify-center font-black text-[14px] border">A</div><input value={newText} onChange={e=>setNewText(e.target.value)} placeholder="What's on your mind, Admin?" className="flex-1 bg-[#fff9f0] rounded-full px-4 outline-none text-[13px] border focus:border-black"/></div><div className="flex gap-2 mt-3"><button onClick={()=>imageRef.current?.click()} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full text-[11px] font-bold border">🖼️ Photo</button><button onClick={()=>videoRef.current?.click()} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full text-[11px] font-bold border">🎥 1Min Video</button><button onClick={createPost} className="ml-auto px-6 py-2 rounded-full text-[11px] font-black shadow-sm hover:opacity-90" style={{background:currentTheme.btn}}>Post to Friends</button></div><input ref={imageRef} type="file" accept="image/*" onChange={handleImage} className="hidden"/><input ref={videoRef} type="file" accept="video/*" onChange={handleVideo} className="hidden"/></div>
          {posts.map(p=>(<div key={p.id} className="bg-white rounded-[18px] border shadow-sm overflow-hidden"><div className="p-3 flex gap-2.5 items-center"><div className="w-9 h-9 bg-[#ffeaa7] rounded-full flex items-center justify-center font-black text-[12px] border">a</div><div><p className="text-[13px] font-bold">{p.user}</p><p className="text-[11px] text-gray-400">{p.time}</p></div></div><p className="px-4 pb-3 text-[14px] leading-[1.4]">{p.text}</p>{p.image&&<img src={p.image} className="w-full border-t"/>}{p.video&&<video src={p.video} controls className="w-full border-t"/>}<div className="flex border-t text-[12px] font-medium"><button onClick={()=>like(p.id)} className={`flex-1 py-3 font-bold hover:bg-gray-50 ${p.liked?"text-red-500":""}`}>❤️ {p.likes} Like</button><button className="flex-1 py-3 hover:bg-gray-50">💬 Comment</button><button className="flex-1 py-3 hover:bg-gray-50">↗️ Share</button></div></div>))}
        </>}
        {activeTab==="friends" && <div className="space-y-3"><div className="bg-white rounded-2xl p-4 border shadow-sm"><h2 className="font-black mb-3 text-[14px]">Friend Requests ({myIncomingReqs.length}) - Accept to see posts</h2>{myIncomingReqs.length>0? myIncomingReqs.map(r=><div key={r.id} className="flex justify-between items-center p-3 bg-[#fff9f0] rounded-xl mb-2 border"><p className="font-bold text-[12px]">{r.from}</p><div className="flex gap-2"><button onClick={()=>{setFriends([...friends, r.from]); setFriendReqs(friendReqs.map(x=>x.id===r.id?{...x,status:"accepted"}:x));}} className="bg-black text-white px-4 py-1.5 rounded-full text-[11px] font-bold">Accept</button><button onClick={()=>setFriendReqs(friendReqs.map(x=>x.id===r.id?{...x,status:"rejected"}:x))} className="bg-gray-200 px-4 py-1.5 rounded-full text-[11px] font-bold">Reject</button></div></div>) : <p className="text-[11px] text-gray-400">No pending requests - All caught up!</p>}</div><div className="bg-white rounded-2xl p-4 border shadow-sm"><h2 className="font-black mb-2 text-[14px]">My Friends ({friends.length}) - Friends Only Posts</h2><div className="flex flex-wrap gap-2">{friends.map(f=><span key={f} className="bg-[#ffeaa7] px-3 py-1.5 rounded-full text-[11px] font-bold border">🟢 {f}</span>)}</div></div><div className="bg-white rounded-2xl p-4 border shadow-sm"><h2 className="font-black mb-3 text-[14px]">People You May Know - 7 Sisters</h2>{allUsers.filter(u=>!friends.includes(u.email)&&u.email!==myEmail).map(u=><div key={u.email} className="flex justify-between items-center p-3 border rounded-xl mb-2 hover:bg-[#fff9f0]"><div><p className="font-bold text-[12px]">{u.name}</p><p className="text-[10px] capitalize text-gray-500">{u.state} • Northeast</p></div><button onClick={()=>{ if(!friendReqs.find(r=>r.from===myEmail&&r.to===u.email)) setFriendReqs([...friendReqs,{id:Date.now(), from:myEmail, to:u.email, status:"pending"}]); alert("Friend request sent to " + u.name); }} className="bg-[#ffeaa7] hover:bg-[#ffdf7e] px-4 py-1.5 rounded-full text-[11px] font-black border">Add Friend</button></div>)}</div></div>}
        {activeTab==="settings" && <div className="bg-white rounded-2xl p-5 border shadow-sm space-y-4"><h2 className="font-black text-[18px]">⚙️ Settings - All Features</h2><div><label className="text-[11px] font-black uppercase tracking-wide">Display Name</label><input value={profileName} onChange={e=>setProfileName(e.target.value)} className="w-full border rounded-xl px-4 py-2.5 mt-1.5 text-[14px] focus:border-black outline-none"/></div><div><label className="text-[11px] font-black uppercase tracking-wide">Your State - 7 Sisters</label><select value={myState} onChange={e=>setMyState(e.target.value)} className="w-full border rounded-xl px-4 py-2.5 mt-1.5 text-[14px]"><option value="assam">Assam</option><option value="meghalaya">Meghalaya</option><option value="nagaland">Nagaland</option><option value="mizoram">Mizoram</option><option value="manipur">Manipur</option><option value="arunachal">Arunachal Pradesh</option><option value="tripura">Tripura</option></select></div><div><label className="text-[11px] font-black uppercase tracking-wide">Light Colour Theme (No Blue)</label><div className="flex gap-2 mt-2">{Object.keys(themes).map(t=><button key={t} onClick={()=>setThemeColor(t)} className={`flex-1 py-3 rounded-xl font-black capitalize border-2 text-[12px] transition ${themeColor===t?"border-black shadow":"border-gray-200"}`} style={{background:themes[t].card}}>{t}</button>)}</div></div><button className="w-full py-3 rounded-full font-black text-[13px] shadow-sm hover:opacity-90 transition" style={{background:currentTheme.card}}>Save Settings ✅</button><p className="text-[10px] text-gray-400 text-center">Theme changes Exterior Login button + Interior background</p></div>}
      </div>
      {showStoryCreate && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"><div className="bg-white rounded-2xl w-full max-w-[350px] p-4 space-y-3 shadow-2xl"><div className="flex justify-between items-center"><h2 className="font-black text-[14px]">Create 12Hr Story - Friends Only</h2><button onClick={()=>setShowStoryCreate(false)} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full font-bold">X</button></div><div onClick={()=>storyFileRef.current?.click()} className="h-[220px] bg-[#fff9f0] rounded-xl flex items-center justify-center border-2 border-dashed cursor-pointer overflow-hidden hover:bg-[#ffecd2]">{storyContent? <img src={storyContent} className="w-full h-full object-cover"/> : <span clas
