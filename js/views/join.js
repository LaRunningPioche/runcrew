import { topBar } from "./shared.js";
import { S } from "../state.js";

export function vJoin() {
  return `
    <div style="height:100vh;display:flex;flex-direction:column;background:#F1F5F4">
      ${topBar("Rejoindre un groupe")}
      <div style="flex:1;padding:1.5rem;overflow-y:auto">

        <div style="margin-bottom:24px">
          <label style="font-size:13px;color:#374151;display:block;margin-bottom:4px;font-weight:500">Rechercher un groupe</label>
          <div style="position:relative">
            <input id="gsearch" type="text" placeholder="Nom du groupe..." autocomplete="off"
              style="padding-left:36px"
              value="${S.joinSelected ? S.joinSelected.name : ""}"/>
            <span style="position:absolute;left:11px;top:50%;transform:translateY(-50%);font-size:15px;pointer-events:none">🔍</span>
            <div id="gdropdown" style="position:absolute;top:calc(100% + 4px);left:0;right:0;background:#fff;border:1px solid #E5E7EB;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.08);z-index:10;overflow:hidden"></div>
          </div>
          ${S.joinSelected ? `
            <div style="margin-top:8px;padding:10px 12px;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;display:flex;justify-content:space-between;align-items:center">
              <span style="font-size:14px;color:#065F46;font-weight:500">✓ ${S.joinSelected.name}</span>
              <button id="gclear" style="background:none;border:none;font-size:12px;color:#6B7280;cursor:pointer">Changer</button>
            </div>
          ` : ""}
        </div>

        <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px">
          <div style="flex:1;height:1px;background:#E5E7EB"></div>
          <span style="font-size:12px;color:#9CA3AF">ou</span>
          <div style="flex:1;height:1px;background:#E5E7EB"></div>
        </div>

        <div style="margin-bottom:24px">
          <label style="font-size:13px;color:#374151;display:block;margin-bottom:4px;font-weight:500">Code du groupe</label>
          <input id="gcode" placeholder="ex. AB12C" style="text-transform:uppercase;letter-spacing:3px;font-size:20px;text-align:center;font-weight:600"/>
          <p style="font-size:12px;color:#9CA3AF;margin-top:6px;text-align:center">Demande le code au créateur du groupe</p>
        </div>

        <button id="btnjoina" class="btn" disabled>Envoyer ma demande</button>
      </div>
    </div>
  `;
}
