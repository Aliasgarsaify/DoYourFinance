import React from "react";
import "./input.css";

function Input({label, placeholder, state, setState, type}){


    return (
        <div className="input-wrapper">
            <p className="label">{label}</p>
            <input className="custom-input"
            type={type}
            onChange={(e) => setState(e.target.value)}
            value = {state}
            placeholder={placeholder}
            ></input>
        </div>
    )
}

export default Input;