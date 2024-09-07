import React, { useEffect } from "react";
import './header.css';
import { auth } from "../firebase";
import {useAuthState} from 'react-firebase-hooks/auth';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";


function Header(){

    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect( () => {
        if(user){
            navigate("/dashboard");
        }
    }, [user])

    function logOut(){
        try{
            signOut(auth).then(() => {
                // Sign-out successful. 
                toast.success("logging out");
                navigate("/");

            }).catch((error) => {
                // An error happened.
                toast.error(error.message);
            });
        }
        catch(e){
            toast.error("log out failed");
        }
    }

    return (
        <div className="navbar">
            <p className="heading"> DoYourFinance. </p>
            { user &&
                <p onClick={logOut} className="link"> Logout </p>
            }
        </div>
    )
}

export default Header;