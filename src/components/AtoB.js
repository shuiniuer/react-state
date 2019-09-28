// 父组件A
// 通过props向子组件B传递了一个count
// 每过1000ms 父组件A state的count值加1
// 子组件B props的count会随着父组件A一起变化
import React from 'react';
import { setInterval } from 'timers';

export default class A extends React.Component{
    constructor(){
        super();
        this.state={count:0}
    }

    componentDidMount(){
        // 每过 1000ms A组件state的count值加1
        setInterval(()=>{
            this.setState({
                count: this.state.count+1
            });
        },1000);
    }

    render(){
        return (<div>
            组件A的count值：{this.state.count}
            <B count={this.state.count}/>
        </div>)
    }
}

// 子组件B
class B extends React.Component{
    render(){
        return (<div>
            组件B的count值：{this.props.count}
        </div>);
    }
}