export const COLORS = ["#0F766E", "#2563EB", "#9333EA", "#D97706", "#DC2626", "#0891B2", "#65A30D", "#DB2777"];

export function uColor(name) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % COLORS.length;
  return COLORS[h];
}

export function genCode() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

export const today = new Date();
today.setHours(0, 0, 0, 0);

export function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function iso(d) {
  return d.toISOString().split("T")[0];
}

export function fmtL(d) {
  return new Date(d + "T12:00:00").toLocaleDateString("fr-CA", { weekday: "long", day: "numeric", month: "long" });
}

export function fmtS(d) {
  return d.toLocaleDateString("fr-CA", { weekday: "short", day: "numeric" });
}

export function toast(msg, dur = 2500) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove("show"), dur);
}
