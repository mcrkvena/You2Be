import React, { Component } from "react";
import LoginLogin from "../components/LoginLogin";
import RegisterLogin from "../components/RegisterLogin";

class Login extends Component{

    render(){
        return (
            <div>
                <LoginLogin />
                <RegisterLogin />
            </div>
          );
    }
  }

export default Login;