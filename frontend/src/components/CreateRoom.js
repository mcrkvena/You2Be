import React, { Component } from "react";
import './CreateRoom.css';
import { auth, db } from "../firebase-config";
import { collection, doc, setDoc, getDoc, arrayUnion } from "firebase/firestore";
import store from "../store";

class CreateRoom extends Component {

    constructor(props){
        super(props);
        this.state = {
            counter: 10
        };
    }

    uploadroomdata = async(roomID) => {
      const storage = JSON.parse(localStorage.getItem('store'));
      if(storage){
        await setDoc(doc(db, "rooms", roomID), {userlist: storage.username});
      } else {
        let result           = '';
        let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let charactersLength = characters.length;
        for ( let i = 0; i < 10; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        localStorage.setItem("storenoreg", result);
        await setDoc(doc(db, "rooms", roomID), {userlist: arrayUnion(result)});
      }
      
    }

    newroom = async() => {
        let result           = '';
        let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for ( let i = 0; i < 20; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       await this.uploadroomdata(result);
       console.log(result);
       window.location.href = `/room/${result}`;
    }

    render(){
        return (
            <div className="pozadinacreateroom">
            <p className="tekst1">WATCH YOUR FAVOURITE</p>
            <p className="tekst2">VIDEOS WITH YOUR</p>
            <p className="tekst3">FAVOURITE FRIENDS!</p>
            <button className="buttoncreateroom" onClick={this.newroom}>
                Create Your Room
            </button>
            </div>
          );
    }
  }

export default CreateRoom;