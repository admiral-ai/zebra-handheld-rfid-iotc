/**
 * Report-broken-link page.
 *
 * Reached from the 404 page's "Report broken link" affordance. Reads
 * the attempted URL and referrer from query-string parameters (?url=
 * &referrer=) so the report is pre-populated; the visitor can refine
 * the URL, add a description, then pick a submission channel.
 *
 * Three submission channels:
 *   1. Copy to clipboard       — works for everyone, no login
 *   2. Compose email (mailto:) — works in any email client, no login
 *   3. Open GitHub issue       — requires GitHub login, but the
 *                                report-body is fully pre-filled
 *
 * The page is intentionally not in the sidebar — it's an action page
 * reached from the 404, not browsable content. Indexing is disabled.
 */

import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import styles from './report-broken-link.module.css';

const GITHUB_ISSUES_URL =
  'https://github.com/al1913-zebra/zebra-handheld-rfid-iotc/issues/new';

function buildReportText(
  url: string,
  referrer: string,
  description: string,
): string {
  return [
    'Broken link report',
    '',
    `Attempted URL: ${url || '(not provided)'}`,
    `Referrer: ${referrer || '(none)'}`,
    '',
    'Description:',
    description || '(none provided)',
    '',
    '---',
    'Reported via the Zebra IOTC docs broken-link form.',
  ].join('\n');
}

function buildGithubIssueUrl(
  url: string,
  referrer: string,
  description: string,
): string {
  const title = `Broken link: ${url || 'unknown URL'}`;
  const body = [
    `**Attempted URL:** ${url || '(not provided)'}`,
    '',
    `**Referrer:** ${referrer || '(none)'}`,
    '',
    '**Description:**',
    '',
    description || '_Nothing additional provided._',
    '',
    '---',
    '_Reported via the broken-link form on the docs site._',
  ].join('\n');
  return `${GITHUB_ISSUES_URL}?title=${encodeURIComponent(
    title,
  )}&body=${encodeURIComponent(body)}`;
}

function buildMailtoUrl(
  url: string,
  referrer: string,
  description: string,
): string {
  const subject = `Broken link on docs: ${url || 'unknown URL'}`;
  const body = buildReportText(url, referrer, description);
  // Note: no recipient is specified. Most email clients will open the
  // compose window with the user's default account; they can address
  // it to their docs maintainer / team contact.
  return `mailto:?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

export default function ReportBrokenLink(): JSX.Element {
  const [url, setUrl] = useState('');
  const [referrer, setReferrer] = useState('');
  const [description, setDescription] = useState('');
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>(
    'idle',
  );

  // Read query parameters on mount.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const qUrl = params.get('url');
    const qReferrer = params.get('referrer');
    if (qUrl) setUrl(qUrl);
    if (qReferrer) setReferrer(qReferrer);
  }, []);

  async function handleCopy(): Promise<void> {
    const text = buildReportText(url, referrer, description);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers / non-secure contexts.
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
    window.setTimeout(() => setCopyState('idle'), 2500);
  }

  return (
    <Layout
      title="Report a broken link"
      description="Tell us about a broken or stale URL in the Zebra Handheld RFID Reader IoT Connector documentation."
    >
      <Head>
        <meta name="robots" content="noindex" />
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>
          {/* Intro */}
          <header className={styles.intro}>
            <h1 className={styles.title}>Report a broken link</h1>
            <p className={styles.subtitle}>
              Tell us about a URL that didn't resolve. We'll fix it or
              add a redirect so others don't hit the same wall.
            </p>
          </header>

          {/* Form */}
          <section className={styles.section}>
            <label htmlFor="url" className={styles.fieldLabel}>
              The URL you tried
            </label>
            <input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={styles.input}
              spellCheck={false}
              autoComplete="off"
            />
            {url ? (
              <p className={styles.fieldHint}>
                Pre-filled from where you came from. Edit if it's wrong.
              </p>
            ) : null}
          </section>

          <section className={styles.section}>
            <label htmlFor="referrer" className={styles.fieldLabel}>
              Where did you arrive from?{' '}
              <span className={styles.optional}>(optional)</span>
            </label>
            <input
              id="referrer"
              type="text"
              value={referrer}
              onChange={(e) => setReferrer(e.target.value)}
              className={styles.input}
              placeholder="A search engine, a blog post, an internal Slack message…"
              spellCheck={false}
              autoComplete="off"
            />
          </section>

          <section className={styles.section}>
            <label htmlFor="description" className={styles.fieldLabel}>
              What were you looking for?{' '}
              <span className={styles.optional}>(optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className={styles.textarea}
              placeholder="If you can tell us the topic, we can suggest the right page."
            />
          </section>

          {/* Submission options */}
          <section className={styles.actions} aria-labelledby="sendHeading">
            <h2 id="sendHeading" className={styles.sectionTitle}>
              How would you like to send this?
            </h2>
            <p className={styles.actionsHint}>
              Pick whichever works for you. All three include the URL,
              referrer, and description above.
            </p>

            <div className={styles.actionList}>
              <button
                type="button"
                onClick={handleCopy}
                className={styles.actionButtonPrimary}
                aria-live="polite"
              >
                {copyState === 'copied'
                  ? '✓ Copied to clipboard'
                  : copyState === 'error'
                  ? '✗ Copy failed — try selecting text manually'
                  : '📋 Copy report to clipboard'}
              </button>

              <a
                href={buildMailtoUrl(url, referrer, description)}
                className={styles.actionButton}
              >
                📧 Compose email
              </a>

              <a
                href={buildGithubIssueUrl(url, referrer, description)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.actionButton}
              >
                🐛 Open GitHub issue
                <span className={styles.actionButtonNote}>
                  (GitHub login required)
                </span>
              </a>
            </div>
          </section>

          <hr className={styles.divider} />

          {/* While you're here — recovery */}
          <section aria-labelledby="recoverHeading">
            <h2 id="recoverHeading" className={styles.sectionTitle}>
              While you're here
            </h2>
            <p>
              You can also try finding the page yourself. Search via the
              box in the navigation bar at the top of this page, or jump
              to one of these:
            </p>
            <ul className={styles.jumpsList}>
              <li>
                <Link to="/foundations/start">Start here</Link>{' '}
                — where to begin in the docs
              </li>
              <li>
                <Link to="/quick-start/overview">Quick Start tutorial</Link>{' '}
                — read your first tag in 30 minutes
              </li>
              <li>
                <Link to="/reference/api-overview">MQTT API Reference</Link>{' '}
                — index of all 27 commands and events
              </li>
              <li>
                <Link to="/diagnose/symptoms">Something not working?</Link>{' '}
                — symptom-first failure index
              </li>
            </ul>
          </section>
        </div>
      </main>
    </Layout>
  );
}
