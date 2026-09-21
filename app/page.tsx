"use client";
import { useState, useRef } from "react";

export default function SevenSistersVoice() {
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("123456");
  const [activeTab, setActiveTab] = useState("home");
  const [newText, setNewText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [activeStory, setActiveStory] = useState<any>(null);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMsg, setNewMsg] = useState("");
  const [commentInputs, setCommentInputs] = useState<{[key:number]:string}>({});

  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const storyRef = useRef<HTMLInputElement>(null);

  const allUsers = [
    { email: "priya@test.com", name: "Priya Das", loc: "Assam" },
    { email: "rahul@test.com", name: "Rahul Bodo", loc: "Meghalaya" },
    { email: "john@test.com", name: "John Tangkhul", loc: "Nagaland" },
  ];
  const [friends] = useState(["priya@test.com", "rahul@test.com", "john@test.com"]);
  const [posts, setPosts] = useState<any[]>([
    { id: 1, user: "admin@test.com", name:"You", text: "Welcome to Seven Sisters Voice! Northeast ka apna platform 🔥 Photo + Video + Stories working!", likes:12, liked:false, comments:[{user:"Priya", text:"Welcome! 🎉"}], shares:2, time: "Just now" },
    { id: 2, user: "priya@test.com", name:"Priya", text: "Beautiful morning in Kaziranga! 🌿", image:"https://picsum.photos/500/300?random=10", likes:24, liked:false, comments:[], shares:5, time:"1h ago" },
  ]);
  const [stories, setStories] = useState<any[]>([
    { id: 1, user: "priya@test.com", name: "Priya", image: "https://picsum.photos/400/700?random=1", time: "2h ago" },
    { id: 2, user: "rahul@test.com", name: "Rahul", image: "https://picsum.photos/400/700?random=2", time: "5h ago" },
  ]);
  const [messages, setMessages] = useState<any[]>([]);

  const handleLogin = (e:any) => { e.preventDefault(); setView("feed"); };
  const onImage = (e:any) => { const f=e.target.files[0]; if(f) setSelectedImage(URL.createObjectURL(f)); };
  const onVideo = (e:any) => { const f=e.target.files[0]; if(f) setSelectedVideo(URL.createObjectURL(f)); };
  const onStory = (e:any) => { const f=e.target.files[0]; if(f){ const url=URL.createObjectURL(f); setStories([{ id: Date.now(), user: email, name: "You", image: url, time: "Just now" },...stories]); } };
  const doPost = () => {
    if (!newText &&!selectedImage &&!selectedVideo) return;
    setPosts([{ id: Date.now(), user: email, name:"You", text: newText, image: selectedImage, video: selectedVideo, likes:0, liked:false, comments:[], shares:0, time: "Just now" },...posts]);
    setNewText(""); setSelectedImage(null); setSelectedVideo(null);
  };
  const toggleLike = (id:number) => {
    setPosts(posts.map(p=> p.id===id? {...p, liked:!p.liked, likes: p.liked? p.likes-1 : p.likes+1} : p));
  };
  const addComment = (id:number) => {
    const txt = commentInputs[id]; if(!txt) return;
    setPosts(posts.map(p=> p.id===id? {...p, comments:[...p.comments, {user:"You", text:txt}]} : p));
    setCommentInputs({...commentInputs, [id]:""});
  };
  const sendMsg = () => { if (!newMsg ||!selectedChat) return; setMessages([...messages, { from: email, to: selectedChat, text: newMsg }]); setNewMsg(""); };

  // EXTERIOR / LOGIN PAGE - FIXED BEAUTIFUL
  if (view!=="feed") {
    return (
      <div className="min-h-screen flex bg-[#0f0f0f] text-white">
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 p-10 flex-col justify-between">
          <div><h1 className="text-3xl font-black">Seven Sisters Voice</h1><p className="text-white/80 text-sm mt-1">Northeast India ka apna Voice</p></div>
          <div><h2 className="text-[52px] font-black leading-[0.9]">Share Your<br/>Story.<br/>Your Voice.</h2><p className="mt-6 text-white/80 max-w-[380px]">Photo, Video, Stories, Chat - Made for Assam, Meghalaya, Nagaland, Manipur, Mizoram, Tripura, Arunachal</p><div className="flex gap-2 mt-8"><span className="bg-white/20 px-3 py-1 rounded-full text-xs">🏔️ Hills</span><span className="bg-white/20 px-3 py-1 rounded-full text-xs">🎵 Music</span><span className="bg-white/20 px-3 py-1 rounded-full text-xs">🍜 Food</span></div></div>
          <div className="text-xs text-white/60">© 2026 Seven Sisters Voice - Built for Northeast</div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-[#fff5eb] md:bg-[#101010]">
          <div className="bg-white rounded-[24px] shadow-2xl p-8 w-full max-w-[400px]">
            <div className="md:hidden mb-6"><h1 className="text-[26px] font-black text-black">Seven Sisters Voice</h1><p className="text-xs text-gray-500">Northeast ka apna platform</p></div>
            <h2 className="text-[22px] font-black text-black mb-1">Welcome back</h2><p className="text-sm text-gray-500 mb-6">Log in to share your voice</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div><label className="text-xs font-bold text-black">Email</label><input value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full mt-1 border border-black/10 rounded-xl px-4 py-3 text-black bg-[#fff9f0] outline-none focus:border-black" /></div>
              <div><label className="text-xs font-bold text-black">Password</label><input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className="w-full mt-1 border border-black/10 rounded-xl px-4 py-3 text-black bg-[#fff9f0] outline-none focus:border-black" /></div>
              <button className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-zinc-800">Log in →</button>
            </form>
            <div className="mt-6 p-3 bg-[#fff9f0] rounded-xl border border-dashed"><p className="text-[11px] text-gray-600"><b>Demo:</b> admin@test.com / 123456<br/>Priya, Rahul, John also available</p></div>
          </div>
        </div>
      </div>
    );
  }

  if (activeStory) {
    return (
      <div className="fixed inset-0 bg-black z-[200] flex flex-col p-4">
        <div className="flex justify-between text-white"><p className="font-bold">{activeStory.name}</p><button onClick={()=>setActiveStory(null)} className="bg-white/20 w-8 h-8 rounded-full">✕</button></div>
        <div className="flex-1 flex items-center justify-center"><img src={activeStory.image} className="max-h-full rounded-xl" /></div>
      </div>
    );
  }

  if (selectedChat) {
    const friend = allUsers.find((u) => u.email === selectedChat);
    const chatMsgs = messages.filter((m) => (m.from === email && m.to === selectedChat) || (m.from === selectedChat && m.to === email));
    return (
      <main className="min-h-screen flex flex-col bg-[#fff5eb]">
        <div className="bg-white border-b p-3 flex gap-2 items-center"><button onClick={()=>setSelectedChat(null)} className="w-8 h-8 bg-gray-100 rounded-full">←</button><p className="font-bold">{friend?.name}</p></div>
        <div className="flex-1 p-3 space-y-2">{chatMsgs.map((m,i)=>(<div key={i} className={`flex ${m.from===email?"justify-end":"justify-start"}`}><div className={`px-4 py-2 rounded-2xl
