/**
 * Shared body for every 404 surface in this site.
 *
 * Three places render this:
 *   1. src/pages/404.tsx              — wrapped in <Layout> → build/404.html (static host fallback)
 *   2. src/theme/NotFound/index.tsx   — wrapped in <Layout> → client-side router wildcard (* route)
 *   3. src/theme/NotFound/Content/index.tsx — bare, no Layout → DocRoot's internal NotFound
 *      (DocRoot is rendered inside its own Layout, so this path must NOT wrap in Layout
 *      again — see @docusaurus/theme-classic DocRoot index.tsx which imports
 *      @theme/NotFound/Content directly to avoid a double layout.)
 *
 * Implementation tracks /brain/404-PAGE.md sections 3a-3g. The dynamic bits
 * (attempted URL, referrer, "did you mean", prefilled report link) light up
 * after client-side hydration; the rest is server-rendered HTML.
 */

import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './NotFoundBody.module.css';

// Suggestions for known-deleted paths. When a visitor lands on one of
// these URLs, surface a "Did you mean" pointer (styleguide §6).
const DID_YOU_MEAN_EXACT: Record<string, string> = {
  '/reference/appendices/libraries': '/foundations/mqtt-primer',
};

const DID_YOU_MEAN_PREFIX: Array<[string, string]> = [
  // The entire /sdks/* section was deleted; any URL under it should
  // suggest the MQTT primer (the closest surviving concept).
  ['/sdks/', '/foundations/mqtt-primer'],
  ['/sdks', '/foundations/mqtt-primer'],
];

// Curated recovery jumps (styleguide §3e). Keep to 4-6 entries.
const RECOVERY_JUMPS: Array<{ label: string; to: string; description: string }> = [
  { label: 'Start here', to: '/foundations/start', description: 'Where to begin in the docs' },
  { label: 'Quick Start tutorial', to: '/quick-start/overview', description: 'Read your first tag in 30 minutes' },
  { label: 'MQTT API Reference', to: '/reference/api-overview', description: 'Index of all 27 commands and events' },
  { label: 'Something not working?', to: '/diagnose/symptoms', description: 'Symptom-first failure index' },
];

const GITHUB_ISSUES_URL = 'https://github.com/al1913-zebra/zebra-handheld-rfid-iotc/issues/new';

function stripBaseUrl(path: string, baseUrl: string): string {
  if (baseUrl !== '/' && path.startsWith(baseUrl)) {
    return path.slice(baseUrl.length - (baseUrl.endsWith('/') ? 1 : 0));
  }
  return path;
}

function computeSuggestion(attemptedPath: string | null): string | null {
  if (!attemptedPath) return null;
  const normalised = attemptedPath.split('?')[0].split('#')[0].replace(/\/$/, '');
  if (DID_YOU_MEAN_EXACT[normalised]) {
    return DID_YOU_MEAN_EXACT[normalised];
  }
  for (const [prefix, target] of DID_YOU_MEAN_PREFIX) {
    if (normalised === prefix.replace(/\/$/, '') || normalised.startsWith(prefix)) {
      return target;
    }
  }
  return null;
}

