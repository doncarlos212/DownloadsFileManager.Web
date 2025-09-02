import { Breadcrumbs, Link as MLink, Typography, Box } from "@mui/material";
import { Link, matchPath, useLocation } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { routes } from "../routes";
import { IRuleDto } from "../api/generated";

type CrumbCtx = {
    pathname: string;
    state: any;
    params: Record<string, string>;
    qc: ReturnType<typeof useQueryClient>;
};

type Crumb =
    | { pattern: string; to?: string; label: string }
    | { pattern: string; to?: (p: CrumbCtx) => string; label: (p: CrumbCtx) => string };

const CRUMBS: Crumb[] = [
    { pattern: routes.home.path, to: routes.home.to(), label: "Home" },

    // Rules
    { pattern: routes.rules.path, to: routes.rules.to(), label: "Rules" },
    { pattern: routes.newRule.path, label: "New" },
    {
        pattern: routes.editRule.path,
        label: ({ params, state, qc }) => {
            const id = params.id;
            const stateName = state?.rule?.name as string | undefined;
            const cachedName = qc.getQueryData<IRuleDto[] | undefined>(["rules"])?.find(r => String(r.id) === String(id))?.name;
            const name = stateName ?? cachedName;
            return `Edit${name ? `: ${name}` : ""}`;
        },
    },

    // Logs
    { pattern: routes.logs.path, to: routes.logs.to(), label: "Logs" },

    // Settings
    { pattern: routes.settings.path, to: routes.settings.to(), label: "Settings" }
];

function buildPathSteps(pathname: string) {
    const parts = pathname.split("/").filter(Boolean);
    const steps: string[] = [];
    for (let i = 0; i < parts.length; i++) {
        steps.push("/" + parts.slice(0, i + 1).join("/"));
    }
    return steps;
}

export default function BreadcrumbsNav() {
    const location = useLocation();
    const qc = useQueryClient();

    const steps = buildPathSteps(location.pathname);

    const items = steps
        .map((step) => {
            for (const c of CRUMBS) {
                const match = matchPath({ path: c.pattern, end: true }, step);
                if (match) {
                    const ctx: CrumbCtx = {
                        pathname: step,
                        state: (location as any).state,
                        params: (match.params as any) ?? {},
                        qc,
                    };
                    const label = typeof c.label === "function" ? c.label(ctx) : c.label;
                    const to =
                        typeof c.to === "function" ? c.to(ctx) : c.to ?? step;
                    return { label, to, step };
                }
            }
            return null;
        })
        .filter(Boolean) as { label: string; to: string; step: string }[];

    if (items.length === 0) return null;

    return (
        <Box sx={{ px: 2, py: 1 }}>
            <Breadcrumbs aria-label="breadcrumb">
                {items.map((it, idx) =>
                    idx < items.length - 1 ? (
                        <MLink key={it.step} component={Link} underline="hover" color="inherit" to={it.to}>
                            {it.label}
                        </MLink>
                    ) : (
                        <Typography key={it.step} color="text.primary">
                            {it.label}
                        </Typography>
                    )
                )}
            </Breadcrumbs>
        </Box>
    );
}