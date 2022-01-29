import React, { Component } from "react";
import './Playlist.css';
import PlaylistItem from "./PlaylistItem";
import { auth, db } from "../firebase-config";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

class Playlist extends Component {

    constructor(props){
        super(props);
        this.state = {
            counter: 10
        };
    }

    render(){

        const extracturltovideo = (url) => {
            this.props.ekstrakcijaurla(url);
        }

        const extracturl = (url) => {
            extracturltovideo(url);
        }

        return (
            <div>
                <p className="tekstplaylist">Playlist</p>
                <div className="pozadinaplaylist">
                    <div className="fakeheader">

                    </div>
                    {this.props.playlist.map(video => {
                      return <div key={this.props.playlist.findIndex(URL => URL === video)}><PlaylistItem id={video} ekstrakcijaurla={extracturl} updateplaylist={this.props.updateplaylist}/>
                      </div>
                    })}
                </div>
            </div>
          );
    }
  }

export default Playlist;