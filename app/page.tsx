"use client";
import { useState, useRef, useEffect } from "react";

export default function SevenSistersVoice() {
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("123456");
  const [activeTab, setActiveTab] = useState("home");
  const [newText, setNewText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [activeStory, setActiveStory] = useState<any>(null);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMsg, setNewMsg] = useState("");

  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const storyRef = useRef<HTMLInputElement>(null);

  const allUsers = [
    { email: "priya@test.com", name: "Priya" },
    { email: "rahul@test.com", name: "Rahul" },
    { email: "john@test.com", name: "John" },
  ];
  const [friends] = useState(["priya@test.com", "rahul@test.com", "john@test.com"]);
  const [posts, setPosts] = useState<any[]>([
    { id: 1, user: "admin@test.com", text: "Welcome to Seven Sisters Voice! Photo + Video + Stories working!", time: "Just now" },
  ]);
  const [stories, setStories] = useState<any[]>([
    { id: 1, user: "priya@test.com", name: "Priya", image: "https://picsum.photos/400/700?random=1", time: "2h ago" },
    { id: 2, user: "rahul@test.com", name: "Rahul", image: "https://picsum.photos/400/700?random=2", time: "5h ago" },
  ]);
  const [messages, setMessages] = useState<any[]>([]);

  const handleLogin = (e: any) => {
    e.preventDefault();
    setView("feed");
  };

  const onImage = (e: any) => {
    const file = e.target.files[0];
    if (file) setSelectedImage(URL.createObjectURL(file));
  };
  const onVideo = (e: any) => {
    const file = e.target.files[0];
    if (file) setSelectedVideo(URL.createObjectURL(file));
  };
  const onStory = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setStories([{ id: Date.now(), user: email, name: "You", image: url, time: "Just now" },...stories]);
    }
  };
  const doPost = () => {
    if (!newText &&!selectedImage &&!selectedVideo) return;
    setPosts([{ id: Date.now(), user: email, text: newText, image: selectedImage, video: selectedVideo, time: "Just now" },...posts]);
    setNewText("");
    setSelectedImage(null);
    setSelectedVideo(null);
  };
  const sendMsg = () => {
    if (!newMsg ||!selectedChat) return;
    setMessages([...messages, { from: email, to: selectedChat, text: newMsg }]);
    setNewMsg("");
  };

  if (view!== "feed") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#fff5eb]">
        <div className="bg-white rounded-xl shadow p-6 w-full max-w-[400px]">
          <h1 className="text-[28px] font-black text-center">Seven Sisters Voice</h1>
          <p className="text-center text-xs text-gray-500 mb-4">Photo Video Story Added</p>
          <form onSubmit={handleLogin} className="space-y-3">
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-lg px-4 py-3" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full border rounded-lg px-4 py-3" />
            <button className="w-full font-bold py-3 rounded-lg bg-[#ffeaa7] border">Log in</button>
          </form>
        </div>
      </div>
    );
  }

  if (activeStory) {
    return (
      <div className="fixed inset-0 bg-black z-[200] flex flex-col p-4">
        <div className="flex justify-between text-white"><p className="font-bold">{activeStory.name}</p><button onClick={() => setActiveStory(null)} className="bg-white/20 w-8 h-8 rounded-full">X</button></div>
        <div className="flex-1 flex items-center justify-center"><img src={activeStory.image} className="max-h-full rounded-xl" /></div>
      </div>
    );
  }

  if (selectedChat) {
    const friend = allUsers.find((u) => u.email === selectedChat);
    const chatMsgs = messages.filter((m) => (m.from === email && m.to === selectedChat) || (m.from === selectedChat && m.to === email));
    return (
      <main className="min-h-screen flex flex-col bg-[#fff5eb]">
        <div className="bg-white border-b p-3 flex gap-2 items-center"><button onClick={() => setSelectedChat(null)} className="w-8 h-8 bg-gray-100 rounded-full">←</button><p className="font-bold">{friend?.name}</p></div>
        <div className="flex-1 p-3 space-y-2">{chatMsgs.map((m, i) => (<div key={i} className={`flex ${m.from === email? "justify-end" : "justify-start"}`}><div className={`px-4 py-2 rounded-2xl text-sm ${m.from === email? "bg-black text-white" : "bg-white border"}`}>{m.text}</div></div>))}</div>
        <div className="bg-white border-t p-2 flex gap-2"><input value={newMsg} onChange={(e) => setNewMsg(e.target.value)} placeholder="Message..." className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm" /><button onClick={sendMsg} className="bg-black text-white w-10 h-10 rounded-full">↑</button></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20 bg-[#fff5eb]">
      <div className="sticky top-0 z-40 bg-white shadow px-2 py-2 flex justify-between">
        <h1 className="font-black text-[12px]">Seven Sisters Voice</h1>
        <div className="flex gap-1">
          <button onClick={() => setActiveTab("home")} className={`px-4 py-2 rounded-full text-[11px] font-bold ${activeTab === "home"? "bg-black text-white" : "bg-[#ffeaa7]"}`}>Home</button>
          <button onClick={() => setActiveTab("friends")} className={`px-3 py-2 rounded-full text-[11px] font-bold ${activeTab === "friends"? "bg-black text-white" : "bg-[#ffeaa7]"}`}>Friends</button>
          <button onClick={() => setActiveTab("chat")} className={`px-3 py-2 rounded-full text-[11px] font-bold ${activeTab === "chat"? "bg-black text-white" : "bg-[#ffeaa7]"}`}>Chat</button>
        </div>
      </div>

      <div className="max-w-[500px] mx-auto p-2 space-y-3">
        {activeTab === "home" && (
          <>
            <div className="bg-white rounded-[18px] p-3 border flex gap-3 overflow-x-auto">
              <div className="flex flex-col items-center gap-1 min-w-[60px]">
                <div onClick={() => storyRef.current?.click()} className="w-[60px] h-[60px] rounded-full bg-[#fff9f0] border-2 border-dashed flex items-center justify-center cursor-pointer"><span className="text-2xl">+</span></div>
                <p className="text-[10px] font-bold">Add Story</p>
              </div>
              {stories.map((s) => (
                <div key={s.id} onClick={() => setActiveStory(s)} className="flex flex-col items-center gap-1 min-w-[60px] cursor-pointer">
                  <div className="w-[60px] h-[60px] rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 to-purple-500"><img src={s.image} className="w-full h-full rounded-full object-cover bg-white p-[2px]" /></div>
                  <p className="text-[10px] font-bold">{s.name}</p>
                </div>
              ))}
            </div>
            <input ref={storyRef} type="file" accept="image/*" onChange={onStory} className="hidden" />

            <div className="bg-white rounded-[18px] p-4 border space-y-3">
              <textarea value={newText} onChange={(e) => setNewText(e.target.value)} placeholder="What's on your mind?" className="w-full bg-[#fff9f0] rounded-xl px-4 py-3 text-sm border outline-none" />
              {selectedImage && <div className="relative"><img src={selectedImage} className="w-full rounded-xl max-h-[300px] object-cover" /><button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 bg-black text-white w-8 h-8 rounded-full">X</button></div>}
              {selectedVideo && <div className="relative"><video src={selectedVideo} controls className="w-full rounded-xl max-h-[300px]" /><button onClick={() => setSelectedVideo(null)} className="absolute top-2 right-2 bg-black text-white w-8 h-8 rounded-full">X</button></div>}
              <input ref={imageRef} type="file" accept="image/*" onChange={onImage} className="hidden" />
              <input ref={videoRef} type="file" accept="video/*" onChange={onVideo} className="hidden" />
              <div className="flex gap-2 border-t pt-3">
                <button onClick={() => imageRef.current?.click()} className="flex-1 bg-[#fff9f0] py-2.5 rounded-full text-[12px] font-bold border">📸 Photo</button>
                <button onClick={() => videoRef.current?.click()} className="flex-1 bg-[#fff9f0] py-2.5 rounded-full text-[12px] font-bold border">🎥 Video</button>
                <button onClick={doPost} className="flex-1 bg-black text-white py-2.5 rounded-full text-[12px] font-bold">Post</button>
              </div>
            </div>

            {posts.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border overflow-hidden">
                <div className="p-4"><p className="font-bold text-xs">{p.user.split("@")[0]}</p><p className="text-[10px] text-gray-400">{p.time}</p><p className="text-[13px] mt-2">{p.text}</p></div>
                {p.image && <img src={p.image} className="w-full" />}
                {p.video && <video src={p.video} controls className="w-full" />}
              </div>
            ))}
          </>
        )}

        {activeTab === "friends" && (
          <div className="bg-white rounded-2xl p-4 border">
            <h2 className="font-black text-sm mb-2">Friends</h2>
            {friends.map((f) => {
              const u = allUsers.find((x) => x.email === f);
              return <div key={f} className="flex justify-between p-3 bg-[#fff9f0] rounded-xl border mb-2"><p className="font-bold text-xs">{u?.name}</p><button onClick={() => setSelectedChat(f)} className="bg-black text-white px-3 py-1 rounded-full text-[10px]">Chat</button></div>;
            })}
          </div>
        )}

        {activeTab === "chat" && (
          <div className="bg-white rounded-2xl border">
            <div className="p-3 border-b font-black text-sm">Messages</div>
            {friends.map((f) => {
              const u = allUsers.find((x) => x.email === f);
              return <div key={f} onClick={() => setSelectedChat(f)} className="flex gap-3 p-3 border-b cursor-pointer"><div className="w-10 h-10 rounded-full bg-[#ffeaa7] flex items-center justify-center font-black">{u?.name[0]}</div><p className="font-bold text-sm">{u?.name}</p></div>;
            })}
          </div>
        )}
      </div>
    </main>
  );
              }
