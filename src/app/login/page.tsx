import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const nextPath = params.next ?? "/admin";

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/admin");
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-card/90 px-6 py-8 shadow-panel sm:px-8">
        <Badge variant="info">Admin access</Badge>
        <h1 className="font-heading mt-4 text-4xl font-semibold tracking-tight text-foreground">
          Manage the model portfolio
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
          Use your Supabase-authenticated admin account to log trades, close positions, update
          settings, and maintain manual equity snapshots.
        </p>
      </section>

      {!isSupabaseConfigured() ? (
        <Card className="mx-auto max-w-xl">
          <h2 className="text-xl font-semibold text-foreground">Supabase setup required</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Add the environment variables from `.env.local.example` to enable protected admin
            authentication and data mutations.
          </p>
        </Card>
      ) : null}

      {params.error ? (
        <Card className="mx-auto max-w-xl border-red-500/20 bg-red-500/10">
          <p className="text-sm text-red-200">{params.error}</p>
        </Card>
      ) : null}

      {isSupabaseConfigured() ? <LoginForm nextPath={nextPath} /> : null}
    </div>
  );
}
