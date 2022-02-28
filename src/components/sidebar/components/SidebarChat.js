import React, { useEffect, useState } from "react";

import "./sidebarChat.css";

import db from "../../firebase";

import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";

const SidebarChat = ({ addNewChat, id, name }) => {
  const [seed, setSeed] = useState(0);
  const [messages, setMessages] = useState([]);

  const avatarChangeEvent = new CustomEvent("avatarChange", {
    detail: `https://avatars.dicebear.com/api/jdenticon/${seed}.svg`,
  });

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 999));
  }, []);

  useEffect(() => {
    id &&
      db
        .collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
  }, [id]);

  const chatClickHandler = () => {
    window.dispatchEvent(avatarChangeEvent);
  };

  const createChat = () => {
    const roomName = prompt("Please enter a room name");

    if (roomName) {
      try {
        db.collection("rooms").add({ name: roomName });
      } catch (error) {
        alert(
          "We are sorry we had an error creating this room, please try again later"
        );
      }
    } else {
      alert("Error: Empty room name");
    }
  };

  return !addNewChat ? (
    <Link to={`/rooms/${id}`} style={{ textDecoration: "none" }}>
      <div className="sidebar__chatbox" id={id} onClick={chatClickHandler}>
        <Avatar
          src={
            name ? `https://avatars.dicebear.com/api/jdenticon/${name}.svg` : ""
          }
        />
        <div className="sidebar__chatbox_info">
          <h2>{name}</h2>
          {messages[messages.length - 1]?.message ? (
            <p>
              {`${messages[messages.length - 1]?.message} - ${
                new Date(
                  messages[messages.length - 1]?.timestamp?.toDate()
                ).toUTCString().toLowerCase().slice(0, -3)
              }`}
            </p>
          ) : (
            <p>say something nice as a first message</p>
          )}
        </div>
      </div>
    </Link>
  ) : (
    <div className="sidebar__chatbox" onClick={createChat}>
      <h2>Add new chat</h2>
    </div>
  );
};

export default SidebarChat;
