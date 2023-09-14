---
sidebar_position: 9
---

# HTML&CSS 篇 - 手写

## 1.手写图片瀑布流效果

1. 手写图片瀑布流效果代码：

HTML:

```html
<div class="waterfall">
  <div class="waterfall-item"></div>
  <div class="waterfall-item"></div>
  <div class="waterfall-item"></div>
  <div class="waterfall-item"></div>
  <div class="waterfall-item"></div>
</div>
```

CSS:

```css
.waterfall {
  display: flex;
  flex-wrap: wrap;
}

.waterfall-item {
  width: 200px;
  margin: 10px;
  height: auto;
}
```

JS:

```javascript
var container = document.querySelector(".waterfall");
var items = container.querySelectorAll(".waterfall-item");

container.style.columnCount = 3; // 分为3列

var itemHeightArr = [];
for (var i = 0; i < items.length; i++) {
  itemHeightArr.push(items[i].offsetHeight);
}

for (var i = 0; i < items.length; i++) {
  var minHeight = Math.min.apply(null, itemHeightArr);
  var minIndex = itemHeightArr.indexOf(minHeight);
  items[minIndex].appendChild(items[i]);
  itemHeightArr[minIndex] += items[i].offsetHeight;
}
```

## 2.使用 CSS 绘制几何图形（圆形、三角形、扇形、菱形等）

2. 使用 CSS 绘制图形代码：

圆形：

```css
.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: red;
}
```

三角形：

```css
.triangle {
  width: 0;
  height: 0;
  border-width: 20px;
  border-style: solid;
  border-color: transparent transparent red transparent;
}
```

扇形：

```css
.sector {
  width: 100px;
  height: 100px;
  background-color: red;
  border-radius: 0 100px 100px 0 / 0 50px 50px 0;
  transform: rotate(45deg);
  overflow: hidden;
}
```

菱形：

```css
.diamond {
  width: 0;
  height: 0;
  border: 50px solid transparent;
  border-bottom-color: red;
  transform: rotate(45deg);
}
```

## 3.使用纯 CSS 实现曲线运动（贝塞尔曲线）

3. 使用纯 CSS 实现曲线运动代码：

```css
.curve {
  width: 50px;
  height: 50px;
  background-color: red;
  position: relative;
  top: 0;
  left: 0;
  transition: all 1s cubic-bezier(0.7, -0.32, 0.04, 1.47);
  /* cubic-bezier 为贝塞尔曲线参数 */
}

.curve:hover {
  top: 300px;
  left: 500px;
}
```

## 4.实现常用布局（三栏、圣杯、双飞翼、吸顶），可是说出多种方式并理解其优缺点

4. 常用布局代码：

三栏布局：

```html
<div class="container">
  <div class="left"></div>
  <div class="main"></div>
  <div class="right"></div>
</div>
```

```css
.container {
  width: 100%;
}

.left {
  float: left;
  width: 200px;
}

.right {
  float: right;
  width: 200px;
}

.main {
  margin-left: 200px;
  margin-right: 200px;
}
```

圣杯布局：

```html
<div class="container">
  <div class="main"></div>
  <div class="left"></div>
  <div class="right"></div>
</div>
```

```css
.container {
  width: 100%;
  padding-left: 200px;
  padding-right: 200px;
}

.main {
  float: left;
  width: 100%;
}

.left {
  float: left;
  width: 200px;
  margin-left: -100%;
  position: relative;
  left: -200px;
}

.right {
  float: right;
  width: 200px;
  margin-right: -100%;
  position: relative;
  right: -200px;
}
```

双飞翼布局：

```html
<div class="container">
  <div class="main"></div>
</div>
<div class="left"></div>
<div class="right"></div>
```

```css
.container {
  width: 100%;
}

.main {
  float: left;
  width: 100%;
}

.left {
  float: left;
  width: 200px;
  margin-left: -100%;
  padding-right: 200px;
}

.right {
  float: right;
  width: 200px;
  margin-right: -100%;
  padding-left: 200px;
}
```

吸顶布局：

```html
<div class="container">
  <div class="header"></div>
  <div class="content"></div>
</div>
```

```css
.container {
  position: relative;
}

.header {
  position: fixed;
  top: 0;
  width: 100%;
}

.content {
  padding-top: 50px; /* 为 header 的高度 */
}
```
