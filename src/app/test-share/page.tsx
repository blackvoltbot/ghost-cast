"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "@/components/Terminal";
import { Monitor, AlertCircle, CheckCircle2, XCircle, ShieldCheck, HelpCircle } from "lucide-react";

/**
 * Screen Share Test Page
 * Enhanced with device compatibility and mobile support information.
 */
export default function TestSharePage() {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState("");
  const [logs, setLogs] = useState<string[]>(["DIAGNOSTIC_READY", "WAITING FOR USER INITIATION..."]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [diagnostics, setDiagnostics] = useState({
    userAgent: "Loading...",
    mediaDevices: "undefined",
    getDisplayMedia: "undefined",
    isSecureContext: false,
  });

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setDiagnostics({
        userAgent: navigator.userAgent,
        mediaDevices: typeof navigator.mediaDevices,
        getDisplayMedia: typeof navigator.mediaDevices?.getDisplayMedia,
        isSecureContext: window.isSecureContext,
      });
    }
  }, []);

  const handleTest = async () => {
    setStatus('idle');
    setErrorMessage("");
    setLogs(prev => [...prev, "ACTION: TEST_SCREEN_SHARE_CLICKED"]);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      const err = "navigator.mediaDevices.getDisplayMedia is not available.";
      setStatus('failed');
      setErrorMessage(err);
      setLogs(prev => [...prev, `CRITICAL: ${err}`]);
      return;
    }

    try {
      setLogs(prev => [...prev, "LOG: REQUESTING_CAPTURE_PICKER..."]);
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setStatus('success');
      setLogs(prev => [...prev, "SUCCESS: SCREEN_SHARE_GRANTED", "LOG: ATTACHING_STREAM_TO_VIEWPORT"]);

      stream.getVideoTracks()[0].onended = () => {
        setLogs(prev => [...prev, "LOG: STREAM_ENDED_BY_SYSTEM"]);
        stopTest();
      };
    } catch (error: any) {
      console.error(error);
      setStatus('failed');
      const msg = error.message || error.name || "Unknown Error";
      setErrorMessage(msg);
      setLogs(prev => [...prev, `ERROR: ${msg}`]);
    }
  };

  const stopTest = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setStatus('idle');
    setLogs(prev => [...prev, "STATUS: TEST_RESET"]);
  };

  if (!mounted) return <div className="min-h-screen bg-[#0D0909]" />;

  return (
    <div className="min-h-screen bg-[#0D0909] text-white p-6 flex items-center justify-center font-body">
      <div className="max-w-4xl w-full space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-tighter uppercase font-headline">
            System <span className="text-primary">Validator</span>
          </h1>
          <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">WebRTC Interface Test Bench</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="bg-black border-primary/20 rounded-none hacker-glow">
              <CardHeader className="border-b border-primary/10">
                <CardTitle className="text-sm font-bold tracking-widest text-primary uppercase flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Environment
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Secure Context</p>
                    <p className={`text-xs font-code ${diagnostics.isSecureContext ? "text-green-400" : "text-destructive"}`}>
                      {diagnostics.isSecureContext ? "VERIFIED" : "INSECURE"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Media Devices</p>
                    <p className="text-xs font-code text-primary/80">{diagnostics.mediaDevices}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Display API</p>
                    <p className="text-xs font-code text-primary/80">{diagnostics.getDisplayMedia}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-primary/10">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">User Agent</p>
                  <p className="text-[10px] font-code text-primary/50 break-all leading-tight">
                    {diagnostics.userAgent}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black border-primary/20 rounded-none">
              <CardHeader className="border-b border-primary/10">
                <CardTitle className="text-sm font-bold tracking-widest text-primary uppercase flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" /> Compatibility
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Supported Platforms</p>
                  <ul className="text-xs space-y-1 font-body">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-400" /> Windows (Chrome, Edge, Firefox)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-400" /> macOS (Chrome, Edge, Safari 13+)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-400" /> Linux (Chrome, Firefox)</li>
                  </ul>
                </div>
                <div className="space-y-2 pt-2 border-t border-primary/10">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Mobile Support</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Most mobile browsers (iOS Safari, Android Chrome) do not support the <code className="text-primary">getDisplayMedia</code> API for screen sharing. Audio-only capture is typically available via <code className="text-primary">getUserMedia</code>.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={handleTest}
              className="w-full h-24 bg-primary hover:bg-accent text-white font-black tracking-widest text-lg rounded-none shadow-lg shadow-primary/20"
            >
              <Monitor className="w-6 h-6 mr-3" /> TEST SCREEN SHARE
            </Button>

            {status === 'success' && (
              <Alert className="bg-green-500/10 border-green-500/50 text-green-400 rounded-none">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle className="font-black uppercase tracking-widest">SCREEN SHARE SUCCESS</AlertTitle>
                <AlertDescription className="text-xs">
                  The capture session has been established successfully.
                </AlertDescription>
              </Alert>
            )}

            {status === 'failed' && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/50 text-destructive rounded-none">
                <XCircle className="h-4 w-4" />
                <AlertTitle className="font-black uppercase tracking-widest">SCREEN SHARE FAILED</AlertTitle>
                <AlertDescription className="text-xs font-code">
                  ERROR_CODE: {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            <Terminal logs={logs} className="h-48 border-primary/20" />
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-primary/20 rounded-none blur opacity-25" />
          <div className="relative bg-black border border-primary/30 aspect-video overflow-hidden">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className={status === 'success' ? "w-full h-full object-contain" : "hidden"} 
            />
            {status !== 'success' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 opacity-30">
                <Monitor className="w-16 h-16 text-primary" />
                <p className="text-primary font-code text-sm tracking-widest font-bold">PREVIEW_WINDOW::STANDBY</p>
              </div>
            )}
            <div className="absolute top-4 left-4 flex gap-2">
               <div className="bg-black/80 px-2 py-1 border border-primary/30 text-[10px] font-code text-primary">TEST_VIEW</div>
               {status === 'success' && <div className="bg-primary/20 px-2 py-1 border border-primary text-[10px] font-code text-primary animate-pulse">LIVE ●</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
