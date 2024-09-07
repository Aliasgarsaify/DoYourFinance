import React, { createElement, useState } from "react";
import { Table, Select } from "antd";
import {Radio} from "antd";
import searchImg from "../assets/search.svg";
import "./transactionTable.css";
import Button from "../Components/Button";
import { unparse, parse } from "papaparse";
import { toast } from "react-toastify";

function TransactionTable({transactions, fetchTransaction, addTransaction}){

    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [sortKey, setSortKey] = useState("");


const columns = [

    {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
    {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
    },
    {
        title: "Type",
        dataIndex: "type",
        key: "type",
    } ,
    {
        title: "Date",
        dataIndex: "date",
        key: "date",
    },
    
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
];

let filteredTransaction = transactions.filter(
     (item) =>  item.name.toLowerCase().includes(search.toLowerCase()) && item.type.includes(typeFilter.toLowerCase()) );

const sortedTransactions = [...filteredTransaction].sort((a, b) => {
        if (sortKey === "date") {
          return new Date(b.date) - new Date(a.date);
        } else if (sortKey === "amount") {
          return b.amount - a.amount;
        } else {
          return 0;
        }
}); 


function exportCSV(){
    let csv = unparse({
        fields: ["name", "amount", "type", "date", "tag"],
        data: transactions
    });

    const blob = new Blob( [csv], {type : "text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transaction.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function importCSV(event) {
    event.preventDefault();
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
            console.log("results>>", results);
          // Now results.data is an array of objects representing your CSV rows
          for (const transaction of results.data) {
            // Write each transaction to Firebase, you can use the addTransaction function here
            console.log("Transactions", transaction);
            const newTransaction = {
              ...transaction,
              amount: parseInt(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          }
        },
      });
      toast.success("All Transactions Added");
      fetchTransaction();
      event.target.files = null;
    } catch (e) {
      toast.error(e.message);
    }
  }


    return (
        <div className="container">
            <div className="search-bar">
                <div className="input-flex">
                    <img src={searchImg} width="16"/>
                    <input 
                    value={search}
                    onChange={ (e) => setSearch(e.target.value)}
                    placeholder="Search by name" 
                    ></input>
                </div>

                <Select
                className="select-input"
                onChange={(value) => setTypeFilter(value)}
                value={typeFilter}
                placeholder="Filter"
                allowClear
                >
                <Select.Option value="">All</Select.Option>
                <Select.Option value="income">Income</Select.Option>
                <Select.Option value="expense">Expense</Select.Option>
                </Select>

            </div>
  
            <div className="my-table">
                <div className="heading">

                    <h1>My Transaction</h1>

                    <Radio.Group
                    onChange={(e) =>setSortKey(e.target.value) }
                    value={sortKey}
                    >
                    <Radio.Button value="">No Sort</Radio.Button>
                    <Radio.Button value="date">Sort by Date</Radio.Button>
                    <Radio.Button value="amount">Sort by Amount</Radio.Button>
                    </Radio.Group>

                    <div className="btn-CSV">
                        <Button text={"Export to CSV"} onClick={exportCSV}></Button>
                        <label className="btn btn-blue">
                            Import from CSV
                            <input
                            style ={{display:"none"}}
                            onChange={importCSV}
                            type="file"
                            accept=".csv"
                            required
                            />
                        </label>
                    
                    </div>

                </div>

            <Table dataSource={sortedTransactions} columns={columns}/>

            </div>

        </div>
        
    );

}

export default TransactionTable;