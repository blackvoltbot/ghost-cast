
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Terminal } from "@/components/Terminal";
import { Plus, Link as LinkIcon, Activity, ExternalLink, Trash2, Zap } from "lucide-react";
import Link from "next/link";
import { createSession, SupportSession } from "@/lib/session-store";

export default function AdminDashboard() {
  const [sessions, setSessions] = useState<SupportSession[]>([]);
  const [logs, setLogs] = useState(["COMMAND CENTER LOADED.", "READY FOR NEW SESSIONS."]);

  const handleCreateRoom = () => {
    const newSession = createSession();
    setSessions(prev => [newSession, ...prev]);
    setLogs(prev => [...prev, `GHOSTLINK GENERATED: ${newSession.id}`]);
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    setLogs(prev => [...prev, `SESSION REMOVED: ${id}`]);
  };

  return (
    <div className="min-h-screen bg-[#0D0909] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/20 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter uppercase font-headline">
              Command <span className="text-primary">Center</span>
            </h1>
            <p className="text-xs text-muted-foreground tracking-[0.3em] font-bold">OPERATOR_LOGGED_IN: ADMIN_ROOT</p>
          </div>
          <Button 
            onClick={handleCreateRoom}
            className="bg-primary hover:bg-accent text-white font-bold tracking-widest rounded-none h-12 px-6"
          >
            <Plus className="w-4 h-4 mr-2" /> CREATE GHOSTLINK
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase flex items-center gap-2">
              <Activity className="w-4 h-4" /> Active Nodes
            </h2>
            
            {sessions.length === 0 ? (
              <div className="border border-dashed border-primary/20 p-12 text-center text-muted-foreground font-code text-sm">
                NO ACTIVE SESSIONS. GENERATE A LINK TO BEGIN.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sessions.map((session) => (
                  <Card key={session.id} className="bg-black border-primary/20 rounded-none hacker-glow hover:border-primary/50 transition-colors">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-code text-lg text-primary font-bold">{session.id}</span>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">{session.status}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Client Gateway Link</label>
                        <div className="flex items-center gap-2 bg-primary/5 border border-primary/10 p-2 font-code text-xs text-primary/70">
                          <span className="truncate flex-1">ghostcast.app/room/{session.id}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-primary">
                            <LinkIcon className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <Button asChild size="sm" className="flex-1 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 rounded-none text-xs font-bold tracking-widest">
                          <Link href={`/admin/room/${session.id}`}>
                            <ExternalLink className="w-3 h-3 mr-2" /> MONITOR
                          </Link>
                        </Button>
                        <Button 
                          onClick={() => deleteSession(session.id)}
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:bg-destructive/10 rounded-none"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase flex items-center gap-2">
              <Zap className="w-4 h-4" /> System Logs
            </h2>
            <Terminal logs={logs} className="h-[500px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
