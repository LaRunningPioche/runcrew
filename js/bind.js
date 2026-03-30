import { S } from "./state.js";
import { sb, loadGroups, loadGroupData } from "./db.js";
import { genCode, fmtL, toast } from "./utils.js";
import { r } from "./router.js";

export function bind() {
  bindAuth();
  bindGroups();
  bindMain();
}

function bindAuth() {
  const lb = document.getElementById("lbtn");
  if (!lb) return;

  document.getElementById("ltoggle")?.addEventListener("click", e => {
    e.preventDefault();
    S.authMode = S.authMode === "signin" ? "signup" : "signin";
    r();
  });

  lb.addEventListener("click", async () => {
    const email = document.getElementById("lemail").value.trim();
    const pwd = document.getElementById("lpwd").value;
    if (!email || !pwd) return;

    lb.disabled = true;
    lb.innerHTML = `<span class="spinner"></span>Chargement...`;

    if (S.authMode === "signup") {
      const name = document.getElementById("ln")?.value.trim() || "";
      const phone = document.getElementById("lp")?.value.trim() || null;
      if (!name) {
        toast("Ton prénom est requis.");
        lb.disabled = false;
        lb.textContent = "Créer un compte";
        return;
      }
      const { error } = await sb.auth.signUp({ email, password: pwd, options: { data: { name, phone } } });
      if (error) {
        toast("Erreur: " + error.message);
        lb.disabled = false;
        lb.textContent = "Créer un compte";
        return;
      }
      toast("Vérifie ta boîte mail pour confirmer ton compte.");
      lb.textContent = "Email envoyé";
    } else {
      const { error } = await sb.auth.signInWithPassword({ email, password: pwd });
      if (error) {
        toast("Erreur: " + error.message);
        lb.disabled = false;
        lb.textContent = "Se connecter";
      }
    }
  });
}

