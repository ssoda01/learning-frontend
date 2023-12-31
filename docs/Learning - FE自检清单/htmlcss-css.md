---
sidebar_position: 8
---

# HTML&CSS篇 - CSS
## 1.CSS盒模型，在不同浏览器的差异
## 2.CSS所有选择器及其优先级、使用场景，哪些可以继承，如何运用at规则
## 3.CSS伪类和伪元素有哪些，它们的区别和实际应用
## 4.HTML文档流的排版规则，CSS几种定位的规则、定位参照物、对文档流的影响，如何选择最好的定位方式，雪碧图实现原理
## 5.水平垂直居中的方案、可以实现6种以上并对比它们的优缺点
## 6.BFC实现原理，可以解决的问题，如何创建BFC
1. BFC实现原理：
BFC（Block Formatting Context）是web页面布局渲染的一部分，是一个独立的渲染区块，具有以下特点：
- 内部的Box会在垂直方向，一个接一个放置
- 垂直方向的距离由margin决定，同个BFC垂直方向上的任意两个相邻box的margin会发生重叠，这是BFC中一个重要的特性。
- BFC区域不会与float box重叠
- BFC是一个独立的布局环境，内部元素布局与外部元素互不影响

BFC常见的应用场景有以下几种：
- 清除浮动
- 避免margin重叠
- 自适应两栏布局
- 防止文字环绕图片的问题

2. BFC可以解决的问题：
①、清除浮动（浮动元素会脱离文档流，向上浮动，导致浮动元素与其他元素重叠）；
②、解决margin重叠问题（同一个BFC下外边距的高度取max值，避免两个margin值之间的叠加）；
③、实现两栏布局（左侧固定，右侧自适应，并且左、右两栏相互独立）；
④、防止文字围绕图片而产生的布局问题等。

3. 如何创建BFC：
- 设置元素的display属性为inline-block、table-cell或flex；
- 设置元素的position属性为absolute或fixed；
- 设置元素的overflow属性为auto、scroll或hidden；
- 将元素使用float属性进行浮动；

需要注意的是，创建了BFC后，内外元素就不能相互嵌套，否则会因为边界塌陷等问题而影响布局效果，因此应当合理地控制使用BFC的范围和元素的层级关系。


## 7.可使用CSS函数复用代码，实现特殊效果
## 8.PostCSS、Sass、Less的异同，以及使用配置，至少掌握一种
## 9.CSS模块化方案、如何配置按需加载、如何防止CSS阻塞渲染
## 10.熟练使用CSS实现常见动画，如渐变、移动、旋转、缩放等等
## 11.CSS浏览器兼容性写法，了解不同API在不同浏览器下的兼容性情况
## 12.掌握一套完整的响应式布局方案