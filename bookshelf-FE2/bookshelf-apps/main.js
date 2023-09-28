document.addEventListener("DOMContentLoaded", function () {
  const inputBookForm = document.getElementById("inputBook");
  const bookTitleInput = document.getElementById("inputBookTitle");
  const bookAuthorInput = document.getElementById("inputBookAuthor");
  const bookYearInput = document.getElementById("inputBookYear");
  const bookIsCompleteInput = document.getElementById("inputBookIsComplete");

  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
  const completeBookshelfList = document.getElementById("completeBookshelfList");

  const searchBookForm = document.getElementById("searchBook");
  const searchBookTitleInput = document.getElementById("searchBookTitle");

  // Membuat fungsi untuk menyimpan data buku ke dalam localStorage
  function saveBooksToStorage() {
    const incompleteBooks = Array.from(incompleteBookshelfList.children).map((bookItem) => {
      return {
        title: bookItem.querySelector("h3").textContent,
        author: bookItem.querySelector("p:nth-child(2)").textContent,
        year: bookItem.querySelector("p:nth-child(3)").textContent,
        isComplete: false,
      };
    });

    const completeBooks = Array.from(completeBookshelfList.children).map((bookItem) => {
      return {
        title: bookItem.querySelector("h3").textContent,
        author: bookItem.querySelector("p:nth-child(2)").textContent,
        year: bookItem.querySelector("p:nth-child(3)").textContent,
        isComplete: true,
      };
    });

    localStorage.setItem("incompleteBooks", JSON.stringify(incompleteBooks));
    localStorage.setItem("completeBooks", JSON.stringify(completeBooks));
  }

  // Membuat fungsi untuk memuat data buku dari localStorage
  function loadBooksFromStorage() {
    const incompleteBooks = JSON.parse(localStorage.getItem("incompleteBooks")) || [];
    const completeBooks = JSON.parse(localStorage.getItem("completeBooks")) || [];

    incompleteBooks.forEach((book) => {
      const bookItem = createBook(book.title, book.author, book.year, book.isComplete);
      incompleteBookshelfList.appendChild(bookItem);
    });

    completeBooks.forEach((book) => {
      const bookItem = createBook(book.title, book.author, book.year, book.isComplete);
      completeBookshelfList.appendChild(bookItem);
    });
  }

  // Memanggil fungsi untuk memuat data buku dari localStorage saat halaman dimuat
  loadBooksFromStorage();

  inputBookForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addBook();
  });

  searchBookForm.addEventListener("submit", function (e) {
    e.preventDefault();
    searchBook();
  });

  function createBook(title, author, year, isComplete) {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");

    const bookTitle = document.createElement("h3");
    bookTitle.textContent = title;

    const authorParagraph = document.createElement("p");
    authorParagraph.textContent = "Penulis: " + author;

    const yearParagraph = document.createElement("p");
    yearParagraph.textContent = "Tahun: " + year;

    const actionDiv = document.createElement("div");
    actionDiv.classList.add("action");

    const actionButton = document.createElement("button");
    actionButton.textContent = isComplete ? "Selesai dibaca" : "Belum selesai di Baca";

    // Tambahkan kelas berdasarkan status isComplete
    actionButton.classList.add(isComplete ? "green" : "red");

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.textContent = "Hapus buku";

    actionButton.addEventListener("click", function () {
      toggleBookStatus(bookItem);
    });

    deleteButton.addEventListener("click", function () {
      deleteBook(bookItem);
    });

    actionDiv.appendChild(actionButton);
    actionDiv.appendChild(deleteButton);

    bookItem.appendChild(bookTitle);
    bookItem.appendChild(authorParagraph);
    bookItem.appendChild(yearParagraph);
    bookItem.appendChild(actionDiv);

    return bookItem;
  }

  function addBook() {
    const title = bookTitleInput.value;
    const author = bookAuthorInput.value;
    const year = bookYearInput.value;
    const isComplete = bookIsCompleteInput.checked;

    const bookItem = createBook(title, author, year, isComplete);

    if (isComplete) {
      completeBookshelfList.appendChild(bookItem);
    } else {
      incompleteBookshelfList.appendChild(bookItem);
    }

    resetForm();

    // Menyimpan data buku ke dalam localStorage
    saveBooksToStorage();
  }

  function resetForm() {
    bookTitleInput.value = "";
    bookAuthorInput.value = "";
    bookYearInput.value = "";
    bookIsCompleteInput.checked = false;
  }

  function toggleBookStatus(bookItem) {
    const actionButton = bookItem.querySelector("button");
    if (actionButton) {
      if (actionButton.classList.contains("red")) {
        actionButton.classList.remove("red");
        actionButton.classList.add("green");
        actionButton.textContent = "Selesai dibaca";
        completeBookshelfList.appendChild(bookItem);
      } else {
        actionButton.classList.remove("green");
        actionButton.classList.add("red");
        actionButton.textContent = "Belum selesai di Baca";
        incompleteBookshelfList.appendChild(bookItem);
      }

      // Menyimpan data buku ke dalam localStorage setelah status berubah
      saveBooksToStorage();
    }
  }

  function deleteBook(bookItem) {
    bookItem.remove();

    // Menyimpan data buku ke dalam localStorage setelah buku dihapus
    saveBooksToStorage();
  }

  function searchBook() {
    const searchTitle = searchBookTitleInput.value.toLowerCase();
    const allBooks = document.querySelectorAll(".book_item");

    allBooks.forEach((bookItem) => {
      const bookTitle = bookItem.querySelector("h3").textContent.toLowerCase();
      if (bookTitle.includes(searchTitle)) {
        bookItem.style.display = "block"; // Tampilkan buku yang cocok
      } else {
        bookItem.style.display = "none"; // Sembunyikan buku yang tidak cocok
      }
    });
  }
});
