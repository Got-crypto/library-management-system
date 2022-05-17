import { useContext, useState } from "react"
import { useHistory } from "react-router-dom"
import FirebaseContext from "../context/firebase-context"
import * as ROUTES from '../constants/routes'
import BookAddPanel from "./admin-dashboard/book-add-panel"

export default function AdminDashboard(){

    const [panelOpen, setPanelOpen] = useState(false)

    const {firebase} = useContext(FirebaseContext)
    const history = useHistory()

    return (
        <div className="h-full w-full flex justify-center flex-col items-center">
            <button className="h-14 w-48 bg-[dodgerblue] text-white rounded"
                onClick={()=>setPanelOpen(true)}
            >
                Add a book
            </button>
            <button className="h-14 w-48 border scale-75 border-[dodgerblue] mt-4 text-[dodgerblue] rounded"
                onClick={async()=>{
                    await firebase.auth().signOut()
                    history.push(ROUTES.LOGIN)
                }}
            >
                log out
            </button>
            <BookAddPanel
                panelOpen={panelOpen}
                setPanelOpen={setPanelOpen}
            />
        </div>
    )
}