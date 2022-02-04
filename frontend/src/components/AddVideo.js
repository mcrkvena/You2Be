import React, { Component } from "react";
import './AddVideo.css';
import { auth, db } from "../firebase-config";
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import store from "../store";

let ws;

class AddVideo extends Component {

    constructor(props){
        super(props);
        this.state = {
            link: '',
            currentplaylist: []
        };
    }

    init = async() => {
        if(ws){
            ws.onerror = ws.onopen = ws.onclose = null;
            ws.close();
        }
        ws = new WebSocket('ws://localhost:5000');
        ws.onopen = async() => {
            console.log("Playlist Connected!");
        }
        ws.onmessage = async({data}) => {
            const temptekst = await data.text();
            if(temptekst === 'playlist'){
                this.updateplaylist();
            }
        }
        ws.onclose = function() {
            ws.send(null);
            ws = null;
        }
        this.updateplaylist();

    }

    uploadplaylistdata = async(link) => {
        const roomID = window.location.href.slice(-20);
        await updateDoc(doc(db, "rooms", roomID), {playlist: arrayUnion(link)});
        ws.send("playlist");
        this.updateplaylist();
    }

    updateplaylist = async() => {
        const roomID = window.location.href.slice(-20);
        const docref = doc(db, "rooms", roomID);
        const docsnap = await getDoc(docref);
        if(docsnap.exists()){
            const lista = docsnap.data().playlist;
            store.playlist = lista;
            this.setState(state => state.currentplaylist = lista);
            this.props.playlistextraction(lista);
        }
    }

    formHandler = (e) =>{
        e.preventDefault();
        if(this.state.link == "" || !this.state.link.includes("youtube.com")){
            return;
        }
        let newstring = this.state.link.replace('watch?v=', 'embed/');
        this.uploadplaylistdata(newstring);
        const elem = e.target.querySelector('.tekstaddvideo');
        elem.value = '';
        //this.props.onClickButton(newstring);
    }

    async componentDidMount(){
        this.init();
    }

    render(){
        return (
            <div>
                <form onSubmit={this.formHandler}>
                    <input className="tekstaddvideo" type="text" name="addvideo" placeholder="Paste your link here!" onChange={(event) => {this.setState({ link: event.target.value });}} />
                    <button type="submit" className="buttonaddvideo">Add video</button>
                </form>
            </div>
          );
    }
  }

export default AddVideo;