/**
 * Swizzled @theme/DocItem/Footer.
 *
 * Replaces Docusaurus' default doc footer (tags row + Edit-this-page +
 * last-updated meta) with the PushFeedback widget rendered inline at
 * the bottom of every doc page.
 *
 * Configuration ("Inline Thumbs" layout):
 *   - <feedback-modal embedded="true">  — inline form, not floating
 *   - rating-mode="thumbs"               — thumbs-up / thumbs-down
 *   - rating-placeholder="Was this helpful?"  — label above rating
 *   - rating="0"                         — neutral (no rating yet)
 *   - modal-position="center"
 *
 * Implementation note:
 * Stencil web components (which is what <feedback-modal> is) do not
 * always reliably hydrate when React renders the element via JSX —
 * React sets attributes/props in a way that can race against the
 * Stencil bootstrap. Creating the element imperatively via
 * document.createElement + setAttribute + appendChild in a useEffect
 * matches the pattern the official docusaurus-pushfeedback plugin
 * uses for <feedback-button>, and is the path that reliably triggers
 * Stencil's connectedCallback → componentWillLoad → render lifecycle.
 *
 * The PushFeedback CSS and ESM bundle are loaded globally via
 * `stylesheets` / `scripts` in docusaurus.config.ts.
 */

import React, { useEffect, useRef, type ReactNode } from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import styles from './styles.module.css';

const PROJECT_ID = 'fv5awvu82c';

export default function DocItemFooter(): ReactNode {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear any prior render (in case of client-side route change).
    container.innerHTML = '';

    const modal = document.createElement('feedback-modal');
    modal.setAttribute('project', PROJECT_ID);
    modal.setAttribute('embedded', 'true');
    modal.setAttribute('rating-mode', 'thumbs');
    modal.setAttribute('rating-placeholder', 'Was this helpful?');
    modal.setAttribute('rating', '0');
    modal.setAttribute('modal-position', 'center');
    container.appendChild(modal);

    // Cleanup on unmount (route change) — remove the modal so it
    // doesn't pile up across navigations.
    return () => {
      container.innerHTML = '';
    };
  }, []);

  return (
    <footer
      className={clsx(
        ThemeClassNames.docs.docFooter,
        'docusaurus-mt-lg',
        styles.feedbackFooter,
      )}
    >
      <div ref={containerRef} className={styles.feedbackContainer} />
    </footer>
  );
}
