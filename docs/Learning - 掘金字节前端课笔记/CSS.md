# CSS

## viewport

两种写法

1. 保持 scale=1
2. 保持 scale 放缩参数是 1/dpr

```html
## 1
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta
  name="viewport"
  content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
/>

## 2 const calcScale = 1/window.devicePixelRation;
<meta
  name="viewport"
  content="width=device-width,
initial-scale=calcScale,
maximum-scale=calcScale,
minimum-scale=calcScale,
user-scalable=no"
/>
```

## em

1. 非 font-size 属性中是相对于自身的字体大小
2. font-size 上使用是相对于父元素的字体大小
   （所以字体 font-size 不用 em，因为会不断嵌套放大、缩小，发生混乱）

## rem

1. 根元素的字体大小，通过伪类:root 或者 html 选择器选定。因为是根元素，所以不会像 em 一样多重嵌套。
2. 第二种 viewport 方式

   1. 设置：
      根据 dpr 设置 viewport，1css px 等于一个设备像素
      1/window.devicePixelRatio
      js 设置 rem 为视口宽度的 1/10
   2. 应用：
      750px 的设计稿，给卡片宽度 60px，通过 px2rem，将 rem 转换为 px。
      假设设计稿为 750，所以基准 75。width: 0.8rem; // = 60/75
   3. 表现：
      375 dpr=2 的设备。rem=75px。width: 0.8*75 = 60px （375*2/10 = 75）
      320 dpr=2 rem=64px width: 0.8\*64 = 51.2px

   ```jsx

   const rem = documentElement.clientWidth/10
   document.documentElement.style.fontSize = `${Number(rem)px}`
   ```

## css 生态工具

语言增强：CSS 预处理器、CSS 后处理器
工程架构：CSS 模块化、CSS-In-JS、Atomic CSS

### 语言增强

CSS 预处理器

提高开发效率：

1. 自定义变量
2. 嵌套、作用域
3. mixins、继承
4. 操作符、条件/循环语句、自定义函数

```scss
// 计算单列的单个宽度
@function column-width($col, $total) {
  @return percentage($col/$total);
}
.col-1 {
  width: column-width(1, 10);
}
.col-1 {
  width: column-width(3, 10);
}
// --- 编译为 ---
.col-1 {
  width: 10%;
}
.col-3 {
  width: 30%;
}
```

CSS 后处理器

后处理框架：postcss

机制：词法分析，语法分析，获取 ast、Plugins 通过 Processor 处理 AST>modified AST，再 Stringifier 转换成我们需要的 css 代码

后处理框架上的 plugins：

- 打包相关：cssnano(减小 css 体积)、stylelint
- fallbacks：autoprefixer(补全 css 前缀)
- 面向未来 css
- 编程增强
- 代码分析

### 工程架构：、CSS-In-JS、Atomic CSS

CSS 模块化

1. BEM 命名规范
   .block\_\_element—modifier

```html
.header-btn__prev{} .header-btn__next{}
```

1. vue-loader 的 scoped 方案
   编译方式 在 html 元素上添加 data-xxxx 唯一属性，再通过 css 添加属性选择器[data-xx]实现样式隔离

```html
<style scoped>
  .example {
    color: red;
  }
</style>
<div class="example">
  h1
  <div></div>
</div>
```

```
<!-- 编译后 -->
<style>
.example[data-v-f3f3cg9]{
	color:red;
}
</style>
<div class="example" data-v-f3f3cg9></div>
```

1. CSS Modules

   编译方式，将一个 css file 中的样式名称转换为一个全局默认的名称，实现样式隔离
   常用：css-loader、postcss-module

CSS-In-JS

将应用的 css 样式写在 js 文件里，利用 js 动态生成 css

1. ~~inline-style 流派 一~~已被抛弃
   1. 代表：radium
   2. 写在元素行内的 style 里
2. unique classname 流派
   1. 代表：styled-component
   2. 动态生成唯一类名
   3. 机制：
   4. 生成一个 classname 作为 componentId 无样式关联
   5. 生成第二个 classname 作为唯一类名（hash 值），使用 stylis，生成和唯一类名关联的 css 字符串
   6. 唯一类名对应的 css 样式 insert 到`<head>`的`<style>`
   7. 将两个类名写到目标节点的 class 中
   8. 好处：
   9. 避免全局样式污染
   10. 复杂样式可以更灵活编写
   11. 首屏渲染无多余 css 阻塞（因为 css 是实时生成）
   12. 坏处：
   13. 有一定学习成本
   14. 存在运行时消耗
   15. css-in-js 的库导致打包体积增大
   16. 代码可读性降低

原子化 css

小巧、单一用途 class
代表库、框架：tailwind、windicss、tachyons、unocss

tailwind 的原理：

1. 先载入工具库
2. 按需生成
3. 支持配置样式规则、自定义插件

优点：

1. 减小 css 体积
2. 原子类复用率高
3. 移动和删除 html 节点变得容易
4. 减少 classname 的命名复杂度

缺点：

1. 增加 html 类名长度
2. 初始有学习成本和记忆成本
3. 样式库的定义成本（但是不完全是缺点）
