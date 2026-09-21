"use client";
import { useState, useRef, useEffect } from "react";
type Story = { id: number; user: string; type: "photo"|"video"|"text"; content: string; bg?: string; filter: string; music: string; border: string; time: number; }
type Post = { id: number; user: string; text: string; image?: string; video?: string; likes: number; liked: boolean; time: string; }
type FriendReq = { id: number; from: string; to: string; status: "pending"|"accepted"|"rejected"; }

export default function SevenSistersVoice() {
  const [view, setView] = useState<"login"|"signup"|"forgot"|"feed">("login");
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
  const [stories, setStories] = useState<Story[]>([{id:1, user:"priya@test.com", type:"photo", content:"https://picsum.photos/300/500?random=5", filter:"none", music:"Bihu Beat", border:"meghalaya", time: Date.now()-1000*60*30}]);
  const [posts, setPosts] = useState<Post[]>([{ id:1, user:"admin@test.com", text:"Welcome to Seven Sisters Voice! 🎉 Light & beautiful Northeast social site!", likes:12, liked:false, time:"Just now • Friends" }]);
  const [newText, setNewText] = useState(""); const [newImage, setNewImage] = useState<string|undefined>(); const [newVideo, setNewVideo] = useState<string|undefined>();
  const [showStoryCreate, setShowStoryCreate] = useState(false); const [viewStory, setViewStory] = useState<Story|null>(null);
  const [storyContent, setStoryContent] = useState("");
  const imageRef = useRef<HTMLInputElement>(null); const videoRef = useRef<HTMLInputElement>(null); const storyFileRef = useRef<HTMLInputElement>(null);
  const storyBorders:any = { assam:"border-4 border-yellow-400", meghalaya:"border-4 border-yellow-400", nagaland:"border-4 border-red-400" };
  useEffect(()=>{ const i=setInterval(()=>{ setStories(s=> s.filter(st=> Date.now()-st.time < 12*60*60*1000)); },60000); return()=>clearInterval(i); },[]);
  const handleLogin = (e:any)=>{ e.preventDefault(); if(email) setView("feed"); };
  const handleImage=(e:any)=>{ const f=e.target.files[0]; if(f){ const r=new FileReader(); r.onload=ev=>setNewImage(ev.target?.result as string); r.readAsDataURL(f);} };
  const handleVideo=(e:any)=>{ const f=e.target.files[0]; if(f){ const v=document.createElement("video"); v.preload="metadata"; v.onloadedmetadata=()=>{ if(v.duration>61){ alert("Video max 60 sec!"); return; } const r=new FileReader(); r.onload=ev=>setNewVideo(ev.target?.result as string); r.readAsDataURL(f); }; v.src=URL.createObjectURL(f);} };
  const handleStoryFile=(e:any)=>{ const f=e.target.files[0]; if(f){ const r=new FileReader(); r.onload=ev=>setStoryContent(ev.target?.result as string); r.readAsDataURL(f);} };
  const createPost=()=>{ if(!newText &&!newImage &&!newVideo) return; setPosts([{id:Date.now(), user:myEmail, text:newText, image:newImage, video:newVideo, likes:0, liked:false, time:"Just now • Friends"},...posts]); setNewText(""); setNewImage(undefined); setNewVideo(undefined); };
  const like=(id:number)=>setPosts(posts.map(p=>p.id===id?{...p, likes:p.liked?p.likes-1:p.likes+1, liked:!p.liked}:p));

  if(view!=="feed"){
    return (
      <div className="min-h-screen flex flex-col" style={{background:"#fff5eb"}}>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-[1100px] flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20">
            <div className="flex-1 text-center lg:text-left max-w-[500px]">
              <h1 className="text-[48px] lg:text-[60px] font-black leading-[0.9]">Seven Sisters Voice</h1>
              <h2 className="text-[20px] lg:text-[24px] mt-4 leading-[1.2] text-[#2d3436]/80">Connect with friends and the world around you on Seven Sisters Voice. Light & warm for Northeast.</h2>
            </div>
            <div className="w-full max-w-[400px]">
              <div className="bg-white rounded-[12px] shadow-[0_2px_20px_rgba(0,0,0,0.15)] p-4">
                <div className="flex gap-2 mb-4 p-1 bg-[#fff9f0] rounded-full">
                  <button onClick={()=>setView("login")} className={`flex-1 py-2.5 rounded-full font-bold text-[14px] ${view==="login"?"bg-[#2d3436] text-white":"text-black"}`}>Log in</button>
                  <button onClick={()=>setView("signup")} className={`flex-1 py-2.5 rounded-full font-bold text-[14px] ${view==="signup"?"bg-[#2d3436] text-white":"text-black"}`}>Sign Up</button>
                </div>
                <form onSubmit={handleLogin} className="space-y-3">
                  <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address or phone number" className="w-full border border-[#dddfe2] rounded-[8px] px-4 py-3.5 text-[16px]" required/>
                  {view!=="forgot" && <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full border border-[#dddfe2] rounded-[8px] px-4 py-3.5 text-[16px]" required/>}
                  {view==="signup" && <input placeholder="Full Name - ex: Priya Assam" className="w-full border border-[#dddfe2] rounded-[8px] px-4 py-3.5 text-[16px]"/>}
                  <button type="submit" className="w-full text-black text-[18px] font-bold rounded-[8px] py-3" style={{background:currentTheme.btn}}>{view==="login"?"Log in":view==="signup"?"Sign Up":"Send Reset Link"}</button>

                  {view==="login" && <>
                    <div className="text-center"><button type="button" onClick={()=>setView("forgot")} className="text-[#ff6b6b] text-[14px]">Forgotten password?</button></div>
                    <hr className="my-4"/>
                    <div className="text-center"><button type="button" onClick={()=>setView("signup")} className="bg-[#ffeaa7] px-5 py-3 rounded-[8px] font-bold">Create new account</button></div>
                    <div className="mt-3 bg-[#fff9f0] border border-[#ffeaa7] rounded-lg p-3 text-[11px]"><b>🔑 DEMO LOGIN:</b><br/>Email: admin@test.com<br/>Pass: 123456</div>
                  </>}
                  {view==="signup" && <>
                    <p className="text-[11px] text-[#777]">By clicking Sign Up, you agree to our Terms and Privacy Policy.</p>
                    <div className="text-center"><button type="button" onClick={()=>setView("login")} className="text-[#ff6b6b] text-sm">Already have an account? Log in</button></div>
                  </>}
                  {view==="forgot" && <>
                    <p className="text-[13px] text-gray-600 text-center">Enter your email and we will send you a reset link for Northeast account.</p>
                    <div className="text-center flex gap-2 justify-center"><button type="button" onClick={()=>setView("login")} className="bg-gray-100 px-5 py-2 rounded-full text-sm font-bold">Back to Login</button><button type="button" onClick={()=>setView("signup")} className="bg-[#ffeaa7] px-5 py-2 rounded-full text-sm font-bold">Sign Up</button></div>
                  </>}
                </form>
              </div>
              <p className="text-center mt-5 text-[13px]"><b>Create a Page</b> for a celebrity, brand or business.</p>
            </div>
          </div>
        </main>
        <footer className="bg-white mt-8 py-6 px-4 border-t text-center"><p className="text-[11px] text-gray-500">Seven Sisters Voice © 2026 • Light Theme No Blue • Exterior + Interior Complete</p><div className="flex flex-wrap gap-3 justify-center mt-2 text-[12px] text-gray-500"><span>Sign Up</span><span>Log in</span><span>Messenger</span><span>Privacy</span><span>Terms</span><span onClick={()=>setView("forgot")} className="text-[#ff6b6b] cursor-pointer underline">Forgot Password</span></div></footer>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-20" style={{background:currentTheme.bg}}>
      <div className="sticky top-0 z-40 bg-white shadow px-3 py-2 flex justify-between items-center">
        <h1 className="font-black text-[18px]">Seven Sisters Voice</h1>
        <div className="flex gap-2">
          <button onClick={()=>setActiveTab("home")} className={`px
