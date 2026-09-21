"use client"
import { useState, useEffect } from "react"

export default function Page() {
  const [isListening, setIsListening] = useState(false)
  const [status, setStatus] = useState("Tap mic and say: 'Open Seven Sisters'")
  const [loggedIn, setLoggedIn] = useState(false)

  const startVoice = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SpeechRecognition) {
      setStatus("Voice not supported in this browser. Use Chrome.")
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = "en-IN"
    recognition.onstart = () => {
      setIsListening(true)
      setStatus("Listening...")
    }
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript.toLowerCase()
      setStatus(`You said: "${text}"`)
      if (text.includes("seven") || text.includes("open") || text.includes("sister")) {
        setLoggedIn(true)
        setStatus("Welcome to Seven Sisters!")
      } else {
        setStatus(`Did not hear 'Seven Sisters'. You said: ${text}. Try again.`)
      }
      setIsListening(false)
    }
    recognition.onerror = () => {
      setIsListening(false)
      setStatus("Error. Try again.")
    }
    recognition.onend = () => setIsListening(false)
    recognition.start()
  }

  if (loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <h1 className="text-3xl font-bold mb-2">Welcome! 🎉</h1>
          <p className="text-gray-600 mb-6">Seven Sisters Voice Login Successful</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-orange-100 p-3 rounded-xl">Arunachal Pradesh</div>
            <div className="bg-green-100 p-3 rounded-xl">Assam</div>
            <div className="bg-blue-100 p-3 rounded-xl">Manipur</div>
            <div className="bg-yellow-100 p-3 rounded-xl">Meghalaya</div>
            <div className="bg-purple-100 p-3 rounded-xl">Mizoram</div>
            <div className="bg-pink-100 p-3 rounded-xl">Nagaland</div>
            <div className="bg-indigo-100 p-3 rounded-xl col-span-2">Tripura + Sikkim</div>
          </div>
          <button onClick={()=>setLoggedIn(false)} className="mt-6 w-full bg-black text-white py-3 rounded-xl">Logout</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
        <h1 className="text-2xl font-bold">Seven Sisters</h1>
        <p className="text-gray-500 mb-8">Voice Login</p>

        <button
          onClick={startVoice}
          className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center text-4xl transition-all ${isListening? 'bg-red-500 animate-pulse' : 'bg-black hover:scale-105'}`}
        >
          🎤
        </button>

        <p className="mt-6 text-sm font-medium min-h-[40px]">{status}</p>
        <p className="mt-4 text-xs text-gray-400">Say: "Open Seven Sisters"</p>
      </div>
    </div>
  )
}
