// Class(books)
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//Class(UI)
class UI {
  static displayBooks() {
    const books = Store.getBooks();
    // const storedBooks = [
    //   {
    //     title: "Outliers",
    //     author: "Malcolm Gladwell",
    //     isbn: "1234567",
    //   },
    //   {
    //     title: "Life is what you make it",
    //     author: "Peter Buffett",
    //     isbn: "1369246",
    //   },
    // ];

    // const books = StoredBooks;

    books.forEach(book => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");

    row.innerHTML = `<td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>`;

    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}

//Class(store)
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

//Display Event(books)
document.addEventListener("DOMContentLoaded", UI.displayBooks);

//Event to add a book
document.querySelector("#book-form").addEventListener("submit", e => {
  //Prevent actual Submit
  e.preventDefault();

  //Getting Form Values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  //Validation
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    //Instantiation(book)
    const book = new Book(title, author, isbn);

    //Adding Book to UI
    UI.addBookToList(book);

    //Add book to store
    Store.addBook(book);

    //Success Message
    UI.showAlert("Book Added successfully", "success");

    //Clear Fields
    UI.clearFields();
  }
});

//Event to remove a book
document.querySelector("#book-list").addEventListener("click", e => {
  UI.deleteBook(e.target);

  //Remove Book from store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  UI.showAlert("Book Removed successfully", "success");
});
