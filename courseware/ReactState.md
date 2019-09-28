#React组件通信

React的基本元素是一个个的组件，组件之间存在各种关联关系。不同的组件之间，经常会发生数据传递、状态共享等行为，我们称之为组件间通信。

组件之间的相互关系：

![组件树](./components.jpg)

1. 父子关系
> `组件A`和`组件B`通信

2. 跨级关系（祖孙关系）
> `组件A`和`组件E`通信<br>
> `组件A`和`组件G`通信<br>
> ...

3. 非嵌套关系（非直系关系）
> `组件D`和`组件E`通信<br>
> `组件D`和`组件F`通信<br>
> `组件D`和`组件C`通信<br>
> `组件D`和`组件G`通信<br>
> ...

##<span style="color:#900">一、父子组件间通信</span>
###1. 父组件向子组件传递数据
> 父组件通过props向子组件传递数据。<br>
> 父组件的state状态发生变化，子组件与之对应的props也会发生变化。

代码示例`AtoB.js`：

```
// 父组件A
// 通过props向子组件B传递了一个number
// 每过1000ms 父组件A state的number值加1
// 子组件B props的number会随着父组件A一起变化
import React from 'react';
import { setInterval } from 'timers';

export default class A extends React.Component{
    constructor(){
        super();
        this.state={number:0}
    }

    componentDidMount(){
        // 每过 1000ms A组件state的number值加1
        setInterval(()=>{
            this.setState({
                number: this.state.number+1
            });
        },1000);
    }

    render(){
        return (<div>
            组件A的number值：{this.state.number}
            <B number={this.state.number}/>
        </div>)
    }
}

// 子组件B
class B extends React.Component{
    render(){
        return (<div>
            组件B的number值：{this.props.number}
        </div>);
    }
}
```

###2. 子组件向父组件传递数据
> React是单向数据流，`子组件`向`父组件`通信，可以由`父组件`提供一个回调函数，供`子组件`调用并回传参数。

代码示例`BtoA.js`：

```
// 点击 子组件B 的按钮修改 父组件A state的 name
import React from 'react';
export default class A extends React.Component{
    constructor(){
        super();
        this.state = {
            name: '传智播客'
        };
    }
    // 父组件定义一个修改name的方法
    // 并传递给子组件
    changeName = (name)=>{
        this.setState({name});
    }
    render(){
        return(
            <div>
                父组件A中的name：{this.state.name}
                <B changeName={this.changeName}/>
            </div>
        )
    }
}

class B extends React.Component{
    render(){
        return(
            <div>
                点击 子组件B 的按钮调用 父组件A 传过来的changeName方法：<button onClick={()=>{this.props.changeName('黑马程序员')}}>修改名字</button>
            </div>
        )
    }
}
```

##<span style="color:#900">二、跨级组件间通信</span>

所谓跨级组件通信，就是父组件向子组件的子组件通信，向更深层的子组件通信。跨级组件间通信可以采用下面两种方式：

- 层层组件传递`props`（不建议）

> 例如上图的`组件A`要和`组件E`通信，`组件A`先通过props把要传递的数据传递给`组件B`，然后在由`组件B`通过props把`组件A`传递过来的数据传递给`组件E`。<br><br>
> 这种方式有一个明显的缺点，如果组件结构较深，那么中间的每一层组件都要去传递 props，增加了复杂度，并且这些 props 并不是这些中间组件自己所需要的，会引起混乱。<br>
> 当组件层次在三层以内可以采用这种方式，当组件嵌套过深时，采用这种方式就需要斟酌了。

- 使用`context`对象

> `context`相当于一个全局容器，我们可以把要通信的内容放在这个容器中，这样一来，不管嵌套有多深，都可以随意取用。<br><br>
> 如果是`上级组件`向`下级组件`单向通信，可以使用变量；<br>
> 如果是`下级组件`向`上级组件`通信，同样可以由`上级组件`提供一个回调函数，供`下级组件`调用并回传参数。<br><br>
> 在使用 context 时，需要注意：<br>
> 1.上级组件使用静态属性`childContextTypes`声明自己支持`context`，并提供`context`中属性的`PropTypes`<br>
> 2.上级组件需要提供一个`getChildContext`函数，用以返回一个初始的`context`对象<br>
> 3.下级组件使用静态属性`contextTypes`声明自己需要使用`context`，并提供其需要使用的`context`属性的 `PropTypes`<br>
>>补充说明：<br>
>>`context`同样可以应在函数组件（无状态组件）上，只需将`context`作为第二个参数传入。<br>



