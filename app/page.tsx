"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("Say 'My Voice is My Password'");
  const [success, setSuccess] = useState(false);

  const startVoice = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice not supported on this browser, use Chrome");
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.start();
    setListening(true);
    setText("Listening... speak now");

    rec.onresult = (e: any) => {
      const spoken = e.results[0][0].transcript.toLowerCase();
      setText(`Heard: "${spoken}"`);
      if (spoken.includes("voice") && spoken.includes("password")) {
        setSuccess(true);
        setText("✓ Voice Verified! Welcome to Seven Sisters!");
      } else {
        setText(`Heard "${spoken}" - Try again: Say "My Voice is My Password"`);
      }
      setListening(false);
    };
    rec.onerror = () => {
      setListening(false);
      setText("Could not hear, try again");
    };
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-[420px] bg-[#161616]/80 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-2xl font-bold">7</div>
        </div>

        <h1 className="text-[28px] font-bold text-center leading-tight">Seven Sisters<br/>Voice Login</h1>
        <p className="text-white/50 text-center mt-2 text-sm">Biometric Voice Authentication for Northeast India</p>

        <div className="mt-8 bg-black/50 border border-white/10 rounded-2xl p-6 text-center">
          <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center transition-all ${listening? 'bg-red-500/20 animate-pulse' : success? 'bg-green-500/20' : 'bg-white/10'}`}>
            <span className="text-3xl">{success? '✓' : listening? '🎙️' : '🔊'}</span>
          </div>
          <p className={`mt-4 text-sm ${success? 'text-green-400' : 'text-white/70'}`}>{text}</p>

          {!success? (
            <button onClick={startVoice} className="mt-6 w-full py-3 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition">
              {listening? 'Listening...' : 'Tap to Speak'}
            </button>
          ) : (
            <div className="mt-6 w-full py-3 rounded-full bg-green-500 text-black font-semibold text-center">Authenticated</div>
          )}
        </div>

        <p className="text-center text-white/30 text-xs mt-6">Secure • Fast • Your Voice is Your Password</p>
      </div>
    </main>
  );
}
