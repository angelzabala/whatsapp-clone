// https://www.youtube.com/watch?v=pUxrDcITyjg
// cuenta de firebase angeldchz@gmail.com proyecto whatsapp-clone

import React from "react";

import "./App.css";

import Sidebar from "./components/sidebar/Sidebar";
import Login from "./components/login/Login";
import Chat from "./components/chat/Chat";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useStateValue } from "./StateProvider";

const App = () => {
  const [{ user }] = useStateValue();

  return (
    <Router>
      {user ? (
        <div className="app">
          <div className="app__body">
            <Sidebar />
            <Switch>
              <Route path="/rooms/:roomId">
                <Chat />
              </Route>

              <Route exact path="/" />
            </Switch>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </Router>
  );
};

export default App;
