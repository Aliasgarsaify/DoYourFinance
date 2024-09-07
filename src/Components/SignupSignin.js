import React from "react";
import './signupSignin.css';
import Input from "./Input";
import { useState } from "react";
import Button from "./Button";
import { createUserWithEmailAndPassword , signInWithEmailAndPassword} from "firebase/auth";
import { auth, db, provider } from "../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function SignupSignin(){

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [loginForm, setLoginForm] = useState(false);
    const navigate = useNavigate();

    function signupWithEmail(){
        setLoading(true);
        // console.log(name);
        // console.log(email);
        // console.log(password);
        // console.log(confirmPassword);
        // authenticate the user or basically create new acc for user

        if(name !== "" && email !== "" && password !== "" && confirmPassword !== "" ){

            if(password === confirmPassword){

                createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed up 
                    const user = userCredential.user;
                    console.log(user);
                    toast.success("account created");
                    setLoading(false);
                    setConfirmPassword("");
                    setName("");
                    setEmail("");
                    setPassword("");
                    createDoc(user);
                    navigate('/dashboard');
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    toast.error(errorMessage);
                    setLoading(false);
                    // ..
                });

            }
            else{
                toast.error("password and confirm Password do not match");
                setLoading(false);
            }

        }
        else{
            toast.error("all fields are required");
            setLoading(false);
        }

    }


    async function createDoc(user){
        // make sure that doc with user Id does not exists already 
        // create doc 
        if(!user) return ;

        const userRef = doc(db, "users", user.uid);
        const userData = await getDoc(userRef);

        if(!userData.exists()){
            try{
                await setDoc(doc(db, "users", user.uid), {
                    name : user.displayName ? user.displayName : name,
                    email : user.email,
                    photoUrl: user.photoUrl ? user.photoUrl : "",
                    createdAt: new Date()
                });
                toast.success("Doc created Successfully");
            }
            catch(e){
                toast.error(e.message);
            }
        }
        else{
           
        }

    }

    function loginWithEmail(){
        console.log(email);
        console.log(password);

        if(email !== "" && password !== ""){
            setLoading(true);
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    setEmail("");
                    setPassword("");
                    toast.success("You Are Logged In");
                    setLoading(false);
                    console.log(user);
                    navigate('/dashboard');
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    toast.error(errorMessage);
                    setLoading(false);
                });
        }
        else{
            toast.error("All Fields are Required");
            setLoading(false);
        }
        
    }

    function googleAuth(){
        setLoading(true);

        try{
            signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                setLoading(false);
                toast.success('user autheticated');
                navigate("/dashboard");
                createDoc(user);
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                setLoading(false);
                toast.error(errorMessage);
                // ...
            });
        }
        catch(e){
            toast.error(e.message);
        }
    }

    return (
        <>
        { loginForm ? 
            (<div className="signup-wrapper">
                <h2 className="title">Login on <span style={{color: "var(--theme)"}}>DoYourFinance.</span></h2>

                <form >

                    <Input label={"Email"} state={email} setState={setEmail} placeholder={"johdoe@gmail.com"} type={"email"}/>

                    <Input label={"Password"} state={password} setState={setPassword} placeholder={"Password"} type={"password"}/>

                    <Button onClick={loginWithEmail} text={loading ? "Loading..." : "login Using Email and Password"} disabled ={loading}/>

                    <p style={{textAlign: "center"}}>or</p>

                    <Button onClick={googleAuth} text={ loading ? "Loading..." : "login Using Google"} blue={true}/>

                    <p className="click-here" onClick={() => setLoginForm(false)}>Or Don't have an Account? Click Here</p>

                </form>
            </div>) 
            : 
            (<div className="signup-wrapper">
                <h2 className="title">Signup on <span style={{color: "var(--theme)"}}>DoYourFinance.</span></h2>

                <form >
                    <Input label={"Full Name"} state={name} setState={setName} placeholder={"John Doe"} type={"text"}/>

                    <Input label={"Email"} state={email} setState={setEmail} placeholder={"johdoe@gmail.com"} type={"email"}/>

                    <Input label={"Password"} state={password} setState={setPassword} placeholder={"Password"} type={"password"}/>

                    <Input label={"Confirm Password"} state={confirmPassword} setState={setConfirmPassword} placeholder={"Confirm Password"} type={"password"}/>

                    <Button onClick={signupWithEmail} text={loading ? "Loading..." : "Signup Using Email and Password"}  disabled ={loading}/>

                    <p style={{textAlign: "center"}}>or</p>

                    <Button onClick={googleAuth} text={ loading ? "Loading..." : "Signup Using Google"} blue={true}/>

                    <p className="click-here" onClick={() => setLoginForm(true)}>Or have an Account? Click Here</p>

                </form>
            </div> ) 
        }
        </>
    )
}

export default SignupSignin;