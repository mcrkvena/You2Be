import React, { Component } from "react";
import './Chat.css';

class Chat extends Component {

    constructor(props){
        super(props);
        this.state = {
            counter: 10
        };
    }

    componentDidMount(){
        const messages = document.querySelector('#messages');
        const messageBox = document.querySelector('#chatinput');
        let ws;

        function showMessage(message){
            if(message === null){
                console.log("Nema poruke");
                return;
            }
            messages.textContent += `${message}`;
            messages.scrollTop = messages.scrollHeight;
            messageBox.value = '';
        }

        function init(){
            if(ws){
                ws.onerror = ws.onopen = ws.onclose = null;
                ws.close();
            }
            ws = new WebSocket('ws://localhost:5000');
            ws.onopen = () => {
                console.log("Connection established");
            }
            ws.onmessage = async ({ data }) => {
                const roomID = window.location.href.slice(-20);
                const object = await data.text();
                const parsedobject = JSON.parse(object);
                if (parsedobject.event !== "chat" || parsedobject.roomId !== roomID) {
                return;
                }
                const tekst = parsedobject;
                showMessage(`${tekst.user}: ${tekst.text}\n`);
            };
            ws.onclose = function() {
                ws = null;
            }
        }

        messageBox.onkeypress = function (e) {
            if (messageBox.value.length === 0) return;
            if (e.key === "Enter") {
                if (!ws) {
                    showMessage("No WebSocket connection");
                    return;
                }
                const roomID = window.location.href.slice(-20);
                const storage = JSON.parse(localStorage.getItem("store"));
                const storenoreg = localStorage.getItem("storenoreg");
                if(storage){          
                    ws.send(
                        JSON.stringify({
                            event: "chat",
                            user: storage.username,
                            text: messageBox.value,
                            roomId: roomID,
                        })
                    );
                }else {
                    ws.send(
                        JSON.stringify({
                            event: "chat",
                            user: storenoreg,
                            text: messageBox.value,
                            roomId: roomID,
                        })
                    );
                }
                let u = "You: ";
                showMessage(`${u}${messageBox.value}\n`);
            }
        };

        init();
    }

    render(){
        return (
            <div>
            <p className="tekstchat">Chat</p>
            <div className="pozadinachat">
                <pre className="chatbox" id="messages">
                </pre>
                <input type="text" className="tekstinputchat" id="chatinput" name="inputchatbox" placeholder="Type your message here!"></input>
            </div>
            </div>
          );
    }
  }

export default Chat;