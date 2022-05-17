import { GoogleAuthProvider } from "firebase/auth"
import { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { Link } from "react-router-dom"
import * as ROUTES from '../constants/routes'
import FirebaseContext from "../context/firebase-context"

export default function Login(){


    const [emailAddress, setEmailAddress] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [disabled, setDisabled] = useState(true)
    const {firebase} = useContext(FirebaseContext)
    const history = useHistory()

    const handleLogin = async () => {
        try{
            await firebase.auth().signInWithEmailAndPassword(emailAddress, password)
            history.push(ROUTES.DASHBOARD)
        }catch(error){
            setError(error.message)
        }
    }

    const handleGoogleLogin = async () => {
        const googleAuth = new GoogleAuthProvider()
        
        try{
            const {user} = await firebase
                                .auth()
                                .signInWithPopup(googleAuth)
            const existingEmail = await firebase
                    .firestore()
                    .collection('users')
                    .where('emailAddress', '==', user.email)
                    .get()
            
            if( existingEmail.length === 0 ){
                await firebase
                .firestore()
                .collection('users')
                .add({
                    userID: user.uid,
                    username: user.displayName,
                    emailAddress: user.email,
                    borrowedBooks: [],
                    profilePhoto: user.photoURL,
                    phoneNumber: "",
                    isAdmin: false
                })
            }

            history.push(ROUTES.DASHBOARD)
        }catch(error){
            setError(error.message)
        }

    
    }

    useEffect(()=>{
        if ( emailAddress === "" || password === "" ){
            setDisabled(true)
        }else{
            setDisabled(false)
        }
    },[emailAddress, password])


    return (
        <>
            <div className="h-[95vh] bg-slate-300 flex flex-col justify-center items-center">
                <div className="h-[10vh] text-2xl">
                    <p>Welcome, please log in to your AFK Library account</p>
                    {
                        error && <p className="text-red-500 mx-auto text-sm text-center w-96">{error}</p>
                    }
                </div>
                <div className="h-auto border rounded flex-col w-96 flex border-gray-500 justify-center">
                    <input
                        className="my-4 bg-transparent w-5/6 h-10 mx-auto border border-gray-500 rounded"
                        value={emailAddress}
                        onChange={({target})=>setEmailAddress(target.value)}
                        placeholder="Enter your email address"
                        type="text"
                    />
                    <input
                        className="my-4 w-5/6 h-10 mx-auto bg-transparent border rounded border-gray-500"
                        value={password}
                        onChange={({target})=>setPassword(target.value)}
                        placeholder="Enter your password"
                        type="password"
                    />
                    <button
                        className={`${disabled ? 'bg-blue-300' : 'bg-[dodgerblue] text-white'} my-4 flex justify-center items-center w-5/6 h-10 mx-auto rounded`}
                        onClick={handleLogin}
                        disabled={disabled}
                    >
                        {
                            disabled ? (
                                <svg 
                                    className="w-6 h-6" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24" 
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                                    />
                                </svg>
                            ) : (
                                <p>
                                    Log in
                                </p>
                            )
                        }
                    </button>
                    <div className="my-4 w-5/6 h-10 text-sm mx-auto">
                        Don't have an account?
                        <Link
                            to={ROUTES.SIGNUP}
                            className="font-bold ml-2 hover:underline"
                        >
                            Sign up
                        </Link>
                    </div>
                    
                    <button
                        className="my-4 w-5/6 h-10 grid grid-cols-4 justify-evenly items-center mx-auto rounded bg-white"
                        onClick={handleGoogleLogin}
                    >
                        <img
                            className="h-8 col-span-1"
                            src="/images/google.png"
                            alt="google icon"
                        />
                        <p className="col-span-2 h-8 flex justify-center items-center">Sign in With Google</p>
                    </button>
                </div>
            </div>
        </>
    )
}