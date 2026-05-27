/**
 * Override @theme/NotFound — the React component the client-side router
 * uses for the wildcard `*` catch-all route.
 *
 * This is one of three surfaces that render the same content; see the
 * comment header in src/components/NotFoundBody.tsx for the architecture.
 */

import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import NotFoundBody from '@site/src/components/NotFoundBody';

export default function NotFound(): JSX.Element {
  return (
    <Layout
      title="Page not found"
      description="The URL you requested isn't part of this documentation."
    >
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <NotFoundBody />
    </Layout>
  );
}
