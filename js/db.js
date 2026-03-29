import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { S } from "./state.js";

const SURL = "https://xuxwqmjvgxzpdwumxzrp.supabase.co";
const SKEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1eHdxbWp2Z3h6cGR3dW14enJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MjYzODMsImV4cCI6MjA5MDMwMjM4M30.PJQxMREH663toOuXEMMOQ21HDpsO_brt6EQCz-D5OH4";

export const sb = createClient(SURL, SKEY);

export async function loadGroups() {
  const [{ data: created }, { data: memberships }] = await Promise.all([
    sb.from("groups").select("*").eq("creator_name", S.user.name),
    sb.from("memberships").select("*,group:groups(*)").eq("member_name", S.user.name),
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
}
