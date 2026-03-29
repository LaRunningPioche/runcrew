import { topBar } from "./shared.js";

export function vCreate() {
  return `
    <div style="height:100vh;display:flex;flex-direction:column;background:#F1F5F4">
      ${topBar("Créer un groupe")}
      <div style="flex:1;padding:1.5rem">
        <label style="font-size:13px;color:#374151;display:block;margin-bottom:4px;font-weight:500">Nom du groupe</label>
        <input id="gname" placeholder="ex. Runners du Plateau" style="margin-bottom:16px"/>
        <p style="font-size:13px;color:#6B7280;line-height:1.6;margin-bottom:24px">Un code unique sera généré automatiquement. Partage-le à tes amis pour qu'ils puissent faire une demande d'accès.</p>
        <button id="btncreateg" class="btn">Créer le groupe</button>
      </div>
    </div>
  `;
}
