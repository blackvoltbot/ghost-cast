"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Monitor, Mic, MicOff, LogOut, ShieldCheck } from "lucide-react";
import { Terminal } from "@/components/Terminal";

export default function UserRoomView() {
  const { id } = useParams();
  const router = useRouter();
  const [sharing, setSharing] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [logs, setLogs] = useState(["ESTABLISHING HANDSHAKE...", `ROOM_ID: ${id}`, "WAITING FOR OPERATOR COMMANDS..."]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startSharing = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true,
        audio: true 
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setSharing(true);
      setLogs(prev => [...prev, "SUCCESS: SCREEN_CAPTURE_ACTIVE", "TRANSMITTING TO REMOTE TERMINAL..."]);
      
      stream.getVideoTracks()[0].onended = () => stopSharing();
    } catch (err) {
      setLogs(prev => [...prev, "ERROR: ACCESS_DENIED", "USER REFUSED PERMISSIONS."]);
    }
  };

  const stopSharing = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    setSharing(false);
    setLogs(prev => [...prev, "SCREEN_TRANSMISSION_TERMINATED."]);
  };

  const toggleMic = async () => {
    if (!micOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicOn(true);
        setLogs(prev => [...prev, "AUDIO_BRIDGE_ACTIVE."]);
      } catch (err) {
        setLogs(prev => [...prev, "ERROR: MIC_ACCESS_DENIED."]);
      }
    } else {
      setMicOn(false);
      setLogs(prev => [...prev, "AUDIO_BRIDGE_SUSPENDED."]);
    }
  };

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0909] text-white p-4 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <div className="space-y-2">
          <div className="flex justify-center">
            <div className="bg-primary/10 border border-primary/30 p-4 rounded-full mb-4">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase font-headline">
            Secure Support <span className="text-primary">Session</span>
          </h1>
          <p className="text-muted-foreground text-sm font-body">You are connected to GhostCast Node: <span className="text-primary font-code">{id}</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            onClick={sharing ? stopSharing : startSharing}
            className={`h-32 rounded-none border border-primary/20 flex flex-col gap-4 text-xs font-bold tracking-widest uppercase transition-all
              ${sharing ? 'bg-primary text-white' : 'bg-black hover:bg-primary/10 text-primary'}`}
          >
            <Monitor className="w-8 h-8" />
            {sharing ? 'Stop Sharing' : 'Share Screen'}
          </Button>

          <Button 
            onClick={toggleMic}
            className={`h-32 rounded-none border border-primary/20 flex flex-col gap-4 text-xs font-bold tracking-widest uppercase transition-all
              ${micOn ? 'bg-primary text-white' : 'bg-black hover:bg-primary/10 text-primary'}`}
          >
            {micOn ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8" />}
            {micOn ? 'Mic Active' : 'Toggle Audio'}
          </Button>
        </div>

        <div className="space-y-4">
           <Terminal logs={logs} className="h-48 text-left" />
           
           <Button 
             onClick={() => router.push('/')}
             variant="outline" 
             className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 rounded-none py-6 font-bold tracking-[0.2em] uppercase"
           >
             <LogOut className="w-4 h-4 mr-2" /> Disconnect Session
           </Button>
        </div>
      </div>

      <video ref={videoRef} className="hidden" autoPlay playsInline />
    </div>
  );
}
