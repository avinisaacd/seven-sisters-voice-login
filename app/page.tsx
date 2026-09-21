"use client";
import { useState, useRef } from "react";

export default function Page() {
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("123456");
  const [activeTab, setActiveTab] = useState("home");
  const [newText, setNewText] = useState("");
  const [selImg, setSelImg] = useState<string | null>(null);
  const [selVid, setSelVid] = useState<string | null>(null);
  const [activeStory, setActiveStory] = useState<any>(null);
  const [likes, setLikes] = useState<{[k:number]:boolean}>({});
  const [cmts, setCmts] = useState<{[k:number]:string[]}>({1:[]});
  const [cmtIn, setCmtIn] = useState<{[k:number]:string}>({});

  const imgRef = useRef<HTMLInputElement>(null);
  const vidRef = useRef<HTMLInputElement>(null);
  const storyRef = useRef<HTMLInputElement>(null);

  const [posts, setPosts] = useState<any[]>([
    {id:1, user:"admin", text:"Welcome to Seven Sisters Voice! Photo + Video + Stories working!", time:"Just now", img:null, vid:null, likeCount:12},
  ]);
  const [stories, setStories] = useState<any[]>([
    {id:1, name:"Priya", img:"https://picsum.photos/200?1"},
    {id:2, name:"Rahul", img:"https://picsum.photos/200?2"},
  ]);

  if (view!== "feed") {
    return (
      <div className="min-h-screen w-full flex flex-col md:flex-row">
        {/* LEFT - EXTERIOR BRANDING - NEW */}
        <div className="w-full md:w-[55%] bg-black text-white p-8 md:p-12 flex flex-col justify-between min-h-[45vh] md:min-h-screen relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 rounded-full blur-[100px] opacity-60 -mr-40 -mt-40"></div>
          <div className="relative z-10">
            <h1 className="font-black text-[20px] tracking-tight">● Seven Sisters Voice</h1>
            <p className="text-white/60 text-[11px] mt-1 tracking-widest uppercase">Northeast India • Est 2026</p>
          </div>
          <div className="relative z-10 mt-8 md:mt-0">
            <h2 className="text-[38px] md:text-[64px] font-black leading-[0.9] tracking-tighter">Your<br/>Voice.<br/>Your<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">Hills.</span></h2>
            <p className="mt-6 text-[14px] text-white/70 max-w-[360px] leading-relaxed">Assam • Meghalaya • Nagaland • Manipur • Mizoram • Tripura • Arunachal — Photo, Video, Stories, Chat. Built for us.</p>
            <div className="flex gap-2 mt-6 flex-wrap">
              <span className="border border-white/20 px-3 py-1.5 rounded-full text-[11px]">🏔️ 7 Sisters</span>
              <span className="border border-white/20 px-3 py-1.5 rounded-full text-[11px]">📸 Stories</span>
              <span className="border border-white/20 px-3 py-1.5 rounded-full text-[11px]">💬 Chat</span>
            </div>
          </div>
          <div className="relative z-10 hidden md:block text-[11px] text-white/40">© 2026 Seven Sisters Voice — Made in Gauhati with ❤️</div>
        </div>

        {/* RIGHT - LOGIN - NEW */}
        <div className="w-full md:w-[45%] bg-[#fff5eb] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-[380px] rounded-[28px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.1)] border">
            <h3 className="text-[26px] font-black text-black tracking-tight">Welcome back</h3>
            <p className="text-[13px] text-gray-500 mt-1 mb-7">Log in to Seven Sisters Voice</p>
            <div className="space-y-4">
              <div><label className="text-[11px] font-bold uppercase tracking-widest">Email</label><input value={email} onChange={e=>setEmail(e.target.value)} className="w-full mt-2 bg-[#fff9f0] border rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-black" placeholder="admin@test.com" /></div>
              <div><label className="text-[11px] font-bold uppercase tracking-widest">Password</label><input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="w-full mt-2 bg-[#fff9f0] border rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-black" placeholder="••••••" /></div>
              <button onClick={()=>setView("feed")} className="w-full bg-black text-white rounded-xl py-3.5 font-bold text-[14px] mt-2">Log in →</button>
              <div className="bg-[#fff9f0] rounded-xl p-3 border border-dashed mt-2"><p className="text-[11px] text-gray-600 leading-snug"><b>Demo access:</b><br/>admin@test.com / 123456</p></div>
            </div>
            <p className="text-[11px] text-center text-gray-400 mt-6 md:hidden">© 2026 Seven Sisters Voice</p>
          </div>
        </div>
      </div>
    );
  }

  if (activeStory) {
    return <div className="fixed inset-0 bg-black z-50 p-4 flex flex-col"><div className="flex justify-between text-white"><b>{activeStory.name}</b><button onClick={()=>setActiveStory(null)} className="w-8 h-8 rounded-full bg-white/20">✕</button></div><div className="flex-1 flex items-center justify-center"><img src={activeStory.img} className="max-h-[80vh] rounded-xl" /></div></div>;
  }

  return (
    <main className="min-h-screen bg-[#fff5eb] pb-20">
      <div className="sticky top-0 z-20 bg-white border-b px-3 py-2 flex justify-between items-center"><h1 className="font-black text-[13px]">Seven Sisters Voice</h1><div className="flex gap-1"><button onClick={()=>setActiveTab("home")} className={`px-4 py-2 rounded-full text-[11px] font-bold ${activeTab==="home"?"bg-black text-white":"bg-[#ffeaa7]"}`}>Home</button><button onClick={()=>setActiveTab("profile")} className={`px-3 py-2 rounded-full text-[11px] font-bold ${activeTab==="profile"?"bg-black text-white":"bg-[#ffeaa7]"}`}>Profile</button></div></div>
      <div className="max-w-[520px] mx-auto p-3 space-y-3">
        <div className="bg-white rounded-[18px] p-3 border flex gap-3 overflow-x-auto">
          <div onClick={()=>storyRef.current?.click()} className="flex flex-col items-center gap-1 min-w-[60px] cursor-pointer"><div className="w-[60px] h-[60px] rounded-full bg-[#fff9f0] border-2 border-dashed flex items-center justify-center text-xl">+</div><p className="text-[10px] font-bold">Add Story</p></div>
          {stories.map(s=><div key={s.id} onClick={()=>setActiveStory(s)} className="flex flex-col items-center gap-1 min-w-[60px] cursor-pointer"><div className="w-[60px] h-[60px] rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 to-purple-600"><img src={s.img} className="w-full h-full rounded-full object-cover border-2 border-white" /></div><p className="text-[10px] font-bold">{s.name}</p></div>)}
        </div>
        <input ref={storyRef} type="file" accept="image/*" className="hidden" onChange={e=>{const f=e.target.files?.[0]; if(f) setStories([{id:Date.now(), name:"You", img:URL.createObjectURL(f)},...stories])}} />

        <div className="bg-white rounded-[18px] p-4 border space-y-3">
          <textarea value={newText} onChange={e=>setNewText(e.target.value)} placeholder="What's on your mind?" className="w-full bg-[#fff9f0] rounded-xl px-4 py-3 text-sm border outline-none" />
          {selImg && <img src={selImg} className="w-full rounded-xl max-h-[300px] object-cover" />}
          {selVid && <video src={selVid} controls className="w-full rounded-xl" />}
          <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={e=>{const f=e.target.files?.[0]; if(f) setSelImg(URL.createObjectURL(f))}} />
          <input ref={vidRef} type="file" accept="video/*" className="hidden" onChange={e=>{const f=e.target.files?.[0]; if(f) setSelVid(URL.createObjectURL(f))}} />
          <div className="flex gap-2 border-t pt-3">
            <button onClick={()=>imgRef.current?.click()} className="flex-1 bg-[#fff9f0] py-2.5 rounded-full text-[12px] font-bold border">📸 Photo</button>
            <button onClick={()=>vidRef.current?.click()} className="flex-1 bg-[#fff9f0] py-2.5 rounded-full text-[12px] font-bold border">🎥 Video</button>
            <button onClick={()=>{if(!newText&&!selImg&&!selVid) return; setPosts([{id:Date.now(), user:"You", text:newText, time:"Just now", img:selImg, vid:selVid, likeCount:0},...posts]); setNewText(""); setSelImg(null); setSelVid(null)}} className="flex-1 bg-black text-white py-2.5 rounded-full text-[12px] font-bold">Post</button>
          </div>
        </div>

        {posts.map(p=>(
          <div key={p.id} className="bg-white rounded-[18px] border overflow-hidden">
            <div className="p-4"><p className="font-black text-[13px]">{p.user}</p><p className="text-[10px] text-gray-400">{p.time}</p><p className="text-[13px] mt-2">{p.text}</p></div>
            {p.img && <img src={p.img} className="w-full" />}
            {p.vid && <video src={p.vid} controls className="w-full" />}
            <div className="px-4 py-2 text-[11px] text-gray-500 flex justify-between border-t bg-[#fffcf7]"><span>{(p.likeCount + (likes[p.id]?1:0))} likes</span><span>{(cmts[p.id]?.length||0)} comments</span></div>
            <div className="flex border-t">
              <button onClick={()=>setLikes({...likes, [p.id]:!likes[p.id]})} className={`flex-1 py-3 text-[12px] font-bold ${likes[p.id]?"text-red-500":"text-gray-600"}`}>{likes[p.id]?"❤️ Liked":"🤍 Like"}</button>
              <button className="flex-1 py-3 text-[12px] font-bold text-gray-600 border-x">💬 Comment</button>
              <button className="flex-1 py-3 text-[12px] font-bold text-gray-600">↗️ Share</button>
            </div>
            <div className="bg-[#fff9f0] p-3 space-y-2">
              {(cmts[p.id]||[]).map((c,i)=><div key={i} className="text-[12px]"><b>You:</b> {c}</div>)}
              <div className="flex gap-2"><input value={cmtIn[p.id]||""} onChange={e=>setCmtIn({...cmtIn, [p.id]:e.target.value})} placeholder="Write a comment..." className="flex-1 bg-white border rounded-full px-4 py-2 text-[12px]" /><button onClick={()=>{const t=cmtIn[p.id]; if(!t) return; setCmts({...cmts, [p.id]:[...(cmts[p.id]||[]), t]}); setCmtIn({...cmtIn, [p.id]:""})}} className="bg-black text-white px-4 rounded-full text-[11px] font-bold">Send</button></div>
            </div>
          </div>
        ))}

        {activeTab==="profile" && (
          <div className="bg-white rounded-[24px] border overflow-hidden"><div className="h-[100px] bg-gradient-to-r from-orange-400 to-purple-600"></div><div className="p-5"><div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center font-black -mt-12 border-4 border-white">A</div><h2 className="font-black mt-2">Admin</h2><p className="text-xs text-gray-500">Founder • Gauhati, Assam</p><button onClick={()=>setView("login")} className="w-full mt-4 border py-2.5 rounded-full text-xs font-bold">Log out</button></div></div>
        )}
      </div>
    </main>
  );
}
