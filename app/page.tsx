"use client";
import { useState } from "react";

export default function Page() {
  const [view, setView] = useState("login"); // login, signup, interior
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const states = [
    { name: "Arunachal", color: "bg-orange-100" },
    { name: "Assam", color: "bg-green-100" },
    { name: "Manipur", color: "bg-blue-100" },
    { name: "Meghalaya", color: "bg-yellow-100" },
    { name: "Mizoram", color: "bg-purple-100" },
    { name: "Nagaland", color: "bg-pink-100" },
    { name: "Tripura", color: "bg-indigo-100" },
  ];

  const handleLogin = (e: any) => {
    e.preventDefault();
    if(email && password) setView("interior");
  };

  if (view === "interior") {
    return (
      <main className="min-h-screen flex items-center justify-center p-4" style={{background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}}>
        <div className="bg-white rounded-[28px] p-8 w-full max-w-[350px] shadow-2xl text-center">
          <h1 className="text-3xl font-bold mb-1">Welcome! 🎉</h1>
          <p className="text-gray-500 text-sm mb-1">{email}</p>
          <p className="text-green-600 font-semibold mb-6">Login Successful</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {states.map((s) => (
              <div key={s.name} className={`${s.color} rounded-2xl p-4 font-medium text-black ${s.name === "Tripura"? "col-span-2" : ""}`}>
                {s.name}
              </div>
            ))}
          </div>
          <button onClick={()=>setView("login")} className="w-full bg-black text-white rounded-xl py-3 font-semibold">Logout</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4" style={{background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}}>
      <div className="bg-white rounded-[28px] p-8 w-full max-w-[350px] shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-2">{view === "login"? "Login" : "Sign Up"}</h1>
        <p className="text-gray-400 text-center text-sm mb-6">Seven Sisters Project</p>

        <form onSubmit={handleLogin} className="space-y-4">
          {view === "signup" && (
            <input type="text" placeholder="Full Name" required className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400" />
          )}
          <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400" />
          <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400" />
          <button type="submit" className="w-full bg-black text-white rounded-xl py-3 font-semibold mt-2">
            {view === "login"? "Login" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {view === "login"? "Don't have account? " : "Already have account? "}
          <button onClick={()=>setView(view==="login"?"signup":"login")} className="text-purple-600 font-semibold">
            {view === "login"? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </main>
  );
}
