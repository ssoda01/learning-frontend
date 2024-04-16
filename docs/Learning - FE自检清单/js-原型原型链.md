---
sidebar_position: 3
---

# JS 篇 - 原型&原型链

## 1.理解原型设计模式以及 JavaScript 中的原型规则

原型设计模式是一种创建型设计模式，它用于创建对象的副本。

这种设计模式特别有用，当对象的创建成本很高时，可以通过复制已存在的实例来`减少创建新对象的成本`。

在 JavaScript 中，原型是实现`对象继承`和`属性查找`的基础。

每个 JavaScript 对象都有一个链接到另一个对象的 "原型"。当我们尝试访问对象的一个属性时，JavaScript 首先会在对象本身上查找这个属性，如果没有找到，它会去对象的原型上查找，如果还没有找到，它会继续在原型的原型上查找，以此类推，直到找到属性或者达到原型链的末端（null）。

### 关键考点：

`原型链`：在 JavaScript 中，所有的对象都有一个内部属性 [[Prototype]]，它链接到另一个对象，这就是原型。这些链接的对象形成了一条原型链。

`构造函数、实例和原型的关系`：每个构造函数都有一个 prototype 属性，指向另一个对象，这个对象就是通过这个构造函数创建的所有实例的原型。同时，每个实例都有一个 **proto** 属性，指向创建这个实例的构造函数的 prototype。

`属性查找`：当我们尝试访问对象的一个属性时，JavaScript 不仅在对象本身上查找，还会沿着原型链向上查找，直到找到或者达到原型链的末端。

`原型链的终点`：所有对象的原型链最终都会指向 null。当我们试图访问一个不存在的属性时，JavaScript 会沿着原型链查找，如果到达 null 还没有找到，那么就会返回 undefined。

`原型继承`：JavaScript 使用原型链实现继承。当我们创建一个新对象时，可以选择一个对象作为它的原型。新对象将继承原型对象的属性。
理解这些关键点，能够帮助你在面试中清楚地解释 JavaScript 的原型和原型链。

## 2.instanceof 的底层实现原理，手动实现一个 instanceof

`instanceof` 是 JavaScript 中一个重要的操作符，用于检测构造函数的 `prototype` 属性是否存在于某个实例对象的原型链上。

`instanceof` 的底层实现原理是这样的：对于表达式 `A instanceof B`，它会沿着 `A` 的原型链向上查找，看是否能找到 `B.prototype`。如果能找到，返回 `true`；否则，返回 `false`。

现在，我们尝试手动实现一个 `instanceof`。代码如下：

```javascript
function myInstanceOf(left, right) {
    // 获取类型的原型
    let prototype = right.prototype;
    // 获取对象的原型
    left = left.__proto__;
    // 循环判断对象的类型是否等于类型的原型
    while (left != null) {
        left = left.__proto__
        if ( left === prototype){
            return true
        }
    }
    return false
}
}
```

这段代码中的关键步骤如下：

1. 获取 `right` 的原型对象 `prototype`；
2. 获取 `left` 的原型链 `__proto__`；
3. 通过一个无限循环，不断地将 `left.__proto__` 与 `prototype` 进行比较。如果 `left.__proto__` 为 `null`（即已经到达了原型链的尽头），则返回 `false`；如果找到了相同的原型对象，返回 `true`；
4. 如果上述两个条件都不满足，那么就将 `left` 更新为它的原型对象，然后继续循环。

这个实现中的关键知识点是 JavaScript 的原型链机制。在 JavaScript 中，每个对象都有一个特殊的内部属性 `[[Prototype]]`，通常通过 `__proto__` 属性来访问。当试图访问一个对象的属性时，如果这个对象本身没有这个属性，那么 JavaScript 会沿着原型链向上查找，看是否有其他对象有这个属性。这就是原型链机制。

## 4.实现继承的几种方式以及他们的优缺点

在 JavaScript 中，有多种方式可以实现继承，包括但不限于：

