import React, { Component } from 'react'
import { w3cwebsocket as W3CWebSocket } from "websocket";
//import Interace from './Interface';
/*require("mkdirp");
const writeFileP = require("write-file-p");
var fs = require('file-system');
*/
import {
    View,
    ScrollView,
    KeyboardAvoidingView,
    Alert,
    SafeAreaView,
    Text,
  } from 'react-native';
import { openDatabase } from "react-native-sqlite-storage";



const client = new W3CWebSocket('wss://trade.trademux.net:8800/?password=1234');

export default class Socket extends Component {
    constructor(props){
        super(props);
        
        this.state = {
			error: null,
			isConnected: false,
			items: [],
            average: 0,
            deviation: 0
		}
        this.handleStart = this.handleStart.bind(this);
        this.handleStop = this.handleStop.bind(this);
        this.handleStatistics = this.handleStatistics.bind(this);
        
        /*fs.writeFile('data.txt', "this.state.items", (err, data) => {
            console.log(err || data);
        });*/

        //var db = openDatabase({ name: 'data.db' });
    

    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.handleStop);
    }

    
    handleStatistics(){
        this.setState({
            average: 1
        })
    }


    handleStart(){
    //componentDidMount(){
        client.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        client.onmessage = (event) => {
            this.setState({
                i: this.state.i+1
            })
            this.setState({
                items: [...this.state.items, JSON.parse(event.data.value)]
            })
            
            console.log(event.data);

        }
    }
    

    handleStop(){
        client.close();
        console.log("close");

    }


    componentDidUpdate(){
        if(this.state.items.length >= 100)
        {
            /*writeFileP.writeFileP('data.json', "this.state.items", (err, data) => {
                console.log(err || data);
            });*/
            this.setState({
                items: []
            })
        }
    }




    render() {
        const {error, isConnected, items} = this.state;
        
        if(error)
        {
            return (
                <p>Error</p>
            )
        }
        else
        return (
            <>
                <button onClick={this.handleStart}>Старт</button>

                <button onClick={this.handleStatistics}>Стистика</button>

                <button onClick={this.handleStop}>Стоп</button>

            </>
        )
/*                <ul>
                    {items.map(item => (
                        <li key={item.id}>
                            {item.value}
                        </li>
                    ))}
                </ul>

*/

    }
}
