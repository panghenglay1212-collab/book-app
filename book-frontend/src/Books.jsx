import { useState, useEffect } from "react";
import { request } from "./api";

export default function Books({ token, onLogout }) {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  async function loadBooks() {
    try {
      const data = await request(`/books?search=${search}`, { token });
      setBooks(data);
    } catch (err) {
      if (err.status === 401) onLogout();
    }
  }

  useEffect(() => {
    loadBooks();
  }, [search]);

  async function addBook(e) {
    e.preventDefault();
    if (!title || !author) return;
    await request("/books", {
      method: "POST",
      token,
      body: { title, author, is_read: false },
    });
    setTitle("");
    setAuthor("");
    loadBooks();
  }

  async function toggleRead(book) {
    await request(`/books/${book.id}`, {
      method: "PUT",
      token,
      body: { title: book.title, author: book.author, is_read: !book.is_read },
    });
    loadBooks();
  }

  async function deleteBook(id) {
    await request(`/books/${id}`, { method: "DELETE", token });
    loadBooks();
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Books</h1>
        <button
          onClick={onLogout}
          className="text-sm border rounded px-3 py-1"
        >
          Logout
        </button>
      </div>

      <input
        className="w-full border rounded p-2 mb-4"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <form onSubmit={addBook} className="flex gap-2 mb-6">
        <input
          className="border rounded p-2 flex-1"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border rounded p-2 flex-1"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 rounded">Add</button>
      </form>

      <ul className="space-y-2">
        {books.map((book) => (
          <li
            key={book.id}
            className="flex items-center justify-between border rounded p-3"
          >
            <div>
              <p className={book.is_read ? "line-through text-gray-400" : "font-medium"}>
                {book.title}
              </p>
              <p className="text-sm text-gray-500">{book.author}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleRead(book)}
                className="text-sm border rounded px-2 py-1"
              >
                {book.is_read ? "Unread" : "Read"}
              </button>
              <button
                onClick={() => deleteBook(book.id)}
                className="text-sm bg-red-500 text-white rounded px-2 py-1"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {books.length === 0 && (
        <p className="text-gray-400 text-center mt-6">No books yet.</p>
      )}
    </div>
  );
}