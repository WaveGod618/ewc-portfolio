import { loginAction } from "@/lib/actions";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function LoginForm({
  nextPath,
  disabled,
}: {
  nextPath?: string;
  disabled?: boolean;
}) {
  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <div>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>
            Sign in with your Supabase admin credentials to manage trades, settings, and snapshots.
          </CardDescription>
        </div>
      </CardHeader>
      <form action={loginAction} className="space-y-4">
        <input name="next" type="hidden" value={nextPath ?? "/admin"} />
        <fieldset className="space-y-4" disabled={disabled}>
          <div>
            <label className="mb-2 block text-sm text-muted-foreground">Email</label>
            <Input autoComplete="email" name="email" required type="email" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-muted-foreground">Password</label>
            <Input autoComplete="current-password" name="password" required type="password" />
          </div>
        </fieldset>
        <SubmitButton disabled={disabled} pendingLabel="Signing in...">
          Sign in
        </SubmitButton>
      </form>
    </Card>
  );
}
