import Link from "next/link";

import { Button, buttonStyles } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function TradeFilters({
  action,
  ticker,
  direction,
}: {
  action: string;
  ticker?: string;
  direction?: string;
}) {
  return (
    <form action={action} className="grid gap-3 md:grid-cols-[minmax(0,1fr)_170px_auto_auto]">
      <Input defaultValue={ticker} name="ticker" placeholder="Search ticker" />
      <Select defaultValue={direction ?? "all"} name="direction">
        <option value="all">All directions</option>
        <option value="long">Long</option>
        <option value="short">Short</option>
      </Select>
      <Button size="sm" type="submit" variant="secondary">
        Filter
      </Button>
      <Link className={buttonStyles({ variant: "ghost", size: "sm" })} href={action}>
        Reset
      </Link>
    </form>
  );
}
