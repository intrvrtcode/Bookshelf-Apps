const storageKey = 'BOOKS_SHELF';
let books = []

function checkStorage() {
    if(typeof(Storage) !== 'undefined') {
        return true
    } else {
        alert('Browser yang anda gunakan tidak mendukung web storage!')
    }

}

function saveData() {
    parseData = JSON.stringify(books);
    localStorage.setItem(storageKey, parseData);
}


function loadDataFromStorage() {
    const serializedData = localStorage.getItem(storageKey);

    let data = JSON.parse(serializedData);

    if (data !== null)
        books = data;

    document.dispatchEvent(new Event("ondataloaded"));
}

function updateDataToStorage() {
    if(checkStorage()) {
        saveData();
    }
}

function generateBookData(title, author, year, isComplete) {
    return {
        id: +new Date(),
        title,
        author,
        year,
        isComplete
    };
}

function findBook(bookId) {
    for (book of books) {
        if (book.id === bookId)
            return book;
    }
    return null;
}

function findBookIndex(bookId) {
    let index = 0
    for (book of books) {
        if (book.id === bookId)
            return index;

        index++;
    }

    return -1;
}

function refreshDataFromBooks() {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');

    for (book of books) {
        const newBook = makeBook(book.title, `Penulis: ${book.author}`, `Tahun: ${book.year}`, book.isComplete);
        newBook[bookItemId] = book.id;

        if (book.isComplete) {
            completeBookshelfList.append(newBook);
        } else {
            incompleteBookshelfList.append(newBook);
        }
    }
}