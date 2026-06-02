
"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TerminalProps {
  title?: string;
  logs: string[];
  className?: string;
}

export function Terminal({ title = "GHOST_CONSOLE_v1.0.4", logs, className }: TerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [timestamps, setTimestamps] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Generate or update timestamps only on the client to avoid hydration mismatch
  useEffect(() => {
    if (mounted) {
      const now = new Date().toLocaleTimeString([], { hour12: false });
      setTimestamps(prev => {
        const next = [...prev];
        while (next.length < logs.length) {
          next.push(now);
        }
        return next;
      });
    }
  }, [logs, mounted]);

  return (
    <div className={cn("flex flex-col bg-black border border-primary/30 rounded-sm overflow-hidden hacker-glow", className)}>
      <div className="flex items-center justify-between px-3 py-1.5 bg-primary/10 border-b border-primary/20">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
            <div className="w-2 h-2 rounded-full bg-green-500/50" />
          </div>
          <span className="text-[10px] font-code uppercase tracking-widest text-primary/80 font-bold">{title}</span>
        </div>
        <div className="text-[10px] text-muted-foreground font-code">STATUS: ACTIVE</div>
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 p-4 font-code text-xs text-primary/90 terminal-scroll overflow-y-auto space-y-1 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"
      >
        {logs.map((log, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-primary/40 shrink-0">
              [{mounted ? (timestamps[i] || "--:--:--") : "--:--:--"}]
            </span>
            <span className={cn(
              "break-all",
              log.toLowerCase().includes('error') ? 'text-destructive' : 
              log.toLowerCase().includes('success') ? 'text-green-400' : ''
            )}>
              {log}
            </span>
          </div>
        ))}
        <div className="animate-pulse">_</div>
      </div>
    </div>
  );
}
