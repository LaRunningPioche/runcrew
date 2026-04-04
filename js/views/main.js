import { S } from "../state.js";
import { uColor, today, addDays, iso, fmtL, fmtS } from "../utils.js";

export function vMain() {
  const g = S.activeGroup;
  const isCreator = g.creator_name === S.user.name;
  const pending = S.allMembers.filter(m => m.status === "pending");
  return `
    <div style="height:100vh;display:flex;flex-direction:column;background:#F1F5F4">
      <div style="background:#0F172A;padding:13px 1.25rem;flex-shrink:0">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <button id="btnback" style="background:none;border:none;color:#94A3B8;font-size:13px;cursor:pointer;padding:0;margin-bottom:2px;display:flex;align-items:center;gap:4px">← Groupes</button>
            <div style="color:white;font-weight:600;font-size:16px">${g.name}</div>
          </div>
          <div style="text-align:right">
            <div style="color:#475569;font-size:11px;margin-bottom:1px">Code d'accès</div>
            <div style="color:white;font-weight:700;font-size:16px;letter-spacing:2px">${g.code}</div>
          </div>
        </div>
      </div>
      <div style="background:#fff;border-bottom:1px solid #E5E7EB;flex-shrink:0"><div style="display:flex">
        <button class="tab-btn ${S.appTab === "agenda" ? "active" : ""}" data-apptab="agenda">Agenda</button>
        ${isCreator ? `<button class="tab-btn ${S.appTab === "members" ? "active" : ""}" data-apptab="members">Membres${pending.length > 0 ? ` <span style="background:#EF4444;color:white;border-radius:10px;padding:1px 6px;font-size:10px;margin-left:3px">${pending.length}</span>` : ""}</button>` : ""}
      </div></div>
      ${S.appTab === "agenda" ? `
        <div style="background:#fff;border-bottom:1px solid #E5E7EB;flex-shrink:0"><div style="display:flex">
          <button class="tab-btn ${S.tab === "week" ? "active" : ""}" data-tab="week">Semaine</button>
          <button class="tab-btn ${S.tab === "list" ? "active" : ""}" data-tab="list">Liste</button>
        </div></div>
      ` : ""}
      <div style="flex:1;overflow-y:auto">
        ${S.appTab === "agenda" ? (S.tab === "week" ? vWeek() : vList()) : vMembers(isCreator, pending)}
      </div>
      ${S.appTab === "agenda" ? `
        <div style="padding:1rem;background:#fff;border-top:1px solid #E5E7EB;flex-shrink:0">
          <button id="addbtn" class="btn">+ Planifier une sortie</button>
        </div>
      ` : ""}
      ${S.modal ? vModal() : ""}
      ${S.showForm ? vForm() : ""}
    </div>
  `;
}

function vWeek() {
  const ws = addDays(today, S.weekOffset * 7);
  const days = Array.from({ length: 7 }, (_, i) => addDays(ws, i));
  const label = `${fmtS(days[0])} – ${fmtS(days[6])}`;
  const cols = days.map(d => {
    const di = iso(d);
    const dr = S.runs.filter(x => x.date === di).sort((a, b) => a.time.localeCompare(b.time));
    const isToday = di === iso(today);
    const isPast = d < today;
    return `
      <div style="flex:1;min-width:0;border-right:1px solid #F3F4F6;padding:0 3px 8px">
        <div style="padding:8px 2px 6px;text-align:center;border-bottom:1px solid #F3F4F6;margin-bottom:5px">
          <div style="font-size:9px;color:${isPast ? "#D1D5DB" : "#9CA3AF"};text-transform:uppercase;letter-spacing:.5px">${d.toLocaleDateString("fr-CA", { weekday: "short" })}</div>
          <div style="width:24px;height:24px;border-radius:50%;background:${isToday ? "#0F766E" : "transparent"};display:flex;align-items:center;justify-content:center;margin:3px auto 0">
            <span style="font-size:12px;font-weight:${isToday ? 600 : 400};color:${isToday ? "#fff" : isPast ? "#D1D5DB" : "#111"}">${d.getDate()}</span>
          </div>
        </div>
        ${dr.map(x => {
          const c = uColor(x.creator_name);
          const pCount = S.participations.filter(p => p.run_id === x.id).length;
          return `
            <div data-runid="${x.id}" style="background:${c}18;border-left:3px solid ${c};border-radius:0 6px 6px 0;padding:5px 6px;margin-bottom:4px;cursor:pointer">
              <div style="font-size:10px;font-weight:600;color:${c}">${x.time}</div>
              <div style="font-size:10px;color:#111;line-height:1.3;margin-top:1px">${x.creator_name}</div>
              ${x.location ? `<div style="font-size:9px;color:#6B7280">${x.location}</div>` : ""}
              ${pCount ? `<div style="font-size:9px;color:#6B7280;margin-top:2px">👟 ${pCount}</div>` : ""}
            </div>
          `;
        }).join("")}
      </div>
    `;
  }).join("");
  const runners = [...new Set(S.runs.map(x => x.creator_name))];
  return `
    <div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 1rem;background:#fff;border-bottom:1px solid #E5E7EB">
        <button id="prev" style="background:none;border:1px solid #E5E7EB;border-radius:6px;padding:4px 10px;font-size:16px;cursor:pointer;color:#374151">‹</button>
        <span style="font-size:13px;font-weight:500;color:#111;text-transform:capitalize">${label}</span>
        <button id="next" style="background:none;border:1px solid #E5E7EB;border-radius:6px;padding:4px 10px;font-size:16px;cursor:pointer;color:#374151">›</button>
      </div>
      <div style="display:flex;background:#fff">${cols}</div>
      ${runners.length ? `
        <div style="padding:.75rem 1rem;display:flex;gap:10px;flex-wrap:wrap;background:#fff;border-top:1px solid #F3F4F6">
          ${runners.map(n => `<span style="display:flex;align-items:center;gap:5px;font-size:12px;color:#6B7280"><span style="width:8px;height:8px;border-radius:50%;background:${uColor(n)};display:inline-block"></span>${n}</span>`).join("")}
        </div>
      ` : ""}
    </div>
  `;
}

