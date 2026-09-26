import { LockKeyhole } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export function AdminAuthGate({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [authenticated, setAuthenticated] = useState(!isSupabaseConfigured);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setAuthenticated(Boolean(data.session));
      setLoading(false);
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setAuthenticated(Boolean(session));
      setLoading(false);
    });
    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function signIn(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setError("");
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-surface"><div className="text-center"><div className="mx-auto size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /><p className="mt-3 text-sm text-muted-foreground">Checking staff session…</p></div></div>;
  }

  if (!authenticated && isSupabaseConfigured) {
    return <div className="grid min-h-screen place-items-center bg-ink p-4"><form onSubmit={signIn} className="w-full max-w-sm rounded-2xl bg-background p-7 shadow-2xl"><span className="grid size-11 place-items-center rounded-xl bg-ink text-gold"><LockKeyhole size={19} /></span><h1 className="mt-4 text-3xl font-black">Broker sign in</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Use an authorized Royal Keys staff account. Roles are enforced by database RLS policies.</p><div className="mt-6 grid gap-4"><label className="text-sm font-bold">Email<input className="field mt-1.5" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label><label className="text-sm font-bold">Password<input className="field mt-1.5" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>{error ? <p className="rounded-lg bg-destructive/10 p-3 text-xs font-semibold text-destructive">{error}</p> : null}<button className="btn-primary" type="submit">Sign in</button></div></form></div>;
  }

  return <>{children}</>;
}
