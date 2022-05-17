import { useEffect, useState } from "react"
import { addBookToShelf } from "../../services/firebase"

export default function BookAddPanel({panelOpen, setPanelOpen}){
    const [ISBN, setISBN] = useState("")
    const [bookTitle, setBookTitle] = useState("")
    const [publicationYear, setPublicationYear] = useState("")
    const [language, setLanguage] = useState("")
    const [genre, setGenre] = useState("")
    const [bookCover, setBookCover] = useState("")
    const [author, setAuthor] = useState("")
    const [disabled, setDisabled] = useState(true)

    useEffect(()=>{
        if( ISBN === "" || bookTitle === "" || publicationYear === "" || language === "" || genre === "" || bookCover === null || author === ""){
            setDisabled(true)
        }else{
            setDisabled(false)
        }
    }, [ISBN, bookTitle, publicationYear, language, genre, bookCover, author])

    const handleUploadBookCover = async ( e ) => {
        const bookCover = e.target.files[0]
        const allowedTypes = ['image/jpeg', 'image/png']

        if( bookCover && allowedTypes.includes(bookCover.type) ){
            setBookCover(bookCover)
        }else{
            setBookCover("")
        }


    }



    const addBook = async ()=>{
        await addBookToShelf(ISBN, bookTitle, publicationYear, language, genre, bookCover, author)
        setAuthor("")
        setBookCover(null)
        setBookTitle("")
        setGenre("")
        setISBN("")
        setLanguage("")
        setPublicationYear("")
    }

    return (
        <div 
            className={`z-10 shadow-md shadow-black -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 text-white rounded h-auto bg-[#242424] w-96 ${panelOpen ? 'flex justify-center flex-col items-center' : 'hidden'} absolute`}
        >
            <div className="mt-1 w-[95%] flex justify-end items-center">
                <button className="p-1 shadow-md shadow-black bg-red-500 rounded-full" onClick={()=>setPanelOpen(false)}>
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
                            d="M6 18L18 6M6 6l12 12" 
                        />
                    </svg>
                </button>
            </div>
            <input
                className="my-2 text-black p-2 w-5/6 rounded"
                placeholder="Book ISBN"
                value={ISBN}
                onChange={({target})=>setISBN(target.value)}
                />
            <input
                className="my-2 text-black p-2 w-5/6 rounded"
                placeholder="Book title"
                value={bookTitle}
                onChange={({target})=>setBookTitle(target.value)}
                />
            <input
                className="my-2 text-black p-2 w-5/6 rounded"
                placeholder="Author"
                value={author}
                onChange={({target})=>setAuthor(target.value)}
                />
            <input
                className="my-2 text-black p-2 w-5/6 rounded"
                value={publicationYear}
                onChange={({target})=>setPublicationYear(target.value)}
                placeholder="Publication year"
                />
            <input
                className="my-2 text-black p-2 w-5/6 rounded"
                value={genre}
                onChange={({target})=>setGenre(target.value)}
                placeholder="Genre"
                />
            <input
                className="my-2 text-black p-2 w-5/6 rounded"
                placeholder="Language"
                value={language}
                onChange={({target})=>setLanguage(target.value)}
                />
            <label className="h-10 w-5/6 justify-center items-center grid grid-cols-3">
                <span className="col-span-1 hover:cursor-pointer bg-slate-500 shadow-md shadow-black h-10 w-10 rounded-full flex justify-center items-center">+</span>
                <input
                    type="file"
                    onChange={handleUploadBookCover}
                    className="file:hidden col-span-2"
                />
            </label>
            <button 
                className={`${ disabled ? 'bg-slate-500' : 'bg-[dodgerblue]'}  my-2 p-2`}
                onClick={addBook}
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
                            Add Book
                        </p>
                    )
                }
            </button>
        </div>
    )
}