import React, { Component } from 'react'

export default class Pinger extends Component {
    constructor(props){
        super(props);
        
        this.state = {
            input: 'https://ya.ru/',
            response: '',
            isDisabled: false
		}

        this.handleSetAdr = this.handleSetAdr.bind(this);
        this.handlePing = this.handlePing.bind(this);
    }

    handleSetAdr(event){
        this.setState({
            input: event.target.value
        });
    }


    handlePing(){
        this.setState({
            isDisabled: true
        })

        var Img = new Image();
        Img.src = (this.state.input[this.state.input.length-1] !== '/' ? this.state.input+'/' : this.state.input ) + "favicon.ico";
        console.log(Img.src);

        if(Img.height > 0){
            this.setState({
                response: "Successful ping",
                isDisabled: false
            })
        } else{
            this.setState({
                response: "Ping failed...",
                isDisabled: false
            })
        }




    }

    render() {
        return (
            <>
                <section className="cells_block">
                    <input onChange={this.handleSetAdr} value={this.state.input} className="fe"/>
                    <button onClick={this.handlePing} disabled={this.state.isDisabled} className="btn">Ping</button>
                </section>
                <textarea value={this.state.response} readOnly className="ta"></textarea>
            </>
        )
    }
}
