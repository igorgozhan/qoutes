import React, { Component } from 'react'
import { w3cwebsocket as W3CWebSocket } from "websocket";

export default class Socket extends Component {
    constructor(props){
        super(props);
        
        this.state = {
			error: null,
            isConnected: false,
			items: [],
            startDisabled: false,
            statDisabled: true,
            showTable: false,
            showLoader: false,
            loaderTxt: '',
            average: '0',
            deviation: '',
            mode: '',
            lost: '',
            ms: ''
		}

        this.handleStart = this.handleStart.bind(this);
        this.handleIteration = this.handleIteration.bind(this);
        this.handleStop = this.handleStop.bind(this);
        this.handleStatistics = this.handleStatistics.bind(this);
        
    }


    componentDidMount(){
        //window.addEventListener('beforeunload', this.handleStop);
    }
    
    handleStatistics(props){
        var dtmp = new Date();

        var tmp = this.state.items;
        
        var notNullAmount = (accumulator, currentValue) => (accumulator + currentValue);
        var sumValues = (accumulator, currentValue, currentIndex) => accumulator + (currentIndex+this.props.di*1) * currentValue;
        var rowsAmount = tmp.reduce(notNullAmount);

        var avr = tmp.reduce(sumValues) / rowsAmount;

        var devi = (currentValue, currentIndex) => (currentValue > 0) ? (((currentIndex*1+this.props.di*1)) - avr) : 0;
        var square = (currentValue, currentIndex) => currentValue * currentValue;
        var sumValues2 = (accumulator, currentValue, currentIndex) => accumulator + (currentValue * tmp[currentIndex])*1;
        
        var deviation = Math.sqrt( tmp.map(devi).map(square).reduce(sumValues2) / (rowsAmount-1) );

        var tmpMax = 0, currentIndex = 0;
        for( let i = 0; i < tmp.length; i++){
            if( tmp[i] > tmpMax ) {
                tmpMax = tmp[i];
                currentIndex = i;
            }
        }
        //моду можно найти и так ↓↓↓, но дольше, т.к. массив обходится дважды
        //var maxIndex = tmp.indexOf( Math.max.apply(null, tmp));

        var medAmount = (rowsAmount / 2).toFixed(0);
        var median = 0, amount = 0;
        for( let i = 0; i < tmp.length; i++) {
            if ( tmp[i] && ((amount + tmp[i]) <= medAmount) ){
                median = i;
                amount += tmp[i];
            }
        }

        this.setState({
            average: avr.toFixed(3),
            deviation: deviation.toFixed(3),
            mode: currentIndex*1 + this.props.di*1,
            median: median*1 + this.props.di*1,
            lost: rowsAmount - this.state.items.reduce(notNullAmount),
            ms: Math.abs(new Date() - dtmp),
            showTable: true,
            showLoader: false
        });


    }


    handleStart(props){
        this.client = new W3CWebSocket('wss://trade.trademux.net:8800/?password=1234');
        if(this.client){
            var tmp = [];
            for( let i = this.props.di; i <= 9999; i++) tmp.push(0);

            this.setState({
                items: tmp,
                startDisabled: true,
                isConnected: true,
                showLoader: true,
                showTable: false,
                loaderTxt: 'Подключение...',
            })
            this.handleIteration();
        }
    }

    handleIteration(){
        this.client.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        this.client.onmessage = (event) => {
            var ar = this.state.items.slice();
            var index = JSON.parse(event.data).value - 1000;
            ar[index] += 1;
    
            this.setState({
                loaderTxt: 'Данные собраны...',
                items: ar,
                statDisabled: false,
                error: false,
            });
    
        }
        this.client.onerror = () => {
            this.setState({
                error: true,
                isConnected: false
            })
        };
        this.client.onclose = () => {
            this.setState({
                statDisabled: true,
                startDisabled: false,
                isConnected: false
            })    
            console.log("WebSocket Client Closed");
        }
    }
    
    handleStop(){
        if(this.state.isConnected) this.client.close();
    }

    componentWillUnmount(){
        this.handleStop();
    }

    componentDidUpdate(){
    }

    render() {
        const {error} = this.state;
        
        if(error){
            return (
                <p>Error</p>
            )
        }
        else
        return (
            <>
                <section className="cells_block">
                    <button onClick={this.handleStart} disabled={this.state.startDisabled} className="btn">Старт</button>
                    <button onClick={this.handleStatistics} disabled={this.state.statDisabled} className="btn">Стистика</button>
                    <button onClick={this.handleStop} className="btn">Стоп</button>
                </section>
                <p className={(this.state.showLoader ? "loader" : "loader hiddenLoader")}>{this.state.loaderTxt}</p>
                <table className={(this.state.showTable ? "statTable" : "statTable hiddenTable")} cellPadding="0" cellSpacing="0">
                <tbody>
                <tr><th>Среднее</th><td>{this.state.average}</td></tr>
                <tr><th>Ст. отклонение</th><td>{this.state.deviation}</td></tr>
                <tr><th>Мода</th><td>{this.state.mode}</td></tr>
                <tr><th>Медиана</th><td>{this.state.median}</td></tr>
                <tr><th>Потеряно/не учтено</th><td>{this.state.lost}</td></tr>
                <tr><th>Время расчетов, мс</th><td>{this.state.ms}</td></tr>
                </tbody>
                </table>
            </>
        )
    }
}