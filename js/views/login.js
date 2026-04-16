import { S } from "../state.js";

const LOGO_SVG = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1.5"/><path d="M5 20l4.5-5 2.5 2 3-6 4 9"/><path d="M3 10c2-3 4-4 9-4s8 1 9 4"/></svg>`;

export function vLogin() {
  const isSignup = S.authMode === "signup";
  return `
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;height:100vh;background:#F1F5F4">
      <div style="width:100%;max-width:360px;background:#fff;border-radius:16px;border:1px solid #E5E7EB;padding:2rem;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
        <div style="text-align:center;margin-bottom:2rem">
          <div style="width:56px;height:56px;background:#0F172A;border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 14px">
            ${LOGO_SVG}
          </div>
          <h1 style="font-size:22px;font-weight:600;color:#111">RunCrew</h1>
          <p style="font-size:13px;color:#6B7280;margin-top:4px">L'agenda de course de ton groupe</p>
        </div>
        <p style="font-size:13px;color:#6B7280;text-align:center;line-height:1.6;margin-bottom:1.5rem;padding:0 0.25rem">
          Planifie tes runs avec tes potes. Lance un groupe, propose des sorties, et cours ensemble — sans la multitude de messages à droite à gauche pour savoir si ton pote ou ton collègue est dispo pour t'accompagner dans tes bêtises de 4 x 5' @ 3:35 / km.
        </p>
        ${isSignup ? `
          <label style="font-size:13px;color:#374151;display:block;margin-bottom:4px;font-weight:500">Ton prénom</label>
          <input id="ln" placeholder="ex. Marie" style="margin-bottom:12px"/>
          <label style="font-size:13px;color:#374151;display:block;margin-bottom:4px;font-weight:500">
            Numéro WhatsApp / SMS
            <span style="font-size:11px;color:#9CA3AF;font-weight:400">optionnel</span>
          </label>
          <input id="lp" type="tel" placeholder="514 000 0000" style="margin-bottom:12px"/>
        ` : ""}
        <input id="lemail" type="email" placeholder="ton@email.com" style="margin-bottom:10px"/>
        <input id="lpwd" type="password" placeholder="Mot de passe" style="margin-bottom:16px"/>
        <button id="lbtn" class="btn">${isSignup ? "Créer un compte" : "Se connecter"}</button>
        <p style="text-align:center;margin-top:14px;font-size:13px;color:#6B7280">
          ${isSignup ? "Déjà un compte ?" : "Pas encore de compte ?"}
          <a id="ltoggle" href="#" style="color:#0F766E;text-decoration:none;font-weight:500">
            ${isSignup ? "Se connecter" : "S'inscrire"}
          </a>
        </p>
      </div>
    </div>
  `;
}
