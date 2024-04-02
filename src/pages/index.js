import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';
import './index.css'
import * as Sentry from "@sentry/react";
import {
  Routes,
  Route,
  BrowserRouter,
  useLocation,
  createRoutesFromChildren,
  useNavigationType,
  matchRoutes,
} from "react-router-dom";

// const { matchRoutes } = useRouters;
function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Start (ง •_•)ง
            {/* Docusaurus Tutorial - 5min ⏱️ */}
          </Link>
        </div>
      </div>
    </header>
  );
}
Sentry.init({
  dsn: "https://a0b6afd51842620c4b5b5c691a0aff34@o4505549306134528.ingest.sentry.io/4505839223504896",
  integrations: [
    new Sentry.BrowserTracing({
      // See docs for support of different versions of variation of react router
      // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      ),
    }),
    new Sentry.Replay()
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  tracesSampleRate: 1.0,

  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello ${siteConfig.title}`}
      description="我真的很想去鹰角">
      <HomepageHeader />
      <main>
        <div className='zebra__shadow__text'>----------------------
        </div>
      </main>
    </Layout>
  );
}
