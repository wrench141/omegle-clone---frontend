"use client";
import { useState } from "react";

export default function Register(){
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");
    const submit = () => {
        const data = {email};
        fetch("http://localhost:4000/user/auth", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }).then((res) => res.json().then((data) => {
            window.localStorage.setItem("email", email);
            console.log(data)
            if(res.status == 200){
              window.location.href = "/register/otpvalidation"
            }
            setMsg(data.message);
        }))
    }
    return (
      <div className="container">
        <h3>{msg}</h3>
        <div className="form">
          <div className="wrap">
            <label className="lab">Email</label>
            <input
              type="text"
              className="inp"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
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