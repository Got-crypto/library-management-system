import { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import FirebaseContext from "../context/firebase-context"
import * as ROUTES from '../constants/routes'
import { getAvailableBooksFromStorage} from "../services/firebase"
import BookContainer from "./member-dashboard/book-container"
import UserBooks from "./member-dashboard/user-books"

export default function MemberDashboard(){

    const {firebase} = useContext(FirebaseContext)
    const history = useHistory()
    const [availableBooks, setAvailableBooks] = useState(null)
    const [isOpen, setIsOpen] = useState(false)

    const showBooks = async () => {

        setIsOpen(true)
        
    }

    useEffect(()=>{
        const getAvailableBooks = async ()=> {
            const availableBooks = await getAvailableBooksFromStorage()

            setAvailableBooks(availableBooks)
        }

        getAvailableBooks()
    }, [availableBooks])

    return (
        <div className="h-auto w-full flex justify-center items-center flex-col">
            <div className="h-10 border-b-2 w-full">
                <div className="h-full mx-auto max-w-screen-lg flex justify-between items-center">
                    <p>
                        Afk Library
                    </p>
                    <div>
                        <button
                            className="bg-[dodgerblue] text-white h-8 w-24 rounded font-bold text-sm"
                            onClick={showBooks}
                        >
                            My Books
                        </button>
                        <button 
                            className="text-[dodgerblue] h-8 w-24 rounded font-bold text-sm"
                            onClick={ async ()=>{
                                await firebase.auth().signOut()
                                history.push(ROUTES.LOGIN)
                            }}
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </div>
            <div className="h-auto max-w-screen-lg mx-auto flex flex-col justify-center items-center">
                    {
                        availableBooks ? (
                            <BookContainer availableBooks={availableBooks} />
                        ) : (
                            <p>No books found</p>
                        )
                    }
                    <UserBooks isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>

        </div>
    )
}