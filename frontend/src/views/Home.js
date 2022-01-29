import React, { Component } from "react";
import CreateRoom from "../components/CreateRoom";
import LoginHome from "../components/LoginHome";

class Home extends Component{

    render(){
        return (
            <div>
                <CreateRoom />
                <LoginHome />
            </div>
          );
    }
  }

export default Home;