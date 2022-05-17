import { useContext, useEffect, useState } from "react";
import FirebaseContext from "../context/firebase-context";
import 'firebase/compat/auth'

export default function UseAuthListener(){
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('authUser')))

    const {firebase} = useContext(FirebaseContext)

    useEffect(()=>{
        return firebase.auth().onAuthStateChanged(authUser => {
            if( authUser ){
                localStorage.setItem('authUser', JSON.stringify(authUser))
                setUser(authUser)
            }else{
                setUser(null)
                localStorage.removeItem('authUser')
            }
        })
    }, [firebase])

    return ({user})
}