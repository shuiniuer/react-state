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
            组件A state 的count值：{this.state.count}
            <B count={this.state.count}/>
        </div>)
    }
}

// 子组件B
class B extends React.Component{
    render(){
        return (<div>
            组件B props 的count值：{this.props.count}
        </div>);
    }
}