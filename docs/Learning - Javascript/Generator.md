# Generator\Promise\Async

## javavascript 的 generator 和 python 的 generator 有什么区别

JavaScript 和 Python 的 Generator（生成器）有一些区别：

1. JavaScript 的 Generator 通过 `function*` 关键词声明，而 Python 的 Generator 通过 `function` 中包含 `yield` 语句实现。
2. JavaScript 的 Generator 可以通过 `yield` 向外部返回值，也可以通过 `next` 方法向内部传递值；而 Python 的 Generator 则只能通过 `yield` 向外返回值，在 Python 3.x 中还可以使用 `yield from`语句向内部传递值。
3. JavaScript 的 Generator 可以使用 `return` 语句返回值，而 Python 的 Generator 则只能通过 `StopIteration` 异常返回值。

---

Python中的yield关键字的作用是将函数的执行结果返回给调用者，并保留函数的状态，以便下次调用继续执行。使用yield可将函数转换为生成器（generator）。生成器可以用于按需（on-demand）生成（yield）无限多的值或序列，而无需一次性生成所有的值。
与调用普通函数相比，使用生成器的效率通常更高。这是因为函数返回后会销毁函数对象和其所有变量，而使用生成器，在每次调用后函数对象和变量仍然存在于内存中，不需要重新初始化。此外，使用生成器还可以避免一次性处理所有数据，而是在需要时逐个生成，减少内存占用和计算时间。



JavaScript Generator 的简单例子：

```javascript
function* generateSeq() {
  let i = 0;
  while (i < 5) {
    yield i;
    i++;
  }
}

const seq = generateSeq();

console.log(seq.next()); // { value: 0, done: false }
console.log(seq.next()); // { value: 1, done: false }
console.log(seq.next()); // { value: 2, done: false }
console.log(seq.next()); // { value: 3, done: false }
console.log(seq.next()); // { value: 4, done: false }
console.log(seq.next()); // { value: undefined, done: true }
```

Python Generator 的简单例子：

```python
def generate_seq():
    i = 0
    while i < 5:
        yield i
        i += 1

seq = generate_seq()

print(next(seq)) # 0
print(next(seq)) # 1
print(next(seq)) # 2
print(next(seq)) # 3
print(next(seq)) # 4
print(next(seq)) # StopIteration
```

## javascript 的 Generator 和迭代器有什么差别

JavaScript 的 Generator 和迭代器之间存在一些差别。JavaScript 中的 Generator 常常用来创建可迭代对象，但不仅限于此。Generator 是一种特殊的函数，它可以生成多个值，并且可以在生成值之间进行暂停和恢复。生成器是通过`function*`关键字声明的，可以使用`yield`来返回值，这些值可以从外部和内部访问，而且也可以使用`return`返回最终值。生成器在需要时才生成值，而不是一次性生成所有值。在调用生成器时，可以使用`next()`方法来获取下一个生成的值。

迭代器是一种可以遍历集合或序列的对象，并且可以可以在访问集合的元素时进行迭代。在 JavaScript 中，迭代器是使用`Symbol.iterator`方法或`for...of`循环声明的，并且它们必须具有`next()`方法来返回下一个值和一个布尔值来表示是否遍历完成。每调用一次`next()`方法，都会返回集合的下一个值，当集合遍历完成后，将返回`{done: true}`。

因此，JavaScript 的生成器和迭代器之间的主要差异在于它们所特定的用途和实现方式。生成器是一种用于生成值的特殊函数，而迭代器则是一种用于遍历集合或序列的对象。

## javascript 的 Generator 过程中垃圾回收机制

在 JavaScript 中，当我们使用生成器时，由于生成器的特殊性质，垃圾回收机制可能会有所不同。

生成器会在执行过程中产生中间状态并保存上下文，以便在下次调用时可以从上一次暂停的位置继续执行。这可能会导致生成器函数调用的一些变量和对象没有被完全清理，因为它们仍存储在上下文中。

