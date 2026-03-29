import { S } from "../state.js";

function groupCard({ group, membership, isCreator }) {
  const badge = isCreator
    ? `<span class="badge" style="background:#EDE9FE;color:#5B21B6">Admin</span>`
    : `<span class="badge" style="background:#D1FAE5;color:#065F46">Membre</span>`;
  return `
    <div data-gid="${group.id}" class="card" style="cursor:pointer;display:flex;justify-content:space-between;align-items:center">
      <div>
        <div style="font-weight:500;font-size:15px;color:#111;margin-bottom:4px">${group.name}</div>
        <div style="font-size:12px;color:#9CA3AF">Code : <strong style="color:#6B7280;letter-spacing:1px">${group.code}</strong></div>
      </div>
      ${badge}
    </div>
  `;
}

export function vGroups() {
  const pending = S.groups.filter(g => g.membership && g.membership.status === "pending");
  const active = S.groups.filter(g => !g.membership || g.membership.status === "approved");
  return `
    <div style="height:100vh;display:flex;flex-direction:column;background:#F1F5F4">
      <div style="background:#0F172A;padding:13px 1.25rem;flex-shrink:0">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span style="color:white;font-weight:600;font-size:17px">RunCrew</span>
          <div style="display:flex;align-items:center;gap:10px">
            <span style="color:#94A3B8;font-size:13px">${S.user.name}</span>
            <button id="logout" style="font-size:12px;color:#64748B;background:none;border:none;cursor:pointer">Changer</button>
          </div>
        </div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:1rem">
        ${pending.length ? `<p style="font-size:12px;font-weight:500;color:#92400E;margin-bottom:8px;background:#FEF3C7;padding:8px 12px;border-radius:8px">⏳ ${pending.length} demande${pending.length > 1 ? "s" : ""} en attente d'approbation</p>` : ""}
        ${active.length === 0 && pending.length === 0
          ? `<div style="text-align:center;padding:2.5rem 1rem;color:#9CA3AF"><p style="font-size:14px">Tu n'es dans aucun groupe pour l'instant.</p></div>`
          : `<p style="font-size:12px;font-weight:500;color:#6B7280;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">Mes groupes</p>${active.map(groupCard).join("")}`}
        ${pending.length ? `
          <p style="font-size:12px;font-weight:500;color:#6B7280;margin:16px 0 8px;text-transform:uppercase;letter-spacing:.5px">En attente</p>
          ${pending.map(g => `
            <div class="card" style="display:flex;justify-content:space-between;align-items:center;opacity:0.7">
              <div><div style="font-weight:500;font-size:15px;color:#111">${g.group.name}</div></div>
              <span class="badge" style="background:#FEF3C7;color:#92400E">En attente</span>
            </div>
          `).join("")}
        ` : ""}
      </div>
      <div style="padding:1rem;background:#fff;border-top:1px solid #E5E7EB;display:flex;gap:10px;flex-shrink:0">
        <button id="btnjoin" class="btn btn-sec" style="flex:1">Rejoindre</button>
        <button id="btncreate" class="btn" style="flex:1">Créer un groupe</button>
      </div>
    </div>
  `;
}
