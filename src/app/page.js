"use client";
import { useEffect, useState } from "react";
import {io} from "socket.io-client";
import "./home.css";
import img from "../../public/3.jpg";


function useSocket(url, token) {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const socketIo = io(url,  {
        query: {"token" :token},
        transports: ['websocket'], 
        upgrade: false
      });
    setSocket(socketIo);
    function cleanup() {
      socketIo.disconnect();
    }
    return cleanup;
  }, []);

  return socket;
}


export default function Home(){
    const token = window.localStorage.getItem("token");
    const [code, setCode] = useState();
    const [msg, setMsg] = useState();
    const [name, setName] = useState();
    const socket = useSocket("ws://localhost:4000/", token);

    useEffect(() => {
      if (socket) {
        socket.on("room-ack", (msg) => {
          console.log(msg)
          setCode(msg.code);
          const newMsg = document.createElement("div");
          newMsg.classList.add("msg");
          newMsg.textContent = msg.msg
          document.getElementById("container")?.appendChild(newMsg);
          // setTimeout(() => {
          //   document.getElementById("container").removeChild(newMsg)
          // }, 1500)
        })
        socket.on("room-msg", (msg) => {
          const wrap = document.createElement("div");
          wrap.classList.add("wrap");
          const mssg = document.createElement("div");
          mssg.classList.add("mssg");
          mssg.textContent = msg.msg
          if(msg.sockId == socket.id){
            wrap.classList.add("r");
            mssg.classList.add("r");
          }else{
            wrap.classList.add("s");
            mssg.classList.add("s");
          }
          wrap.appendChild(mssg);
          document.getElementById("msgs").appendChild(wrap)
        });
        socket.on("room-id", (id) => {
          window.localStorage.setItem("roomid", id.msg);
        })
        socket.on("room-disconnect", (msg) => {
          setCode(msg.code)
        })
        socket.on("name", (data) => {
          setName(data.name)
        })
      }
    }, [socket]);
    const joinroom = () => {
      socket.emit("join-room", token)
    }
    const sendMsg = () => {
      const roomid = window.localStorage.getItem("roomid");
      socket.emit("room-msg", {id: roomid, msg});
      setMsg("")
    }
    return (
      <>
        {code == 200 ? (
          <div
            className="container"
            style={{ background: "rgb(225, 225, 225)" }}
          >
            <div className="midcont">
              <div className="nav">
                <p className="title">
                  <img id="dp" src={img.src} className="dp" />
                  {name}
                </p>
                <button className="btn">Leave Room</button>
              </div>
              <div className="msgs" id="msgs">
              </div>
              <div className="chathandler">
                <input
                  id="msg"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Type Something here"
                />
                <button onClick={() => sendMsg()}>Send</button>
              </div>
            </div>
          </div>
        ) : code === 403 ? (
          (window.location.href = "/register")
        ) : (
          <>
            <div className="container" id="container">
              <button className="btn" onClick={() => joinroom()}>
                Chat with Randoms
              </button>
            </div>
          </>
        )}
      </>
    );
}