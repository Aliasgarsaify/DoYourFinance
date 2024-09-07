import { Card, Row } from "antd";
import React  from "react";
import Button from "./Button";
import "./card.css"

function Cards({setIsExpenseModalVisible, setIsIncomeModalVisible, balance, expense, income}){
    return (
        <div>
            <Row className="my-row">
                <Card className="my-card" 
                title="Current Balance" >
                    <p>${balance}</p>
                    <Button text={"Reset Balance"} blue={true}></Button>
                </Card>
                <Card className="my-card" 
                title="Total Income" >
                    <p>${income}</p>
                    <Button onClick={() => setIsIncomeModalVisible(true)}
                    text={"Add Income"} blue={true}></Button>
                </Card>
                <Card className="my-card" 
                title="Total Expenses" >
                    <p>${expense}</p>
                    <Button onClick={() => setIsExpenseModalVisible(true)}
                    text={"Add Expense"} blue={true}></Button>
                </Card>
            </Row>
        </div>
    )
}

export default Cards;