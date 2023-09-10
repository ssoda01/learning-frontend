---
sidebar_position: 2
---


# JS篇 - 变量&类型

## Javascript基础

语言的属性是由什么定义的呢？

[ECMAscript](https://tc39.es/ecma262/)
我们常说的ES5、ES6，是ECMAScript语言规范的不同版本。Babel的常见作用就是将ES6&6+的代码转译为ES5的代码。


## 变量&类型
### 1. JavaScript规定了几种语言类型

语言类型指 built-in types。 有以下七种。**Undefined, Null, Boolean, Number(2^64-2^53-1), BigInt, String, Symbol**

---

七种类型的详细解析请看：[6.1 ECMAScript 语言类型](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-data-types-and-values)

String(UTF-16,maximum length of 253 - 1 elements.，因为JavaScript中的数字类型采用的是IEEE 754标准规定的双精度浮点数格式，它使用64位表示一个数字，其中1位表示符号位，11位表示指数位，剩下的52位表示有效数字位。最大能表示的整数值为2^53-1，超过这个值后就会出现精度丢失的问题。因此，String类型最大长度为2^53-1。

在Unicode编码下，一个典型的字符（该字符可以是字母，数字，标点符号等）通常使用2个字节（16位）进行编码，但有些罕见字符可能需要4个或更多字节。因此，在Unicode中，一个长度为9007199254740991（2^53-1）的字符串可能会超过18万亿字节。请注意，JavaScript中的字符串长度限制是由语言实现限制的，而不是由Unicode的编码方式导致的限制。因此单纯考虑Sting的长度能不能足够放下时，不用考虑编码导致的字节长度增加问题。)
>
属性是容纳其他对象、原始值或函数的容器。

A primitive value  is a member of one of the following built-in types: **Undefined, Null, Boolean, Number, BigInt, String, and Symbol**；
基元值是下列内置类型之一的成员： **未定义、空、布尔、数、BigInt、字符串和符号**；

An object is a member of the built-in type **Object**;

A function is a callable object. A function that is associated with an object via a property is called a *method*.
>
对象是内置类型 Object 的成员；函数是可调用对象。通过属性与对象关联的函数称为方法。

ECMAScript 定义了一系列内置对象，以完善 ECMAScript 实体的定义。这些内置对象包括全局对象；对语言运行时语义至关重要的对象，包括对象（Object）、函数（Function）、布尔（Boolean）、符号（Symbol）和各种错误对象；表示和处理数值的对象，包括数学（Math）、数字（Number）和日期（Date）；文本处理对象 String 和 RegExp； 值的索引集合对象，包括数组（Array）和九种不同的类型数组（其元素均具有特定的数值数据表示法）；键集合，包括 Map 和 Set 对象；支持结构化数据的对象，包括 JSON 对象、ArrayBuffer、SharedArrayBuffer 和 DataView；支持控制抽象的对象，包括生成器函数和 Promise 对象；以及反射对象，包括 Proxy 和 Reflect。
>
ECMAScript 语法有意与 Java 语法相似。放宽 ECMAScript 语法是为了使其成为一种易于使用的脚本语言。例如，变量不需要声明其类型，类型也不需要与属性相关联，定义的函数也不需要在调用前以文本形式显示其声明。
>
--By https://tc39.es/ecma262/multipage/overview.html#sec-web-scripting

### 2.JavaScript对象的底层数据结构是什么

HashMap

---

Object 类型的每个实例(也简称为“一个 Object”)表示一个属性集合。每个属性要么是一个数据属性，要么是一个访问器属性:
- 数据属性将键值与 ECMAScript 语言值和一组布尔属性关联。
- 访问器属性将键值与一个或两个访问器函数以及一组布尔属性关联。访问器函数用于存储或检索与该属性关联的 ECMAScript 语言值。
>
使用属性键唯一标识对象的属性。属性键可以是字符串，也可以是符号。所有字符串和符号(包括空字符串)都作为属性键有效。属性名是一个属性键，它是一个 String。

整数索引是一个属性名称 n，使 CanonicalNumericIndexString (n)在 + 0 F 到 F (253-1)的包含区间内返回一个整数。数组索引是一个整数索引 n，这样 CanonicalNumericIndexString (n)在从 + 0 F 到 F (232-2)的包含区间内返回一个整数。

属性键用于访问属性及其值。对于属性有两种访问: get 和 set，分别对应于值检索和赋值。通过 get 和 set 访问可访问的属性包括作为对象直接部分的自身属性和通过属性继承关系由另一个关联对象提供的继承属性。继承属性可以是关联对象的自有属性，也可以是继承属性。对象的每个自己的属性必须各自具有一个与该对象的其他自己的属性的键值不同的键值。
>
所有对象在逻辑上都是属性的集合，但是存在多种形式的对象，它们在访问和操作属性时的语义不同。有关多种对象形式的定义，请参见6.1.7.2。

### 3. Symbol类型在实际开发中的应用、可手动实现一个简单的Symbol

在实现一个 JavaScript 的迭代器时使用 Symbol，可以用 Symbol 来定义迭代器的 next 方法和 iterable 属性。例如：

```
const myIterable = {
  [Symbol.iterator]() {
    let index = 0;
    const data = [1, 2, 3, 4, 5];
    return {
      next() {
        if (index < data.length) {
          return { value: data[index++], done: false };
        } else {
          return { done: true };
        }
      }
    };
  }
};
```

在此示例中，myIterable 对象具有一个 Symbol.iterator 方法，该方法返回一个迭代器对象。由于此迭代器使用了 Symbol，因此它的行为与其他迭代器不同。此迭代器可以使用 for...of 循环进行迭代：

```
for (const value of myIterable) {
  console.log(value);
}
// Output: 1 2 3 4 5
```

这里我们用 Symbol.iterator 在对象上添加了一个方法，它返回一个迭代器对象，这个迭代器对象具有 next() 方法。每次调用 next() 方法都返回一个包含 value 和 done 两个属性的对象，value 表示下一个需要迭代的元素，done 表示该迭代器的状态是否已完成。利用这种方式，我们可以创建一个自定义迭代器用来遍历自定义数据结构，而 Symbol 是实现这个过程中必不可少的东西。

### 4.JavaScript中的变量在内存中的具体存储形式

- 原始类型：7种。Undefined、null、Boolean、Number、Bigint、String、Symbol
- 引用类型：对象&数组。堆内存。堆内存中不被引用指向的对象或数组，会被自动垃圾收集器清理。

### 5.基本类型对应的内置对象，以及他们之间的装箱拆箱操作

#### 一： 装箱

基本类型不能调用对应内置对象的方法，只有将基本类型转换为相应的对象才能使用对象的方法。

我们会看到以下代码：
```
const str = 'hello world';
str.substring(0,3);

const num = 12.345;
num.toFixed(1);
```
众所周知，Javascript只有Object类型才有方法。上面代码能执行正是因为自动装箱的结果。
什么是装箱呢？就是将基本类型转成对象类型的操作。分为显式装箱和隐式装箱。
- 显式装箱：
通过内置对象String、Boolean、Number等可以对基本类型进行显式装箱
ini复制代码const strObj = new String('hello world');

- 隐式装箱：
当读取一个基本类型值时，后台会为该基本类型创建一个对应的基本类型包装对象。在这个基本类型上调用方法，实际上是在这个基本类型包装对象上调用方法。这个基本类型包装对象是临时的，它只存在于方法调用那一行代码的的瞬间，一旦调用完毕就立即销毁。
```
num.toFixed(1);
// 在后台的具体执行如下：
const c = new Number(12.345);
c.toFixed(1);
c = null;
```
当我们访问 num 时，要从内存中读取这个数字的值，此时访问过程处于读取模式。在读取模式中，后台进行了三步处理：
- 创建一个 Number 类型的实例。
- 在实例上调用方法。
- 销毁实例。

#### 二、拆箱
拆箱操作是将一个装箱对象转换为其对应的基本类型值的过程。

拆箱操作在以下情况下会被使用：

- 需要获取装箱对象的基本类型值：有时候我们需要获取装箱对象的基本类型值，以便进行计算、比较和其他操作。
- 需要将装箱对象与其他基本类型进行比较：当我们需要将装箱对象与其他基本类型进行比较时，需要先对装箱对象进行拆箱操作。

需要对装箱对象进行特定的操作：某些内置对象提供了一些特定的方法和属性，只能通过对装箱对象进行拆箱操作来使用。

需要注意的是，JavaScript中的大多数情况下会自动进行拆箱操作，所以我们在大多数情况下是不需要手动进行拆箱操作的。拆箱操作通常隐式地发生在需要获取装箱对象的基本类型值时。

拆箱过程内部调用了抽象操作 ToPrimitive 。该操作接受两个参数，第一个参数是要转变的对象，第二个参数 PreferredType 是对象被期待转成的类型。第二个参数不是必须的，默认该参数为 number，即对象被期待转为数字类型。有些操作如 String(obj) 会传入 PreferredType 参数。有些操作如 obj + " " 不会传入 PreferredType。
具体转换过程是这样的。默认情况下，ToPrimitive 先检查对象是否有 valueOf 方法，如果有则再检查 valueOf 方法是否有基本类型的返回值。如果没有 valueOf 方法或 valueOf 方法没有返回值，则调用 toString 方法。如果 toString 方法也没有返回值，产生 TypeError 错误。
PreferredType 影响 valueOf 与 toString 的调用顺序。如果 PreferrenType 的值为 string。则先调用 toString ,再调用 valueOf。

参考[Methods of primitives](https://javascript.info/primitives-methods)

具体测试代码如下：
```
var obj = {
    valueOf : () => {console.log("valueOf"); return []},
    toString : () => {console.log("toString"); return []}
}

String(obj)
// toString
// valueOf
// Uncaught TypeError: Cannot convert object to primitive value

obj+' '
//valueOf
//toString
// Uncaught TypeError: Cannot convert object to primitive value

Number(obj)
//valueOf
//toString
// Uncaught TypeError: Cannot convert object to primitive value
```
### 6.理解值类型和引用类型
#### 值类型
值类型的数据是不可变的，在内存中占有固定大小的空间，它们都会被存储在栈（stack）中。
```
let a = 2;
let b = a;
b++;
console.log(a, b);  // 2, 3
```

a所持有的值是值类型，所以当执行b = a时，b会持有2的一个副本。所以b改变时，a并未受到影响。a和b所持有的值相互独立。

在调用函数时，传递给函数参数如果是值类型，也是通过值复制的方式传递：
```
let a = 2;

function foo(b) {
  b++;
  console.log(b); // 3
}

foo(a);
console.log(a); // 2
```
实际上在调用foo函数时，会把实参a的值复制给b，所以b所持有的值也是2，但是和a相互独立，所以更改b的值同样不影响a。


如果我们使用构造函数声明一个基本类型，并改变它会怎么样？
```
let a = new Number(10);
let b = a;
b++;
console.log(a); // Number {[[PrimitiveValue]]: 10}
console.log(b); // 11
```
实际上，因为a是通过构造函数声明的，所以它所持有的值是引用类型，所以在第二步let b = a时，b和a指向同一个引用。
但是第三步中b++（等价于b = b + 1），在执行b + 1时，进行了隐式拆箱，将b从Number对象提取为基本类型10，所以最后b的值变成了11，而a的值并未受到影响。

#### 引用类型
引用类型的数据大小不固定，所以把它们的值存在堆（Heap）中，但还是会把它们在堆中的内存地址存在栈中。在查询引用类型数据时，先从栈中读取所持有的数据在堆中的内存地址，然后根据地址找到实际的数据。
```
const a = { name: "zhangsan", age: 20 };
const b = a;

b.name = "lisi";
console.log(a); // {name:"lisi", age:20}
console.log(b); // {name:"lisi", age:20}
```

a所持有的值是引用类型，所以当执行b = a时，b会复制a的引用（堆内存地址），即a和b指向对一个对象。所以b改变name属性时，a会受到影响。

在调用函数时，传递给函数参数如果是引用类型，也是通过引用复制的方式传递：
```
const a = { name: "zhangsan", age: 20 };

function foo(b) {
  b.name = "lisi";
  console.log(b);// {name:"lisi", age:20}
}

foo(a);
console.log(a); // {name:"lisi", age:20}
```
实际上在调用foo函数时，会把实参a的引用复制给b，所以a和b指向对一个对象，结果就是改变b的属性，a同样会受到影响。

由于引用指向的是值本身，而不是变量，所以一个引用无法更改另一引用的指向。

在另一个例子中：
```
let a = { name: "zhangsan", age: 20 };
let b = a;
b = { value: 123 };

console.log(a); // {name:"zhangsan", age:20}
console.log(b); // {value:123}
```

关键是在b = { value: 123 }这一步，实际上是更改b的指向，使得a和b指向不同的对象。但是b指向的改变并不会影响a的值。

为什么会有栈内存和堆内存？

通常与gc（垃圾回收机制）有关。为了使程序运行时占用的内存最小。

当一个方法执行时，每个方法都会建立自己的内存栈，在这个方法内定义的变量将会被逐个放入这块栈内存里，当方法执行结束，这个方法的内存栈也会被销毁。因此，所有在方法中定义的变量都存放在栈内存中。

但当在程序创建一个对象时，这个对象将被保存到运行时数据区中，以便反复利用（因为对象的创建成本通常较大），这个运行时数据区就是堆内存。堆内存中的对象不会随方法的结束而销毁，即使方法调用结束后，只要这个对象还可能被另一个变量所引用，则这个对象就不会被销毁；只有当一个对象没有被任何变量引用它时，系统的垃圾回收机制才会回收它。

在es6中我们使用const关键字表示常量。即变量所持有的值不可变。

如果变量所持有的值是值类型，那么这个值确定不可变。如果持有的值是引用类型，我们依旧可以更改该值的内容。这是因为const保证的是栈内存中数据不变性：

- 对于值类型来说，栈内存中的数据就是所持有的值
- 而对于引用类型来说，`栈内存中的数据`只是`所持有的值在堆内存中的内存地址`，我们改变该值的内部属性并不会影响它在堆内存中的内存地址。但如果重新赋值一个新的引用类型的值是不合法的，因为这会修改变量所绑定内存地址

### 7.null和undefined的区别

#### null表示"没有对象"，即该处不应该有值。

典型用法是：
- 作为函数的参数，表示该函数的参数不是对象。
- 作为对象原型链的终点。
```
Object.getPrototypeOf(Object.prototype)
// null
```

#### undefined表示"缺少值"，就是此处应该有一个值，但是还没有定义。

典型用法是：
- 变量被声明了，但没有赋值时，就等于undefined。
- 调用函数时，应该提供的参数没有提供，该参数等于undefined。
- 对象没有赋值的属性，该属性的值为undefined。
- 函数没有返回值时，默认返回undefined。
```
var i;
i // undefined

function f(x){console.log(x)}
f() // undefined

var  o = new Object();
o.p // undefined

var x = f();
x // undefined
```

### 8.至少可以说出三种判断JavaScript数据类型的方式，以及他们的优缺点，如何准确的判断数组类型
#### typeof

原始类型中除了null，其它类型都可以通过typeof来判断。

typeof null的值为object，历史遗留问题。如果想具体判断null类型，就用xxx === null判断。

对于对象类型来说，typeof只能具体判断函数的类型为function，其它均为object。

#### instanceof
instanceof  内部通过原型链的方式来判断是否为构建函数的实例，常用于判断具体的对象类型。


instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。

```
function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
}
const auto = new Car('Honda', 'Accord', 1998);

console.log(auto instanceof Car);
// Expected output: true

console.log(auto instanceof Object);
// Expected output: true
```
```
obj = {"a":"1"}
obj instanceof Array
// false
obj instanceof Object
// true
new Date() instanceof Date
// true
```
```
[] instanceof Array;
```
都说  instanceof  只能判断对象类型，其实这个说法是不准确的，我们是可以通过 hake 的方式得以实现，虽然不会有人这样去玩吧。
```
class CheckIsNumber {
  static [Symbol.hasInstance](number "Symbol.hasInstance") {
    return typeof number === 'number'
  }
}

// true
1 instanceof CheckIsNumber
```
> ES6中新增的Symbol.hasInstance属性的写法。Symbol.hasInstance是一个内置的符号，用于定制对象的 instanceof 操作符行为。
> 
> 当使用 instanceof 操作符检查一个对象是否为某个类的实例时，会首先检查该类的静态属性 Symbol.hasInstance。当检查到对象存在 Symbol.hasInstance 属性并且属性值是一个函数时，会调用该函数进行判断。
>
> 在这个例子中，class CheckIsNumber 声明了一个静态方法 Symbol.hasInstance。这个静态方法接受两个参数，第一个参数是待检查的对象，第二个参数是一个 Symbol.hasInstance。如果该对象是一个数字类型，方法会返回true，否则返回false。
>
> 方括号是用于计算属性名的写法，它允许在对象字面量中使用动态的属性名。在这个例子中，方括号里的内容是一个Symbol.hasInstance，这里使用了Symbol.hasInstance作为属性名来定义一个静态方法。

##### instanceof  原理
##### 手写  instanceof
```
const instanceOf = (left, right) => {
	const rpt = right.prototype
	white(true){
		if(left === null) return false
		if(left === rpt) return true

		left = left.__proto__
	}
}
instanceOf([], Object) // true
instanceOf([], String) // false
instanceOf('a', String) // true
```
```
const myInstanceof = (originData, preferredType) => {
    // originData
    const pft = preferredType.prototype;
    while (true) {
        if (originData === null) {
            return false
        }
        if (originData === pft) {
            return true
        }
        originData = originData.__proto__
    }
}
myInstanceof(originData = [], preferredType = Array)
myInstanceof(originData = [], preferredType = String)
```

另外其实我们还可以直接通过构建函数来判断类型：
```
// true
[].constructor === Array;
```
#### Object.prototype.toString
前几种方式或多或少都存在一些缺陷，Object.prototype.toString综合来看是最佳选择，能判断的类型最完整。
```
let a=1
Object.prototype.toString.call(a)
'[object Number]'
```
```
const checkType = obj => {
  const [typeEx, typeEn] = Object.prototype.toString.call(obj).split(' ');
  return typeEn.substring(0, typeEn.length - 1).toLowerCase();
};

checkType(1); // number
checkType([]); // array
checkType(new Date()); // date
```
#### isXXX API
判断特定类型
```
Array.isArray([]) // true
isNaN(1) // false
```



### 9.可能发生隐式类型转换的场景以及转换原则，应如何避免或巧妙应用

可能发生隐式类型转换的场景有以下几种：

1. 进行逻辑运算，比较运算符（例如 `==`）会隐式转换数据类型。
2. 进行算术运算时，不同类型的数据会隐式转换为相同的数据类型。
3. 字符串操作时，数字和布尔值等非字符串类型的数据会被转换为字符串类型。

在进行类型转换时，JavaScript 会根据一定的转换原则来确定转换的结果。这些转换原则包括以下几点：

1. 数字类型参与运算，字符串会被转成数字，布尔值会被转成 1 或 0。
2. 字符串类型参与运算，数字和布尔值会被转换成字符串。
3. 对象、数组等类型的参与运算会先转换成字符串，再根据情况进行转换。

为了避免隐式类型转换带来的问题，我们可以采取以下方案：

1. 优先使用严格相等运算符 `===`，避免使用 `==`。
2. 在进行运算前，先确定操作数的数据类型并进行必要的类型转换。
3. 在进行字符串操作时，使用模板字符串代替字符串拼接。

此外，巧妙地应用隐式类型转换也是一种很常用的方法。例如，在将一个数字转化成字符串的场景下，我们可以使用 `+` 运算符 （类似于 `String(n)` ）或者 `NaN` 的特殊性质来构造一些有趣的代码。但是，在巧妙应用类型转换时，我们必须确保代码可读性，不要让代码过于晦涩难懂。

### 10.出现小数精度丢失的原因，JavaScript可以存储的最大数字、最大安全数字，JavaScript处理大数字的方法、避免精度丢失的方法