在一些情况下，这可能会导致内存泄漏或持续存在的变量和对象，其中内存泄漏指的是一些被分配的内存永远不会被回收，因此增加了整个应用程序的内存使用量。

为防止这种情况，我们可以通过显式地调用生成器函数的`return`方法来删除上下文并清理任何剩余的状态。这将允许垃圾回收机制回收该函数中所有的内存。

因此，在使用 JavaScript 生成器时，请确保正确管理其上下文，并定期检查垃圾回收过程是否按预期工作。

## python 的 Generator 过程中垃圾回收机制

在 Python 中，生成器也是一种特殊的函数，它可以生成多个值，并且能够在生成值之间进行暂停和恢复。它们使用 yield 表达式来生成值，当调用生成器的**next**()方法时，生成器会从上次暂停的位置继续执行。

由于生成器的特殊性质，垃圾回收机制可能会有所不同。由于 Python 拥有自动内存管理，所以在使用生成器时，Python 会处理内存管理问题。当生成器完成迭代时，Python 会自动清理生成器所占用的内存空间。

在一些情况下，当我们使用生成器时，因为 Python 拥有自动内存管理，垃圾回收机制可以处理我们需要处理的内存问题，所以我们不需要特别考虑垃圾回收机制。

但是，如果我们使用生成器函数引用了其他对象，这些对象可能在生成器执行时不再使用，但在垃圾回收发生之前，这些对象可能会占用内存。所以，我们可以使用`del`操作符来删除不再使用的对象和变量，以确保它们被及时回收。另外，如果我们需要长时间使用生成器，最好使用 Python 的内存分析工具，以确保生成器不会引起内存泄漏问题。

总的来说，Python 自动处理内存管理和垃圾回收问题，因此，我们通常无需特别关注垃圾回收机制问题。但我们仍然需要注意，在使用生成器时，避免滥用引用不再需要的对象和变量，以确保程序能够及时回收内存。

## python 中，generator 的使用

### 查询，把 es.scan 和 yield 结合使用

可以使用`scan`和`yield`结合来迭代地获取查询结果，这可能比直接使用`scan`更有效。

使用`scan`方法，查询是一次性完成的，Elasticsearch 会向缓存写入所有满足查询条件的文档。而如果使用`yield`实现迭代器，查询会被分成小的批次，并且每个批次只会检索少量的文档，从而减少查询期间的内存使用。

下面是一个用`scan`和`yield`结合的示例代码片段，该代码片段使用 Python 的 Elasticsearch 客户端来迭代获取 Elasticsearch 中所有文档的某个字段的值：

```python
from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan

es = Elasticsearch()

# 定义一个生成器函数，传入扫描查询和字段名称
def get_docs(query, field):
    # 使用scan方法获取文档迭代器
    docs = scan(es, query=query, index="your_index")
    # 遍历所有文档并使用yield返回指定字段的值
    for doc in docs:
        yield doc["_source"][field]

# 构建一个search查询，只包含您想要的字段
body = {
    "_source": "your_field"
}

# 调用生成器函数，传入搜索查询和字段名称作为参数
for value in get_docs(query=body, field="your_field"):
    print(value)
```

在这个示例代码中，我们定义了一个名为`get_docs`的生成器函数，该函数使用 scan 方法获取文档迭代器，并且遍历所有文档并使用 yield 返回指定字段的值。然后，我们通过传递搜索查询和字段名称作为参数来调用该函数，将生成器函数视为一个可迭代对象，可以使用 for 循环遍历获取每个文档的值。

使用`yield`实现迭代获取查询结果可以减少内存消耗，而且可以分批获取查询结果，从而更加高效。

### 批量赋值

当数据量级为 20w 条时，下面是一个使用 yield, scan 和 bulk 的 Python 代码示例，用于从所有 Elasticsearch 文档检索特定字段的值：

