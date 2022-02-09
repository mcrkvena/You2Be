import React, { Component } from "react";
import "./VideoPlayer.css";

let player;
let ws;
let time = 0;
let playerState = 2;
let responsecounter = 0;

const timer = function (delay) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
};

window.addEventListener("message", async (e) => {
  const roomID = window.location.href.slice(-20);
  let data = JSON.parse(e.data);

  if (data.event === "infoDelivery" && player.playerInfo.playerState === 2) {
    time = data.info.currentTime.toFixed(2);

    ws.send(
      JSON.stringify({
        event: "timeChange",
        time: time,
        roomID: roomID,
      })
    );
  }

  if (data.event === "onStateChange") {
    await timer(100);
    playerState = player.playerInfo.playerState;
    ws.send(
      JSON.stringify({
        event: "playerStateChange",
        state: playerState,
        roomID: roomID,
      })
    );
  }
});

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 10,
      url: ""
    };
  }

  componentDidMount() {
    const loadVideo = () => {
      const s = "https://www.youtube.com/embed/dQw4w9WgXcQ";
      const s1 = s.substring(s.indexOf("embed/") + 6);
      s1.trim();
      console.log(s1);
      player = new window.YT.Player("player", {
        videoId: s1,
        playerVars: {
          autoplay: 0,
          mute: 1,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";

      window.onYouTubeIframeAPIReady = loadVideo;

      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else loadVideo();

    this.init();
    function onPlayerStateChange(event) {}

    function onPlayerReady(event) {}
  }

  changeVideo = (url) => {
    const s = url;
    const s1 = s.substring(s.indexOf("embed/") + 6);
    s1.trim();
    player.stopVideo();
    player.cueVideoById({ videoId: s1 });
  };

  init = async () => {
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }
    ws = new WebSocket("wss://you2be-project.herokuapp.com/");
    ws.onopen = async () => {
      console.log("Playlist Connected!");
      const roomID = window.location.href.slice(-20);
      ws.send(
        JSON.stringify({
          event: "ping",
          roomID: roomID
        })
      );
    };
    ws.onmessage = async ({ data }) => {
      const roomID = window.location.href.slice(-20);

      const object = await data.text();
      const parsedobject = JSON.parse(object);

      if (parsedobject.roomID !== roomID) return;

      if (parsedobject.event === "ping"){
        player.pauseVideo();
        await timer(100);
        ws.send(
            JSON.stringify({
              event: "pingresponse",
              url: this.state.url,
              time: time,
              roomID: roomID
            })
          );
      }

      if(parsedobject.event === "pingresponse"){
          responsecounter++;
          if(responsecounter === 1){
            console.log(responsecounter);
            await timer(1000);
            await this.changeVideo(parsedobject.url);
            await timer(1000);
            // player.pauseVideo();
            // await timer(500);
            player.seekTo(parsedobject.time, true);
            await timer(500);
            responsecounter = 0;
        }
      }

      if (parsedobject.event === "changevideo") {
        await this.changeVideo(parsedobject.link);
      } else if (parsedobject.event === "timeChange") {
        const timeRec = parsedobject.time;
        player.seekTo(timeRec, true);
        // console.log("Time synced!");
      } else if (parsedobject.event === "playerStateChange") {
        const recPlayerState = parsedobject.state;

        if (recPlayerState === 1) player.playVideo();
        if (recPlayerState === 2) player.pauseVideo();

        // console.log("Play/Stop Synced");
      }
    };
    ws.onclose = function () {
      ws.send(null);
      ws = null;
    };
  };

  cueNewVideo = async () => {
    if (player.playerInfo.playerState === 1) {
      return;
    }
    const roomID = window.location.href.slice(-20);
    await timer(100);
    ws.send(
      JSON.stringify({
        event: "changevideo",
        link: this.props.url,
        roomID: roomID,
      })
    );
    this.changeVideo(this.props.url);
  };

  share = () => {
      navigator.clipboard.writeText(window.location.href);
  }

  render() {
    if (this.props.url !== "") {
        this.state.url = this.props.url;
        this.cueNewVideo();
    }
    return (
      <div>
        <div id="player" className="pozadinavideoplayer"></div>
        <div className="shareroom" onClick={this.share}>
            <div>
                <div className="sharelinkznakic"></div>
            </div>
            <div>
                <p>
                    Share room
                </p>
            </div>
        </div>
      </div>
    );
  }
}

export default Video;