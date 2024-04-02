
# 前端入门 - 基础语言篇 - CSS基础

### CSS基础

在设置字体时，最后一个一定要写sans-serif这种通用字体族

css有五种通用字体族

- serif
- sans-serif（一般浏览器都是无衬线体了）
- cursive
- fantasy
- monospace

当你的字体用户设备上没有时，兜底的通用字体族可以让显示字体不至于和你期望的字体差别特别大。

英文字体写在中文字体前面。

### 深入CSS 上

选择启动特异度越高，权重越重

table

|  | id（#） | (伪)类（.） | 标签（E） |
| --- | --- | --- | --- |
| #nav .list li a:link | 1 | 2 | 2 |
|  |  |  |  |

字体属性一般隐式继承，box相关属性一般不继承。

可以用inhert显式继承

height：auto取值由内容计算而来。百分数相对于容器content box高度。容器有指定高度时，百分数才生效。

padding：当设置为百分比时，表示相对于容器宽度。不管是padding-left还是-top，都是相对容器宽度的。

项目里border-box用的比较多

IFC 行级排版上下文

只包含行级盒子的容器会创建一个IFC

BFC 块级

由于BFC和IFC不能共存 因此会生成匿名div把IFC包裹起来