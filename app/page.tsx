"use client";
import { useState, useRef, useEffect } from "react";

type Story = {
  id: number;
  user: string;
  type: "photo"|"video"|"text";
  content: string;
  bg?: string;
  filter: string;
  music: string;
  border: string;
  time: number;
}
type Post = {
  id: number;
  user: string;
  text: string;
  image?: string;
  video?: string;
  likes: number;
  liked: boolean;
  comments: {user: string, text: string}[];
  time: string;
}

export default function Page() {
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [stories, setStories] = useState<Story[]>([
    {id:1, user:"Priya Meghalaya", type:"photo", content:"https://picsum.photos/300/500?random=2", filter:"none", music:"Bihu Beat", border:"assam", time: Date.now()-1000*60*30},
    {id:2, user:"Rahul Assam", type:"text", content:"Seven Sisters Voice!", bg:"linear-gradient(135deg,#ff9a9e,#fecfef)", filter:"none", music:"Local Folk", border:"meghalaya", time: Date.now()-1000*60*60*2}
  ]);
  const [showStoryCreate, setShowStoryCreate] = useState(false);
  const [storyType, setStoryType] = useState<"photo"|"video"|"text">("photo");
  const [storyContent, setStoryContent] = useState("");
  const [storyBg, setStoryBg] = useState("linear-gradient(135deg,#ff9a9e,#fecfef)");
  const [storyFilter, setStoryFilter] = useState("none");
  const [storyMusic, setStoryMusic] = useState("No Music");
  const [storyBorder, setStoryBorder] = useState("assam");
  const [viewStory, setViewStory] = useState<Story|null>(null);

  const storyBorders: any = {
    assam: "border-4 border-[#ff6b6b] shadow-[0_0_0_3px_#ffe66d]",
    arunachal: "border-4 border-[#48dbfb] shadow-[0_0_0_3px_#feca57]",
    manipur: "border-4 border-[#feca57] shadow-[0_0_0_3px_#ff6b6b]",
    meghalaya: "border-4 border-[#1dd1a1] shadow-[0_0_0_3px_#feca57]",
    mizoram: "border-4 border-[#a55eea] shadow-[0_0_0_3px_white]",
    nagaland: "border-4 border-[#ff6b6b] shadow-[0_0_0_3px_black]",
    tripura: "border-4 border-[#ff9f43] shadow-[0_0_0_3px_white]",
  };
  const musics = ["No Music","Bihu Beat","Naga Folk","Mizo Love Song","Meghalaya Rock","Manipuri Pena","Tripura Tribal","Arunachal Chant"];
  const filters = [{name:"Normal",val:"none"},{name:"B&W",val:"grayscale(100%)"},{name:"Warm",val:"sepia(60%)"},{name:"Cold",val:"hue-rotate(180deg)"},{name:"Bright",val:"brightness(1.3) contrast(1.2)"},{name:"Vintage",val:"sepia(80%)"}];

  const [posts, setPosts] = useState<Post[]>([
    { id:1, user:"admin@test.com", text:"Welcome to Seven Sisters Voice! 🎉 Our light & beautiful Northeast social site!", likes:12, liked:false, comments:[], time:"Just now" }
  ]);
  const [newText, setNewText] = useState("");
  const [newImage, setNewImage] = useState<string|undefined>();
  const [newVideo, setNewVideo] = useState<string|undefined>();
  const [commentText, setCommentText] = useState<{[key:number]:string}>({});
  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const storyFileRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{
    const i = setInterval(()=>{ setStories(s=> s.filter(st=> Date.now()-st.time < 12*60*60*1000)); },60000);
    return ()=> clearInterval(i);
  },[]);

  const handleLogin = (e:any) => { e.preventDefault(); if(email) setView("feed"); };
  const handleStoryFile = (e:any)=>{
    const file = e.target.files[0]; if(!file) return;
    const r = new FileReader();
    r.onload = ev=>{
      const res = ev.target?.result as string;
      if(file.type.startsWith("video")){
        const vid = document.createElement("video");
        vid.onloadedmetadata = ()=>{ if(vid.duration>30){ alert("Story video max 30 sec!"); return; } setStoryContent(res); setStoryType("video"); };
        vid.src = res;
      } else { setStoryContent(res); setStoryType("photo"); }
    };
    r.readAsDataURL(file);
  };
  const addStory = ()=>{
    if(!storyContent && storyType!=="text") return;
    setStories([{ id: Date.now(), user: email || "You", type: storyType, content: storyType==="text"? storyContent || "Seven Sisters Voice!" : storyContent, bg: storyBg, filter: storyFilter, music: storyMusic, border: storyBorder, time: Date.now() },...stories]);
    setShowStoryCreate(false); setStoryContent("");
  };
  const handleImage = (e:any) => {
    const file = e.target.files[0]; if(file){ const reader = new FileReader(); reader.onload = (ev)=> setNewImage(ev.target?.result as string); reader.readAsDataURL(file); }
  };
  const handleVideo = (e:any) => {
    const file = e.target.files[0]; if(!file) return;
    const video = document.createElement("video"); video.preload = "metadata";
    video.onloadedmetadata = () => { if(video.duration > 61){ alert(`Video too long! ${Math.round(video.duration)} sec. Only 60 sec allowed.`); return; } const reader = new FileReader(); reader.onload = (ev)=> setNewVideo(ev.target?.result as string); reader.readAsDataURL(file); };
    video.src = URL.createObjectURL(file);
  };
  const createPost = () => {
    if(!newText &&!newImage &&!newVideo) return;
    setPosts([{ id: Date.now(), user: email, text: newText, image: newImage, video: newVideo, likes:0, liked:false, comments:[], time:"Just now" },...posts]);
    setNewText(""); setNewImage(undefined); setNewVideo(undefined);
  };
  const like = (id:number) => setPosts(posts.map(p=> p.id===id? {...p, likes: p.liked? p.likes-1 : p.likes+1, liked:!p.liked} : p));

  if(view!=="feed"){
    return (
      <main className="min-h-screen flex items-center justify-center p-4" style={{background:"linear-gradient(135deg,#ffecd2 0%,#fcb69f 100%)"}}>
        <div className="w-full max-w-[1000px] flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h1 className="text-5xl font-black" style={{color:"#2d3436"}}>Seven Sisters Voice</h1>
            <h2 className="text-xl mt-4 text-[#636e72] font-medium">A light, warm & beautiful voice for Northeast India. Share stories, photos & videos with friends.</h2>
          </div>
          <div className="bg-white/90 backdrop-blur rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-6 w-full max-w-[400px]">
            <form onSubmit={handleLogin} className="space-y-4">
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border border-[#ffeaa7] rounded-xl px-4 py-3.5 bg-[#fff9f0] focus:outline-none focus:ring-2 focus:ring-[#ff9a9e]" required/>
              <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full border border-[#ffeaa7] rounded-xl px-4 py-3.5 bg-[#fff9f0] focus:outline-none focus:ring-2 focus:ring-[#ff9a9e]" required/>
              <button className="w-full text-white text-[18px] font-bold rounded-xl py-3.5 shadow-lg" style={{background:"linear-gradient(90deg,#ff9a9e,#fecfef,#fecfef)", color:"#2d3436"}}>Log in</button>
              <div className="text-center"><span className="text-xs text-[#b2bec3]">Seven Sisters Voice • Light Theme</span></div>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{background:"#fff5eb"}}>
      <div className="sticky top-0 z-40 backdrop-blur bg-white/80 shadow-sm flex items-center justify-between px-4 py-3">
        <h1 className="text-[22px] font-black tracking-tight" style={{color:"#2d3436"}}>Seven Sisters Voice</h1>
        <div className="flex gap-2"><span className="text-xs bg-[#ffeaa7] px-3 py-1 rounded-full font-semibold text-[#2d3436]">12Hr Friends Story</span><button onClick={()=>setView("login")} className="bg-[#ffeaa7] rounded-full px-4 py-1 text-sm font-bold text-[#2d3436]">Logout</button></div>
      </div>

      <div className="max-w-[680px] mx-auto pt-3 px-2 pb-20 space-y-4">
        <div className="bg-white rounded-2xl shadow-sm p-3 border border-[#ffeaa7]/50">
          <div className="flex gap-3 overflow-x-auto">
            <div onClick={()=>setShowStoryCreate(true)} className="min-w-[110px] h-[190px] bg-[#fff9f0] rounded-2xl relative overflow-hidden cursor-pointer border border-[#ffeaa7] border-dashed">
              <div className="h-[120px] bg-gradient-to-br from-[#ffecd2] to-[#fcb69f] flex items-center justify-center"><div className="w-10 h-10 bg-[#2d3436] text-white rounded-full flex items-center justify-center text-2xl">+</div></div>
              <p className="text-xs font-bold text-center p-2 text-[#2d3436]">Create Story</p>
            </div>
            {stories.map(s=>{
              const hoursLeft = 12 - Math.floor((Date.now()-s.time)/(60*60*1000));
              return (
                <div key={s.id} onClick={()=>setViewStory(s)} className={`min-w-[110px] h-[190px] rounded-2xl relative overflow-hidden cursor-pointer ${storyBorders[s.border]}`}>
                  {s.type==="photo" && <img src={s.content} style={{filter:s.filter}} className="w-full h-full object-cover"/>}
                  {s.type==="video" && <video src={s.content} style={{filter:s.filter}} className="w-full h-full object-cover"/>}
                  {s.type==="text" && <div style={{background:s.bg, filter:s.filter}} className="w-full h-full flex items-center justify-center p-2 text-[#2d3436] font-bold text-center text-sm">{s.content}</div>}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                  <div className="absolute bottom-1 left-1 right-1"><p className="text-white text-[11px] font-bold truncate">{s.user.split(" ")[0]}</p><p className="text-[9px] text-white/80">🎵 {s.music} • {hoursLeft}h</p></div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 border border-[#ffeaa7]/50">
          <div className="flex gap-3"><div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{background:"linear-gradient(135deg,#ff9a9e,#fecfef)"}}>{email[0]?.toUpperCase()}</div>
          <textarea value={newText} onChange={e=>setNewText(e.target.value)} placeholder="What's on your mind?" className="flex-1 bg-[#fff9f0] rounded-2xl px-4 py-3 outline-none resize-none border border-[#ffeaa7]/50"/></div>
          {(newImage || newVideo) && <div className="mt-3 relative">{newImage && <img src={newImage} className="w-full rounded-xl"/>}{newVideo && <video src={newVideo} controls className="w-full rounded-xl"/>}<button onClick={()=>{setNewImage(undefined); setNewVideo(undefined);}} className="absolute top-2 right-2 bg-[#2d3436] text-white rounded-full w-8 h-8">X</button></div>}
          <div className="flex justify-between mt-3"><div className="flex gap-2"><button onClick={()=>imageRef.current?.click()} className="px-4 py-2 bg-[#fff9f0] rounded-full text-sm font-semibold border">🖼️ Photo</button><button onClick={()=>videoRef.current?.click()} className="px-4 py-2 bg-[#fff9f0] rounded-full text-sm font-semibold border">🎥 1Min Video</button></div><button onClick={createPost} className="text-[#2d3436] px-6 py-2 rounded-full font-bold shadow-sm" style={{background:"linear-gradient(90deg,#ffeaa7,#fab1a0)"}}>Post</button></div>
          <input ref={imageRef} type="file" accept="image/*" onChange={handleImage} className="hidden"/><input ref={videoRef} type="file" accept="video/*" onChange={handleVideo} className="hidden"/>
        </div>

        {posts.map(post=>(
          <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-[#ffeaa7]/30">
            <div className="p-3 flex gap-2"><div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[#2d3436]" style={{background:"#ffeaa7"}}>{post.user[0]}</div><div><p className="font-bold text-[15px] text-[#2d3436]">{post.user}</p><p className="text-xs text-[#b2bec3]">{post.time} • Friends</p></div></div>
            {post.text && <p className="px-4 pb-3 text-[#2d3436]">{post.text}</p>}
            {post.image && <img src={post.image} className="w-full"/>}
            {post.video && <video src={post.video} controls className="w-full bg-black"/>}
            <div className="flex p-1 border-t border-[#ffeaa7]/30"><button onClick={()=>like(post.id)} className={`flex-1 py-2.5 rounded-xl font-semibold ${post.liked?"text-[#ff7675]":"text-[#636e72]"} hover:bg-[#fff9f0]`}>❤️ {post.likes} Like</button><button className="flex-1 py-2.5 rounded-xl font-semibold text-[#636e72] hover:bg-[#fff9f0]">💬 Comment</button><button className="flex-1 py-2.5 rounded-xl font-semibold text-[#636e72] hover:bg-[#fff9f0]">↗️ Share</button></div>
          </div>
        ))}
      </div>

      {showStoryCreate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[380px] max-h-[90vh] overflow-y-auto p-5 space-y-3">
            <div className="flex justify-between items-center"><h2 className="font-black text-[#2d3436]">Create Story - Seven Sisters Voice</h2><button onClick={()=>setShowStoryCreate(false)} className="w-8 h-8 bg-[#ffeaa7] rounded-full font-bold">X</button></div>
            <div className="flex gap-2"><button onClick={()=>setStoryType("photo")} className={`flex-1 py-2.5 rounded-full font-bold ${storyType==="photo"?"bg-[#2d3436] text-white":"bg-[#fff9f0]"}`}>Photo</button><button onClick={()=>setStoryType("video")} className={`flex-1 py-2.5 rounded-full font-bold ${storyType==="video"?"bg-[#2d3436] text-white":"bg-[#fff9f0]"}`}>Video</button><button onClick={()=>setStoryType("text")} className={`flex-1 py-2.5 rounded-full font-bold ${storyType==="text"?"bg-[#2d3436] text-white":"bg-[#fff9f0]"}`}>Text</button></div>
            {storyType!=="text"? (
              <div onClick={()=>storyFileRef.current?.click()} className="h-[300px] bg-[#fff9f0] rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden border border-dashed border-[#ffeaa7]">
                {storyContent? (storyType==="photo"? <img src={storyContent} style={{filter:storyFilter}} className="w-full h-full object-cover"/> : <video src={storyContent} style={{filter:storyFilter}} className="w-full h-full object-cover"/> ) : <><span className="text-4xl">📸</span><p className="text-sm mt-2 font-semibold">Upload {storyType}</p></>}
              </div>
            ) : (
              <div><div style={{background:storyBg}} className="h-[300px] rounded-2xl flex items-center justify-center p-4"><textarea value={storyContent} onChange={e=>setStoryContent(e.target.value)} placeholder="Seven Sisters Voice..." className="w-full bg-transparent text-[#2d3436] text-xl font-bold text-center outline-none placeholder-[#2d3436]/40"/></div><div className="flex gap-2 mt-2 overflow-x-auto">{["linear-gradient(135deg,#ff9a9e,#fecfef)","linear-gradient(135deg,#ffecd2,#fcb69f)","linear-gradient(135deg,#a1c4fd,#c2e9fb)","linear-gradient(135deg,#d4fc79,#96e6a1)","linear-gradient(135deg,#ffeaa7,#fab1a0)"].map(bg=><div key={bg} onClick={()=>setStoryBg(bg)} style={{background:bg}} className="w-10 h-10 rounded-full cursor-pointer border-2 border-white shadow shrink-0"/> )}</div></div>
            )}
            <input ref={storyFileRef} type="file" accept={storyType==="video"?"video/*":"image/*"} onChange={handleStoryFile} className="hidden"/>
            <div><p className="text-sm font-bold text-[#2d3436]">🎵 Add Music</p><div className="flex gap-2 overflow-x-auto mt-1">{musics.map(m=><button key={m} onClick={()=>setStoryMusic(m)} className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs border font-semibold ${storyMusic===m?"bg-[#2d3436] text-white":"bg-[#fff9f0]"}`}>{m}</button>)}</div></div>
            <div><p className="text-sm font-bold text-[#2d3436]">✨ Filter</p><div className="flex gap-2 overflow-x-auto mt-1">{filters.map(f=><button key={f.name} onClick={()=>setStoryFilter(f.val)} className={`px-3 py-1.5 rounded-full text-xs border font-semibold ${storyFilter===f.val?"bg-[#2d3436] text-white":"bg-[#fff9f0]"}`}>{f.name}</button>)}</div></div>
            <div><p className="text-sm font-bold text-[#2d3436]">🌈 7 Sisters Border</p><div className="grid grid-cols-4 gap-2 mt-1">{Object.keys(storyBorders).map(k=><button key={k} onClick={()=>setStoryBorder(k)} className={`py-2 rounded-full text-xs capitalize font-bold border ${storyBorder===k?"bg-[#2d3436] text-white":"bg-[#fff9f0]"}`}>{k}</button>)}</div></div>
            <button onClick={addStory} className="w-full py-3 rounded-full font-black text-[#2d3436]" style={{background:"linear-gradient(90deg,#ffeaa7,#fab1a0)"}}>Share Story - 12Hr Friends Only</button>
          </div>
        </div>
      )}

      {viewStory && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="relative w-full max-w-[400px] h-full md:h-[90vh] bg-black md:rounded-[20px] overflow-hidden">
            {viewStory.type==="photo" && <img src={viewStory.content} style={{filter:viewStory.filter}} className="w-full h-full object-cover"/>}
            {viewStory.type==="video" && <video src={viewStory.content} style={{filter:viewStory.filter}} autoPlay controls className="w-full h-full object-cover"/>}
            {viewStory.type==="text" && <div style={{background:viewStory.bg, filter:viewStory.filter}} className="w-full h-full flex items-center justify-center p-6 text-[#2d3436] text-2xl font-black text-center">{viewStory.content}</div>}
            <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/70 to-transparent flex justify-between items-center">
              <div className="flex gap-2 items-center"><div className="w-8 h-8 bg-[#ffeaa7] rounded-full flex items-center justify-center font-bold text-xs text-[#2d3436]">{viewStory.user[0]}</div><div><p className="text-white text-sm font-bold">{viewStory.user}</p><p className="text-white/70 text-[11px]">🎵 {viewStory.music}</p></div></div>
              <button onClick={()=>setViewStory(null)} className="w-8 h-8 bg-white/20 text-white rounded-full">X</button>
            </div>
            <div className={`absolute inset-0 pointer-events-none ${storyBorders[viewStory.border]} rounded-[20px]`}/>
          </div>
        </div>
      )}
    </main>
  );
  }
