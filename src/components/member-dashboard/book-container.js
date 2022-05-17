import { useContext } from "react"
import UserContext from "../../context/user-context"
import { getBookFirebase } from "../../services/firebase"

export default function BookContainer({availableBooks}){
    const {user} = useContext(UserContext)
    const getBook = async (ISBN) => {
        await getBookFirebase(ISBN, user.uid)
    }
    return (
        <div className="w-full h-auto py-10 grid grid-cols-3 items-center">
            
            {
                availableBooks.map(book => {
                    return <div key={book.ISBN} className="h-[26rem] flex flex-col items-center mx-5 col-span-1 mt-24 text-black font-bold text-sm">
                            <img
                                src={book.bookCoverURL}
                                className="h-[80%]"
                                alt={book.name}
                            />
                            <div className="mx-auto text-center w-[80%]">
                                {
                                    book.bookTitle
                                }
                            </div>
                            <div className="mx-auto font-normal mt-2 text-center w-full">
                                {
                                    book.author
                                }
                            </div>
                            <div className="mx-auto text-center font-mono font-light mt-2 w-full">
                                {
                                    book.genre
                                }
                            </div>
                            <button
                                className="bg-[dodgerblue] p-2 rounded text-sm font-bold text-white"
                                onClick={()=>{
                                    getBook(book.ISBN)
                                }}
                            >
                                Get Book
                            </button>
                        </div>
                })
            }
        </div>
    )
}