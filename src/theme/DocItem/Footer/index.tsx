/**
 * Swizzled @theme/DocItem/Footer.
 *
 * Replaces Docusaurus' default doc footer (tags row + Edit-this-page +
 * last-updated meta) with the PushFeedback widget rendered inline at
 * the bottom of every doc page.
 *
 * Configuration (matches the requested "Inline Thumbs" layout):
 *   - <feedback-modal embedded="true">  — embedded form, not a
 *     floating button
 *   - rating-mode="thumbs"               — thumbs-up / thumbs-down
 *   - rating-placeholder="Was this helpful?"  — the label above the
 *     rating control
 *   - rating="0"                         — neutral default (no rating
 *     selected)
 *   - modal-position="center"
 *
 * The PushFeedback CSS and ESM bundle are loaded once globally via the
 * `stylesheets` / `scripts` entries in docusaurus.config.ts. This
 * component only renders the element tag (a Stencil web component);
 * the bundle wires it up when it loads.
 *
 * Editorial note: the `editUrl` for docs is intentionally omitted from
 * docusaurus.config.ts so the default "Edit this page" link doesn't
 * render. The original DocItemFooter conditionally rendered
 * tags-row + edit-meta-row; with no edit-url and no tags on most
 * pages, that footer was empty. We replace it entirely with the
 * feedback widget.
 */

import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import styles from './styles.module.css';

// TypeScript: <feedback-modal> is a Web Component (custom element),
// so we declare it as a JSX intrinsic element.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'feedback-modal': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        project?: string;
        embedded?: string;
        'rating-mode'?: string;
        'rating-placeholder'?: string;
        rating?: string;
        'modal-position'?: string;
      };
    }
  }
}

export default function DocItemFooter(): ReactNode {
  return (
    <footer
      className={clsx(
        ThemeClassNames.docs.docFooter,
        'docusaurus-mt-lg',
        styles.feedbackFooter,
      )}
    >
      <feedback-modal
        project="fv5awvu82c"
        embedded="true"
        rating-mode="thumbs"
        rating-placeholder="Was this helpful?"
        rating="0"
        modal-position="center"
      />
    </footer>
  );
}
