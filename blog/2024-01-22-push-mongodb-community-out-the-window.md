---
slug: push-mongodb-community-out-the-window
title: Push mongodb-community out the window
authors:
  name: Soda
  title: Impulsive
  url: https://github.com/ssoda01
  image_url: https://github.com/ssoda01.png
tags: [coding]
---

今天nvm切换node的时候，发现怎么都切不成功。

使用命令 nvm use 17

输出结果为Now using node v17.9.1 (npm v10.2.4)


然而继续使用命令node --version

输出结果却还是v21.6.0


换成n，用了sudo，还是没切换成功
> sudo n 17.9.1

> Password: \*\*\*\*\*\*


```
copying : node/17.9.1
installed : v17.9.1 to /usr/local/bin/node
active : v21.6.0 at /opt/homebrew/bin/node
```


试了fnm，也还是没成功


想把brew的node卸载了，结果报错
```
...
Error: Refusing to uninstall /opt/homebrew/Cellar/node/21.6.0
because it is required by mongodb-community and mongosh, which are currently installed.
You can override this and force removal with:
brew uninstall --ignore-dependencies node
```

很生气，一气之下卸载了
> brew uninstall mongodb-community
s s
把下面这一串都卸载了
- mongodb-community
- mongodb-database-tools
- mongosh

然后突然想起来，之前后台启动，一直没关，所以是开机自启动的：mongodb-community
> brew services start mongodb-community

猜测：估计是因为mongodb-community有用到nodejs，所以一直占用当前的这个nodejs，导致切换失败。

本来只要把mongodb-community推下跑步机就行了，我直接把它推到窗外了（指卸载）。


当然，为了不再碰到这种环境互相影响的事情。还是选择不再用brew启动mongodb了，改用docker吧。