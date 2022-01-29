import React, { Component } from "react";
import LoginRegister from "../components/LoginRegister";
import RegisterRegister from "../components/RegisterRegister";

class Register extends Component{

    render(){
        return (
            <div>
                <LoginRegister />
                <RegisterRegister />
            </div>
          );
    }
  }

export default Register;