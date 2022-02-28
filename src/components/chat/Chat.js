import React, { useEffect, useState } from "react";

import "./chat.css";

import InserEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFile from "@material-ui/icons/AttachFile";
import MicIcon from "@material-ui/icons/Mic";

import db from "../firebase";
import firebase from "firebase";

import { Avatar, IconButton } from "@material-ui/core";
import { useStateValue } from "../../StateProvider";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const Chat = ({ avatarUrl }) => {
  const [errorFound, setErrorFound] = useState(false);
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [message, setMessage] = useState("");
  const [{ user }] = useStateValue();

  const { roomId } = useParams();

  const sendMessage = (e) => {
    e.preventDefault();
    db.collection("rooms")
      .doc(roomId)
      .collection("messages")
      .add({
        name: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: message,
        uuid: uuidv4(),
      })
      .then(() => {
        setMessage("");
      })
      .catch((error) => {
        console.log(
          error
        );
      });
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    let roomData;
    if (roomId) {
      try {
        roomData = db
          .collection("rooms")
          .doc(roomId)
          .onSnapshot((snapshot) => {
            setRoomName(snapshot.data().name);
          });
      } catch (error) {
        setErrorFound(true);
        alert("We are sorry, we couldn't fetch room info");
      }

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      roomData();
    };
  }, [roomId]);

  return (
    <div className="chat">
      <div className="chat__header">
        {!errorFound && <Avatar src={`https://avatars.dicebear.com/api/jdenticon/${roomName}.svg`} />}

        {!errorFound && (
          <div className="chat__header_info">
            <h3>{roomName}</h3>
            {messages[messages.length - 1]?.timestamp ? (
              <p>
                {new Date(
                  messages[messages.length - 1]?.timestamp?.toDate()
                ).toUTCString().toLowerCase().slice(0, -3)}
              </p>
            ) : (
              <p>
                say something nice or just a simple hello, come on add a new
                message...
              </p>
            )}
          </div>
        )}

        {!errorFound && (
          <div className="chat__header_right">
            <IconButton>
              <SearchOutlined />
            </IconButton>
            <IconButton>
              <AttachFile />
            </IconButton>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </div>
        )}
      </div>

      <div className="chat__body">
        {avatarUrl !== 0 &&
          !errorFound &&
          messages.map((message) => (
            <p
              key={message.uuid}
              id={message.uuid + "-message"}
              className={`chat__message ${
                user.displayName === message.name && "chat__message_receiver"
              }`}
            >
              <span className="chat__name">{message.name}</span>
              {message.message}
              <span className="chat__timestamp">
                {new Date(message.timestamp?.toDate()).toUTCString().toLowerCase().slice(0, -3)}
              </span>
            </p>
          ))}
      </div>

      {!errorFound && (
        <div className="chat__footer">
          <IconButton>
            <InserEmoticonIcon />
          </IconButton>
          <form>
            <input
              placeholder="Type a message"
              type="text"
              name="message__text_input"
              id="message__text_input"
              value={message}
              onChange={handleMessageChange}
            />
            <button type="submit" onClick={sendMessage}>
              Send a message
            </button>
          </form>
          <IconButton>
            <MicIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default Chat;
