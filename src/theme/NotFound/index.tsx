/**
 * Override @theme/NotFound so the client-side router uses our custom
 * 404 page (src/pages/404.tsx) for unmatched routes — not just the
 * static build/404.html served by the host.
 *
 * Without this override, Docusaurus' client router falls back to the
 * default @theme/NotFound after hydration. The visitor briefly sees
 * our custom 404 (rendered from build/404.html) then it gets replaced
 * by the bland default. With this override, both surfaces use the
 * same component.
 *
 * See /brain/404-PAGE.md §7 for the technical conformance rationale.
 */
export { default } from '@site/src/pages/404';
