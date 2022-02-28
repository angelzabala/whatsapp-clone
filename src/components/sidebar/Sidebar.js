import React, { useEffect, useState } from "react";

import "./sidebar.css";

import SearchOutlined from "@material-ui/icons/SearchOutlined";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SidebarChat from "./components/SidebarChat";
import ChatIcon from "@material-ui/icons/Chat";


import db from "../firebase";

import { Avatar, IconButton } from "@material-ui/core";
import { useStateValue } from "../../StateProvider";

const Sidebar = () => {
  const [errorFound, setErrorFound] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [{ user }] = useStateValue();

  const refreshPage = () => {
    window.location.reload();
  }

  useEffect(() => {
    let roomsSubscription;
    try {
      roomsSubscription = db.collection("rooms").onSnapshot((snapshot) => {
        setRooms(
          snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              data: doc.data(),
            };
          })
        );
      });
    } catch (error) {
      setErrorFound(true);
      alert(
        "We are sorry, we couldn't load your data correctly, please refresh the page or try again later"
      );
    }

    return () => {
      roomsSubscription(); //unsubscribe
    }
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user?.photoURL}/>
        <div className="sidebar__header_right">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="sidebar__search_container">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <input
            type="text"
            placeholder="Search or start new chat"
            name="search"
            id="sideebar__header_input"
          />
        </div>
      </div>

      <div className="sidebar__chats">
        <SidebarChat addNewChat />
        {!errorFound ? (
          rooms.map((room) => (
            <SidebarChat key={room.id} id={room.id} name={room.data.name} />
          ))
        ) : (
          <h4 class="sidebar__chats_error" onClick={refreshPage}>Ooops, there was an error fetching the chat rooms</h4>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
