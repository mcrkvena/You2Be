import React, { Component } from "react";
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./views/Home";
import Login from "./views/Login";
import Register from "./views/Register";
import Video from "./views/Video";
import store from "./store.js";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase-config";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

const bg = require('./assets/background.png');
const bgstyle = {
  width: '100vw',
  height: '100vh',
  backgroundImage: `url(${bg})`,
  backgroundSize: 'cover',
  position: 'absolute'
};

class App extends Component {
  // data(){
  //   return store;
  // }

  render(){

    const getuserdata = async(email) => {
      const docref = doc(db, "users", email);
      const docsnap = await getDoc(docref);
      if(docsnap.exists()){
          store.username = docsnap.data().username;
          localStorage.setItem("store", JSON.stringify(store));
          const storage = JSON.parse(localStorage.getItem('store'));
      }
    }

    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Logged in.")
        store.authenticated = true
        getuserdata(user.email)
      }
      else {
        console.log("Not logged in")
        store.authenticated = false
      }
    })

      return (
          <div className="App" style={bgstyle}>
            <h1 className="logo">You2Be</h1>
            <BrowserRouter>
                <Routes>
                  <Route exact path="/" element={<Home/>} />
                  <Route path="/login" element={<Login/>} />
                  <Route path="/register" element={<Register/>} />
                  <Route path="/room/:roomID" element={<Video/>} />
                </Routes>
            </BrowserRouter>
          </div>
      );
    }
}

export default App;