function vList() {
  const upcoming = S.runs
    .filter(x => new Date(x.date + "T23:59:00") >= today)
    .sort((a, b) => new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time));
  if (!upcoming.length) {
    return `<div style="text-align:center;padding:3rem 1rem;color:#9CA3AF"><p style="font-size:14px">Aucune sortie à venir.</p></div>`;
  }
  return `
    <div style="padding:1rem">
      ${upcoming.map(x => {
        const c = uColor(x.creator_name);
        return `
          <div data-runid="${x.id}" class="card" style="border-left:3px solid ${c};cursor:pointer">
            <div style="font-size:13px;color:${c};font-weight:600;text-transform:capitalize;margin-bottom:4px">${fmtL(x.date)} · ${x.time}${x.location ? " · " + x.location : ""}${x.distance_km ? " · " + x.distance_km + " km" : ""}</div>
            <p style="margin:0 0 8px;font-size:14px;line-height:1.55;color:#111">${x.description}</p>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:${S.participations.filter(p => p.run_id === x.id).length ? "8px" : "0"}">
              <span style="font-size:13px;color:#6B7280">Par <strong style="font-weight:500;color:#111">${x.creator_name}</strong></span>
            </div>
            ${(() => {
              const participants = S.participations.filter(p => p.run_id === x.id);
              if (!participants.length) return "";
              return `<div style="display:flex;flex-wrap:wrap;gap:6px">${participants.map(p => `<span style="font-size:12px;background:#F3F4F6;color:#374151;padding:3px 8px;border-radius:20px">👟 ${p.user_name}</span>`).join("")}</div>`;
            })()}
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function vMembers(isCreator, pending) {
  const approved = S.allMembers.filter(m => m.status === "approved");
  return `
    <div style="padding:1rem">
      ${pending.length ? `
        <p style="font-size:12px;font-weight:600;color:#374151;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">Demandes en attente (${pending.length})</p>
        ${pending.map(m => `
          <div class="card" style="display:flex;justify-content:space-between;align-items:center;gap:10px">
            <div>
              <div style="font-weight:500;font-size:14px;color:#111">${m.member_name}</div>
              ${m.member_phone ? `<div style="font-size:12px;color:#9CA3AF">${m.member_phone}</div>` : ""}
            </div>
            <div style="display:flex;gap:6px;flex-shrink:0">
              <button data-approve="${m.id}" style="background:#D1FAE5;color:#065F46;border:none;border-radius:6px;padding:7px 12px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit">Accepter</button>
              <button data-refuse="${m.id}" style="background:#FEE2E2;color:#991B1B;border:none;border-radius:6px;padding:7px 12px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit">Refuser</button>
            </div>
          </div>
        `).join("")}
        <div style="height:1px;background:#E5E7EB;margin:16px 0"></div>
      ` : ""}
      <p style="font-size:12px;font-weight:600;color:#374151;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">Membres (${approved.length + 1})</p>
      <div class="card" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <div>
          <div style="font-weight:500;font-size:14px;color:#111">${S.user.name}</div>
          <div style="font-size:12px;color:#9CA3AF">Toi · Admin</div>
        </div>
        <span class="badge" style="background:#EDE9FE;color:#5B21B6">Admin</span>
      </div>
      ${approved.length
        ? approved.map(m => `
            <div class="card" style="display:flex;justify-content:space-between;align-items:center">
              <div>
                <div style="font-weight:500;font-size:14px;color:#111">${m.member_name}</div>
                ${m.member_phone ? `<div style="font-size:12px;color:#9CA3AF">${m.member_phone}</div>` : ""}
              </div>
              <button data-kick="${m.id}" style="font-size:12px;color:#9CA3AF;background:none;border:none;cursor:pointer;padding:4px">Retirer</button>
            </div>
          `).join("")
        : `<p style="font-size:13px;color:#9CA3AF;text-align:center;padding:1rem">Aucun autre membre pour l'instant.</p>`}
    </div>
  `;
}

export function vModal() {
  const x = S.modal;
  const c = uColor(x.creator_name);
  const isOwn = x.creator_name === S.user.name;
  const action = isOwn
    ? `<button id="mdel" style="font-size:13px;color:#DC2626;background:none;border:none;cursor:pointer">Retirer cette sortie</button>`
    : x.creator_phone
      ? `<div style="display:flex;gap:8px">
           <button id="mwa" style="background:#25D366;color:white;border:none;border-radius:8px;padding:8px 14px;font-size:13px;cursor:pointer;font-weight:500">WhatsApp</button>
           <button id="msms" style="background:#F3F4F6;color:#111;border:1px solid #E5E7EB;border-radius:8px;padding:8px 14px;font-size:13px;cursor:pointer">SMS</button>
         </div>`
      : `<span style="font-size:12px;color:#9CA3AF">Pas de contact renseigné</span>`;
  return `
    <div id="moverlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:flex-end;justify-content:center;z-index:100">
      <div style="width:100%;max-width:480px;background:#fff;border-radius:16px 16px 0 0;padding:1.5rem">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
          <span style="font-size:12px;font-weight:600;color:${c};background:${c}18;padding:4px 12px;border-radius:20px">${x.time} · ${fmtL(x.date)}</span>
          <button id="mclose" style="background:none;border:none;font-size:24px;cursor:pointer;color:#6B7280;line-height:1;padding:0">×</button>
        </div>
        <div style="display:flex;gap:12px;margin-bottom:10px">
          ${x.location ? `<div style="font-size:13px;color:#6B7280">📍 ${x.location}</div>` : ""}
          ${x.distance_km ? `<div style="font-size:13px;color:#6B7280">🏃 ${x.distance_km} km</div>` : ""}
        </div>
        <p style="font-size:15px;line-height:1.65;color:#111;margin-bottom:16px">${x.description}</p>
        ${(() => {
          const participants = S.participations.filter(p => p.run_id === x.id);
          const isParticipating = participants.some(p => p.user_id === S.user.id);
          return `
            <div style="margin-bottom:14px">
              ${participants.length ? `<div style="font-size:12px;color:#6B7280;margin-bottom:8px">👟 ${participants.map(p => p.user_name).join(", ")}</div>` : ""}
              <button id="${isParticipating ? "munparticipate" : "mparticipate"}" style="width:100%;padding:10px;border-radius:8px;border:1px solid ${isParticipating ? "#E5E7EB" : "#0F766E"};background:${isParticipating ? "#F9FAFB" : "#0F766E"};color:${isParticipating ? "#6B7280" : "white"};font-size:14px;font-weight:500;font-family:inherit;cursor:pointer">
                ${isParticipating ? "Ne plus participer" : "Participer"}
              </button>
            </div>
          `;
        })()}
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:14px;border-top:1px solid #F3F4F6">
          <span style="font-size:14px;color:#6B7280">Par <strong style="font-weight:500;color:#111">${x.creator_name}</strong></span>
          ${action}
        </div>
      </div>
    </div>
  `;
}

export function vForm() {
  const f = S.form;
  const minDate = iso(today);
  const ok = f.date && f.time && f.desc;
  return `
    <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:flex-end;justify-content:center;z-index:100">
      <div style="width:100%;max-width:480px;background:#fff;border-radius:16px 16px 0 0;padding:1.5rem">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem">
          <h2 style="font-size:18px;font-weight:600;color:#111">Planifier une sortie</h2>
          <button id="fclose" style="background:none;border:none;font-size:24px;cursor:pointer;color:#6B7280;line-height:1;padding:0">×</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
          <div>
            <label style="font-size:13px;color:#374151;display:block;margin-bottom:4px;font-weight:500">Date</label>
            <input id="fdate" type="date" min="${minDate}" value="${f.date}"/>
          </div>
          <div>
            <label style="font-size:13px;color:#374151;display:block;margin-bottom:4px;font-weight:500">Heure</label>
            <input id="ftime" type="time" value="${f.time}"/>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
          <div>
            <label style="font-size:13px;color:#374151;display:block;margin-bottom:4px;font-weight:500">
              Lieu <span style="font-size:11px;color:#9CA3AF;font-weight:400">optionnel</span>
            </label>
            <input id="floc" type="text" placeholder="Mont-Royal, Canal Lachine..." value="${f.location}"/>
          </div>
          <div>
            <label style="font-size:13px;color:#374151;display:block;margin-bottom:4px;font-weight:500">
              Distance <span style="font-size:11px;color:#9CA3AF;font-weight:400">km · optionnel</span>
            </label>
            <input id="fdist" type="number" min="0" step="0.5" placeholder="10" value="${f.distance}" style="width:100%;box-sizing:border-box"/>
          </div>
        </div>
        <div style="margin-bottom:20px">
          <label style="font-size:13px;color:#374151;display:block;margin-bottom:4px;font-weight:500">Description</label>
          <textarea id="fdesc" rows="3" placeholder="Rythme, niveau, point de rendez-vous..." style="resize:vertical">${f.desc}</textarea>
        </div>
        <button id="fadd" class="btn" ${ok ? "" : "disabled"}>Ajouter à l'agenda</button>
      </div>
    </div>
  `;
}
