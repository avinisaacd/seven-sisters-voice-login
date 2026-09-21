"use client"
import { useState } from "react"

export default function Page() {
  const [isListening, setIsListening] = useState(false)
  const [status, setStatus] = useState("Tap mic and say: 'Open Seven Sisters'")
  const [loggedIn, setLoggedIn] = useState(false)

  const startVoice = () => {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SR) {
      setStatus("Use Chrome browser - mic not supported")
      // still allow login for demo
      setTimeout(()=>setLoggedIn(true), 1000)
      return
    }
    const rec = new SR()
    rec.lang = "en-US"
    rec.onstart = () => { setIsListening(true); setStatus("Listening... say anything!") }
    rec.onresult = (e:any) => {
      const text = e.results[0][0].transcript
      setStatus(`Heard: "${text}" - Logging in!`)
      setIsListening(false)
      setLoggedIn(true) // ANY voice will now login - no strict check
    }
    rec.onerror = (e:any) => {
      console.log(e)
      setIsListening(false)
      setStatus("Mic error - Tap again and allow microphone")
    }
    rec.onend = () => setIsListening(false)
    rec.start()
  }

  if (loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <h1 className="text-3xl font-bold">Welcome! 🎉</h1>
          <p className="text-green-600 font-bold mt-2">Voice Login Successful</p>
          <div className="grid grid-cols-2 gap-3 text-sm mt-6">
            <div className="bg-orange-100 p-3 rounded-xl">Arunachal</div>
            <div className="bg-green-100 p-3 rounded-xl">Assam</div>
            <div className="bg-blue-100 p-3 rounded-xl">Manipur</div>
            <div className="bg-yellow-100 p-3 rounded-xl">Meghalaya</div>
            <div className="bg-purple-100 p-3 rounded-xl">Mizoram</div>
            <div className="bg-pink-100 p-3 rounded-xl">Nagaland</div>
            <div className="bg-indigo-100 p-3 rounded-xl col-span-2">Tripura</div>
          </div>
          <button onClick={()=>setLoggedIn(false)} className="mt-6 w-full bg-black text-white py-3 rounded-xl">Logout</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
        <h1 className="text-2xl font-bold">Seven Sisters</h1>
        <p className="text-gray-500 mb-8">Voice Login</p>
        <button onClick={startVoice} className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center text-4xl ${isListening?'bg-red-500 animate-pulse':'bg-black'}`}>🎤</button>
        <p className="mt-6 text-sm font-bold min-h-[40px]">{status}</p>
        <p className="mt-2 text-xs text-gray-400">Say anything - it will login now</p>
        <button onClick={()=>setLoggedIn(true)} className="mt-4 text-xs underline text-gray-400">Skip voice - Click to Enter</button>
      </div>
    </div>
  )
}
