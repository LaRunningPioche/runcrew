export function vPending() {
  return `
    <div style="height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#F1F5F4;padding:2rem;text-align:center">
      <div style="font-size:40px;margin-bottom:16px">⏳</div>
      <h2 style="font-size:18px;font-weight:600;color:#111;margin-bottom:8px">Demande envoyée</h2>
      <p style="font-size:14px;color:#6B7280;line-height:1.6;margin-bottom:24px">Le créateur du groupe doit accepter ta demande. Tu verras le groupe dans ta liste une fois approuvé.</p>
      <button id="btnback" class="btn btn-sec" style="max-width:200px">Retour</button>
    </div>
  `;
}
