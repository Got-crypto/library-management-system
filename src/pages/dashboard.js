import { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import FirebaseContext from "../context/firebase-context"
import * as ROUTES from '../constants/routes'
import { checkIfUserAdmin } from "../services/firebase"
import UserContext from "../context/user-context"
import HeroDashboard from "../components/hero-dashboard"
import MemberDashboard from "../components/member-dashboard"
import AdminDashboard from "../components/admin-dashboard"

export default function Login(){
    
    const [isAdmin, setIsAdmin] = useState()
    const {user} = useContext(UserContext)

    useEffect(()=>{
        const isUserAdmin = async () => {
            try {
                const {isAdmin} = await checkIfUserAdmin(user.uid)
                setIsAdmin(isAdmin)
            } catch (error) {
                console.log('error', error)
            }
        }

        isUserAdmin()
    },[user])

    return (
        <div className="bg-slate-300 h-auto min-h-screen">
            {
                user ? (
                    isAdmin === undefined ? (
                        <p>wait ...</p>
                    ) : (
                        isAdmin ? (
                            <AdminDashboard />
                        ) : (
                            <MemberDashboard />
                        )
                    )
                ) : (
                    <HeroDashboard />
                )
            }
        </div>
    )
}