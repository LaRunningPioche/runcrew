import { sb, loadGroups } from "./db.js";
import { S } from "./state.js";
import { r } from "./router.js";

sb.auth.onAuthStateChange((event, session) => {
  if (session?.user) {
    const meta = session.user.user_metadata;
    S.user = {
      id: session.user.id,
      name: meta?.name || session.user.email,
      phone: meta?.phone || null,
      notify_runs: true,
    };
    if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
      S.view = "groups";
      S.authReady = true;
      loadGroups().then(async () => {
        const { data: profile } = await sb.from("profiles").select("notify_runs").eq("id", session.user.id).single();
        if (profile) S.user.notify_runs = profile.notify_runs ?? true;
        r();
      });
      return;
    }
  } else {
    S.user = null;
    S.groups = [];
    S.view = "login";
  }
  S.authReady = true;
  r();
});

setTimeout(() => {
  if (!S.authReady) r();
}, 3000);
