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
  views: number;
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

  // Friends
  const [friends] = useState(["Rahul Assam","Priya Meghalaya","John Nagaland","Mizo Boy"]);

  // Stories
  const [stories, setStories] = useState<Story[]>([
    {id:1, user:"Priya Meghalaya", type:"photo", content:"https://picsum.photos/300/500?random=2", filter:"none", music:"Bihu Beat", border:"assam", time: Date.now()-1000*60*30, views:12},
    {id:2, user:"Rahul Assam", type:"text", content:"Jai Ai Axom!", bg:"linear-gradient(45deg,#ff6a00,#ee0979)", filter:"none", music:"Local Folk", border:"meghalaya", time: Date.now()-1000*60*60*2, views:5}
  ]);
  const [showStoryCreate, setShowStoryCreate] = useState(false);
  const [storyType, setStoryType] = useState<"photo"|"video"|"text">("photo");
  const [storyContent, setStoryContent] = useState("");
  const [storyBg, setStoryBg] = useState("linear-gradient(45deg,#667eea,#764ba2)");
  const [storyFilter, setStoryFilter] = useState("none");
  const [storyMusic, setStoryMusic] = useState("No Music");
  const [storyBorder, setStoryBorder] = useState("assam");
  const [viewStory, setViewStory] = useState<Story|null>(null);

  const storyBorders: any = {
    assam: "border-4 border-[#ff0000] shadow-[0_0_0_3px_gold]",
    arunachal: "border-4 border-blue-500 shadow-[0_0_0_3px_orange]",
    manipur: "border-4 border-yellow-400 shadow-[0_0_0_3px_red]",
    meghalaya: "border-4 border-green-500 shadow-[0_0_0_3px_yellow]",
    mizoram: "border-4 border-purple-500 shadow-[0_0_0_3px_white]",
    nagaland: "border-4 border-red-500 shadow-[0_0_0_3px_black]",
    tripura: "border-4 border-orange-500 shadow-[0_0_0_3px_white]",
  };
  const musics = ["No Music","Bihu Beat","Naga Folk","Mizo Love Song","Meghalaya Rock","Manipuri Pena","Tripura Tribal","Arunachal Chant"];
  const filters = [
    {name:"Normal", val:"none"},
    {name:"B&W", val:"grayscale(100%)"},
    {name:"Warm", val:"sepia(60%)"},
    {name:"Cold", val:"hue-rotate(180deg)"},
    {name:"Bright", val:"brightness(1.3) contrast(1.2)"},
    {name:"Vintage", val:"sepia(80%) contrast(1.1)"},
  ];

  // Auto delete 12 hr stories
  useEffect(()=>{
    const i = setInterval(()=>{
      setStories(s=> s.filter(st=> Date.now()-st.time < 12*60*60*1000));
    },60000);
    return ()=> clearInterval(i);
  },[]);

  // Posts (same as before)
  const [posts, setPosts] = useState<Post[]>([
    { id:1, user:"admin@test.com", text:"Welcome to Seven Sisters Book! 🎉", likes:12, liked:false, comments:[], time:"Just now" }
  ]);
  const [newText, setNewText] = useState("");
  const [newImage, setNewImage] = useState<string|undefined>();
  const [newVideo, setNewVideo] = useState<string|undefined>();
  const [commentText, setCommentText] = useState<{[key:number]:string}>({});
  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const storyFileRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e:any) => {
    e.preventDefault();
    if(email) setView("feed");
  };

  const handleStoryFile = (e:any)=>{
    const file = e.target.files[0];
    if(!file) return;
    const r = new FileReader();
    r.onload = ev=>{
      const res = ev.target?.result as string;
      if(file.type.startsWith("video")){
        const vid = document.createElement("video");
        vid.onloadedmetadata = ()=>{
          if(vid.duration>30){ alert("Story video max 30 sec!"); return; }
          setStoryContent(res); setStoryType("video");
        };
        vid.src = res;
      } else {
        setStoryContent(res); setStoryType("photo");
      }
    };
    r.readAsDataURL(file);
  };

  const addStory = ()=>{
    if(!storyContent && storyType!=="text") return;
    const s: Story = {
      id: Date.now(),
      user: email || "You",
      type: storyType,
      content: storyType==="text"? storyContent || "Hello 7 Sisters!" : storyContent,
      bg: storyBg,
      filter: storyFilter,
      music: storyMusic,
      border: storyBorder,
      time: Date.now(),
      views: 0
    };
    setStories([s,...stories]);
    setShowStoryCreate(false);
    setStoryContent("");
  };

  const handleImage = (e:any) => {
    const file = e.target.files[0];
    if(file){
      const reader = new FileReader();
      reader.onload = (ev)=> setNewImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };
  const handleVideo = (e:any) => {
    const file = e.target.files[0];
    if(!file) return;
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      if(video.duration > 61){ alert(`Video too long! ${Math.round(video.duration)} sec. Only 60 sec allowed.`); return; }
      const reader = new FileReader();
      reader.onload = (ev)=> setNewVideo(ev.target?.result as string);
      reader.readAsDataURL(file);
    };
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
      <main className="min-h-screen flex items-center justify-center p-4 bg-[#f0f2f5]">
        <div className="w-full max-w-[1000px] flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1"><h1 className="text-6xl font-bold text-[#0866ff]">seven sisters</h1><h2 className="text-2xl mt-4">7 Sisters Stories - 12 Hr • Friends Only • Music + Filter</h2></div>
          <div className="bg-white rounded-lg shadow-xl p-4 w-full max-w-[400px]">
            <form onSubmit={handleLogin} className="space-y-3">
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-lg px-4 py-3.5" required/>
              <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full border rounded-lg px-4 py-3.5" required/>
              <button className="w-full bg-[#0866ff] text-white text-xl font-bold rounded-lg py-3">Log in</button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f0f2f5]">
      <div className="sticky top-0 z-40 bg-white shadow flex items-center justify-between px-4 py-2">
        <h1 className="text-2xl font-bold text-[#0866ff]">seven sisters</h1>
        <div className="flex gap-2"><span className="text-xs bg-green-100 px-2 py-1 rounded-full">Friends Only • 12Hr Story</span><button onClick={()=>setView("login")} className="bg-gray-200 rounded-full px-3 py-1 text-sm">Logout</button></div>
      </div>

      <div className="max-w-[680px] mx-auto pt-3 px-2 pb-20 space-y-3">
        {/* STORIES BAR */}
        <div className="bg-white rounded-lg shadow p-3">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {/* Create Story */}
            <div onClick={()=>setShowStoryCreate(true)} className="min-w-[110px] h-[190px] bg-gray-100 rounded-xl relative overflow-hidden cursor-pointer border">
              <div className="h-[120px] bg-gray-200 flex items-center justify-center"><div className="w-10 h-10 bg-[#0866ff] text-white rounded-full flex items-center justify-center text-2xl">+</div></div>
              <p className="text-xs font-semibold text-center p-2">Create Story</p>
            </div>
            {/* Friends Stories - 12hr + 7 Sisters Border + Filter */}
            {stories.map(s=>{
              const hoursLeft = 12 - Math.floor((Date.now()-s.time)/(60*60*1000));
              return (
                <div key={s.id} onClick={()=>setViewStory(s)} className={`min-w-[110px] h-[190px] rounded-xl relative overflow-hidden cursor-pointer ${storyBorders[s.border]}`}>
                  {s.type==="photo" && <img src={s.content} style={{filter:s.filter}} className="w-full h-full object-cover"/>}
                  {s.type==="video" && <video src={s.content} style={{filter:s.filter}} className="w-full h-full object-cover"/>}
                  {s.type==="text" && <div style={{background:s.bg, filter:s.filter}} className="w-full h-full flex items-center justify-center p-2 text-white font-bold text-center text-sm">{s.content}</div>}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
                  <div className="absolute bottom-1 left-1 right-1">
                    <p className="text-white text-[11px] font-bold truncate">{s.user.split(" ")[0]}</p>
                    <p className="text-[9px] text-white/80">🎵 {s.music} • {hoursLeft}h left</p>
                  </div>
                  <div className="absolute top-1 left-1 w-8 h-8 rounded-full bg-white text-[10px] flex items-center justify-center font-bold">{s.user[0]}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CREATE POST - Same */}
        <div className="bg-white rounded-lg shadow p-3">
          <div className="flex gap-2"><div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">{email[0]?.toUpperCase()}</div>
          <textarea value={newText} onChange={e=>setNewText(e.target.value)} placeholder="What's on your mind?" className="flex-1 bg-[#f0f2f5] rounded-2xl px-4 py-2 outline-none resize-none"/></div>
          {(newImage || newVideo) && <div className="mt-2 relative">{newImage && <img src={newImage} className="w-full rounded-lg"/>}{newVideo && <video src={newVideo} controls className="w-full rounded-lg"/>}<button onClick={()=>{setNewImage(undefined); setNewVideo(undefined);}} className="absolute top-2 right-2 bg-black text-white rounded-full w-8 h-8">X</button></div>}
          <div className="flex justify-between mt-3"><div className="flex gap-2"><button onClick={()=>imageRef.current?.click()} className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm">🖼️ Photo</button><button onClick={()=>videoRef.current?.click()} className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm">🎥 1Min Video</button></div><button onClick={createPost} className="bg-[#0866ff] text-white px-5 py-1.5 rounded-lg font-semibold">Post</button></div>
          <input ref={imageRef} type="file" accept="image/*" onChange={handleImage} className="hidden"/><input ref={videoRef} type="file" accept="video/*" onChange={handleVideo} className="hidden"/>
        </div>

        {/* POSTS */}
        {posts.map(post=>(
          <div key={post.id} className="bg-white rounded-lg shadow">
            <div className="p-3 flex gap-2"><div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold">{post.user[0]}</div><div><p className="font-semibold text-[15px]">{post.user}</p><p className="text-xs text-gray-500">{post.time} • Friends</p></div></div>
            {post.text && <p className="px-3 pb-2">{post.text}</p>}
            {post.image && <img src={post.image} className="w-full"/>}
            {post.video && <video src={post.video} controls className="w-full bg-black"/>}
            <div className="flex p-1 border-t"><button onClick={()=>like(post.id)} className={`flex-1 py-2 rounded-lg ${post.liked?"text-blue-600":""}`}>👍 {post.likes} Like</button><button className="flex-1 py-2">💬 Comment</button><button className="flex-1 py-2">↗️ Share</button></div>
          </div>
        ))}
      </div>

      {/* CREATE STORY MODAL */}
      {showStoryCreate && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[380px] max-h-[90vh] overflow-y-auto p-4 space-y-3">
            <div className="flex justify-between items-center"><h2 className="font-bold text-lg">Create Story - 12 Hr • Friends Only</h2><button onClick={()=>setShowStoryCreate(false)} className="w-8 h-8 bg-gray-200 rounded-full">X</button></div>

            <div className="flex gap-2">
              <button onClick={()=>setStoryType("photo")} className={`flex-1 py-2 rounded-lg font-semibold ${storyType==="photo"?"bg-black text-white":"bg-gray-100"}`}>Photo</button>
              <button onClick={()=>setStoryType("video")} className={`flex-1 py-2 rounded-lg font-semibold ${storyType==="video"?"bg-black text-white":"bg-gray-100"}`}>Video</button>
              <button onClick={()=>setStoryType("text")} className={`flex-1 py-2 rounded-lg font-semibold ${storyType==="text"?"bg-black text-white":"bg-gray-100"}`}>Text</button>
            </div>

            {storyType!=="text"? (
              <div onClick={()=>storyFileRef.current?.click()} className="h-[300px] bg-gray-100 rounded-xl flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                {storyContent? (storyType==="photo"? <img src={storyContent} style={{filter:storyFilter}} className="w-full h-full object-cover"/> : <video src={storyContent} style={{filter:storyFilter}} className="w-full h-full object-cover"/> ) : <><span className="text-4xl">📸</span><p className="text-sm mt-2">{storyType==="video"?"30 sec video":"Upload photo"}</p></>}
              </div>
            ) : (
              <div>
                <div style={{background:storyBg}} className="h-[300px] rounded-xl flex items-center justify-center p-4"><textarea value={storyContent} onChange={e=>setStoryContent(e.target.value)} placeholder="Type story text..." className="w-full bg-transparent text-white text-xl font-bold text-center outline-none placeholder-white/60"/></div>
                <div className="flex gap-2 mt-2 overflow-x-auto">{["linear-gradient(45deg,#667eea,#764ba2)","linear-gradient(45deg,#ff6a00,#ee0979)","linear-gradient(45deg,#11998e,#38ef7d)","linear-gradient(45deg,#000,#333)","linear-gradient(45deg,#f857a6,#ff5858)"].map(bg=><div key={bg} onClick={()=>setStoryBg(bg)} style={{background:bg}} className="w-10 h-10 rounded-full cursor-pointer border-2 border-white shadow shrink-0"/> )}</div>
              </div>
            )}
            <input ref={storyFileRef} type="file" accept={storyType==="video"?"video/*":"image/*"} onChange={handleStoryFile} className="hidden"/>

            <div><p className="text-sm font-semibold">🎵 Add Music</p><div className="flex gap-2 overflow-x-auto mt-1">{musics.map(m=><button key={m} onClick={()=>setStoryMusic(m)} className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs border ${storyMusic===m?"bg-black text-white":"bg-white"}`}>{m}</button>)}</div></div>

            <div><p className="text-sm font-semibold">✨ Filter</p><div className="flex gap-2 overflow-x-auto mt-1">{filters.map(f=><button key={f.name} onClick={()=>setStoryFilter(f.val)} className={`px-3 py-1.5 rounded-full text-xs border ${storyFilter===f.val?"bg-black text-white":"bg-white"}`}>{f.name}</button>)}</div></div>

            <div><p className="text-sm font-semibold">🌈 7 Sisters Border</p><div className="grid grid-cols-4 gap-2 mt-1">{Object.keys(storyBorders).map(k=><button key={k} onClick={()=>setStoryBorder(k)} className={`py-2 rounded-lg text-xs capitalize border-2 ${storyBorder===k?"border-black bg-gray-100":"bg-white"} ${k==="assam"?"border-red-500":k==="meghalaya"?"border-green-500":""}`}>{k}</button>)}</div></div>

            <button onClick={addStory} className="w-full bg-[#0866ff] text-white py-3 rounded-xl font-bold">Share to Friends Story - 12Hr</button>
            <p className="text-[11px] text-center text-gray-400">Only friends can see • Auto delete after 12 hours</p>
          </div>
        </div>
      )}

      {/* VIEW STORY */}
      {viewStory && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="relative w-full max-w-[400px] h-full md:h-[90vh] bg-black md:rounded-2xl overflow-hidden">
            {viewStory.type==="photo" && <img src={viewStory.content} style={{filter:viewStory.filter}} className="w-full h-full object-cover"/>}
            {viewStory.type==="video" && <video src={viewStory.content} style={{filter:viewStory.filter}} autoPlay controls className="w-full h-full object-cover"/>}
            {viewStory.type==="text" && <div style={{background:viewStory.bg, filter:viewStory.filter}} className="w-full h-full flex items-center justify-center p-6 text-white text-2xl font-bold text-center">{viewStory.content}</div>}
            <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/70 to-transparent flex justify-between items-center">
              <div className="flex gap-2 items-center"><div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-xs">{viewStory.user[0]}</div><div><p className="text-white text-sm font-semibold">{viewStory.user}</p><p className="text-white/70 text-[11px]">🎵 {viewStory.music} • {12-Math.floor((Date.now()-viewStory.time)/3600000)}h left • Friends</p></div></div>
              <button onClick={()=>setViewStory(null)} className="w-8 h-8 bg-white/20 text-white rounded-full">X</button>
            </div>
            <div className={`absolute inset-0 pointer-events-none ${storyBorders[viewStory.border]} rounded-2xl`}/>
          </div>
        </div>
      )}
    </main>
  );
                  }
