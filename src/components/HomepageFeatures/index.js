import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import { CtaCards, icons } from '@infinum/docusaurus-theme';

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div id='get-started'>
        <CtaCards
          title='Welcome'
          subtitle="你好呀，欢迎来到Soda的面试复习自留地。本站为无人值守自助学习站。但你仍然可以通过以下几种方式找到我。"
          cards={[
            {
              icon: icons.frontendDevelopment,
              text: '看看我最近在做些什么',
              buttonLabel: 'Github',
              buttonUrl: 'https://github.com/ssoda01',
            },
            {
              icon: icons.puzzleOpenJob,
              text: '联系我',
              buttonLabel: '点此发邮件',
              buttonUrl: 'mailto:ssoda@qq.com',
            }
          ]}
        />
      </div>
    </section >
  );
}
