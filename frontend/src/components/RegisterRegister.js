import React, { Component, useState } from "react";
import './RegisterRegister.css';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase-config";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import store from "../store";

class RegisterRegister extends Component {

    constructor(props){
        super(props);
        this.state = {
            registerEmail: "",
            registerUsername: "",
            registerPassword: "",
            registerConfirmPassword: ""
        };
    }

    render(){
        const uploaduserdata = async() => {
            await setDoc(doc(db, "users", this.state.registerEmail), {username: this.state.registerUsername, email: this.state.registerEmail});
        }

        const register = async (e) => {
            e.preventDefault();
            if(this.state.registerConfirmPassword != this.state.registerPassword){
                console.log("Password do not match!");
                alert("Password do not match!");
                return;
            }
            try {
                if(this.state.registerUsername.trim().length === 0) return;
                const user = await createUserWithEmailAndPassword(auth, this.state.registerEmail, this.state.registerPassword);
                await uploaduserdata();
                store.username = this.state.registerUsername;
                console.log("Registration complete!");
                window.location.href = "/";
            } catch(error) {
                console.log(error.message);
            }
        };

        return (
            <div className="pozadinaregisterregister">
            <p className="tekstregisterregister">REGISTER</p>
            <form>
                <input className="registerregisteremail" type="email" name="email" placeholder="Email" onChange={(event) => {this.setState({ registerEmail: event.target.value });}} />
                <input className="registerregisterusername" type="text" name="username" placeholder="Username" onChange={(event) => {this.setState({ registerUsername: event.target.value });}} />
                <input className="registerregisterpassword" type="password" name="password" placeholder="Password" onChange={(event) => {this.setState({ registerPassword: event.target.value });}} />
                <input className="registerregisterconfirmpassword" type="password" name="confirmpassword" placeholder="Confirm password" onChange={(event) => {this.setState({ registerConfirmPassword: event.target.value });}} />
                <br></br>
                <button type="submit" className="buttonregisterregister" onClick={register}>REGISTER</button>
            </form>
            </div>
          );
    }
  }

export default RegisterRegister;