import React, { Component } from "react";
import './RegisterLogin.css';

class RegisterLogin extends Component {

    constructor(props){
        super(props);
        this.state = {
            counter: 10
        };
    }

    registerhandler = () => {
        window.location.href = "/register";
    }

    render(){
        return (
            <div className="pozadinaregisterlogin">
                <pre className="tekstregisterlogin">
                    DON'T
                    <br></br>
                    HAVE AN
                    <br></br>
                    ACCOUNT
                    <br></br>
                    YET?
                    <br></br>
                    <button className="buttonregisterlogin" onClick={this.registerhandler}>
                    REGISTER
                    </button>
                </pre>
            </div>
          );
    }
  }

export default RegisterLogin;