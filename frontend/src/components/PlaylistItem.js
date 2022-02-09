import React, { Component } from "react";
import './PlaylistItem.css';
import { doc, getDoc, updateDoc, arrayRemove, deleteField } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import store from "../store";

let ws;

class PlaylistItem extends Component {

    constructor(props){
        super(props);
        this.state = {
            title: "",
            currentplaylist: []
        };
    }

    removefromplaylist = async() => {
        const roomID = window.location.href.slice(-20);
        const docref = doc(db, "rooms", roomID);
        await updateDoc(docref, {playlist: arrayRemove(this.props.id)});
        ws.send("playlist");
    }

    playlistup = async() => {
        const currentindex = store.playlist.findIndex(link => link === this.props.id);
        if(currentindex == 0){
            return;
        } else {
            [store.playlist[currentindex-1], store.playlist[currentindex]] = [store.playlist[currentindex], store.playlist[currentindex-1]];
            const roomID = window.location.href.slice(-20);
            await updateDoc(doc(db, "rooms", roomID), {playlist: store.playlist});
            ws.send("playlist");
            this.props.updateplaylist();
        }
    }

    playlistdown = async() => {
        const currentindex = store.playlist.findIndex(link => link === this.props.id);
        if(currentindex == store.playlist.length-1){
            return;
        } else {
            [store.playlist[currentindex], store.playlist[currentindex+1]] = [store.playlist[currentindex+1], store.playlist[currentindex]];
            const roomID = window.location.href.slice(-20);
            await updateDoc(doc(db, "rooms", roomID), {playlist: store.playlist});
            ws.send("playlist");
            this.props.updateplaylist();
        }
    }

    init = async() => {
        if(ws){
            ws.onerror = ws.onopen = ws.onclose = null;
            ws.close();
        }
        ws = new WebSocket('wss://you2be-project.herokuapp.com/');
    }

    getTitle = async() => {
        const response = await fetch(`https://noembed.com/embed?url=${this.props.id}`);
        const data = await response.json();
        if(this.state.title !== data.title){
            this.setState(state => state.title = data.title);
        } else return;
    }

    componentDidMount(){
        // const getTitle = async() => {
        //     const response = await fetch(`https://noembed.com/embed?url=${this.props.id}`);
        //     const data = await response.json();
        //     this.setState(state => state.title = data.title);
        // }
        this.getTitle();
        this.init();
    }

    componentDidUpdate(){
        this.getTitle();
    }

    render(){

        const extracturl = () => {
            this.props.ekstrakcijaurla(this.props.id);
        }

        return (
            <div className="playlistitem">
                <iframe className="playlistiframe" id="vid" src={this.props.id}>

                </iframe>
                <div className="removevideo" onClick={this.removefromplaylist}>

                </div>
                <div className="playlistup" onClick={this.playlistup}>

                </div>
                <div className="playlistdown" onClick={this.playlistdown}>

                </div>
                <div className="naslov">
                    <p>
                        {this.state.title}
                    </p>
                </div>
                <div className="blocker" onClick={extracturl}>

                </div>
            </div>
          );
    }
  }

export default PlaylistItem;