###1.`上级组件`向`下级组件`通信
代码示例`AtoD.js`：

```
import React from "react";
import PropTypes from "prop-types";

export default class A extends React.Component{
    constructor(){
        super();
        this.state = {
            color: 'red'
        }
    }
    // 上级组件申明自己支持的 context
    static childContextTypes={
        color: PropTypes.string
    }

    // 上级组件提供一个函数，用来返回相应的 context 对象
    getChildContext(){
        return {
            color: this.state.color
        }
    }

    changeColor=()=>{
        let color = '';
        if(this.state.color === 'red'){
            color = 'green';
        }else{
            color = 'red';
        }
        this.setState({
            color: color
        });
    }

    render(){
        return (<div style={{border:'solid 5px '+ this.state.color,padding:'10px'}}>
            <span>组件A</span><button onClick={this.changeColor}>修改A组件state中的color</button>
            <B/>
        </div>)
    }
}

const B = ()=>{
    return (<div style={{border:'solid 5px #999',padding:'10px'}}>
        <span>组件B</span>
        <D/>
    </div>)
}

class D extends React.Component{
    // 下级组件声明自己接受的上级组件的 context
    static contextTypes = {
        color:PropTypes.string
    }
    render(){
        return (<div style={{border:'solid 5px '+ this.context.color,padding:'10px'}}>
            <span>组件D</span>
        </div>)
    }
}

/*
// 函数组件（无状态组件）使用context
const D = (props, context)=>{
    return (<div style={{border:'solid 5px '+ context.color,padding:'10px'}}>
        <span>组件D</span>
    </div>)
}
D.contextTypes = {
    color:PropTypes.string
}*/
```

### 2.`下级组件`向`上级组件`通信
代码示例`DtoA.js`：

```
import React from "react";
import PropTypes from "prop-types";

export default class A extends React.Component{
    constructor(){
        super();
        this.state = {
            color: 'red'
        }
    }
    // 上级组件申明自己支持的 context
    static childContextTypes={
        color: PropTypes.string,
        changeColor: PropTypes.func
    }

    // 上级组件提供一个函数，用来返回相应的 context 对象
    getChildContext(){
        return {
            color: this.state.color,
            changeColor: this.changeColor
        }
    }

    changeColor=()=>{
        let color = '';
        if(this.state.color === 'red'){
            color = 'green';
        }else{
            color = 'red';
        }
        this.setState({
            color: color
        });
    }

    render(){
        return (<div style={{border:'solid 5px '+ this.state.color,padding:'10px'}}>
            <span>组件A</span>
            <B/>
        </div>)
    }
}

const B = ()=>{
    return (<div style={{border:'solid 5px #999',padding:'10px'}}>
        <span>组件B</span>
        <D/>
    </div>)
}

class D extends React.Component{
    // 下级组件声明自己接受的上级组件的 context
    static contextTypes = {
        color:PropTypes.string,
        changeColor: PropTypes.func
    }
    render(){
        return (<div style={{border:'solid 5px '+ this.context.color,padding:'10px'}}>
            <span>组件D</span>
            <button onClick={this.context.changeColor}>修改color值</button>
        </div>)
    }
}
```
##<span style="color:#900">三、非嵌套组件间通信</span>
非嵌套组件，就是没有任何包含关系的组件，包括兄弟组件以及不在同一个父级中的非兄弟组件。非嵌套组件间通信可以采用下面两种方式：

- 利用二者共同的上级组件的`context`对象进行通信（不建议）

> 如果采用组件间共同的上级来进行中转，会增加子组件和父组件之间的耦合度，如果组件层次较深的话，找到二者公共的上级组件不是一件容易的事，所以不建议使用这种方式来实现非嵌套组件间的通信。

- 使用自定义事件实现

> 本教程给大家演示一下如何用自定义事件的方式来实现非嵌套组件间的通信。<br><br>
> 安装一个 events 包：<br>
> 
```
npm install events --save
```
> 新建一个 event.js，引入 events 包，并向外提供一个事件对象，供通信时使用：
>
```
import { EventEmitter } from "events";
export default new EventEmitter();
```
> 自定义事件是典型的发布/订阅模式，通过向事件对象上添加监听器和触发事件来实现组件间通信。

代码示例`DtoC.js`：