function buildReportUrl(attempted: string | null, referrer: string | null): string {
  const title = `Broken link: ${attempted ?? 'unknown URL'}`;
  const body =
    `**Attempted URL:** ${attempted ?? '(client-side detection failed)'}\n\n` +
    `**Referrer:** ${referrer ?? '(none)'}\n\n` +
    `**Description:**\n\n` +
    `_What did you expect to find at this URL? Where did you click from?_\n`;
  return `${GITHUB_ISSUES_URL}?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}

export default function NotFoundBody(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const baseUrl = siteConfig.baseUrl ?? '/';
  const searchUrl = useBaseUrl('/search');

  const [attempted, setAttempted] = useState<string | null>(null);
  const [referrer, setReferrer] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const rawPath = window.location.pathname + window.location.search;
    const trimmedPath = stripBaseUrl(rawPath, baseUrl);
    setAttempted(trimmedPath);
    setSuggestion(computeSuggestion(trimmedPath));

    if (document.referrer) {
      try {
        const ref = new URL(document.referrer);
        const sameOrigin = ref.origin === window.location.origin;
        setReferrer(
          sameOrigin
            ? stripBaseUrl(ref.pathname + ref.search, baseUrl)
            : ref.hostname + ref.pathname,
        );
      } catch {
        // Malformed referrer; ignore.
      }
    }

    // Fire a custom event so any analytics integration can capture the
    // 404 (styleguide §7e). gtag fallback included for sites that wire
    // up Google Analytics 4 later.
    window.dispatchEvent(
      new CustomEvent('zebra:404', {
        detail: {
          attemptedUrl: trimmedPath,
          rawPath,
          referrer: document.referrer || null,
        },
      }),
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gtag = (window as any).gtag;
    if (typeof gtag === 'function') {
      gtag('event', 'page_not_found', {
        attempted_url: trimmedPath,
        referrer: document.referrer || '(none)',
      });
    }
  }, [baseUrl]);

  const reportUrl = buildReportUrl(attempted, referrer);

  return (
    <main className={styles.notFoundMain}>
      <div className={styles.container}>
        {/* §3a Status acknowledgement */}
        <div className={styles.statusBlock}>
          <div className={styles.statusCode} aria-hidden="true">404</div>
          <h1 className={styles.title}>This page doesn't exist</h1>
          <p className={styles.subtitle}>
            The URL you requested isn't part of this documentation.
          </p>
        </div>

        {/* §3b Diagnostics strip */}
        <div className={styles.diagnostics} role="status" aria-live="polite">
          {attempted ? (
            <p className={styles.diagnosticsLine}>
              <span className={styles.diagnosticsLabel}>You tried:</span>{' '}
              <code className={styles.urlCode}>{attempted}</code>
            </p>
          ) : null}
          {referrer ? (
            <p className={styles.diagnosticsLine}>
              <span className={styles.diagnosticsLabel}>You arrived from:</span>{' '}
              <code className={styles.urlCode}>{referrer}</code>
            </p>
          ) : null}
          <p className={styles.diagnosticsMeta}>HTTP 404 · noindex</p>
        </div>

        {/* §6 "Did you mean" suggestion (only when a target exists) */}
        {suggestion ? (
          <div className={styles.didYouMean}>
            <p>
              Did you mean:{' '}
              <Link to={suggestion} className={styles.suggestionLink}>
                <code>{suggestion}</code>
              </Link>
              ?
            </p>
          </div>
        ) : null}

        {/* §3c What likely happened */}
        <section className={styles.section} aria-labelledby="whyHeading">
          <h2 id="whyHeading" className={styles.sectionTitle}>
            A few things that may have happened
          </h2>
          <ul className={styles.reasonList}>
            <li>The page was renamed or retired during a documentation refactor.</li>
            <li>You mistyped part of the URL.</li>
            <li>A link from another site is out of date.</li>
          </ul>
        </section>

        {/* §3d Search */}
        <section className={styles.section} aria-labelledby="searchHeading">
          <h2 id="searchHeading" className={styles.sectionTitle}>
            Search the documentation
          </h2>
          <form
            method="get"
            action={searchUrl}
            className={styles.searchForm}
            role="search"
            aria-label="Search the documentation"
          >
            <input
              type="search"
              name="q"
              placeholder="Search the documentation"
              aria-label="Search the documentation"
              className={styles.searchInput}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
            <button type="submit" className={styles.searchButton}>
              Search
            </button>
          </form>
          <p className={styles.searchHint}>
            Or use the search box in the navigation bar above.
          </p>
        </section>

        {/* §3e Curated recovery jumps */}
        <section className={styles.section} aria-labelledby="jumpsHeading">
          <h2 id="jumpsHeading" className={styles.sectionTitle}>
            Or jump to one of these
          </h2>
          <ul className={styles.jumpsList}>
            {RECOVERY_JUMPS.map((jump) => (
              <li key={jump.to} className={styles.jumpItem}>
                <Link to={jump.to} className={styles.jumpLink}>
                  <span className={styles.jumpLabel}>{jump.label}</span>
                  <span className={styles.jumpDescription}>{jump.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* §3f Report broken link */}
        <section className={styles.reportSection}>
          <p>
            Think this URL should resolve?{' '}
            <Link
              to={reportUrl}
              className={styles.reportLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              Report broken link →
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
