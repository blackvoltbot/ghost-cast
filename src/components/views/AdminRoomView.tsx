"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Terminal } from "@/components/Terminal";
import { Monitor, Info, ChevronLeft, Zap, Sparkles } from "lucide-react";
import { adminIssueDiagnosis, AdminIssueDiagnosisOutput } from "@/ai/flows/admin-issue-diagnosis";

export default function AdminRoomView() {
  const { id } = useParams();
  const router = useRouter();
  const [logs, setLogs] = useState(["OPERATOR CONNECTED.", "LISTENING FOR SCREEN DATA...", "SIGNALING STRENGTH: 98%"]);
  const [diagnosis, setDiagnosis] = useState<AdminIssueDiagnosisOutput | null>(null);
  const [diagnosing, setDiagnosing] = useState(false);

  const runDiagnosis = async () => {
    setDiagnosing(true);
    setLogs(prev => [...prev, "AI AGENT ENGAGED.", "ANALYZING SESSION METADATA..."]);
    
    try {
      const result = await adminIssueDiagnosis({
        sessionMetadata: JSON.stringify({
          browser: "Chrome 120",
          os: "macOS 14.1",
          connection: "WebRTC/UDP",
          latency: "45ms"
        }),
        consoleLogs: logs.join("\n")
      });
      setDiagnosis(result);
      setLogs(prev => [...prev, "SUCCESS: DIAGNOSIS COMPLETE."]);
    } catch (err) {
      setLogs(prev => [...prev, "ERROR: AI AGENT FAILED TO PROCESS DATA."]);
    } finally {
      setDiagnosing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0909] text-white flex flex-col">
      <header className="flex items-center justify-between p-4 border-b border-primary/20 bg-black">
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-primary hover:bg-primary/10 rounded-none p-2" onClick={() => router.back()}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="space-y-0.5">
            <h1 className="text-lg font-black tracking-tighter uppercase font-headline">
              Monitor <span className="text-primary">Node::{id}</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live Feed</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-6 px-6 border-x border-primary/10 h-10">
            <div className="text-center">
              <p className="text-[9px] text-muted-foreground uppercase font-bold">Latency</p>
              <p className="text-xs font-code text-primary">42ms</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] text-muted-foreground uppercase font-bold">FPS</p>
              <p className="text-xs font-code text-primary">60</p>
            </div>
          </div>
          <Button 
            onClick={runDiagnosis}
            disabled={diagnosing}
            className="bg-primary hover:bg-accent text-white font-bold tracking-widest rounded-none text-xs"
          >
            <Sparkles className="w-4 h-4 mr-2" /> {diagnosing ? "ANALYZING..." : "RUN AI DIAGNOSIS"}
          </Button>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 overflow-hidden">
        <div className="lg:col-span-3 bg-black flex items-center justify-center p-8 relative overflow-hidden">
           <div className="w-full max-w-5xl aspect-video border border-primary/30 relative overflow-hidden group hacker-glow">
              <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/ghostcast-1/1280/720')] bg-cover bg-center opacity-40 grayscale" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                <Monitor className="w-16 h-16 text-primary animate-pulse" />
                <p className="text-primary font-code text-lg tracking-widest font-bold">WAITING FOR USER STREAM...</p>
              </div>

              <div className="absolute top-4 left-4 flex gap-2">
                <div className="bg-black/80 px-2 py-1 border border-primary/30 text-[10px] font-code text-primary">REC ●</div>
                <div className="bg-black/80 px-2 py-1 border border-primary/30 text-[10px] font-code text-primary">ENCRYPTED</div>
              </div>
           </div>
        </div>

        <aside className="border-l border-primary/20 bg-[#0D0909] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-primary/10 bg-primary/5">
             <h2 className="text-xs font-bold tracking-widest uppercase flex items-center gap-2 text-primary">
               <Zap className="w-3 h-3" /> Console Output
             </h2>
          </div>
          <Terminal logs={logs} className="flex-1 border-none rounded-none" />
          
          <div className="p-4 border-t border-primary/20 bg-black h-[300px] overflow-y-auto custom-scroll">
            <h2 className="text-xs font-bold tracking-widest uppercase flex items-center gap-2 text-primary mb-4">
               <Sparkles className="w-3 h-3" /> AI Diagnostics
             </h2>
             
             {!diagnosis ? (
               <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                 <Info className="w-8 h-8 text-primary/40" />
                 <p className="text-[10px] font-code uppercase px-4 leading-relaxed">System metadata ready for analysis. Click the diagnosis button to begin.</p>
               </div>
             ) : (
               <div className="space-y-6">
                 <div className="space-y-2">
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Detected Issue</p>
                   <p className="text-xs font-code bg-primary/10 border border-primary/20 p-3 text-primary">{diagnosis.summary}</p>
                 </div>
                 <div className="space-y-3">
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Actionable Fixes</p>
                   <ul className="space-y-2">
                     {diagnosis.suggestions.map((s, i) => (
                       <li key={i} className="flex gap-2 text-[10px] font-code text-muted-foreground border-l border-primary/40 pl-3">
                         <span className="text-primary font-bold">{i+1}.</span>
                         {s}
                       </li>
                     ))}
                   </ul>
                 </div>
               </div>
             )}
          </div>
        </aside>
      </main>

      <footer className="h-14 border-t border-primary/20 bg-black flex items-center px-4 justify-between">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-primary" />
               <span className="text-[10px] font-bold text-primary uppercase">Audio: Standby</span>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="rounded-none border-primary/30 text-primary hover:bg-primary/10 text-[10px] font-bold tracking-widest">
               SNAPSHOT
            </Button>
            <Button size="sm" variant="outline" className="rounded-none border-primary/30 text-primary hover:bg-primary/10 text-[10px] font-bold tracking-widest">
               INVITE
            </Button>
            <Button size="sm" className="bg-destructive hover:bg-destructive/80 text-white rounded-none text-[10px] font-bold tracking-widest">
               TERMINATE
            </Button>
         </div>
      </footer>
    </div>
  );
}
