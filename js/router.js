import { S } from "./state.js";
import { vLogin } from "./views/login.js";
import { vGroups } from "./views/groups.js";
import { vCreate } from "./views/create.js";
import { vJoin } from "./views/join.js";
import { vPending } from "./views/pending.js";
import { vMain } from "./views/main.js";
import { bind } from "./bind.js";

const VIEWS = {
  login: vLogin,
  groups: vGroups,
  join: vJoin,
  create: vCreate,
  pending: vPending,
  main: vMain,
};

export function r() {
  const app = document.getElementById("app");
  const renderView = VIEWS[S.view];
  if (renderView) app.innerHTML = renderView();
  bind();
}
