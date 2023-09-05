---
sidebar_position: 1
---

# React Components 源码笔记

两种组件

- 类（ Class ）组件
- 函数（ Function ）组件

### React 中组件的执行

#### 类组件

react-reconciler/src/ReactFiberClassComponent.js

```javascript
function constructClassInstance(
  workInProgress, // 当前正在工作的 fiber 对象
  ctor, // 我们的类组件
  props // props
) {
  /* 实例化组件，得到组件实例 instance */
  const instance = new ctor(props, context);
}
```

#### 函数组件

react-reconciler/src/ReactFiberHooks.js
```javascript
function renderWithHooks(
  current,          // 当前函数组件对应的 `fiber`， 初始化
  workInProgress,   // 当前正在工作的 fiber 对象
  Component,        // 我们函数组件
  props,            // 函数组件第一个参数 props
  secondArg,        // 函数组件其他参数
  nextRenderExpirationTime, //下次渲染过期时间
){
     /* 执行我们的函数组件，得到 return 返回的 React.element对象 */
     let children = Component(props, secondArg);
}
```

### React 中组件的定义

#### 类组件
react/src/ReactBaseClasses.js

```javascript
function Component(props, context, updater) {
  this.props = props;      //绑定props
  this.context = context;  //绑定context
  this.refs = emptyObject; //绑定ref
  this.updater = updater || ReactNoopUpdateQueue; //上面所属的updater 对象
}
/* 绑定setState 方法 */
Component.prototype.setState = function(partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
}
/* 绑定forceupdate 方法 */
Component.prototype.forceUpdate = function(callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
}

```
<!-- #### 函数组件 -->

### 组件示例
#### 类组件
```javascript
class Index extends React.Component{
    constructor(...arg){
       super(...arg)                        /* 执行 react 底层 Component 函数 */
    }
    state = {}                              /* state */
    static number = 1                       /* 内置静态属性 */
    handleClick= () => console.log(111)     /* 方法： 箭头函数方法直接绑定在this实例上 */
    componentDidMount(){                    /* 生命周期 */
        console.log(Index.number,Index.number1) // 打印 1 , 2 
    }
    render(){                               /* 渲染函数 */
        return <div style={{ marginTop:'50px' }} onClick={ this.handerClick }  >hello,React!</div>
    }
}
Index.number1 = 2                           /* 外置静态属性 */
Index.prototype.handleClick = ()=> console.log(222) /* 方法: 绑定在 Index 原型链的 方法*/

```
#### 函数组件
```javascript
function Index(){
    console.log(Index.number) // 打印 1 
    const [ message , setMessage  ] = useState('hello,world') /* hooks  */
    return <div onClick={() => setMessage('let us learn React!')  } > { message } </div> /* 返回值 作为渲染ui */
 }
 Index.number = 1 /* 绑定静态属性 */
```

### 附：组件间通信
- props 和 callback 方式
- ref 方式
- React-redux 或 React-mobx 状态管理方式
- context 上下文方式
- event bus 事件总线
