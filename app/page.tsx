"use client";
import { useState, useRef, useEffect } from "react";
type Msg = { id:number; from:string; to:string; text:string; time:string; };
type Team = { id:number; name:string; desc:string; members:string[]; createdBy:string; state:string; };

export default function SevenSistersVoice() {
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("123456");
  const [fullName, setFullName] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [themeColor, setThemeColor] = useState("peach");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<string|null>(null);
  const [newMsg, setNewMsg] = useState("");
  const [inCall, setInCall] = useState<string|null>(null);
  const [callTime, setCallTime] = useState(0);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDesc, setNewTeamDesc] = useState("");
  const [newTeamState, setNewTeamState] = useState("assam");
  const [newText, setNewText] = useState("");
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const themes:any = { peach:{bg:"#fff5eb",card:"#ffeaa7",btn:"linear-gradient(90deg,#ff9a9e,#fecfef)"}, mint:{bg:"#e8fffa",card:"#a1f0c4",btn:"linear-gradient(90deg,#a1f0c4,#b2f7ef)"}, lavender:{bg:"#f5e8ff",card:"#e2d1f9",btn:"linear-gradient(90deg,#c3b1e1,#e2d1f9)"} };
  const currentTheme = themes[themeColor];

  const [allUsers] = useState([
    {email:"priya@test.com", name:"Priya Meghalaya", state:"meghalaya"},
    {email:"rahul@test.com", name:"Rahul Assam", state:"assam"},
    {email:"john@test.com", name:"John Nagaland", state:"nagaland"},
    {email:"mary@test.com", name:"Mary Mizoram", state:"mizoram"},
  ]);
  const [friendReqs, setFriendReqs] = useState([{id:1, from:"priya@test.com", to:"admin@test.com", status:"pending"}]);
  const [friends, setFriends] = useState(["john@test.com","rahul@test.com","priya@test.com"]);
  const [messages, setMessages] = useState<Msg[]>([
    {id:1, from:"john@test.com", to:"admin@test.com", text:"Hey! Welcome bro! 🎉", time:"10:30 AM"},
    {id:2, from:"admin@test.com", to:"john@test.com", text:"Thanks!", time:"10:31 AM"},
  ]);
  const [posts, setPosts] = useState([{id:1, user:"admin@test.com", text:"Welcome to Seven Sisters Voice! 🎉 Teams added as subsection!", time:"Just now"}]);
  const [teams, setTeams] = useState<Team[]>([
    {id:1, name:"Assam Bihu Team", desc:"Bihu dance & music lovers", members:["admin@test.com","rahul@test.com"], createdBy:"rahul@test.com", state:"assam"},
    {id:2, name:"Meghalaya Hills Team", desc:"Shillong explorers", members:["priya@test.com"], createdBy:"priya@test.com", state:"meghalaya"},
    {id:3, name:"Northeast Coders Team", desc:"7 sisters devs team", members:["admin@test.com","john@test.com"], createdBy:"admin@test.com", state:"nagaland"},
  ]);

  const chatWith = (f:string)=> messages.filter(m=> (m.from===email && m.to===f) || (m.from===f && m.to===email));
  const filteredUsers = allUsers.filter(u =>!friends.includes(u.email) && u.email!==email && u.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const myTeams = teams.filter(t=> t.members.includes(email));
  const otherTeams = teams.filter(t=>!t.members.includes(email));

  useEffect(()=>{ let t:any; if(inCall){ t=setInterval(()=>setCallTime(s=>s+1),1000);} else setCallTime(0); return()=>clearInterval(t); },[inCall]);

  const startCall = async (f:string) => {
    setInCall(f);
    try{ const s = await navigator.mediaDevices.getUserMedia({video:true, audio:true}); if(localVideoRef.current) localVideoRef.current.srcObject=s; }catch{ alert("Allow camera!"); }
  };
  const endCall = () => { if(localVideoRef.current?.srcObject){ (localVideoRef.current.srcObject as MediaStream).getTracks().forEach(tr=>tr.stop()); } setInCall(null); };

  const handleLogin = (e:any)=>{ e.preventDefault(); if(view==="signup"){ setView("login"); return; } if(view==="forgot"){ setView("login"); return; } setView("feed"); };
  const sendMsg = () => { if(!newMsg.trim()||!selectedChat) return; setMessages([...messages,{id:Date.now(),from:email,to:selectedChat,text:newMsg,time:new Date().toLocaleTimeString()}]); setNewMsg(""); };

  if(view!=="feed"){
    return (<div className="min-h-screen flex items-center justify-center p-4" style={{background:"#fff5eb"}}><div className="bg-white rounded-xl shadow p-4 w-full max-w-[400px]"><h1 className="text-[32px] font-black text-center">Seven Sisters Voice</h1><p className="text-center text-xs text-gray-500 mb-4">All features + Team subsection like FB Groups</p><div className="flex gap-2 mb-4 p-1 bg-[#fff9f0] rounded-full border"><button onClick={()=>setView("login")} className={`flex-1 py-2 rounded-full font-bold ${view==="login"?"bg-black text-white":""}`}>Log in</button><button onClick={()=>setView("signup")} className={`flex-1 py-2 rounded-full font-bold ${view==="signup"?"bg-black text-white":""}`}>Sign Up</button></div><form onSubmit={handleLogin} className="space-y-3">{view==="signup"&&<input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Full Name" className="w-full border rounded-lg px-4 py-3" required/>}<input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-lg px-4 py-3" required/>{view!=="forgot"&&<input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full border rounded-lg px-4 py-3" required/>}<button className="w-full font-bold py-3 rounded-lg" style={{background:currentTheme.btn}}>{view==="login"?"Log in":view==="signup"?"Sign Up":"Send Reset"}</button>{view==="login"&&<><div className="text-center"><button type="button" onClick={()=>setView("forgot")} className="text-red-500 text-sm">Forgotten password?</button></div><hr/><div className="text-center"><button type="button" onClick={()=>setView("signup")} className="bg-[#ffeaa7] px-5 py-2 rounded-lg font-bold text-sm">Create new account</button></div></>}</form></div></div>);
  }

  if(inCall){
    const friend = allUsers.find(u=>u.email===inCall);
    return (<div className="fixed inset-0 bg-black z-[100] flex flex-col"><div className="flex-1 bg-gray-900 flex items-center justify-center relative"><div className="text-center"><div className="w-24 h-24 rounded-full bg-[#ffeaa7] mx-auto flex items-center justify-center text-3xl font-black">{friend?.name[0]}</div><p className="text-white font-bold mt-4">{friend?.name}</p><p className="text-white/60 text-sm">● {String(Math.floor(callTime/60)).padStart(2,"0")}:{String(callTime%60).padStart(2,"0")}</p></div><video ref={localVideoRef} autoPlay muted playsInline className="absolute bottom-4 right-4 w-[110px] h-[150px] rounded-2xl bg-black object-cover border-2 border-white/30"/></div><div className="bg-[#1a1a1a] p-6 flex justify-center gap-4"><button onClick={endCall} className="w-14 h-14 rounded-full bg-red-600 text-white text-xl">📞</button></div></div>);
  }

  if(selectedChat){
    const friend = allUsers.find(u=>u.email===selectedChat);
    const conv = chatWith(selectedChat);
    return (<main className="min-h-screen flex flex-col" style={{background:currentTheme.bg}}><div className="bg-white border-b px-3 py-2.5 flex items-center gap-2 sticky top-0"><button onClick={()=>setSelectedChat(null)} className="w-8 h-8 bg-gray-100 rounded-full">←</button><div className="w-9 h-9 rounded-full bg-[#ffeaa7] flex items-center justify-center font-black text-xs">{friend?.name[0]}</div><div className="flex-1"><p className="font-bold text-sm">{friend?.name}</p
