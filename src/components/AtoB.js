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