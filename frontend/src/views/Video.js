import React, { Component } from "react";
import AddVideo from "../components/AddVideo";
import Users from "../components/Users";
import Chat from "../components/Chat";
import Playlist from "../components/Playlist";
import VideoPlayer from "../components/VideoPlayer";
import { doc, getDoc, updateDoc, arrayUnion} from "firebase/firestore";
import { db } from "../firebase-config";
import store from "../store";

class Video extends Component{

    constructor(props){
      super(props);
      this.state = {
          usersarray: [],
          toggle: true,
          playlist: [],
          currenturl: ""
      };
    }

    uploadroomdata = async() => {
      const roomID = window.location.href.slice(-20);
      const storage = JSON.parse(localStorage.getItem('store'));
      await updateDoc(doc(db, "rooms", roomID), {userlist: arrayUnion(storage.username)});
    }

    updateplaylist = async() => {
      const roomID = window.location.href.slice(-20);
      const docref = doc(db, "rooms", roomID);
      const docsnap = await getDoc(docref);
      if(docsnap.exists()){
          const lista = docsnap.data().playlist;
          store.playlist = lista;
          this.setState(state => state.playlist = lista);
      }
  }

    componentDidMount(){
      this.uploadroomdata();
    }

    render(){

      const clickedplaylisturl = async(url) => {
        store.currenturl = url;
        this.setState(state => state.currenturl = url);
      };

      const ekstrakcijaplayliste = (playlist) => {
        this.setState(state => state.playlist = playlist);
      }

        return (
            <div>
                <AddVideo playlistextraction={ekstrakcijaplayliste}/>
                <Users />
                <Chat />
                <Playlist playlist={this.state.playlist} ekstrakcijaurla={clickedplaylisturl} updateplaylist={this.updateplaylist} />
                <VideoPlayer url={this.state.currenturl} />
            </div>
          );
    }
  }

export default Video;