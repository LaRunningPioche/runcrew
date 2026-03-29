export function topBar(title, back = true) {
  return `
    <div style="background:#0F172A;padding:13px 1.25rem;flex-shrink:0;display:flex;align-items:center;gap:12px">
      ${back ? `<button id="btnback" style="background:none;border:none;color:#94A3B8;font-size:20px;cursor:pointer;padding:0;line-height:1">←</button>` : ""}
      <span style="color:white;font-weight:600;font-size:16px">${title}</span>
    </div>
  `;
}
