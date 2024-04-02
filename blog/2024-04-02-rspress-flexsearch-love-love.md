---
slug: rspress-flexsearch-love-love
title: 太喜欢Rspress的搜索了（指Flexsearch
authors:
  name: Soda
  title: Kawaii
  url: https://github.com/ssoda01
  image_url: https://github.com/ssoda01.png
tags: [relax]
---

从文档框架自带搜索这个场景来说，本身没有多少文本量，为什么不能用 js 自己搜索呢。量变足够多了再考虑质变，也算是打破了我之前搜索必经服务器的迷信。

自己着手修改那个西语符号的问题之后，也确实感觉到，js实现的搜索是够用的。

毕竟前端都可以直接操作数据库了，用 wasm 还可以给你装个 sqlite。

半年没更新了，但是也想不起来发生过什么，只记得最后没有报名 JLPT。稀里糊涂地开始在 Github 打猎。存了很多大佬的 pr，想把自己缺的 e2e 补完。

提pr（~~打猎~~）之后，发现自己背的东西，都在别人的源码里优雅地运用着。~~每一道面试题都有它存在的理由。~~

之前看到[复杂度越低的算法就越好么？\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV16u4m1c7cU/)，repeat 了理解运行环境底层实现的重要性。python 的 sort 是 c 实现，有天然性能优势，已经和手写 python 排序不是一个赛道了。虽然要个人奋斗，但是也要考虑~~历史进程~~基座。

目前还停留在：`rust真是优雅，靠多加mut让用户多思考使用const还是let`的认知程度。

```rust
let
let mut
```