function bindGroups() {
  document.getElementById("logout")?.addEventListener("click", () => sb.auth.signOut());

  document.getElementById("btnback")?.addEventListener("click", async () => {
    if (["join", "create", "pending"].includes(S.view)) {
      S.view = "groups";
      r();
    } else if (S.view === "main") {
      await loadGroups();
      S.view = "groups";
      r();
    }
  });

  document.getElementById("btnjoin")?.addEventListener("click", () => { S.view = "join"; r(); });
  document.getElementById("btncreate")?.addEventListener("click", () => { S.view = "create"; r(); });

  document.querySelectorAll("[data-gid]").forEach(el => el.addEventListener("click", async () => {
    const found = S.groups.find(g => g.group.id === el.dataset.gid);
    if (!found) return;
    S.activeGroup = found.group;
    S.tab = "week";
    S.weekOffset = 0;
    S.appTab = "agenda";
    await loadGroupData();
    S.view = "main";
    r();
  }));

  document.getElementById("btncreateg")?.addEventListener("click", async () => {
    const nm = document.getElementById("gname")?.value.trim();
    if (!nm) return;
    const btn = document.getElementById("btncreateg");
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span>Création...`;
    const code = genCode();
    const { error } = await sb.from("groups").insert([{ name: nm, code, creator_id: S.user.id, creator_name: S.user.name }]);
    if (error) {
      toast("Erreur.");
      btn.disabled = false;
      btn.textContent = "Créer le groupe";
      return;
    }
    await loadGroups();
    toast("Groupe créé · Code : " + code, 5000);
    S.view = "groups";
    r();
  });

  const gc = document.getElementById("gcode");
  if (gc) {
    const ja = document.getElementById("btnjoina");
    gc.addEventListener("input", () => { gc.value = gc.value.toUpperCase(); ja.disabled = gc.value.trim().length < 3; });
    ja.addEventListener("click", async () => {
      const code = gc.value.trim();
      ja.disabled = true;
      ja.innerHTML = `<span class="spinner"></span>Envoi...`;
      const { data: gs } = await sb.from("groups").select("*").eq("code", code);
      if (!gs || !gs.length) {
        toast("Code introuvable.");
        ja.disabled = false;
        ja.textContent = "Envoyer ma demande";
        return;
      }
      const grp = gs[0];
      if (grp.creator_id === S.user.id) {
        toast("Tu es le créateur de ce groupe.");
        ja.disabled = false;
        ja.textContent = "Envoyer ma demande";
        return;
      }
      const { data: ex } = await sb.from("memberships").select("id").eq("group_id", grp.id).eq("member_id", S.user.id);
      if (ex && ex.length) {
        toast("Demande déjà envoyée pour ce groupe.");
        ja.disabled = false;
        ja.textContent = "Envoyer ma demande";
        return;
      }
      await sb.from("memberships").insert([{ group_id: grp.id, member_id: S.user.id, member_name: S.user.name, member_phone: S.user.phone || null, status: "pending" }]);
      await loadGroups();
      S.view = "pending";
      r();
    });
  }
}

function bindMain() {
  document.querySelectorAll("[data-apptab]").forEach(b => b.addEventListener("click", () => { S.appTab = b.dataset.apptab; r(); }));
  document.querySelectorAll("[data-tab]").forEach(b => b.addEventListener("click", () => { S.tab = b.dataset.tab; r(); }));
  document.getElementById("prev")?.addEventListener("click", () => { S.weekOffset--; r(); });
  document.getElementById("next")?.addEventListener("click", () => { S.weekOffset++; r(); });

  document.querySelectorAll("[data-runid]").forEach(b => b.addEventListener("click", () => {
    S.modal = S.runs.find(x => x.id == b.dataset.runid);
    r();
  }));

  document.getElementById("moverlay")?.addEventListener("click", e => { if (e.target.id === "moverlay") { S.modal = null; r(); } });
  document.getElementById("mclose")?.addEventListener("click", () => { S.modal = null; r(); });
  document.getElementById("mdel")?.addEventListener("click", async () => {
    const id = S.modal.id;
    S.modal = null;
    await sb.from("runs").delete().eq("id", id);
    S.runs = S.runs.filter(x => x.id !== id);
    toast("Sortie retirée.");
    r();
  });
  document.getElementById("mwa")?.addEventListener("click", () => {
    const x = S.modal;
    const n = x.creator_phone.replace(/\D/g, "");
    const msg = encodeURIComponent(`Salut ${x.creator_name} ! Je voudrais me joindre à ta sortie du ${fmtL(x.date)} à ${x.time}. C'est encore possible ?`);
    window.open(`https://wa.me/${n.startsWith("1") ? n : "1" + n}?text=${msg}`, "_blank");
  });
  document.getElementById("msms")?.addEventListener("click", () => {
    const x = S.modal;
    const msg = encodeURIComponent(`Salut ${x.creator_name} ! Je voudrais me joindre à ta sortie du ${fmtL(x.date)} à ${x.time}. C'est encore possible ?`);
    window.open(`sms:+1${x.creator_phone.replace(/\D/g, "")}?body=${msg}`);
  });

  document.getElementById("addbtn")?.addEventListener("click", () => { S.showForm = true; r(); });
  document.getElementById("fclose")?.addEventListener("click", () => { S.showForm = false; r(); });

  const fdesc = document.getElementById("fdesc");
  if (fdesc) {
    const syncForm = () => {
      S.form = {
        date: document.getElementById("fdate").value,
        time: document.getElementById("ftime").value,
        location: document.getElementById("floc").value,
        desc: document.getElementById("fdesc").value,
      };
      document.getElementById("fadd").disabled = !(S.form.date && S.form.time && S.form.desc);
    };
    ["fdate", "ftime", "floc", "fdesc"].forEach(id => document.getElementById(id).addEventListener("input", syncForm));
    document.getElementById("fadd").addEventListener("click", async () => {
      const f = S.form;
      if (!f.date || !f.time || !f.desc) return;
      const btn = document.getElementById("fadd");
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner"></span>Ajout...`;
      const { data, error } = await sb.from("runs").insert([{
        group_id: S.activeGroup.id,
        creator_id: S.user.id,
        creator_name: S.user.name,
        creator_phone: S.user.phone || null,
        date: f.date,
        time: f.time,
        location: f.location || null,
        description: f.desc,
      }]).select().single();
      if (error) {
        toast("Erreur.");
        btn.disabled = false;
        btn.textContent = "Ajouter à l'agenda";
        return;
      }
      S.runs.push(data);
      S.form = { date: "", time: "", location: "", desc: "" };
      S.showForm = false;
      S.tab = "week";
      toast("Sortie ajoutée !");
      r();
    });
  }

  document.querySelectorAll("[data-approve]").forEach(b => b.addEventListener("click", async () => {
    await sb.from("memberships").update({ status: "approved" }).eq("id", b.dataset.approve);
    await loadGroupData();
    toast("Membre accepté !");
    r();
  }));
  document.querySelectorAll("[data-refuse]").forEach(b => b.addEventListener("click", async () => {
    await sb.from("memberships").delete().eq("id", b.dataset.refuse);
    await loadGroupData();
    toast("Demande refusée.");
    r();
  }));
  document.querySelectorAll("[data-kick]").forEach(b => b.addEventListener("click", async () => {
    await sb.from("memberships").delete().eq("id", b.dataset.kick);
    await loadGroupData();
    toast("Membre retiré.");
    r();
  }));
}
