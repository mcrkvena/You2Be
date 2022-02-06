import React, { Component } from "react";
import './Users.css';
import store from "../store";
import { doc, getDoc, updateDoc, arrayRemove, deleteDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../firebase-config";

class Users extends Component {

    constructor(props){
        super(props);
        this.state = {
            currentuserlist: [],
            toggle: true
        };
    }

    async getuserlist() {
        const roomID = window.location.href.slice(-20);
        const docref = doc(db, "rooms", roomID);
        const docsnap = await getDoc(docref);
        if(docsnap.exists()){
            //this.state.currentuserlist = docsnap.data().userlist;
            this.setState(state => state.currentuserlist = docsnap.data().userlist);
        }
        //this.setState(state => state.toggle = !state.toggle)
      }

    getusernumber() {
        return this.state.currentuserlist.length;
    }

    async componentDidMount(){
        let ws;

        const chain = () => {
            this.getuserlist();
        };

        const broj = () => {
            return this.getusernumber();
        }

        async function init(){
            if(ws){
                ws.onerror = ws.onopen = ws.onclose = null;
                ws.close();
            }
            ws = new WebSocket('ws://localhost:5000');
            ws.onopen = async() => {
                const storage = JSON.parse(localStorage.getItem('store'));
                const roomID = window.location.href.slice(-20);
                if(storage){
                    console.log("User List Connected!");
                    await ws.send(null);
                    setTimeout(chain, 1000);
                } else {
                    const storenoreg = localStorage.getItem('storenoreg');
                    if(storenoreg){ 
                        await updateDoc(doc(db, "rooms", roomID), {userlist: arrayUnion(storenoreg)});
                        console.log("User List Connected!");
                        await ws.send(null);
                        setTimeout(chain, 1000);
                    } else {
                        let result           = '';
                        let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                        let charactersLength = characters.length;
                        for ( let i = 0; i < 10; i++ ) {
                            result += characters.charAt(Math.floor(Math.random() * charactersLength));
                        }
                        localStorage.setItem("storenoreg", result);
                        await updateDoc(doc(db, "rooms", roomID), {userlist: arrayUnion(result)});
                        console.log("User List Connected!");
                        await ws.send(null);
                        setTimeout(chain, 1000);
                    }
                }
            }
            ws.onmessage = async({data}) => {
                const temptekst = await data.text();
                if(temptekst === 'null'){
                    setTimeout(chain, 1000);
                }
            }
            ws.onclose = function() {
                ws.send(null);
                ws = null;
            }

            window.addEventListener("beforeunload", () => {
                const roomID = window.location.href.slice(-20);
                const storage = JSON.parse(localStorage.getItem('store'));
                if(storage){
                    updateDoc(doc(db, "rooms", roomID), {userlist: arrayRemove(storage.username)});
                } else {
                    const storenoreg = localStorage.getItem('storenoreg');
                    updateDoc(doc(db, "rooms", roomID), {userlist: arrayRemove(storenoreg)});
                }
                ws.send(null);
                if(broj() == 0){
                        deleteDoc(doc(db, "rooms", roomID));
                }
            })
        }

        init();
    }

    render(){
        return (
            <div>
            <p className="tekstusers">Users</p>
            <div className="pozadinausers">
                <ul className="listausera">
                    {this.state.currentuserlist.map(user => {return (<li key={this.state.currentuserlist.indexOf(user)}>
                        <p>
                            {user}
                        </p>
                    </li>)})}
                </ul>
            </div>
            </div>
          );
    }
  }

export default Users;