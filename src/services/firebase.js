import {firebase, FieldValue} from '../lib/firebase'
import isAfter from 'date-fns/isAfter'
import addDays from 'date-fns/addDays'

// checking if user is admin so they can do their duties

export async function checkIfUserAdmin( userId ){
    const result = await firebase
        .firestore()
        .collection('users')
        .where('userID', '==', userId)
        .get()

    const response = result.docs.map(item => ({
        ...item.data(),
        docId: item.id
    }))

    return response[0]
}

// admin duty to add books to shelf

export async function addBookToShelf(ISBN, bookTitle, publicationYear, language, genre, bookCover, author){
    
    let uploadError = null
     
    try {
        await firebase
            .storage()
            .ref(bookCover.name)
            .put( bookCover )
    } catch (error) {
        uploadError = error.message
    }
        
    const bookCoverURL = await firebase
                            .storage()
                            .ref(bookCover.name)
                            .getDownloadURL()
    

    if( uploadError === null ){
        await firebase
            .firestore()
            .collection('books')
            .add({
                ISBN, bookTitle, publicationYear, language, genre, bookCoverURL, author, available: true
            })
    }
}

// displaying available books on registered members dashboard

export async function getAvailableBooksFromStorage(){
    const {docs} =  await firebase
                .firestore()
                .collection('books')
                .where('available', '==', true)
                .get()

    const response = docs.map((item)=>({
        ...item.data(),
        docId: item.id
    }))

    return response.length > 0 ? response : null
}

// getting details for the auth user

export async function getUserByUserId( userId ){
    const {docs} = await firebase
        .firestore()
        .collection('users')
        .where('userID', '==', userId)
        .get()

    const response = docs.map(item => ({
        ...item.data(),
        docId: item.id
    }))

    return response[0]
}

// getting details for the selected book

export async function getBookByISBN( ISBN ){
    const {docs} = await firebase
        .firestore()
        .collection('books')
        .where('ISBN', '==', ISBN)
        .get()

    const response = docs.map(item => ({
        ...item.data(),
        docId: item.id
    }))

    return response[0]
}

// reserving selected book to the auth user inventory

export async function getBookFirebase(ISBN, userId){
    const {docId: user, borrowedBooks, infractions} = await getUserByUserId(userId)

    let permission = true

    for ( let infraction of infractions ){
        if ( !infraction.finePaid ){
            permission = false
        }
    }
    
    if( borrowedBooks.length < 5 && permission && infractions.length < 5 ){
        await firebase
            .firestore()
            .collection('users')
            .doc(user)
            .update({
                borrowedBooks: FieldValue.arrayUnion({
                    book: ISBN,
                    timeBorrowed: Date.now()
                })
            })

        const {docId: book} = await getBookByISBN(ISBN)

        await firebase
            .firestore()
            .collection('books')
            .doc(book)
            .update({
                available: false
            })
    } else{
        !permission && (
            console.log("you have unpaid fine")
        )
        borrowedBooks.length > 4 && (
            console.log("you reached your borrowing limit")
        )
        infractions.length > 4 && (
            console.log("you are banned from borrowing books due to consistent delay returns, visit administration")
        )
    }

}

// displaying auth user inventory books

export async function getUserBooks( userId ){
    const {borrowedBooks} = await getUserByUserId(userId)

    let bookDocs = []
    
    for( let item of borrowedBooks ){
        const {docs} = await firebase
                            .firestore()
                            .collection('books')
                            .where('ISBN', '==', item.book)
                            .get()

        const response = docs.map(item => ({
            ...item.data(),
            docId: item.id
        }))

        bookDocs.push(response[0])
    }


    return bookDocs

}

// returning the selected book from inventory to shelf

export async function handleReturnBook( bookId, userId ){
    const {borrowedBooks, docId} = await getUserByUserId(userId)
    const {docId: boodDocId} = await getBookByISBN(bookId)


    const {book, timeBorrowed} = borrowedBooks.filter(book => book.book === bookId)[0]

    const delayed = isAfter( new Date(), addDays(timeBorrowed, 5) )

    delayed && (
        await firebase
            .firestore()
            .collection('users')
            .doc(docId)
            .update({
                infractions: FieldValue.arrayUnion({
                    infraction: 'book delay',
                    finePaid: false
                })
            })
    )

    await firebase
            .firestore()
            .collection('users')
            .doc(docId)
            .update({
                borrowedBooks: FieldValue.arrayRemove({
                    book, timeBorrowed
                })
            })
    
    await firebase
            .firestore()
            .collection('books')
            .doc(boodDocId)
            .update({
                available: true
            })
}