1. **原型链继承**：这是最基本的继承方式，通过将子类的原型对象指向父类的实例来实现继承。

   **优点**：易于实现，父类新增原型方法/原型属性，子类都能访问到。

   **缺点**：1）引用类型的属性被所有实例共享；2）在创建子类实例时，不能向父类构造函数传参。

   ```javascript
   function Parent() {
     this.name = "parent";
     this.colors = ["red", "blue", "green"];
   }

   function Child() {}

   Child.prototype = new Parent();

   var child1 = new Child();
   ```

2. **构造函数继承**：通过在子类的构造函数中执行父类构造函数，并将其上下文设置为子类来实现继承。

   **优点**：1）避免了引用类型的属性被所有实例共享；2）可以在子类中向父类传参。

   **缺点**：方法都在构造函数中定义，每次创建实例都会创建一遍方法。

   ```javascript
   function Parent() {
     this.name = "parent";
     this.colors = ["red", "blue", "green"];
   }

   function Child() {
     Parent.call(this);
   }

   var child1 = new Child();
   ```

3. **组合继承**（原型链+构造函数的继承）：这种方式结合了原型链和构造函数的优点，是 JavaScript 中最常用的继承模式。

   **优点**：能够正常使用 instanceof 和 constructor。

   **缺点**：调用了两次父类构造函数，生成了两份实例。

   ```javascript
   function Parent() {
     this.name = "parent";
     this.colors = ["red", "blue", "green"];
   }

   function Child() {
     Parent.call(this);
   }

   Child.prototype = new Parent();
   Child.prototype.constructor = Child;

   var child1 = new Child();
   ```

4. **原型式继承**：通过创建一个临时的构造函数来承载传递过来的父类的原型。

   **优点**：简单易于实现。

   **缺点**：同原型链继承。

   ```javascript
   function createObj(o) {
     function F() {}
     F.prototype = o;
     return new F();
   }
   ```

5. **寄生式继承**：通过创建一个新对象，这个对象内部复制某个对象的属性和方法来实现继承。

   **优点**：可以继承方法和属性。

   **缺点**：效率较低，每次创建对象都会创建一遍方法。

   ```javascript
   function createObj(o) {
     var clone = Object.create(o);
     clone.sayName = function () {
       console.log("hi");
     };
     return clone;
   }
   ```

6. **寄生组合式继承**：这是对组合继承的优化，它不必为了指定子类型的原型而调用超类型的构造函数，我们是通过创建一个临时的构造函数来承载传递过来的父类的原型。

   **优点**：只调用了一次父类构造函数，避免了在子类型.prototype 上面创建不必要的、多余的属性。与此同时，原型链还能保持不变；因此，还能够正常使用 instanceof 和 isPrototypeOf。

   **缺点**：实现较为复杂。

   ```javascript
   function Parent() {
     this.name = "parent";
     this.colors = ["red", "blue", "green"];
   }

   function Child() {
     Parent.call(this);
   }

   function inheritPrototype(Child, Parent) {
     var prototype = Object.create(Parent.prototype);
     prototype.constructor = Child;
     Child.prototype = prototype;
   }

   inheritPrototype(Child, Parent);

   var child1 = new Child();
   ```

7. **ES6 类继承**：ES6 引入了 class 关键字，语法更加清晰，更接近传统的面向对象编程的写法。

   **优点**：定义简单，且完全可以使用 instanceof 来检查类型。

   **缺点**：ES6 的继承机制是先创建父类的实例对象 this，然后再用子类的构造函数修改 this。如果你需要创建子类实例时能够传参，这种机制会带来一些不便。

   ```javascript
   class Parent {
     constructor() {
       this.name = "parent";
       this.colors = ["red", "blue", "green"];
     }
   }

   class Child extends Parent {
     constructor() {
       super();
     }
   }

   var child1 = new Child();
   ```

