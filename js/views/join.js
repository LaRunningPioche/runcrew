import { topBar } from "./shared.js";

export function vJoin() {
  return `
    <div style="height:100vh;display:flex;flex-direction:column;background:#F1F5F4">
      ${topBar("Rejoindre un groupe")}
      <div style="flex:1;padding:1.5rem">
        <label style="font-size:13px;color:#374151;display:block;margin-bottom:4px;font-weight:500">Code du groupe</label>
        <input id="gcode" placeholder="ex. AB12C" style="margin-bottom:8px;text-transform:uppercase;letter-spacing:3px;font-size:20px;text-align:center;font-weight:600"/>
        <p style="font-size:12px;color:#9CA3AF;margin-bottom:24px;text-align:center">Demande le code au créateur du groupe</p>
        <button id="btnjoina" class="btn" disabled>Envoyer ma demande</button>
      </div>
    </div>
  `;
}
