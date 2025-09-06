import { generatePath, Params } from "react-router"

const route = (pattern: string) => {
  const to = ((params?: Params) =>
    params ? generatePath(pattern, params) : pattern) as {
    (): string;
    (params: Params): string;
  };
  return { path: pattern, to };
};

export const routes = {
    home: route("/"),
    rules: route("/rules"),
    newRule: route("/rules/new"),
    editRule: route("/rules/:id/edit"),
    settings: route("/settings"),
    logs: route("/logs"),
    dashboard: route("/dashboard"),
}

