# Promises、异步、事件循环

参考：

- [Promises/A+](https://promisesaplus.com/)
- [tc39](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise-objects)
- [Promise 你真的用明白了么？](https://segmentfault.com/a/1190000023929979)

## 规定

Promise 的三种状态：pending、fulfilled、rejected

```
promise.then(onFulfilled, onRejected)
```

27.2 Promise 对象
Promise 是一个对象，用作延迟（可能是异步）计算的最终结果的占位符。

任何 Promise 都处于三种互斥状态之一：已完成、已拒绝和待处理
Any Promise is in one of three mutually exclusive states: fulfilled, rejected, and pending:

A promise p is fulfilled if p.then(f, r) will immediately enqueue a Job to call the function f.

A promise p is rejected if p.then(f, r) will immediately enqueue a Job to call the function r.

A promise is pending if it is neither fulfilled nor rejected.

## 事件循环

### 事件的类型

- 同步任务
- 异步任务

- 同步和异步任务分别进入不同的执行"场所"，同步的进入主线程，异步的进入 Event Table 并注册函数。
- 当指定的事情完成时，`Event Table`会将这个函数移入 Event Queue。
- 主线程内的任务执行完毕为空，会去`Event Queue`读取对应的函数，进入主线程执行。
- 上述过程会不断重复，也就是常说的 Event Loop(事件循环)。

```
let data = [];
$.ajax({
    url:www.javascript.com,
    data:data,
    success:() => {
        console.log('发送成功!');
    }
})
console.log('代码执行结束');
```

- ajax 进入 Event Table，注册回调函数 success
- 执行 console.log('代码执行结束')
- ajax 事件完成，回调函数 success 进入 Event Queue
- 主线程从 Event Queue 读取回调函数 success 并执行

#### setTimeout

```
setTimeout(() => {
    task()
},3000)
sleep(10000000)
```

乍一看其实差不多嘛，但我们把这段代码在 chrome 执行一下，却发现控制台执行 task()需要的时间远远超过 3 秒，说好的延时三秒，为啥现在需要这么长时间啊？

这时候我们需要重新理解 setTimeout 的定义。我们先说上述代码是怎么执行的：

- task()进入 Event Table 并注册,计时开始。
- 执行 sleep 函数，很慢，非常慢，计时仍在继续。
- 3 秒到了，计时事件 timeout 完成，task()进入 Event Queue，但是 sleep 也太慢了吧，还没执行完，只好等着。
- sleep 终于执行完了，task()终于从 Event Queue 进入了主线程执行。

上述的流程走完，我们知道 setTimeout 这个函数，是经过指定时间后，把要执行的任务(本例中为 task())加入到 Event Queue 中，又因为是单线程任务要一个一个执行，如果前面的任务需要的时间太久，那么只能等着，导致真正的延迟时间远远大于 3 秒。

我们还经常遇到 setTimeout(fn,0)这样的代码，0 秒后执行又是什么意思呢？是不是可以立即执行呢？ 答案是不会的，setTimeout(fn,0)的含义是，指定某个任务在主线程最早可得的空闲时间执行，意思就是不用再等多少秒了，只要主线程执行栈内的同步任务全部执行完成，栈为空就马上执行。

关于 setTimeout 要补充的是，即便主线程为空，0 毫秒实际上也是达不到的。根据 HTML 的标准，最低是 4 毫秒。

#### setInterval

上面说完了 setTimeout，当然不能错过它的孪生兄弟 setInterval。他俩差不多，只不过后者是循环的执行。对于执行顺序来说，setInterval 会每隔指定的时间将注册的函数置入 Event Queue，如果前面的任务耗时太久，那么同样需要等待。

唯一需要注意的一点是，对于 setInterval(fn,ms)来说，我们已经知道不是每过 ms 秒会执行一次 fn，而是每过 ms 秒，会有 fn 进入 Event Queue。一旦 setInterval 的回调函数 fn 执行时间超过了延迟时间 ms，那么就完全看不出来有时间间隔了。这句话请读者仔细品味。

#### Promise 与 process.nextTick(callback)

传统的定时器我们已经研究过了，接着我们探究 Promise 与 process.nextTick(callback)的表现。 process.nextTick(callback)类似 node.js 版的"setTimeout"，在事件循环的下一次循环中调用 callback 回调函数。

### 宏任务&微任务

我们进入正题，除了广义的同步任务和异步任务，我们对任务有更精细的定义：

==`macro-task(宏任务)`：包括整体代码 script，setTimeout，setInterval==

==`micro-task(微任务)`：Promise，process.nextTick==

不同类型的任务会进入对应的 Event Queue，比如 setTimeout 和 setInterval 会进入相同的 Event Queue。

事件循环的顺序，决定 js 代码的执行顺序。进入整体代码(`宏任务`)后，开始第一次循环。接着执行所有的`微任务`。然后再次从宏任务开始，找到其中一个任务队列执行完毕，再执行所有的微任务。听起来有点绕，我们用文章最开始的一段代码说明：

```
setTimeout(function() {
    console.log('setTimeout');
})

new Promise(function(resolve) {
    console.log('promise');
}).then(function() {
    console.log('then');
})

console.log('console');
```

```
//输出
promise
console
then
setTimeout
```

- 这段代码作为宏任务，进入主线程。
- 先遇到 setTimeout，那么将其回调函数注册后分发到宏任务 Event Queue。(注册过程与上同，下文不再描述)
- 好啦，整体代码 script 作为第一个宏任务执行结束，看看有哪些微任务？我们发现了 then 在微任务 Event Queue 里面，执行。
- ok，第一轮事件循环结束了，我们开始第二轮循环，当然要从宏任务 Event Queue 开始。我们发现了宏任务 Event Queue 中 setTimeout 对应的回调函数，立即执行。

看看下一题

```
console.log('1');

setTimeout(function() {
    console.log('2');
    process.nextTick(function() {
        console.log('3');
    })
    new Promise(function(resolve) {
        console.log('4');
        resolve();
    }).then(function() {
        console.log('5')
    })
})
process.nextTick(function() {
    console.log('6');
})
new Promise(function(resolve) {
    console.log('7');
    resolve();
}).then(function() {
    console.log('8')
})

setTimeout(function() {
    console.log('9');
    process.nextTick(function() {
        console.log('10');
    })
    new Promise(function(resolve) {
        console.log('11');
        resolve();
    }).then(function() {
        console.log('12')
    })
})
```

```
//输出
1
7
6
8

2
4
3
5

9
11
10
12

```

整体 script 作为第一个宏任务进入主线程，遇到 console.log，输出 1。
遇到 setTimeout，其回调函数被分发到宏任务 Event Queue 中。我们暂且记为 setTimeout1。
遇到 process.nextTick()，其回调函数被分发到微任务 Event Queue 中。我们记为 process1。
遇到 Promise，new Promise 直接执行，输出 7。then 被分发到微任务 Event Queue 中。我们记为 then1
又遇到了 setTimeout，其回调函数被分发到宏任务 Event Queue 中，我们记为 setTimeout2。

| 宏任务 Event Queue | 微任务 Event Queue |
| ------------------ | ------------------ |
| setTimeout1        | process1           |
| setTimeout2        | then1              |

上表是第一轮事件循环宏任务结束时各 Event Queue 的情况，此时已经输出了 1 和 7。
我们发现了 process1 和 then1 两个微任务。
执行 process1,输出 6。
执行 then1，输出 8。 好了，第一轮事件循环正式结束，这一轮的结果是输出 1，7，6，8。那么第二轮时间循环从 setTimeout1 宏任务开始：
首先输出 2。接下来遇到了 process.nextTick()，同样将其分发到微任务 Event Queue 中，记为 process2。new Promise 立即执行输出 4，then 也分发到微任务 Event Queue 中，记为 then2。

| 宏任务 Event Queue | 微任务 Event Queue |
| ------------------ | ------------------ |
| setTimeout1        | process2           |
|                    | then2              |

第二轮事件循环宏任务结束，我们发现有 process2 和 then2 两个微任务可以执行。
输出 3。
输出 5。
第三轮事件循环开始，此时只剩 setTimeout2 了，执行。
直接输出 9。
将 process.nextTick()分发到微任务 Event Queue 中。记为 process3。
将 then 分发到微任务 Event Queue 中，记为 then3。

| 宏任务 Event Queue | 微任务 Event Queue |
| ------------------ | ------------------ |
|                    | process3           |
|                    | then3              |

第三轮事件循环宏任务执行结束，执行两个微任务 process3 和 then3。
输出 10。
输出 12。
第三轮事件循环结束，第三轮输出 9，11，10，12。
整段代码，共进行了三次事件循环，完整的输出为 1，7，6，8，2，4，3，5，9，11，10，12。 (请注意，node 环境下的事件监听依赖 libuv 与前端环境不完全相同，输出顺序可能会有误差)

```
console.log('script start')

async function async1() {
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2 end')
}
async1()

setTimeout(function() {
  console.log('setTimeout')
}, 0)

new Promise(resolve => {
  console.log('Promise')
  resolve()
})
  .then(function() {
    console.log('promise1')
  })
  .then(function() {
    console.log('promise2')
  })

console.log('script end')
// script start => async2 end => Promise => script end => promise1 => promise2 => async1 end => setTimeout
```

首先先来解释下上述代码的 async 和 await 的执行顺序。当我们调用 async1 函数时，会马上输出 async2 end，并且函数返回一个 Promise，接下来在遇到 await 的时候会就让出线程开始执行 async1 外的代码，所以我们完全可以把 await 看成是让出线程的标志。

然后当同步代码全部执行完毕以后，就会去执行所有的异步代码，那么又会回到 await 的位置执行返回的 Promise 的 resolve 函数，这又会把 resolve 丢到微任务队列中，接下来去执行 then 中的回调，`当两个 then 中的回调全部执行完毕以后，又会回到 await 的位置处理 返回值`，这时候你可以看成是 Promise.resolve(返回值).then()，然后 await 后的代码全部被包裹进了 then 的回调中，所以 console.log('async1 end') 会优先执行于 setTimeout。

如果你觉得上面这段解释还是有点绕，那么我把 async 的这两个函数改造成你一定能理解的代码

```
new Promise((resolve, reject) => {
  console.log('async2 end')
  // Promise.resolve() 将代码插入微任务队列尾部
  // resolve 再次插入微任务队列尾部
  resolve(Promise.resolve())
}).then(() => {
  console.log('async1 end')
})
```

所以 Eventloop 执行顺序如下所示：

- 首先执行同步代码，这属于宏任务
- 当执行完所有同步代码后，执行栈为空，查询是否有异步代码需要执行
- 执行所有微任务
- 当执行完所有微任务后，如有必要会渲染页面
- 然后开始下一轮 Eventloop，执行宏任务中的异步代码，也就是 setTimeout 中的回调函数

所以以上代码虽然 setTimeout 写在 Promise 之前，但是因为 Promise 属于微任务而 setTimeout 属于宏任务，所以会有以上的打印。

微任务包括 process.nextTick ，promise ，Object.observe ，MutationObserver。

宏任务包括 script ， setTimeout ，setInterval ，setImmediate ，I/O ，UI rendering。

这里很多人会有个误区，认为微任务快于宏任务，其实是错误的。因为宏任务中包括了 script ，浏览器会先执行一个宏任务，接下来有异步代码的话才会先执行微任务。

### eventLoop 总结

同步任务
同步任务指的是，在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务。

异步任务
不进入主线程、而进入"任务队列"（task queue）的任务，只有"任务队列"通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行。

宏任务（macrotask）

在 ES6 规范中，macrotask 称为 task

包括

- script
- setTimeout
- setInterval
- setImmediate
- I/O

微任务（microtask）

在 ES6 规范中，microtask 称为 jobs

- process.nextTick
- promise
- Object.observe
- MutationObserver

setTimeout

比设定要晚运行

本质上 setTimeout 是经过制定时间后，把要执行的任务加入 event queue，由于单线程是一个一个执行，如果前面的任务需要时间太久，那么只能等。

最短间隔 4ms

HTML 5 标准规定，setTimeout 的最短时间间隔是 4 毫秒。在浏览器中，setTimeout()/setInterval() 的每调用一次定时器的最小间隔是 4ms，这通常是由于函数嵌套导致（嵌套层级达到一定深度），或者是由于已经执行的 setInterval 的回调函数阻塞导致的

this

由 setTimeout()调用的代码运行在与所在函数完全分离的执行环境上。这会导致，这些代码中包含的 this 关键字在非严格模式会指向 window (或全局)对象，严格模式下为 undefined，这和所期望的 this 的值是不一样的。

setInterval

对于 setInterval(fn,ms)来说，们已经知道不是每过 ms 秒会执行一次 fn，而是每过 ms 秒，会有 fn 进入 Event Queue。

requestAnimationFrame

大多数电脑显示器的刷新频率是 60Hz，大概相当于每秒钟重绘 60 次。大多数浏览器都会对重绘操作加以限制，不超过显示器的重绘频率，因为即使超过那个频率用户体验也不会有提升。因此，最平滑动画的最佳循环间隔是 1000ms/60，约等于 16.6ms

## Promise

Promise 哪些 API 涉及了微任务？

Promise 中只有涉及到状态变更后才需要被执行的回调才算是微任务，比如说 then、 catch 、finally ，其他所有的代码执行都是宏任务（同步执行）。

![img](https://segmentfault.com/img/remote/1460000023929982)

上图中蓝色为同步执行，黄色为异步执行（丢到微任务队列中）。

```
new Promise ((resolve)=>{
    resolve(1)
}).then(data=>{console.log(data)})
```
### 这些微任务何时被加入微任务队列？
这个问题我们根据 ecma 规范来看：
- 如果此时 Promise 状态为 pending，那么成功或失败的回调会分别被加入至 [[PromiseFulfillReactions]] 和 [[PromiseRejectReactions]] 中。如果你看过手写 Promise 的代码的话，应该能发现有两个数组存储这些回调函数。
- 如果此时 Promise 状态为非 pending 时，回调会成为 Promise Jobs，也就是微任务。

### 同一个 then，不同的微任务执行

#### 初级
```
Promise.resolve()
  .then(() => {
    console.log("then1");
    Promise.resolve().then(() => {
      console.log("then1-1");
    });
  })
  .then(() => {
    console.log("then2");
  });
```
以上代码大家应该都能得出正确的答案：then1 → then1-1 → then2。

虽然 then 是同步执行，并且状态也已经变更。但这并不代表每次遇到 then 时我们都需要把它的回调丢入微任务队列中，而是等待 then 的回调执行完毕后再根据情况执行对应操作。

基于此，我们可以得出第一个结论：*链式调用中，只有前一个 then 的回调执行完毕后，跟着的 then 中的回调才会被加入至微任务队列。*

#### 中级

大家都知道了 Promise resolve 后，跟着的 then 中的回调会马上进入微任务队列。

那么以下代码你认为的输出会是什么？

```
let p = Promise.resolve();

p.then(() => {
  console.log("then1");
  Promise.resolve().then(() => {
    console.log("then1-1");
  });
}).then(() => {
  console.log("then1-2");
});

p.then(() => {
  console.log("then2");
}); 

// then 1
// then 2
// then 1-1
// then 1-2
```
按照一开始的认知我们不难得出 then2 会在 then1-1 后输出，但是实际情况却是相反的。

基于此我们得出第二个结论：每个链式调用的开端会首先依次进入微任务队列。

接下来我们换个写法：
```
let p = Promise.resolve().then(() => {
  console.log("then1");
  Promise.resolve().then(() => {
    console.log("then1-1");
  });
}).then(() => {
  console.log("then2");
});

p.then(() => {
  console.log("then3");
});

// then1
// then1-1
// then2
// then3
```
上述代码其实有个陷阱，then 每次都会返回一个新的 Promise，此时的 p 已经不是 Promise.resolve() 生成的，而是最后一个 then 生成的，因此 then3 应该是在 then2 后打印出来的。

顺便我们也可以把之前得出的结论优化为：*同一个 Promise 的每个链式调用的开端会首先依次进入微任务队列。*

#### 高级

以下大家可以猜猜 then1-2 会在何时打印出来？

```
Promise.resolve()
  .then(() => {
    console.log("then1");
    Promise.resolve()
      .then(() => {
        console.log("then1-1");
        return 1;
      })
      .then(() => {
        console.log("then1-2");
      });
  })
  .then(() => {
    console.log("then2");
  })
  .then(() => {
    console.log("then3");
  })
  .then(() => {
    console.log("then4");
  });
```
```
输出
VM243:3 then1
VM243:6 then1-1
VM243:14 then2
VM243:10 then1-2
VM243:17 then3
VM243:20 then4
```

这题肯定是简单的，记住第一个结论就能得出答案，以下是解析：

- 第一次 resolve 后第一个 then 的回调进入微任务队列并执行，打印 then1
- 第二次 resolve 后内部第一个 then 的回调进入微任务队列，此时外部第一个 then 的回调全部执行完毕，需要将外部的第二个 then 回调也插入微任务队列。
- 执行微任务，打印 then1-1 和 then2，然后分别再将之后 then 中的回调插入微任务队列
- 执行微任务，打印 then1-2 和 then3 ，之后的内容就不一一说明了

接下来我们把 return 1 修改一下，结果可就大不相同啦：

```
Promise.resolve()
  .then(() => {
    console.log("then1");
    Promise.resolve()
      .then(() => {
        console.log("then1-1");
        return Promise.resolve();
      })
      .then(() => {
        console.log("then1-2");
      });
  })
  .then(() => {
    console.log("then2");
  })
  .then(() => {
    console.log("then3");
  })
  .then(() => {
    console.log("then4");
  });
```
```
输出
VM292:3 then1
VM292:6 then1-1
VM292:14 then2
VM292:17 then3
VM292:20 then4
VM292:10 then1-2
```
当我们 return Promise.resolve() 时，你猜猜 then1-2 会何时打印了？

*答案是最后一个才被打印出来。*

为什么在 then 中分别 return 不同的东西，微任务的执行顺序竟有如此大的变化？以下是笔者的解析。

*PS：then 返回一个新的 Promise，并且会用这个 Promise 去 resolve 返回值，这个概念需要大家先了解一下。*

#### 根据 Promise A+ 规范
根据规范 2.3.2，如果 resolve 了一个 Promise，需要为其加上一个 then 并 resolve。

```
if (x instanceof MyPromise) {
  if (x.currentState === PENDING) {
  } else {
    x.then(resolve, reject);
  }
  return;
}
```
上述代码节选自手写 Promise 实现。

那么根据 A+ 规范来说，如果我们在 then 中返回了 Promise.resolve 的话会多入队一次微任务，但是这个结论还是与实际不符的，因此我们还需要寻找其他权威的文档。

根据 ECMA - 262 规范


根据规范 [25.6.1.3.2](https://www.ecma-international.org/ecma-262/#sec-promise-resolve-functions)，当 Promise resolve 了一个 Promise 时，会产生一个NewPromiseResolveThenableJob，这是属于 Promise Jobs 中的一种，也就是微任务。

> This Job uses the supplied thenable and its then method to resolve the given promise. This process must take place as a Job to ensure that the evaluation of the then method occurs after evaluation of any surrounding code has completed.

并且该 Jobs 还会调用一次 then 函数来 resolve Promise，这也就又生成了一次微任务。

这就是为什么会触发两次微任务的来源。

## Async、Await

await 和 promise 一样，更多的是考笔试题，当然偶尔也会问到和 promise 的一些区别。

await 相比直接使用 Promise 来说，优势在于处理 then 的调用链，能够更清晰准确的写出代码。缺点在于滥用 await 可能会导致性能问题，因为 await 会阻塞代码，也许之后的异步代码并不依赖于前者，但仍然需要等待前者完成，导致代码失去了并发性，此时更应该使用 Promise.all。

下面来看一道很容易做错的笔试题。

```
var a = 0;
var b = async () => {
  a = a + (await 10);
  console.log('2', a); // -> ？
};
b();
a++;
console.log('1', a); // -> ?
// 输出
// 1 1
// 2 10
```

这道题目大部分读者肯定会想到 await 左边是异步代码，因此会先把同步代码执行完，此时 a 已经变成 1，所以答案应该是 11。

其实 a 为 0 是因为加法运算法，先算左边再算右边，所以会把 0 固定下来。如果我们把题目改成(await 10)+a 的话，答案就是 11 了。

## Generator 和 async
