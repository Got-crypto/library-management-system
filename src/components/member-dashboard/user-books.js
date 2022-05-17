import { useContext, useEffect, useState } from "react"
import UserContext from "../../context/user-context"
import { getUserBooks, handleReturnBook } from "../../services/firebase"

export default function UserBooks({isOpen, setIsOpen}){

    const {user} = useContext(UserContext)

    const returnBook = async ( book ) => {
        await handleReturnBook( book, user.uid )
    }

    const [userBooks, setUserBooks] = useState()

    useEffect(()=>{
        const handleUpdateUserbooks = async ()=> {
            const userBooks = await getUserBooks(user.uid)

            setUserBooks(userBooks)
        }

        handleUpdateUserbooks()
    }, [userBooks, user, setUserBooks])

    return (
        <div className={`${isOpen ? 'flex items-center flex-col' : 'hidden'} top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 absolute h-96 w-96 bg-[#242424]`}>
            <button
                onClick={()=>setIsOpen(false)}
                className="font-bold text-sm text-white"
            >
                close
            </button>
            <div className="h-auto mt-5 w-full flex items-center flex-col">
                {
                    userBooks && (
                        userBooks.map( book => {
                            return <div key={book.ISBN} className="h-10 mt-4 mx-auto w-[95%] inline-flex justify-between items-center">
                                    <img
                                        className="h-full border-2 rounded"
                                        src={book.bookCoverURL}
                                        alt={book.bookTitle}
                                    />
                                    <p className="text-white text-sm">
                                        {
                                            book.bookTitle
                                        }
                                    </p>
                                    <button className="h-full w-16 bg-[dodgerblue] font-bold text-sm text-white"
                                        onClick={()=>returnBook(book.ISBN)}
                                    >
                                        Return
                                    </button>
                                </div>
                        } )
                    )
                }
            </div>

        </div>
    )
}