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