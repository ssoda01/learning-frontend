# JS 运行环境

## Javascript 代码优化

- JIT（即时编译）
- 内联缓存 Inline Caching
- 隐藏类 Hidden Classes
- 内存管理优化

调试工具

- 浏览器开发者工具：现代浏览器都提供了内置的开发者工具，包括调试器、性能分析器、堆栈追踪等功能，可用于调试 JavaScript 代码。
- Node.js 调试工具：Node.js 提供了内置的调试工具，如 inspect 命令和 Chrome DevTools 集成等，可用于调试 Node.js 应用程序。
- 第三方调试器：还有许多第三方调试器可供选择，如 VS Code 的调试功能、Chrome DevTools Protocol、WebStorm 等。

GC 垃圾回收
_现在 js 引擎会使用这两方法结合_

1. 标记-清除算法（标记出活动的/非活动的，清除非活动的）
2. 引用计数法（被引用次数+1+1-1-1，为 0 时说明没有任何地方引用它了）

JavaScript 引擎的垃圾回收优化策略

## 微任务和宏任务

异步的实现：

事件循环 Event Loop （循环 等待）

任务队列 Task Queue

```javascript
while (true) {
  let task = taskQueue.pop();
  execute(task);
}
```

宏任务和微任务

任务队列中 有 MacroTask 和 MicroTask

宏任务：下一轮事件循环开始时执行

微任务：本轮事件循环结束时执行

这意味着微任务的优先级高于宏任务。

常见的宏任务有：script 全文（可以看作一种宏任务）、setTimeout、setInterval、setImmediate（Node.js 环境）、I/O、UI 渲染。

常见的微任务有：Promise、process.nextTick（Node.js 环境）、MutationObserver(html5 新特性)。

事件循环的顺序，决定了 JavaScript 代码的执行顺序。过程如下：
- 执行同步代码，这属于宏任务
- 执行栈为空，查询是否有微任务需要执行
- 执行所有微任务
- 必要的话渲染 UI
- 然后开始下一轮 Event loop，执行::宏任务中的异步代码::
  
这是因为 JavaScript 执行机制决定了微任务比宏任务优先执行。

还有一个：requestAnimationFrame

requestAnimationFrame 的执行时机是在下一次重绘之前，而不是立即执行。

requestAnimationFrame 的优点是由系统来决定回调函数的执行时机。如果系统忙到一定程度，可能会两次“刷新”之间多次执行回调函数，这时就可以省略掉一些回调函数的执行。这种机制可以有效节省 CPU 开销，提高系统的性能。

requestAnimationFrame 的位置在事件循环中的具体位置是视浏览器的实现而定，但一般来说，它在宏任务执行完，渲染之前，这使得其可以获取到最新的布局和样式信息。

## 浏览器渲染进程

浏览器 渲染进程

多线程工作流程

1. 网络线程加载网页资源
2. JS 引擎解析 JS 脚本并执行
3. JS 解析引擎空闲时 渲染线程立刻工作
4. 用户交互 定时器操作等产生回调函数放入任务队列中
5. 事件线程进行事件循环 将队列里的任务取出交给 js 引擎执行

正则表达式

[正则表达式 - 灾难性回溯](https://zh.javascript.info/regexp-catastrophic-backtracking)

[【正则表达式】正则表达式引发的惨案 回溯 超时 cpu 100](https://blog.csdn.net/qq_21383435/article/details/117619175)

检测正则有没有灾难性回溯等风险的正则检查网站：https://regex101.com/
