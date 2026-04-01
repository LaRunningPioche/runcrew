const fs = require("fs");
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY env vars");
  process.exit(1);
}
fs.writeFileSync("js/config.js", `export const SURL = "${url}";\nexport const SKEY = "${key}";\n`);
console.log("js/config.js generated");
