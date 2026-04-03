import { sb, loadGroups } from "./db.js";
import { S } from "./state.js";
import { r } from "./router.js";

sb.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    const meta = session.user.user_metadata;
    S.user = {
      id: session.user.id,
      name: meta?.name || session.user.email,
      phone: meta?.phone || null,
    };
    if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
      await loadGroups();
      S.view = "groups";
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
