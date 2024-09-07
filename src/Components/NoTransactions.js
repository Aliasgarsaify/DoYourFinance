import React from "react";
import myImg from "../assets/transaction.svg";
import "./noTransactions.css";

function NoTransactions (){
    return (
        <div className="no-trans">
            <img src={myImg} />
            <p> No Transactions Added</p>
        </div>
    )
}

export default NoTransactions;