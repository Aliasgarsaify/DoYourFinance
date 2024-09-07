import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Cards from "../Components/Cards";
import AddExpenseModal from "../Components/AddExpenseModal";
import AddIncomeModal from "../Components/AddIncomeModal";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { auth , db} from "../firebase";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import TransactionTable from "../Components/TransactionTable";
import Charts from "../Components/Charts";
import NoTransactions from "../Components/NoTransactions";


function Dashboard(){

    const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
    const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    const[income, setIncome] = useState(0);
    const[expense, setExpense] = useState(0);
    const[balance, setBalance] = useState(0);

    const [user] = useAuthState(auth); 

    function onFinish(values,type){ 
        console.log(values); 
        const newTransaction = {
            type: type,
            date: values.date.format("YYYY-MM-DD"),
            amount : parseFloat(values.amount),
            tag: values.tag,  
            name: values.name,
        };

        setTransactions([...transactions, newTransaction]);
        calculateBalance();
        addTransaction(newTransaction);
    };

    async function addTransaction(transaction, many){
        // add the doc to our firebase db
        try{    
            const docRef = await addDoc(collection(db, `users/${user.uid}/transactions`), transaction);

            console.log("doc written with id", docRef.id);
            if(!many)  toast.success("transaction added");

        }
        catch(e){
            console.log("error in addind doc", e);
            if(!many) toast.error("coundn't add transaction");
        }

    }


    useEffect( () => {
        // get all doc information 
        fetchTransaction();
    },[user]);

    async function fetchTransaction(){ 
        setLoading(true);
        if(user){
            const q = query(collection(db, `users/${user.uid}/transactions`));
            const allDocs = await getDocs(q);
            let transactionArray = [];
            allDocs.forEach( (doc) => {
                transactionArray.push(doc.data());
            });
            setTransactions(transactionArray);
            console.log("transaction array", transactionArray);
            toast.success("Transaction fetched");
            setLoading(false);
        }
        else{
            setLoading(false); 
        }
    }
 
    useEffect( () => {
        calculateBalance();
    }, [transactions]);

    function calculateBalance(){
        let incomeTotal = 0;
        let expenseTotal = 0;

        transactions.forEach( (transaction) => {
            if(transaction.type === 'income'){
                incomeTotal += transaction.amount;
            }
            else{
                expenseTotal += transaction.amount;
            }
        });
        
        setIncome(incomeTotal);
        setExpense(expenseTotal);

        setBalance(incomeTotal - expenseTotal);
        
    }

    let sortedTransactions = [...transactions].sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    }) ;

    console.log("sorted Transaction",sortedTransactions);

    return (

        <div>
        {loading ? 
            (<p>Loading...</p>) : 
            (
                <div>
                <Header/>
                <Cards 
                setIsExpenseModalVisible = {setIsExpenseModalVisible}
                setIsIncomeModalVisible = {setIsIncomeModalVisible}
                balance = {balance}
                income ={income}
                expense = {expense}
                />
     
                 <AddExpenseModal 
                 isExpenseModalVisible={isExpenseModalVisible}
                 setIsExpenseModalVisible={setIsExpenseModalVisible}
                 onFinish={onFinish}
                 />
     
                 <AddIncomeModal
                 isIncomeModalVisible ={isIncomeModalVisible}
                 setIsIncomeModalVisible={setIsIncomeModalVisible}
                 onFinish={onFinish}
                 />


                {transactions.length !== 0 ? <Charts sortedTransactions = {sortedTransactions} /> :  <NoTransactions/>}

                { transactions.length === 0 ?<p>Loading</p> : <TransactionTable transactions = {transactions}  fetchTransaction= {fetchTransaction} addTransaction={addTransaction}/>}

                </div>
            )
        }
        </div>)
}


export default Dashboard;