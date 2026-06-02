
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Terminal } from "@/components/Terminal";
import { ShieldAlert, Fingerprint } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState(["WAITING FOR AUTHENTICATION..."]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLogs(prev => [...prev, "VERIFYING CREDENTIALS...", "ACCESSING ENCRYPTED VOLUME..."]);
    
    // Simulate auth
    setTimeout(() => {
      setLogs(prev => [...prev, "AUTHENTICATION SUCCESSFUL.", "REDIRECTING TO COMMAND CENTER..."]);
      setTimeout(() => router.push("/admin/dashboard"), 1000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0909] p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white font-headline">
            ADMIN <span className="text-primary">TERMINAL</span>
          </h1>
          <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">Secure Access Required</p>
        </div>

        <Card className="bg-black border-primary/30 rounded-none hacker-glow">
          <CardHeader className="space-y-1 border-b border-primary/10">
            <CardTitle className="text-sm font-bold tracking-widest text-primary uppercase flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              Auth Gateway
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Operator ID</label>
                <Input 
                  type="text" 
                  placeholder="admin_root"
                  required
                  className="bg-primary/5 border-primary/20 rounded-none font-code text-primary placeholder:text-primary/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Access Key</label>
                <Input 
                  type="password" 
                  placeholder="••••••••"
                  required
                  className="bg-primary/5 border-primary/20 rounded-none font-code text-primary placeholder:text-primary/20"
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary hover:bg-accent text-white font-bold tracking-widest py-6 rounded-none flex items-center gap-2"
              >
                {loading ? "INITIALIZING..." : <><Fingerprint className="w-4 h-4" /> AUTHORIZE SESSION</>}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="bg-primary/5 flex flex-col p-0">
            <Terminal logs={logs} className="w-full border-none h-32 rounded-none" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
