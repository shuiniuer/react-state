import React from "react";
import emitter from "../event"

export default class A extends React.Component{
    constructor(){
        super();
        this.state = {
            color: 'red'
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
        return (<div style={{border:'solid 5px '+ this.state.color,padding:'10px',color:'red'}}>
            <span>组件A</span>
            <B/>
            <C/>
        </div>)
    }
}

const B = ()=>{
    return (<div style={{border:'solid 5px gray',padding:'10px',color:'gray',marginTop:'20px'}}>
        <span>组件B</span>
        <D/>
    </div>)
}

class C extends React.Component{
    constructor(){
        super();
        this.state = {
            color: 'blue'
        }
    }
    componentDidMount(){
        // C组件在组件装载完成以后
        // 声明一个自定义事件
        this.eventEmitter = emitter.addListener('change-c-color',(color)=>{
            this.setState({
                color
            });
        })
    }
    // 组件销毁前移除事件监听
    componentWillUnmount(){
        emitter.removeListener(this.eventEmitter);
    }
    render(){
        return (<div style={{border:'solid 5px '+this.state.color,padding:'10px',color:+this.state.color,marginTop:'20px'}}>
            <span>组件C</span>
        </div>)
    }
}

class D extends React.Component{
    handleClick=(color)=>{
        // 触发change-c-color事件
        emitter.emit('change-c-color',color)
    }
    render(){
        return (<div style={{border:'solid 5px green',padding:'10px',color:'green',marginTop:'20px'}}>
            <span>组件D </span>
            <button onClick={()=>{this.handleClick('yellow')}}>把组件C的颜色修改为yellow</button>
        </div>)
    }
}