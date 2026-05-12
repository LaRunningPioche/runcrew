import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function sendEmail(to: { email: string; name: string }[], subject: string, html: string) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: { name: "RunCrew", email: "paul.pelletier18@gmail.com" },
      to,
      subject,
      htmlContent: html,
    }),
  });
  console.log("Brevo", res.status, subject);
}

async function sendNotifications(run: any) {
  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: groupRow } = await sb.from("groups").select("name, creator_id").eq("id", run.group_id).single();
  const groupName = groupRow?.name ?? "votre groupe";

  const { data: members } = await sb
    .from("memberships")
    .select("member_id")
    .eq("group_id", run.group_id)
    .eq("status", "approved");

  const { data: { users } } = await sb.auth.admin.listUsers({ perPage: 1000 });
  const emailMap = new Map<string, string>(users.map((u: any) => [u.id as string, u.email as string]));

  const runDate = new Date(run.date).toLocaleDateString("fr-CA", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const details = [
    `📅 ${runDate} à ${run.time}`,
    run.location ? `📍 ${run.location}` : null,
    run.distance_km ? `📏 ${run.distance_km} km` : null,
    run.description ? `💬 ${run.description}` : null,
  ].filter(Boolean).join("<br>");

  // Confirmation au créateur
  const creatorEmail = emailMap.get(run.creator_id);
  if (creatorEmail) {
    await sendEmail(
      [{ email: creatorEmail, name: run.creator_name }],
      `Ta sortie a bien été publiée dans ${groupName} !`,
      `<p>Salut ${run.creator_name} 👋</p>
       <p>Ta sortie a bien été publiée et les membres de <strong>${groupName}</strong> ont été notifiés.</p>
       <p>${details}</p>`
    );
  }

  // IDs des membres à notifier (sauf le créateur du run)
  const ids = new Set<string>();
  if (groupRow && groupRow.creator_id !== run.creator_id) ids.add(groupRow.creator_id);
  for (const m of members ?? []) {
    if (m.member_id !== run.creator_id) ids.add(m.member_id);
  }

  if (ids.size === 0) return;

  const { data: profiles } = await sb
    .from("profiles")
    .select("id, name")
    .in("id", [...ids])
    .eq("notify_runs", true);

  if (!profiles || profiles.length === 0) return;

  const recipients = profiles
    .map((p: any) => ({ email: emailMap.get(p.id), name: p.name }))
    .filter((r: any) => r.email) as { email: string; name: string }[];

  if (recipients.length === 0) return;

  // Notification aux membres
  await sendEmail(
    recipients,
    `Nouvelle sortie dans ${groupName} !`,
    `<p>Salut 👋</p>
     <p><strong>${run.creator_name}</strong> vient d'ajouter une sortie dans <strong>${groupName}</strong> :</p>
     <p>${details}</p>
     <p style="color:#6B7280;font-size:12px">Tu reçois cet email car tu es membre de ce groupe sur RunCrew. Tu peux désactiver ces notifications dans l'application.</p>`
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
    });
  }

  let payload: any;
  try { payload = await req.json(); } catch { return new Response("ok"); }

  const run = payload.record ?? payload.run;
  if (!run) return new Response("ok");

  EdgeRuntime.waitUntil(sendNotifications(run));

  return new Response("ok");
});