```python
from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan, bulk

def retrieve_field_from_all_docs(es, index_name, field_name):
    search_query = {"query": {"match_all": {}}}
    search_response = scan(es, query=search_query, index=index_name)
    bulk_fetch = []

    for doc in search_response:
        field_value = doc['_source'][field_name]
        bulk_fetch.append({'_id': doc['_id'], '_source': {field_name: field_value}})
        if len(bulk_fetch) == 1000:
            bulk(es, bulk_fetch, index=index_name, doc_type='_doc', refresh=True)
            bulk_fetch = []
            yield

    if bulk_fetch:
        bulk(es, bulk_fetch, index=index_name, doc_type='_doc', refresh=True)
        yield
```

使用该函数，可以遍历整个索引，并使用`yield`关键字来分批返回 `_source` 中的特定字段。`scan`函数用于迭代搜索结果，使我们能够逐步拉取。当检索到到 1000 次时，输入批量请求并删除批量缓冲区。

在该示例中，每次从返回的批量中提取特定字段的值，缓存字段的值，然后使用 `bulk_fetch` 批量更新索引中的 `_source` 字段。这样可以避免内存中缓存所有文档、批处理所有文档，并且在存储更新的文档时使用更少的存储器。此外，通过使用 `yield` 和 `scan()` 函数，可以避免将所有结果存储在内存中，从而减少内存使用。

## javascript 中 为什么 generator 的原型链上有 iteator 呢

Generator 函数是一种特殊的函数，可以暂停执行并在需要时恢复执行。它可以通过 `yield` 关键字来控制执行流程。而 `Iterator` 是一种接口，它定义了一种访问集合元素的方法，每次调用该方法都会返回集合中的下一个元素，直到所有元素都被访问完毕。

Generator 函数的返回值是一个实现了 `Iterator` 接口的对象，因此它的原型链上会有 `Iterator`，以便在使用该对象时可以调用 `next()` 方法来迭代访问生成器中的元素。因此，在 JavaScript 中，`Generator` 的原型链上会有 `Iterator`。

## 手写 Generator 自执行器，实现 Async/Await

[手写 Generator 自执行器(基于 Promise)](https://juejin.cn/post/6913857530951106567?searchId=202309112109506FB8E471CD47F04E5927)

```javascript
function* foo() {
  const a = yield 1;
  const b = yield 2;
  const c = yield 3;
  return 4;
}
```

对于同步代码来说，要让其自动执行非常简单：

```javascript
function run(fn) {
  const it = fn();
  let result = it.next();
  while (!result.done) {
    result = it.next(result.value);
  }
  return result.value;
}

const result = run(foo);
console.log(result); // [1, 2, 3]
```

但这种简单的处理方式无法处理异步逻辑，为了处理异步逻辑，我们需要：

自执行函数需要返回一个 Promise 对象，用于获取 Generator 最终结果
每次调用 next 后，将返回的结果转换为 Promise 对象，并且在该 Promise 完成后，在其 then 方法中继续调用 next 方法直至 Generator 完成为止

按照这个思路，先写点便于理解的代码：

```javascript
function mockFetch(data, timeout, fail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // fail参数是为了模拟异步请求出错的情况
      if (fail) {
        reject("error");
      }

      resolve(data);
    }, timeout);
  });
}

function* bar() {
  const a = yield mockFetch("a", 100);
  const b = yield mockFetch("b", 100);
  const c = yield mockFetch("c", 100);
  return [a, b, c];
}

const it = bar();
const res1 = it.next();

res1.value.then((a) => {
  const res2 = it.next(a);
  res2.value.then((b) => {
    const res3 = it.next(b);
    res3.value.then((c) => {
      const res4 = it.next(c);
      console.log("result", res4); // result { value: [ 'a', 'b', 'c' ], done: true }
    });
  });
});
```
通过上述的代码，就已经实现了一个最基础的自执行器，但这种方法只适用于bar函数。

下面开始真正的实现满足需要的自执行函数。

首先创建一个run函数，它接受Generator函数和Generator函数的参数作为参数，并且返回一个Promise对象：

