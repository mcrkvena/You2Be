import React, { Component } from "react";
import './VideoPlayer.css';

let player;
let ws;

class Video extends Component {

    constructor(props){
        super(props);
        this.state = {
            counter: 10,
            url: ""
        };
    }

    componentDidMount(){
        const loadVideo = () => {
            const s = "https://www.youtube.com/embed/dQw4w9WgXcQ";
            const s1 = s.substring(s.indexOf("embed/")+6);
            s1.trim();
            console.log(s1);
            player = new window.YT.Player('player', {
              videoId: s1,
              playerVars: {
                'autoplay': 0,
                'mute': 0
              },
              events: {
                'onReady': onPlayerReady,
                'onStateChange' : onPlayerStateChange
              },
            });
          } 
      
          if(!window.YT){
            const tag = document.createElement('script');
            tag.src = "http://www.youtube.com/iframe_api";
      
            window.onYouTubeIframeAPIReady = loadVideo;
      
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
          } else
            loadVideo();

        console.log(this.props.url);
        this.init();
        function onPlayerStateChange(event) {
            console.log(event)
        }

        function onPlayerReady(event) {
            console.log(event)
        }
    }

    changeVideo = (url) => {
        const s = url;
        const s1 = s.substring(s.indexOf("embed/")+6);
        s1.trim();
        player.loadVideoById({videoId:s1});
    };

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
            //const temptekst = await data.text();
            const object = await data.text();
            const parsedobject = JSON.parse(object);
            if(parsedobject.event === 'changevideo'){
                await this.changeVideo(parsedobject.link);
                player.playVideo();
            }
        }
        ws.onclose = function() {
            ws.send(null);
            ws = null;
        }   
    }

    Pauza = () => {
        console.log("SUKA");
    }

    render(){
        if(this.props.url != ""){
            ws.send(JSON.stringify({
                event: "changevideo",
                link: this.props.url
                }))
            this.changeVideo(this.props.url);
        }
        return (
            <div>
                <div id="player" className="pozadinavideoplayer">

                </div>
                <div className="dummydiv">

                </div>
            </div>
          );
    }
  }

export default Video;