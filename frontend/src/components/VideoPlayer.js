import React, { Component } from "react";
import './VideoPlayer.css';

class Video extends Component {

    constructor(props){
        super(props);
        this.state = {
            counter: 10
        };
    }

    render(){
        return (
            <iframe title="player" className="pozadinavideoplayer" src={this.props.url} allowFullScreen={true}>
            </iframe>
          );
    }
  }

export default Video;