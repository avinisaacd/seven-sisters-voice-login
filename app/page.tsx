export default function Page() {
  const states = [
    { name: "Arunachal", color: "bg-orange-100" },
    { name: "Assam", color: "bg-green-100" },
    { name: "Manipur", color: "bg-blue-100" },
    { name: "Meghalaya", color: "bg-yellow-100" },
    { name: "Mizoram", color: "bg-purple-100" },
    { name: "Nagaland", color: "bg-pink-100" },
    { name: "Tripura", color: "bg-indigo-100" },
  ];

  return (
    <main className="min-h-screen flex items-center justify-center p-4" style={{background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}}>
      <div className="bg-white rounded-[28px] p-8 w-full max-w-[350px] shadow-2xl text-center">
        <h1 className="text-3xl font-bold mb-2">Welcome! 🎉</h1>
        <p className="text-green-600 font-semibold mb-6">Login Successful</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {states.map((s) => (
            <div
              key={s.name}
              className={`${s.color} rounded-2xl p-4 font-medium text-black ${s.name === "Tripura"? "col-span-2" : ""}`}
            >
              {s.name}
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400">
          seven-sisters-voice-login
        </p>
      </div>
    </main>
  );
}
