const bookItemId = "itemId";
const submitForm =document.getElementById('inputBook')

function makeBook(title, author, year, isComplete) {
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = author

    const bookYear = document.createElement('p');
    bookYear.innerText = year;

    const bookAction = document.createElement('div');
    bookAction.classList.add("action");
    if(isComplete) {
        bookAction.append(
            createUndoButton(),
            createEditButton(),
            createTrashButton()
        )
    } else {
        bookAction.append(
            createCheckButton(),
            createEditButton(),
            createTrashButton()
        )
    }

    const additionalAction = document.createElement('article');
    additionalAction.classList.add('w3-leftbar', 'w3-panel', 'w3-light-gray');
    additionalAction.append(bookTitle, bookAuthor, bookYear, bookAction);

    return additionalAction;
}

function createButton(buttonClass,divClass, buttonText, evenListener) {
    const div = document.createElement('span')
    div.classList.add(divClass)
    const button = document.createElement('i');
    button.innerText = buttonText;
    button.classList.add(buttonClass);
    button.addEventListener('click', function(e) {
        evenListener(e)
    })
    div.append(button)

    return div;
}

function createUndoButton() {
    return createButton("material-icons","w3-text-green", "reply x", function(e) {
        undoBookFromCompleted(e.target.parentElement.parentElement.parentElement)
    });
}

function createCheckButton() {
    return createButton("material-icons","w3-text-green", "done_outline x", function(e) {
        addBookToCompleted(e.target.parentElement.parentElement.parentElement)
    })
}

function createTrashButton() {
    return createButton("material-icons","w3-text-red", "delete", function(e) {
        removeBook(e.target.parentElement.parentElement.parentElement)
    })
}

function createEditButton() {
    return createButton("material-icons", "w3-text-blue", "edit x", function(e) {
        editBook(e.target.parentElement.parentElement.parentElement)
    })
}

function addBook() {
    const incompleteBooksList = document.getElementById('incompleteBookshelfList');
    const completeBooksList = document.getElementById('completeBookshelfList');
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;

    const book = makeBook(bookTitle, `Penulis: ${bookAuthor}`, `Tahun: ${bookYear}`, isComplete);
    const bookObject = generateBookData(bookTitle, bookAuthor, bookYear, isComplete);
    book[bookItemId] = bookObject.id;
    books.push(bookObject);

    if(isComplete) {
        completeBooksList.append(book);
    } else {
        incompleteBooksList.append(book);
    }
    updateDataToStorage();
}

function addBookToCompleted(bookElement) {
    const completeBooksList = document.getElementById('completeBookshelfList');
    const bookTitle = bookElement.querySelector("h3").innerText;
    const bookAuthor = bookElement.querySelectorAll("p")[0].innerText;
    const bookYear = bookElement.querySelectorAll("p")[1].innerText;

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, true);
    const book = findBook(bookElement[bookItemId]);
    book.isComplete = true;
    newBook[bookItemId] = book.id;

    completeBooksList.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function removeBook(bookElement) {
    const confirmDelete = window.confirm("Apakah anda yakin ingin menghapus buku ini?");
    if(confirmDelete) {
        const bookPosition = findBookIndex(bookElement[bookItemId]);
        books.splice(bookPosition, 1);
        bookElement.remove();
        updateDataToStorage();
        alert("Buku berhasil dihapus!")
    } else {
        alert("Buku gagal dihapus!")
    }
}

function undoBookFromCompleted(bookElement) {
    const incompleteBooksList = document.getElementById('incompleteBookshelfList');
    const bookTitle = bookElement.querySelector('h3').innerText;
    const bookAuthor = bookElement.querySelectorAll('p')[0].innerText;
    const bookYear = bookElement.querySelectorAll('p')[1].innerText;

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, false);

    const book = findBook(bookElement[bookItemId]);
    book.isComplete  = false;
    newBook[bookItemId] = book.id;

    incompleteBooksList.append(newBook);
    bookElement.remove();
    updateDataToStorage();
}

function searchBook() {
    const input = document.getElementById("searchBookTitle");
    const filter = input.value.toUpperCase();
    const bookItem = document.querySelectorAll("section.book_shelf > .book_list > .w3-panel");
    for (let i = 0; i < bookItem.length; i++) {
        let textValue = bookItem[i].textContent || bookItem[i].innerText;
        if (textValue.toUpperCase().indexOf(filter) > -1) {
            bookItem[i].style.display = "";
        } else {
            bookItem[i].style.display = "none";
        }
    }
}

function editBook(bookElement) {
   const confirmEdit = confirm('Apakah kamu yakin ingin mengedit buku ini ?');
   if(confirmEdit) {
    const bookPosition = findBookIndex(bookElement[bookItemId]);
    books.splice(bookPosition, 1);
    bookElement.remove();
    updateDataToStorage();
    const bookTitle = bookElement.querySelector('h3').innerText;
    const bookAuthor = bookElement.querySelectorAll('p')[0].innerText;
    const bookYear = bookElement.querySelectorAll('p')[1].innerText;
    document.getElementById('inputBookTitle').value = bookTitle;
    const author = bookAuthor.split(': ');
    const year = bookYear.split(': ')
    document.getElementById('inputBookAuthor').value = author[1];
    document.getElementById('inputBookYear').value = year[1];
    alert('Silahkan melakukan pengeditan di form masukkan buku!')
   }
}

function checkButton() {
    const span = document.querySelector('span');
    if(inputBookIsComplete.checked) {
        span.innerText = "Selesai dibaca"
    } else {
        span.innerText = "Belum selesai dibaca"
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('inputBook');
    const searchBookForm = document.getElementById('searchBook');
    const inputBookIsComplete = document.getElementById('inputBookIsComplete');

    submitForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addBook()
        document.getElementById('inputBookTitle').value = ""
        document.getElementById('inputBookAuthor').value = ""
        document.getElementById('inputBookYear').value = ""
    });

    searchBookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        searchBook()
    })

    inputBookIsComplete.addEventListener('input', function(e) {
        e.preventDefault();
        checkButton();
    });

    if(checkStorage()) {
        loadDataFromStorage();
    }

});

document.addEventListener("ondataloaded", function() {
    refreshDataFromBooks();
})