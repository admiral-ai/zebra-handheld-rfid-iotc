import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

type FeatureCardProps = {
  title: string;
  badge: 'tutorial' | 'howto' | 'reference' | 'explanation';
  description: string;
  to: string;
};

function FeatureCard({ title, badge, description, to }: FeatureCardProps) {
  return (
    <Link to={to} className={styles.card}>
      <div className={`badge-${badge} ${styles.cardBadge}`}>
        {badge.toUpperCase()}
      </div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>
    </Link>
  );
}

function HomepageHero() {
  return (
    <header className={styles.hero}>
      <div className="container">
        <h1 className={styles.heroTitle}>Zebra IoT Connector for Handheld RFID</h1>
        <p className={styles.heroSubtitle}>
          MQTT API documentation for RFD40 and RFD90 reader sleds. Build
          integrations, manage fleets, and stream tag data.
        </p>
        <div className={styles.heroButtons}>
          <Link
            className="button button--primary button--lg"
            to="/getting-started/quick-start/overview">
            Quick Start — Read a Tag in 45 min
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/reference/api-overview">
            API Reference
          </Link>
        </div>
      </div>
    </header>
  );
}

function FeatureGrid() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.cardGrid}>
          <FeatureCard
            badge="tutorial"
            title="New here? Start with the Quick Start"
            description="Connect a reader to a broker and read your first tag in under an hour using mosquitto_pub and mosquitto_sub."
            to="/getting-started/quick-start/overview"
          />
          <FeatureCard
            badge="explanation"
            title="Understand the architecture"
            description="Five hops from tag to application. MQTT 3.1.1, seven endpoint types, three-part topic structure."
            to="/foundations/architecture/end-to-end"
          />
          <FeatureCard
            badge="reference"
            title="Look up an endpoint"
            description="28 MQTT commands and 5 events organised into MGMT, CTRL, DATA, and MDM interfaces. Field schemas and error codes."
            to="/reference/api-overview"
          />
          <FeatureCard
            badge="howto"
            title="Set up a TLS connection"
            description="Install certificates, configure endpoints with MQTT_TLS, verify with mqttConnEVT."
            to="/infrastructure/security/tls-setup"
          />
          <FeatureCard
            badge="howto"
            title="Manage a fleet"
            description="SOTI Connect provisioning, bulk configuration, drift detection, phased firmware migration."
            to="/fleet/provisioning/models"
          />
          <FeatureCard
            badge="reference"
            title="Diagnose an issue"
            description="Symptom-driven troubleshooting across MQTT connection, RFID radio, tag data, Bluetooth, and battery."
            to="/reference/troubleshooting/approach"
          />
        </div>
      </div>
    </section>
  );
}

function PersonaSection() {
  return (
    <section className={styles.personas}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Where to start</h2>
        <div className={styles.personaGrid}>
          <div className={styles.persona}>
            <h3>New Integrator</h3>
            <p>I want to read a tag as fast as possible.</p>
            <Link to="/getting-started/quick-start/overview">→ Quick Start Tutorial</Link>
          </div>
          <div className={styles.persona}>
            <h3>Solution Builder</h3>
            <p>I&apos;m architecting a multi-reader deployment.</p>
            <Link to="/foundations/architecture/end-to-end">→ System Architecture</Link>
          </div>
          <div className={styles.persona}>
            <h3>API Consumer</h3>
            <p>I&apos;m writing integration code right now.</p>
            <Link to="/reference/api-overview">→ MQTT API Reference</Link>
          </div>
          <div className={styles.persona}>
            <h3>Fleet Operator</h3>
            <p>I manage deployed reader populations.</p>
            <Link to="/fleet/provisioning/models">→ Fleet Operations</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="MQTT API documentation for Zebra RFD40/RFD90 handheld RFID reader sleds. Built on the Diátaxis framework: tutorials, how-to guides, reference, explanations.">
      <HomepageHero />
      <main>
        <FeatureGrid />
        <PersonaSection />
      </main>
    </Layout>
  );
}
