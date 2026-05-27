/**
 * Swizzled @theme/DocItem/Footer.
 *
 * Renders a compact "Was this helpful?" prompt with thumbs-up /
 * thumbs-down trigger buttons. Clicking a thumb opens the PushFeedback
 * modal pre-set with that rating, where the user can add a free-text
 * message, email, optional screenshot, and submit.
 *
 * Pattern: official "Like / dislike feedback widget" example from
 * PushFeedback's docs CodePen
 * (https://codepen.io/David-Garcia-the-bashful/pen/jOgWaOp), surfaced
 * at https://docs.pushfeedback.com/customization/layout under the
 * "Like / dislike buttons" heading.
 *
 * The trick: two <feedback-button> elements, one with rating="1"
 * (thumbs up) and one with rating="0" (thumbs down). Each
 * <feedback-button> wraps a custom <button> with the SVG icon — the
 * PushFeedback web component uses its slotted content as the trigger
 * and opens the standard feedback modal (Share your thoughts +
 * Email + Add a screenshot + Send) when clicked.
 *
 * Implementation note (imperative DOM creation):
 *   Stencil web components can race against React's hydration. The
 *   docusaurus-pushfeedback plugin (used in earlier iterations) sets
 *   up <feedback-button> by document.createElement + setAttribute, so
 *   we follow the same pattern here in a useEffect rather than via
 *   JSX. The custom element bundle is loaded globally via
 *   `stylesheets` + `scripts` entries in docusaurus.config.ts.
 */

import React, { useEffect, useRef, type ReactNode } from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import styles from './styles.module.css';

const PROJECT_ID = 'fv5awvu82c';

// SVG icons taken from the official "Like / dislike feedback widget"
// CodePen, with stroke="currentColor" so the inner <button> controls
// the colour (via CSS) rather than hardcoding a hex.
const THUMB_UP_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>`;

const THUMB_DOWN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg>`;

// Success and error copy applied to every <feedback-button> so the
// confirmation pop-up uses our wording — see
// https://docs.pushfeedback.com/customization/text for the exact
// attribute names. Stencil kebab-cases the digits individually for
// the HTTP-status-coded errors (modal-title-error-4-0-3, ...-4-0-4).
const FEEDBACK_COPY: Record<string, string> = {
  // Success
  'modal-title-success':
    'Thanks for your feedback!',
  'success-message':
    "Your feedback has been recorded. We use it to make these docs better.",
  // Error
  'modal-title-error':
    'Oops!',
  'error-message':
    'Please try again later.',
  'modal-title-error-4-0-3':
    'The request URL does not match the one defined in PushFeedback for this project.',
  'modal-title-error-4-0-4':
    'We could not find the provided project ID in PushFeedback.',
};

function makeThumbTrigger(
  rating: '1' | '0',
  title: string,
  innerSvg: string,
  buttonClass: string,
): HTMLElement {
  const fb = document.createElement('feedback-button');
  fb.setAttribute('project', PROJECT_ID);
  fb.setAttribute('rating', rating);
  fb.setAttribute('button-style', 'default');
  fb.setAttribute('modal-position', 'center');
  // Apply the success / error copy
  for (const [name, value] of Object.entries(FEEDBACK_COPY)) {
    fb.setAttribute(name, value);
  }

  const inner = document.createElement('button');
  inner.className = buttonClass;
  inner.setAttribute('type', 'button');
  inner.setAttribute('title', title);
  inner.setAttribute('aria-label', title);
  inner.innerHTML = innerSvg;

  fb.appendChild(inner);
  return fb;
}

export default function DocItemFooter(): ReactNode {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    c.innerHTML = '';

    // Label
    const label = document.createElement('div');
    label.className = styles.label;
    label.textContent = 'Was this helpful?';
    c.appendChild(label);

    // Thumbs row
    const row = document.createElement('div');
    row.className = styles.thumbsRow;
    row.appendChild(
      makeThumbTrigger('1', 'Yes, this was helpful', THUMB_UP_SVG, styles.thumbBtn),
    );
    row.appendChild(
      makeThumbTrigger('0', 'No, this was not helpful', THUMB_DOWN_SVG, styles.thumbBtn),
    );
    c.appendChild(row);

    // Cleanup on unmount (client-side route change) so widgets don't pile up.
    return () => {
      c.innerHTML = '';
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
      <div ref={containerRef} className={styles.feedbackWidget} />
    </footer>
  );
}
