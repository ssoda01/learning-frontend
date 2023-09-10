---
sidebar_position: 4
---

# 理解LifeCycle
- 一次性搞定 React 生命周期的流程和能弄清楚在各个生命周期做些什么
- 加深对 React Hooks 中 useEffect 和 useLayoutEffect的使用。

## 类组件生命周期介绍
- render 阶段
- commit 阶段
React 在调和( render )阶段会深度遍历 React fiber 树，目的就是发现不同( diff )，不同的地方就是接下来需要更新的地方，对于变化的组件，就会执行 render 函数。在一次调和过程完毕之后，就到了commit 阶段，commit 阶段会创建修改真实的 DOM 节点。
```
/* workloop React 处理类组件的主要功能方法 */
function updateClassComponent(){
    let shouldUpdate
    const instance = workInProgress.stateNode // stateNode 是 fiber 指向 类组件实例的指针。
     if (instance === null) { // instance 为组件实例,如果组件实例不存在，证明该类组件没有被挂载过，那么会走初始化流程
        constructClassInstance(workInProgress, Component, nextProps); // 组件实例将在这个方法中被new。
        mountClassInstance(  workInProgress,Component, nextProps,renderExpirationTime ); //初始化挂载组件流程
        shouldUpdate = true; // shouldUpdate 标识用来证明 组件是否需要更新。
     }else{  
        shouldUpdate = updateClassInstance(current, workInProgress, Component, nextProps, renderExpirationTime) // 更新组件流程
     }
     if(shouldUpdate){
         nextChildren = instance.render(); /* 执行render函数 ，得到子节点 */
        reconcileChildren(current,workInProgress,nextChildren,renderExpirationTime) /* 继续调和子节点 */
     }
}
```
几个重要概念：

① instance 类组件对应实例。
② workInProgress 树，当前正在调和的 fiber 树 ，一次更新中，React 会自上而下深度遍历子代 fiber ，如果遍历到一个 fiber ，会把当前 fiber 指向 workInProgress。
③ current 树，在初始化更新中，current = null ，在第一次 fiber 调和之后，会将 workInProgress 树赋值给 current 树。React 来用workInProgress 和 current 来确保一次更新中，快速构建，并且状态不丢失。
④ Component 就是项目中的 class 组件。
⑤ nextProps 作为组件在一次更新中新的 props 。
⑥ renderExpirationTime 作为下一次渲染的过期时间。
上面这个函数流程我已经标的很清楚了，同学们在学习React的过程中，重要的属性一定要拿小本本记下来，比如说类组件完成渲染挂载之后， React 用什么记录组件对应的 fiber 对象和类组件实例之间的关系。只有搞清楚这些，才能慢慢深入学习 React 。
在组件实例上可以通过 _reactInternals 属性来访问组件对应的 fiber 对象。在 fiber 对象上，可以通过 stateNode 来访问当前 fiber 对应的组件实例。两者的关系如下图所示。

