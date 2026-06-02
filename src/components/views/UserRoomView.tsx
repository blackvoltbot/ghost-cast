"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Monitor, Mic, MicOff, LogOut, ShieldCheck, AlertCircle, MonitorOff } from "lucide-react";
import { Terminal } from "@/components/Terminal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Diagnostics {
  userAgent: string;
  isSecureContext: boolean;
  mediaDevices: string;
  getDisplayMedia: string;
}

/**
 * UserRoomView - Handles the remote user's side of the session.
 * Features WebRTC screen and audio capture with detailed logging and diagnostics.
 * Now includes capability checks for mobile/incompatible browser support.
 */
export default function UserRoomView() {
  const { id } = useParams();
  const router = useRouter();
  const [sharing, setSharing] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [diagnostics, setDiagnostics] = useState<Diagnostics | null>(null);
  const [logs, setLogs] = useState(["ESTABLISHING HANDSHAKE...", `ROOM_ID: ${id}`, "WAITING FOR OPERATOR COMMANDS..."]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Gather diagnostics only on client mount
    const diag: Diagnostics = {
      userAgent: navigator.userAgent,
      isSecureContext: window.isSecureContext,
      mediaDevices: typeof navigator.mediaDevices,
      getDisplayMedia: typeof navigator.mediaDevices?.getDisplayMedia,
    };
    
    setDiagnostics(diag);
    setLogs(prev => [
      ...prev, 
      "SYSTEM_DIAG_REPORT_GENERATED",
      `UA: ${diag.userAgent}`,
      `SECURE_CONTEXT: ${diag.isSecureContext}`,
      `MEDIADEV_SUPPORT: ${diag.mediaDevices}`,
      `DISPLAY_CAP_SUPPORT: ${diag.getDisplayMedia}`
    ]);

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [id]);

  const startSharing = async () => {
    setLogs(prev => [...prev, "ACTION: SHARE_BUTTON_CLICKED"]);
    
    if (typeof window === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      const errorMsg = "CRITICAL_ERROR: getDisplayMedia is undefined in this environment.";
      setLogs(prev => [...prev, errorMsg]);
      return;
    }
    
    try {
      setLogs(prev => [...prev, "LOG: REQUESTING_SCREEN_SHARE..."]);
      
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true,
        audio: true 
      });
      
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setSharing(true);
      setLogs(prev => [...prev, "SUCCESS: CAPTURE_GRANTED", "LOG: TRANSMITTING_DATA_STREAMS..."]);
      
      stream.getVideoTracks()[0].onended = () => {
        setLogs(prev => [...prev, "LOG: SHARE_ENDED_BY_SYSTEM"]);
        stopSharing();
      };
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setLogs(prev => [...prev, "ERROR: PERMISSION_DENIED_BY_USER"]);
      } else {
        setLogs(prev => [...prev, `ERROR: ${err.message || "INITIALIZATION_FAILED"}`]);
      }
    }
  };

  const stopSharing = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setSharing(false);
    setLogs(prev => [...prev, "STATUS: TRANSMISSION_TERMINATED"]);
  };

  const toggleMic = async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices) return;

    if (!micOn) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicOn(true);
        setLogs(prev => [...prev, "STATUS: AUDIO_BRIDGE_ACTIVE"]);
      } catch (err) {
        setLogs(prev => [...prev, "ERROR: MIC_ACCESS_DENIED"]);
      }
    } else {
      setMicOn(false);
      setLogs(prev => [...prev, "STATUS: AUDIO_BRIDGE_SUSPENDED"]);
    }
  };

  if (!mounted) return null;

  const isScreenShareSupported = diagnostics?.getDisplayMedia === 'function';

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
          <p className="text-muted-foreground text-sm font-body">Connected to Node: <span className="text-primary font-code">{id}</span></p>
        </div>

        {!isScreenShareSupported && mounted && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/30 text-destructive rounded-none text-left">
            <MonitorOff className="h-4 w-4" />
            <AlertTitle className="font-black uppercase tracking-widest text-xs">Capability Error</AlertTitle>
            <AlertDescription className="text-xs font-body opacity-90">
              Screen sharing is not supported on this device. <br />
              Use Chrome or Edge on a desktop computer for full functionality.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isScreenShareSupported && (
            <Button 
              onClick={sharing ? stopSharing : startSharing}
              className={`h-32 rounded-none border border-primary/20 flex flex-col gap-4 text-xs font-bold tracking-widest uppercase transition-all shadow-md
                ${sharing ? 'bg-primary text-white border-primary shadow-primary/20' : 'bg-black hover:bg-primary/10 text-primary'}`}
            >
              <Monitor className="w-8 h-8" />
              {sharing ? 'Stop Sharing' : 'Share Screen'}
            </Button>
          )}

          <Button 
            onClick={toggleMic}
            className={`h-32 rounded-none border border-primary/20 flex flex-col gap-4 text-xs font-bold tracking-widest uppercase transition-all shadow-md
              ${micOn ? 'bg-primary text-white border-primary shadow-primary/20' : 'bg-black hover:bg-primary/10 text-primary'} ${!isScreenShareSupported ? 'md:col-span-2' : ''}`}
          >
            {micOn ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8" />}
            {micOn ? 'Mic Active' : 'Toggle Audio'}
          </Button>
        </div>

        {diagnostics && (
          <div className="p-4 bg-black border border-primary/20 rounded-sm space-y-3 text-left">
            <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] flex items-center gap-2">
              <AlertCircle className="w-3 h-3" /> Environment Diagnostics
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[9px] text-muted-foreground uppercase font-bold">Secure Context</p>
                <p className={`text-xs font-code ${diagnostics.isSecureContext ? "text-green-400" : "text-destructive"}`}>
                  {diagnostics.isSecureContext ? "VERIFIED" : "INSECURE"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] text-muted-foreground uppercase font-bold">Display Capture API</p>
                <p className={`text-xs font-code ${diagnostics.getDisplayMedia === 'function' ? "text-green-400" : "text-destructive"}`}>
                  {diagnostics.getDisplayMedia === 'function' ? "SUPPORTED" : "UNAVAILABLE"}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-primary/10">
              <p className="text-[9px] text-muted-foreground uppercase font-bold mb-1">User Agent Profile</p>
              <p className="text-[10px] font-code text-primary/60 break-all leading-tight">
                {diagnostics.userAgent}
              </p>
            </div>
          </div>
        )}

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

      <video ref={videoRef} className="hidden" autoPlay playsInline muted />
    </div>
  );
}
