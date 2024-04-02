# React状态管理

## Intro

思考：
1. 为什么不能用window对象
2. react hooks给状态管理库的设计带来了哪些新思路

问题1

从全局对象window说起。

1. 全局污染，重复声明
2. 直接取值和赋值 数据更不清晰
3. 渲染粒度不可控
4. 无法实现时间旅行

## 什么是状态管理

状态管理 能不用就尽量不用

redux的一些心智负担：样板代码、异步副作用处理

不用状态管理 可以减轻其他人对项目理解的心智负担

当组件层级比较深时，自上而下的数据流，会陷入Props嵌套地狱。

状态管理解决的事跨层级组件之间的数据通信和状态共享

状态管理的本质：管理共享内存中的状态

- 共享内存
- 管理状态
- 页面通信
- 组件通信
- 刷新失效？（放在query（eg可以把页面筛选条件共享给其他人，这也是一种状态管理）或者ls里就刷新不失效）

> SPA的各个组件本身是共享内存的，如果状态保存在内存中，就可以的读写统一内存中的变量，从而达到状态共享的目的
> 

为什么React有这么多状态管理工具

因为Vue和Angular双向数据绑定、计算属性，数据时响应式的，控制视图刷新，拥有计算属性等。本身就包含了完整的状态管理工具，从官方定调。

React是个纯UI层等前端框架，UI=fn(state)，React将状态的变动完全交给开发者。

状态管理工具，代码量少，实现简单，很灵活

## 状态管理简介

以下几类

- React自带：Local State(props)、Context
- 单向数据流：Flux、Redux（Redux-toolkit）
- 双向数据绑定：Mobx
- 原子型状态管理：Recoil、Jotai
- 异步操作密集型：Rxjs（*这个比较适合多播的场景）

1. Local State(props)、Context
    1. props：父组件 → 子组件 的传值
    2. Context：子页面 <→ 子页面之间 的传值
        1. 渲染力度不可控，会生成不必要的渲染。（只要Context变化，下面的子组件都会重现渲染，甚至会穿透useMemo。导致会造成不必要的渲染）
            1. 可以用props做hack的方法 但是不是每次都能找到hack的方法
            
            ```jsx
            
            // OtherDisplay里没有用到Context的value 但是随着context的变换，OtherDisplay重新渲染了。怎么解决呢
            // 用hack的方式。解决
            
            function Provider(props){
            	let counter = useCounter()
            	return <Counter.Provider value={counter}>
            					 {props.child}
            				 </Counter.Provider>
            }
            const App = () => {
            	return (
            		<Provider>
            			<CounterDisplay></CounterDisplay>
            			<OtherDisplay></OtherDisplay>
            		</Provider>
            	)
            }
            ```
            
        2. 每个变量都要有个Provider
        
2. Redux 
    
    Flux：
    
    利用数据的单向流动 对公共状态进行管理
    
    View 视图层
    
    Action 视图发出的消息
    
    Dispatcher 派发者 用来接受action 执行回调函数
    
    Store 数据层 存放状态 一旦发生改动 就会更新数据以及emit相关事件等  
    
    Redux：
    
    状态即UI
    
    可以实现时间旅行（除了使用Sentry这种异常上报工具实现异常上报之外，可以使用Redux的时间旅行特性实现事故重现）
    
    中小项目：Context 或者 React hooks中的useReducer
    
    大项目：使用Redux（作者目前为止没遇到过一定要redux的那么大的项目
    
3. Mobx 响应式 借助装饰器实现
    1. 优点
        1. 上手简单
        2. 局部精确更新 免去粒度控制烦恼 自始至终一份引用 不需要immutable 也没有复制对象的额外开销
        3. 对类组件的兼容性比较好
    2. 缺点
        1. 太灵活 代码风格很难统一
        2. 不能实现时间旅行和回溯
        3. 随着React hooks（比如useReducer等），以及React自身的原子型状态管理工具Recoil，Mobx的使用场景进一步被压缩。目前已经越来越少
4. Recoil。
    1. 解决了Local State和Context的局限性，兼容React新特性比如Concurrent模式等
    2. 解决掉问题：
    1. 组件间状态共享只能通过state将它提升到公共祖先来实现，可能导致重新渲染一颗巨大的组件树
    2. Context只能存储单一值，无法存储多个各自拥有消费者的值的集合
    3. 概念。定义一个atom，
    4. 特点：
    1. 兼容React新特性（eg. Concurrent模式）性能好
    2. 原子性，实现细粒度状态控制
    3. 可以状态回溯
    4. 写法简单
    5. 可以实现状态快照。比如填充首屏数据，数据状态回滚
5. Zustand
体积小，适合移动端，没有React类组件的历史包袱。
    
    在2022年很流行
    
    核心代码只有及时行
    

## 实现一个简易状态管理工具

状态管理工具，都是基于发布/订阅模式

## Redux在项目中的实践

不要把所有的东西都放到状态管理工具。状态管理工具只是用来解决组件间通信问题的。

不要为了使用而使用，目标是代码简单易使用，且能实现目标。