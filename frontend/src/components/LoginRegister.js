import React, { Component } from "react";
import './LoginRegister.css'

class LoginRegister extends Component {

    constructor(props){
        super(props);
        this.state = {
            counter: 10
        };
    }

    loginhandler = () => {
        window.location.href = "/login";
    }

    render(){
        return (
            <div className="pozadinaloginregister">
                <pre className="tekstloginregister">
                    ALREADY
                    <br></br>
                    HAVE AN
                    <br></br>
                    ACCOUNT?
                    <br></br>
                    <button className="buttonloginregister" onClick={this.loginhandler}>
                    LOGIN
                    </button>
                </pre>
            </div>
          );
    }
  }

export default LoginRegister;