"use client";
import { useState } from "react";

//use params and set email so that BE can identify

export default function Register() {
  const [otp, setOtp] = useState("");
  const submit = () => {
    const data = { otp, email: window.localStorage.getItem("email")};
    fetch("http://localhost:4000/user/verify", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) =>
      res.json().then((data) => {
        console.log(data);
        if (res.status == 200) {
            window.localStorage.setItem("roomid", data.randRoomId);
            window.localStorage.setItem("token", data.token);
          window.location.href = "/";
        }
      })
    );
  };
  return (
    <div className="container">
      <div className="form">
        <div className="wrap">
          <label className="lab">OTP</label>
          <input
            type="text"
            className="inp"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
            }}
          />
        </div>
        <button className="btn" onClick={() => submit()}>
          Verify
        </button>
      </div>
    </div>
  );
}
