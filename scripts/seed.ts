import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

import { sampleSettings, sampleSnapshots, sampleTrades } from "@/lib/sample-data";

config({ path: ".env.local" });

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local.",
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { error: settingsError } = await supabase
    .from("settings")
    .upsert(sampleSettings, { onConflict: "id" });

  if (settingsError) {
    throw settingsError;
  }

  const { error: tradesError } = await supabase
    .from("trades")
    .upsert(sampleTrades, { onConflict: "id" });

  if (tradesError) {
    throw tradesError;
  }

  const { error: snapshotsError } = await supabase
    .from("equity_snapshots")
    .upsert(sampleSnapshots, { onConflict: "id" });

  if (snapshotsError) {
    throw snapshotsError;
  }

  console.log("Seed complete.");
  console.log(`Settings: 1 row upserted`);
  console.log(`Trades: ${sampleTrades.length} rows upserted`);
  console.log(`Equity snapshots: ${sampleSnapshots.length} rows upserted`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
