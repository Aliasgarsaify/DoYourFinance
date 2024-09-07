import React from "react";
import { Line } from '@ant-design/plots';
import "./charts.css";
import { Pie } from "@ant-design/charts";

function Charts({sortedTransactions}){

    const data = sortedTransactions.map( (item) => {
        return {date : item.date, amount : item.amount};
    })

    const spendings = sortedTransactions.filter( (transaction) => {
        if(transaction.type === "expense"){
            return {tag : transaction.tag, amount: transaction.amount};
        }
    })

    const dataPie = [ 
        {tag:"food", amount:0},
        {tag:"education", amount:0},
        {tag:"office", amount:0}
    ]

    spendings.forEach((item) => {
        if(item.tag === "food"){
            dataPie[0].amount += item.amount;
        }
        else if(item.tag === "education"){
            dataPie[1].amount += item.amount;
        }
        else{
            dataPie[2].amount += item.amount;
        }
    });

    const configPie = { 
        data : dataPie,
        angleField: 'amount',
        colorField: 'tag',
        label: {
        text: 'amount',
        position: 'outside',
        },
        legend: {
        color: {
            title: false,
            position: 'right',
            rowPadding: 5,
        },
        },
    };

    const config = {
      data: data,
      xField: 'date',
      yField: 'amount',
      autoFit: true,
      point: {
        shapeField: 'square',
        sizeField: 4,
      },
      interaction: {
        tooltip: {
          marker: false,
        },
      },
      style: {
        lineWidth: 1,
      },
    };
    
    return (
        <div  className="charts">
            <div className="component1">
                <h2>Finantial Statistics</h2>
                <Line className="line"{...config} />
                
            </div>
            <div className="component2">
                <h2>Total Spendings</h2>
                <Pie {...configPie}/>
            </div>

        </div>
    )
}


export default Charts;