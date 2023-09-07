
import React, { useState } from 'react'
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import { CtaCards, icons } from '@infinum/docusaurus-theme';
// import ReactCurse, { Text, useInput, useExit } from 'react-curse'

// const Feature = () => {
//   const [counter, setCounter] = useState(0)

//   useInput(
//     input => {
//       if (input === 'q') useExit()
//       else setCounter(counter + 1)
//     },
//     [counter]
//   )

//   return (
//     <Text>
//       <Text block>
//         Counter: <Text color="Green">{counter.toString()}</Text>
//       </Text>
//       <Text dim block>
//         Press q to exit or any key to increment the counter
//       </Text>
//       <Text>
//         Edit <Text inverse>App.tsx</Text>
//       </Text>
//     </Text>
//   )
// }

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      {/* <Feature/> */}
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
