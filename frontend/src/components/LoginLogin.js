import React, { Component } from "react";
import './LoginLogin.css';
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebase-config";
import store from "../store";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

class LoginLogin extends Component {

    constructor(props){
        super(props);
        this.state = {
            loginEmail: "",
            loginPassword: ""
        };
    }

    render(){
        const getuserdata = async(email) => {
            const docref = doc(db, "users", email);
            const docsnap = await getDoc(docref);
            if(docsnap.exists()){
                console.log(docsnap.data());
            }

        }
        const logout = () => {
            signOut(auth);
          }
        const login = async (e) => {
            e.preventDefault();
            try {
                const user = await signInWithEmailAndPassword(auth, this.state.loginEmail, this.state.loginPassword);
                await getuserdata(this.state.loginEmail);
                // window.location.href = "/";
            } catch(error) {
                console.log(error.message);
                alert(`ERROR: ${error.message}`);
            }
        };

        return (
            <div>
            <p className="tekstloginlogin">LOGIN</p>
            <button className="buttonlogoutlogin" onClick={logout}>LOGOUT</button>
            <form>
                <input className="loginloginemail" type="text" name="email" placeholder="Email" onChange={(event) => {this.setState({ loginEmail: event.target.value });}} />
                <input className="loginloginpassword" type="password" name="password" placeholder="Password" onChange={(event) => {this.setState({ loginPassword: event.target.value });}} />
                <br></br>
                <button type="submit" className="buttonloginlogin" onClick={login}>LOGIN</button>
            </form>
            </div>
          );
    }
  }

export default LoginLogin;