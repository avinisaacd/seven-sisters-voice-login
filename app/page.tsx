"use client";
import { useState, useRef } from "react";

type Team = { id:number; name:string; desc:string; members:string[]; createdBy:string; state:string; }

export default function SevenSistersVoice() {
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("admin@test.com");
  const [activeTab, setActiveTab] = useState("teams");
  const [themeColor, setThemeColor] = useState("peach");
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDesc, setNewTeamDesc] = useState("");
  const [newTeamState, setNewTeamState] = useState("assam");
  const [selectedChat, setSelectedChat] = useState<string|null>(null);
  const [inCall, setInCall] = useState<string|null>(null);

  const themes:any = { peach:{bg:"#fff5eb",card:"#ffeaa7"}, mint:{bg:"#e8fffa",card:"#a1f0c4"}, lavender:{bg:"#f5e8ff",card:"#e2d1f9"} };
  const currentTheme = themes[themeColor];

  const [teams, setTeams] = useState<Team[]>([
    {id:1, name:"Assam Bihu Lovers", desc:"We love Bihu dance & music. Join Assam team!", members:["admin@test.com","rahul@test.com"], createdBy:"rahul@test.com", state:"assam"},
    {id:2, name:"Meghalaya Hills", desc:"Cherrapunji & Shillong explorers team", members:["priya@test.com"], createdBy:"priya@test.com", state:"meghalaya"},
    {id:3, name:"Northeast Coders", desc:"Developers from 7 sisters states - coding team", members:["admin@test.com","john@test.com","mary@test.com"], createdBy:"admin@test.com", state:"nagaland"},
  ]);

  const [friends] = useState(["john@test.com","rahul@test.com"]);

  const myTeams = teams.filter(t=> t.members.includes(email));
  const otherTeams = teams.filter(t=>!t.members.includes(email));

  const createTeam = () => {
    if(!newTeamName.trim()) return alert("Enter Team name");
    const newTeam:Team = {
      id: Date.now(),
      name: newTeamName,
      desc: newTeamDesc || "New team for Seven Sisters",
      members: [email],
      createdBy: email,
      state: newTeamState
    };
    setTeams([newTeam,...teams]);
    setNewTeamName(""); setNewTeamDesc("");
    setShowCreateTeam(false);
    alert(`Team "${newTeamName}" created! ✅`);
  };

  const joinTeam = (id:number) => {
    setTeams(teams.map(t=> t.id===id? {...t, members:[...t.members, email]} : t));
  };

  const leaveTeam = (id:number) => {
    setTeams(teams.map(t=> t.id===id? {...t, members: t.members.filter(m=>m!==email)} : t));
  };

  if(view!=="feed"){
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{background:"#fff5eb"}}>
        <div className="bg-white rounded-xl shadow p-4 w-full max-w-[400px]">
          <h1 className="text-3xl font-black text-center mb-2">Seven Sisters Voice</h1>
          <p className="text-center text-xs mb-4 text-gray-500">Teams instead of Groups - For Northeast</p>
          <form onSubmit={e=>{e.preventDefault(); setView("feed");}} className="space-y-3">
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-lg px-4 py-3" />
            <button className="w-full bg-[#ffeaa7] font-bold py-3 rounded-lg border">Log in - Team Added</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-20" style={{background:currentTheme.bg}}>
      <div className="sticky top-0 z-40 bg-white shadow px-3 py-2 flex justify-between items-center">
        <h1 className="font-black text-[13px]">Seven Sisters Voice • Teams</h1>
        <div className="flex gap-1">
          <button onClick={()=>setActiveTab("home")} className={`px-3 py-2 rounded-full text-[10px] font-bold ${activeTab==="home"?"bg-black text-white":"bg-[#ffeaa7]"}`}>Home</button>
          <button onClick={()=>setActiveTab("teams")} className={`px-3 py-2 rounded-full text-[10px] font-bold ${activeTab==="teams"?"bg-black text-white":"bg-[#ffeaa7] border-2 border-black"}`}>👥 Teams</button>
          <button onClick={()=>setActiveTab("chat")} className={`px-2 py-2 rounded-full text-[10px] font-bold ${activeTab==="chat"?"bg-black text-white":"bg-[#ffeaa7]"}`}>Chat 📹</button>
          <button onClick={()=>setView("login")} className="px-2 py-2 rounded-full text-[10px] bg-gray-100">Logout</button>
        </div>
      </div>

      <div className="max-w-[500px] mx-auto p-2 pt-3 space-y-3">
        {activeTab==="teams" && <>
          <div className="bg-black text-white rounded-[18px] p-4 flex justify-between items-center">
            <div><p className="font-black text-[14px]">👥 My Teams ({myTeams.length})</p><p className="text-[10px] text-white/60 mt-1">Instead of Groups - We call it Teams for 7 Sisters</p></div>
            <button onClick={()=>setShowCreateTeam(true)} className="bg-[#ffeaa7] text-black px-4 py-2 rounded-full text-[11px] font-black">+ Create Team</button>
          </div>

          <div className="bg-white rounded-2xl border overflow-hidden">
            <div className="p-3 border-b font-black text-sm bg-[#fff9f0]">My Teams - Joined ✅</div>
            {myTeams.length>0? myTeams.map(team=>(
              <div key={team.id} className="p-4 border-b last:border-0 hover:bg-[#fff9f0]">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center font-black text-lg">{team.name[0]}</div>
                    <div>
                      <p className="font-black text-[13px]">{team.name}</p>
                      <p className="text-[10px] text-gray-500 capitalize">{team.state} • {team.members.length} members • Team</p>
                      <p className="text-[11px] mt-1 leading-4">{team.desc}</p>
                    </div>
                  </div>
                  <button onClick={()=>leaveTeam(team.id)} className="text-[10px] bg-gray-100 px-3 py-1 rounded-full font-bold">Leave</button>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 bg-[#ffeaa7] py-2 rounded-full text-[11px] font-bold border">💬 Team Chat</button>
                  <button className="flex-1 bg-black text-white py-2 rounded-full text-[11px] font-bold">📹 Team Call</button>
                </div>
              </div>
            )) : <p className="p-6 text-center text-xs text-gray-400">No teams yet - Create or Join a Team!</p>}
          </div>

          <div className="bg-white rounded-2xl border overflow-hidden">
            <div className="p-3 border-b font-black text-sm flex justify-between"><span>Discover Teams - 7 Sisters</span><span className="text-[10px] bg-[#ffeaa7] px-2 py-1 rounded-full border">{otherTeams.length} teams</span></div>
            {otherTeams.map(team=>(
              <div key={team.id} className="p-4 border-b last:border-0 hover:bg-[#fff9f0]">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#ffeaa7] flex items-center justify-center font-black text-lg border">{team.name[0]}</div>
                  <div className="flex-1">
                    <p className="font-black text-[13px]">{team.name}</p>
                    <p className="text-[10px] text-gray-500 capitalize">{team.state.toUpperCase()} • {team.members.length} members • Created by {team.createdBy.split("@")[0]}</p>
                    <p className="text-[11px] mt-1">{team.desc}</p>
                    <button onClick={()=>joinTeam(team.id)} className="mt-2 bg-black text-white px-5 py-1.5 rounded-full text-[11px] font-bold">+ Join Team</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>}

        {activeTab==="home" && <div className="bg-white rounded-2xl p-8 text-center border"><p className="font-black">Home</p><button onClick={()=>setActiveTab("teams")} className="mt-3 bg-black text-white px-6 py-2 rounded-full text-xs">Go to Teams 👥</button></div>}
        {activeTab==="chat" && <div className="bg-white rounded-2xl p-8 text-center border"><p className="font-black">Chat + Video call already added!</p></div>}
      </div>

      {showCreateTeam && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[380px] p-5 space-y-4">
            <div className="flex justify-between items-center"><h2 className="font-black text-sm">Create New Team 👥</h2><button onClick={()=>setShowCreateTeam(false)} className="w-8 h-8 bg-gray-100 rounded-full font-bold">X</button></div>
            <p className="text-[11px] text-gray-500 bg-[#fff9f0] p-2 rounded-lg border">Instead of Facebook Group, we make <b>Team</b> - For collaboration of Northeast people</p>
            <input value={newTeamName} onChange={e=>setNewTeamName(e.target.value)} placeholder="Team Name - ex: Assam Coders Team" className="w-full border rounded-xl px-4 py-3 text-sm focus:border-black outline-none"/>
            <textarea value={newTeamDesc} onChange={e=>setNewTeamDesc(e.target.value)} placeholder="Team Description - What is this team for?" className="w-full border rounded-xl px-4 py-3 text-sm h-20 focus:border-black outline-none"/>
            <select value={newTeamState} onChange={e=>setNewTeamState(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-sm">
              <option value="assam">Assam Team</option><option value="meghalaya">Meghalaya Team</option><option value="nagaland">Nagaland Team</option><option value="mizoram">Mizoram Team</option><option value="manipur">Manipur Team</option><option value="arunachal">Arunachal Team</option><option value="tripura">Tripura Team</option>
            </select>
            <div className="flex gap-2">
              <button onClick={()=>setShowCreateTeam(false)} className="flex-1 bg-gray-100 py-3 rounded-full font-bold text-sm">Cancel</button>
              <button onClick={createTeam} className="flex-1 bg-[#ffeaa7] py-3 rounded-full font-black text-sm border-2 border-black">Create Team ✅</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
