# React基础

## React哲学

React是一个画界面的组件

影响web性能的两大原因

1. 等待自由加载时间
    1. 一次请求太多资源 → React.Lazy
    2. 网络请求慢 → React.Suspense
    3. 资源加载失败 → ErrorBoundary (hoc)
2. 大部分情况下浏览器单线程执行
    1. JS执行 → 异步更新
    2. 浏览器计算样式布局 → 时间切片
    3. UI绘制 → React Fiber

React更新流程

1. Scheduler调度器
    1. 维护时间切片 类似于requestIdleCallback （为了兼容性 自己实现了requestIdleCallback）
    2. 与浏览器任务调度
    3. 优先级调度
2. Reconciler协调器
    1. JSX转化为Fiber
    2. Fiber树对比（双缓存
        1. 内存里的当前Fiber树 current Tree
        2. 正在构建中的workInProgress Tree
    3. 确定本次更新的Fiber
3. Renderer渲染器
    1. 管理一棵React树，根据底层平台的不同而进行不同调用
    2. **跨平台就是更换Renderer
    

虚拟dom确实比真实dom渲染的慢，但是有时候用户要的不是快，要的是不卡，就是页面上要一直有东西⇒异步更新

## 用React开发

### web应用

1. 【架构】打包配置：JSX → babel → js
    1. 加载优化
    2. 错误降级
2. 【路由】React Router快速添加视图和数据流 使页面与URL之间同步
3. 【UI】可复用UI → 组件 → 页面 可复用逻辑抽离成hook
4. 【状态】多页面多足迹共享信息
    1. Redux
    2. context

### 组件

1. 数据
通过定义state操作视图
Mount时获取数据更新state
Ref保存与视图无直接关系的值 （→ 保存了不会自动更新的值）
unMount前清空Ref
2. 通信
props父子组件通信
context和redux组件信息共享
3. UI
数据决定视图
通过Ref获取到DOMß
4. 性能
函数使用useCallback
值或者计算使用useMemo
组件包裹memo （浅比较）

## React基础

### Class组件

- 继承+构造函数
- this
- 生命周期
- render方法

### 函数式组件

- 没有生命周期
- 借助Hook （React16.8)
- return JSX

### 函数式相比Class的优点

- 代码量骤减
- 没有复杂的生命周期
- 支持自定义hook 逻辑服用方便

### 组件与Hook的关系

- 把UI拆成多个独立单元 单元可以构成多种视图展示 这些独立单元就是组件 → 组件相当于原子
- hook贴近组件内部运行的各种概念逻辑，effect、state、context等。 → hooks更贴切于电子

### Hook规则和原理

1. 只能在最顶层使用hook

> React怎么知道哪个state对应哪个useState呢？因为React靠的是Hook调用顺序
> 
1. 只能在React函数中调用Hook
    1. 在React函数中或自定义hook中调用
    2. 自定义hook必须以use开头
    3. hook中的state是完全隔离的
2. Hook过期闭包问题
（因为hook本质是函数 只要是函数就难免会遇到闭包问题）
因为 在js中 函数运行的上下文是由定义的位置决定的
所以 当旧函数的闭包包住旧的变量值时 就会出现过期闭包问题

### React常用Hook及作用

useState

useReducer([state, dispatch])

state可以定义复杂对象 dispatch可以更新这个复杂对象
例如定义一个obj 然后定义getter/setter

useImperativeHandle

useLayoutEffect

## 场景案例

如何划分组件？ 如何拆分组件的粒度

- _Layout
    - Navbar
    - MainContent
    - Footer
    - Floating Button
- _Page
    - Banner
    - Card Group
    - Slider Group
    - Help Docs
    - Footer Banner
- _Component
    - SliderButton
        - onClick(direction, index)
        - icon?: ReactNode
        - animate?: boolean
    - AnimationWrapper
        - animationName?: string
        - animationDuration?: number
    - BlockWrapper
        - backgroundType
        - animate?: boolean
        - theme?: “dark”|”light”
    - SizeText
        - 通过className控制
        - 封装成组件
        - 安装主题包

父子组件通信

- 知道子组件表现
    - 直接props传递
- 不知道具体子组件表现
    - props.children

```jsx
// before 之前需要挨个props传递
<div>
	<Input value="input" size={props.size} />
	<InputTag value={['input-tag']} size={props.size} />
	<Button type="primary" size={props.size} />
</div>

// after 不再需要挨个props传递了
// SizeWrapper
<div>
	{React.Children.map(children, (child)=>{
		if(child && child.props) {
			return React.cloneElement(child, commonProps);
		}	

	})}
</div>

<SizeWrapper size={props.size}>
	<Input value="input"/>
	<InputTag value={['input-tag']}/>
	<Button type="primary"/>
</SizeWrapper>

```

子组件给父组件通信

- 传递信息比如对象文本，通过callback
- 传递方法？父组件需要调用子组件的一些方法？

```jsx
// - 传递信息比如对象文本，通过callback
// 为了解决 数据在组件里面 但是按钮在组件外面的问题
// 使用ref来解决这个问题

// FormComponent
const FormComponent = (props,ref) => {
	const [formInstance] = Form.useForm();
	// 给ref添加change, clear方法
	useImperativeHandle(ref, ()=> ({
		change: () => formInstance.setFieldsValue(newValue),
		clear: () => formInstance.clearFields(['username', 'email'])
	}));
	return (
		<Form form={formInstance}>
			<FormItem label="Username" field="username">
				<Input placeholder="please enter your username..." ></Input>
			</FromItem>
		</Form>
	);
};

// 转发ref
const FormComponentWithRef = forwardRef(FormComponent)

//UserSettings
const FormWrapper = () => {
	const formRef = useRef(null);

	return (
		<div>
			<div>
				<b>Wrapper Operations:</b>
				<Button onClick={()=>formRef.current?.change()}>Change</Button>
				<Button onClick={()=>formRef.current?.clear()}>Clear</Button>
			</div>
			<FormComponentWithRef ref={formRef} />
		</div>
	)
}
```

### 组件间共享信息

context & reducer 

** 世界上没有相同的对象  因为他们在内存中的位置是不同的（不算浅拷贝的情况）**

useMemo 返回一个值

useCallback 返回一个函数

### 组件挂载位置

1. 挂在哪里

```jsx
const [visible. setVisible] = useState(false);
// 保证容器已经挂载完成
useEffect(()=>{
	setVisible(true)
}, []);
<div>
	<div style={{background: 'blue'}}>
		<div>blue container</div>
		{
			visible && 
			(<CustomButton container={()=>wrapperRef.current} color="blue" />)
		}
	</div>
	<div ref={wrapperRef} style={{background: 'yellow'}}>
		<div>yellow container</div>
		<CustomButton color="yellow" />
	</div>
</div>

// Component
// createPortal不是react原生方法 是react-dom里提供的
// createPortal将真实DOM的渲染位置也改变了
import {createPortal} from 'react-dom';
function CustomButton(props) {
	const {container, color} = props;
	const DemoButton = <Button>{color}-按钮</Button>
	const containerElem = useMemo(()=>{
		return container?.();
	},[container]);
	if(containerElem){
		return createPortal(DemoButton, containerElem);
	}
	return DemoButton;
} 
```

2. 冒泡问题

在button上包一层div 阻止冒泡

那么通过createPotral改变组件真实渲染位置，那么惦记按钮会发生冒泡吗 冒泡到哪个容器呢

会冒泡到代码写入位置。

因为React文档中规定 一个portal内部触发的事件会冒泡到React树的祖先，即使这些元素不是DOM树的祖先

### 如何进行逻辑复用

手动实现一个useRequest