
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Terminal } from "@/components/Terminal";
import { Shield, Radio, Monitor, Zap } from "lucide-react";

export default function Home() {
  const demoLogs = [
    "INITIALIZING GHOSTCAST PROTOCOL...",
    "HANDSHAKING WITH SIGNALING BRIDGE...",
    "SECURE TUNNEL ESTABLISHED.",
    "READY FOR DEPLOYMENT."
  ];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#0D0909]">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-tighter uppercase">
            <Shield className="w-3 h-3" />
            Vercel Optimized Secure Transmission
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white font-headline leading-tight">
            GHOST<span className="text-primary">CAST</span>
          </h1>
          
          <p className="text-xl text-muted-foreground font-body max-w-md leading-relaxed">
            Ephemeral, high-performance remote support infrastructure. 
            No plugins. No latency. Pure WebRTC transmission.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-accent text-white font-bold tracking-widest text-base px-8 py-6 rounded-none">
              <Link href="/admin/login">LAUNCH TERMINAL</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-primary/50 text-primary hover:bg-primary/10 font-bold tracking-widest text-base px-8 py-6 rounded-none">
              DOCUMENTATION
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-primary/10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Radio className="w-4 h-4" />
                <span className="font-bold text-xs uppercase tracking-widest">Signaling</span>
              </div>
              <p className="text-xs text-muted-foreground">High-concurrency WebSocket bridge.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Monitor className="w-4 h-4" />
                <span className="font-bold text-xs uppercase tracking-widest">Transmission</span>
              </div>
              <p className="text-xs text-muted-foreground">Peer-to-peer screen streaming.</p>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-accent/50 rounded-sm blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <Terminal logs={demoLogs} className="h-[400px] w-full" />
        </div>
      </div>
    </main>
  );
}
