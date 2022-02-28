import React from "react";

import "./login.css";

import { Button } from "@material-ui/core";
import { auth, googleProvider } from "../firebase";
import { useStateValue } from "../../StateProvider";
import { actionTypes } from "../../reducer";

const Login = () => {
  const [, dispatch] = useStateValue();

  const signIn = () => {
    auth
      .signInWithPopup(googleProvider)
      .then((result) =>
        dispatch({ type: actionTypes.SET_USER, user: result.user })
      )
      .catch((error) => {
        alert("Sign in error, please try again");
      });
  };

  return (
    <div className="login">
      <div className="login__container">
        <img
          src="//upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/598px-WhatsApp.svg.png"
          alt=""
        />
        <div className="login__text">Sign in into this goassap clone app</div>

        <Button onClick={signIn}>Sign in with google</Button>
        <h2 className="login__container_warning">
          THIS IS JUST A WHATSAPP CLONE MADE FOR EDUCATIONAL PURPOSES
        </h2>
      </div>
    </div>
  );
};

export default Login;
