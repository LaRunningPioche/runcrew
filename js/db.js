import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { S } from "./state.js";
import { SURL, SKEY } from "./config.js";

export const sb = createClient(SURL, SKEY, {
  auth: { lock: async (_name, _timeout, fn) => await fn() },
});

export async function loadGroups() {
  const [{ data: created }, { data: memberships }] = await Promise.all([
    sb.from("groups").select("*").eq("creator_id", S.user.id),
    sb.from("memberships").select("*,group:groups(*)").eq("member_id", S.user.id),
  ]);
  const result = [];
  (created || []).forEach(g => result.push({ group: g, membership: null, isCreator: true }));
  (memberships || []).forEach(m => { if (m.group) result.push({ group: m.group, membership: m, isCreator: false }); });
  S.groups = result;
}

export async function loadGroupData() {
  const gid = S.activeGroup.id;
  const [{ data: runs }, { data: members }] = await Promise.all([
    sb.from("runs").select("*").eq("group_id", gid).order("date").order("time"),
    sb.from("memberships").select("*").eq("group_id", gid),
  ]);
  S.runs = runs || [];
  S.allMembers = members || [];
  const runIds = S.runs.map(r => r.id);
  if (runIds.length) {
    const { data: participations } = await sb.from("run_participations").select("*").in("run_id", runIds);
    S.participations = participations || [];
  } else {
    S.participations = [];
  }
}
