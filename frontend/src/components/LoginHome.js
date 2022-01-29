import React, { Component } from "react";
import './LoginHome.css';
import store from "../store.js";

class LoginHome extends Component {

    constructor(props){
        super(props);
        this.state = {
            i: false
        };
    }

    loginhandler = () => {
        if(store.authenticated){
            alert("Already logged in");
            return;
        }
        this.setState((currentState) => ({
        i: !currentState.i
        }));
        window.location.href = "/login";
    }

    // data() {
    //     return {
    //       store
    //     }
    //   }

    render(){
        return (
            <div className="pozadina">
                {console.log(store)}
                <pre className="tekst">
                • Synchronized player for video and
                <br className="brsmall"></br>
                audio
                <br className="brbig"></br>
                • Talk to your friends in the
                <br className="brsmall"></br>
                integrated chat room
                <br className="brbig"></br>
                • Enjoy content from YouTube
                <br className="brbig"></br>
                • Organize content into playlists
                <br className="brbig"></br>
                { !store.authenticated && <button className="buttonloginhome" onClick={this.loginhandler}>
                    Login
                </button>}
                </pre>
            </div>
          );
    }
  }

export default LoginHome;