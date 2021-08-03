// create book object

function createBook(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

// UI function
function UI() {}

// Book local storage

function bookLocalStorage() {}

UI.prototype.addBookList = function (book) {
    // Get book list
    let bookList = document.querySelector("#book-list");

    // Create a row
    let row = document.createElement("tr");

    // add data to the row

    row.innerHTML = `
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.isbn}</td>
                        <td><a href="#" class="delete">X</a></td>
                    `;

    // Appened row to the body

    bookList.appendChild(row);
};

// Show alert messages

UI.prototype.showAlertMessage = function (message, className) {
    // create a div element and add a class

    let divElement = document.createElement("div");
    divElement.className = `alert ${className}`;

    // Add text content to div element

    divElement.appendChild(document.createTextNode(message));

    // Get container and form element

    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");

    // Inser before form element

    container.insertBefore(divElement, form);

    // disable form submit for 3 seconds

    document.querySelector("#submit").disabled = true;

    setTimeout(() => {
        document.querySelector(".alert").remove();
        document.querySelector("#submit").disabled = false;
    }, 3000);
};

// Clear all input elements

UI.prototype.clearAllFields = function () {
    bookTitle = document.querySelector("#title").value = "";
    bookAuthor = document.querySelector("#author").value = "";
    bookISBN = document.querySelector("#isbn").value = "";
};

// Remove book from book list

UI.prototype.removeBook = function (book) {
    if (book.classList.contains("delete")) {
        book.parentElement.parentElement.remove();
    }
};

// get books from local storage

bookLocalStorage.prototype.getBooks = function () {
    let bookList;

    if (localStorage.getItem("books") === null) {
        bookList = [];
    } else {
        bookList = JSON.parse(localStorage.getItem("books"));
    }

    return bookList;
};

// display book from local storage

bookLocalStorage.prototype.displayBooks = function () {
    let bookList = this.getBooks();

    bookList.forEach(function (book) {
        const ui = new UI();

        ui.addBookList(book);
    });
};

// add book to local storage

bookLocalStorage.prototype.addBook = function (book) {
    let bookList = this.getBooks();

    bookList.push(book);

    localStorage.setItem("books", JSON.stringify(bookList));
};

// remove book from local storage

bookLocalStorage.prototype.removeBook = function (isbn) {
    let bookList = this.getBooks();

    bookList.forEach((book, index) => {
        if (book.isbn === isbn) {
            bookList.splice(index, 1);
        }
    });

    localStorage.setItem("books", JSON.stringify(bookList));
};

// form event listener

document
    .querySelector("#book-form")
    .addEventListener("submit", function (event) {
        // Get form values

        const bookTitle = document.querySelector("#title").value,
            bookAuthor = document.querySelector("#author").value,
            bookISBN = document.querySelector("#isbn").value;

        // Create UI object

        const ui = new UI();

        // bool local storage object

        const bookLocalStorageObj = new bookLocalStorage();

        // Check conditions for empty values

        if (bookTitle === "" || bookAuthor === "" || bookISBN === "") {
            ui.showAlertMessage(
                "Please fill the required information!",
                "error"
            );
        } else {
            // Create a book object

            const book = new createBook(bookTitle, bookAuthor, bookISBN);

            // Add book to the table

            ui.addBookList(book);
            ui.showAlertMessage("Book has been added successfully!", "success");

            // Add book to local storage

            bookLocalStorageObj.addBook(book);

            ui.clearAllFields();
        }

        event.preventDefault();
    });

// Remove book from the list

document.querySelector("#book-list").addEventListener("click", (event) => {
    const ui = new UI();

    // call book remove method

    ui.removeBook(event.target);

    // remove from local storage

    const bookLocalStorageObj = new bookLocalStorage();
    bookLocalStorageObj.removeBook(
        event.target.parentElement.previousElementSibling.textContent
    );

    ui.showAlertMessage("Book has been removed!", "success");

    event.preventDefault();
});

// Dom reload listener

document.addEventListener("DOMContentLoaded", () => {
    const booklocalStorageObj = new bookLocalStorage();

    booklocalStorageObj.displayBooks();
});