以上就是实现继承的几种方式以及他们的优缺点。在面试中，你可能会被要求解释这些概念，或者实现一种或多种类型的继承。理解这些继承方式的优缺点可以帮助你选择最适合特定情况的继承策略。

## 5.至少说出一种开源项目(如 Node)中应用原型继承的案例

## 6.可以描述 new 一个对象的详细过程，手动实现一个 new 操作符

在 JavaScript 中，`new`操作符用于创建一个用户自定义的对象类型或内建对象的实例。`new`操作符创建一个对象，该对象的原型链接到另一个对象，新对象从原型中继承属性。

当我们使用`new`操作符创建对象时，以下四个步骤发生：

1. 创建一个新对象：首先，JavaScript 创建一个新的空对象。
2. 设置原型链：然后，新对象的`__proto__`属性被设置为构造函数的`prototype`对象，这样新对象就可以访问构造函数原型的属性和方法。
3. 执行构造函数：构造函数内的代码被执行，相应的属性和方法被添加到新对象中。如果构造函数返回非原始值（对象或函数），那么这个返回值会被用作新对象。
4. 返回新对象：如果构造函数没有手动返回对象，那么新创建的对象会被自动返回。

以下是一个手动实现`new`操作符的例子：

```javascript
function myNew(func, ...args) {
  // Step 1: Create a new object
  let obj = {};
  // Step 2: Set the prototype of the new object to the constructor's prototype
  obj.__proto__ = func.prototype;
  // Step 3: Execute the constructor function with 'this' set to the new object
  let result = func.apply(obj, args);
  // Step 4: If the constructor function returned an object, return that, otherwise return our new object
  return typeof result === "object" && result !== null ? result : obj;
}
```

在这个例子中，`myNew`函数接受一个构造函数和一系列参数。首先，它创建一个新的空对象`obj`，然后将这个对象的原型设置为构造函数的原型。然后，它使用`apply`方法调用构造函数，将新对象作为`this`参数传递，并传入其余参数。最后，如果构造函数返回了一个对象，那么`myNew`返回这个对象；否则，它返回新创建的对象。

这个函数模拟了`new`操作符的所有主要行为，但是请注意，它并不能完全替代`new`操作符。例如，它并不能处理构造函数返回原始值的情况，而`new`操作符可以。

## 7.理解 es6 class 构造以及继承的底层实现原理

在 ES6 中，类（class）是一个语法糖，它实际上是基于原型链的继承的封装。了解 ES6 类的底层实现原理，需要理解 JavaScript 的原型链和构造函数。

首先，让我们看一下 ES6 中如何定义一个类：

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  sayName() {
    console.log(this.name);
  }
}
```

在 ES6 中，类的定义包括了构造函数（constructor）和原型方法（sayName）。在这个例子中，`constructor` 是一个特殊的方法，用于创建和初始化由类创建的一个对象。

当我们使用 `new` 关键字创建一个新的实例时，`constructor` 方法会被自动调用。例如：

```javascript
let animal = new Animal("Dog");
animal.sayName(); // 输出 "Dog"
```

接下来，我们看一下 ES6 中的类继承：

```javascript
class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  sayBreed() {
    console.log(this.breed);
  }
}
```

在这个例子中，`Dog` 类继承自 `Animal` 类，使用了 `extends` 关键字。`Dog` 类有自己的 `constructor` 方法，这个方法首先调用了父类的 `constructor` 方法，使用了 `super` 关键字。

这些 ES6 的类和继承的语法糖，实际上是基于 JavaScript 的原型链和构造函数实现的。当我们创建一个类时，实际上是创建了一个构造函数和它的原型对象。当我们创建一个类的实例时，实际上是使用构造函数创建了一个新的对象，并将这个对象的原型链设置为构造函数的原型对象。当我们进行类继承时，实际上是将子类的原型对象设置为父类的一个实例，这样子类就可以访问父类的方法和属性。

因此，理解 ES6 类和继承的底层实现原理，实际上是理解 JavaScript 的原型链和构造函数。