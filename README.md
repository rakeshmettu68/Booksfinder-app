# 📚 BookFinder

A modern React + TypeScript application that allows users to search for books using the **Open Library API**, view book details, and manage a personal favorites list. Built with **TailwindCSS** for styling and **lucide-react** icons for a sleek UI.

---

## 🚀 Features

- **🔍 Search Books** – Search by book title with real-time results.
- **📖 Book Details** – View detailed information including cover, author, publishers, subjects, and description in a modal popup.
- **⭐ Favorites System** – Add or remove books from a personal favorites list.
- **📑 Tabs Navigation** – Switch between search results and favorites.
- **⚡ Debounced Search** – Efficient search with delay to prevent excessive API calls.
- **🎨 Modern UI** – Gradient backgrounds, responsive layout, smooth transitions, and iconography with lucide-react.

---

## 🛠️ Tech Stack

- **React** (with TypeScript)
- **TailwindCSS** (styling)
- **lucide-react** (icons)
- **Open Library API** (book data)
  - Search API: `https://openlibrary.org/search.json?title={bookTitle}&limit=12`
  - Work details: `https://openlibrary.org/{workKey}.json`
  - Cover images: `https://covers.openlibrary.org/b/id/{coverId}-{size}.jpg`

---

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/bookfinder.git
   cd bookfinder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the app locally:
   ```bash
   npm start
   ```

4. Open your browser at:
   ```
   http://localhost:3000
   ```

---

## 📷 Screenshots

### 🔍 Search Page
- Search for books by title and view cover, title, author, and publish year.

### ⭐ Favorites Tab
- Manage and view your saved favorite books.

### 📖 Book Details Modal
- Detailed information including publishers, subjects, and description.

---

## 📌 Future Enhancements
- Add **search by author, ISBN, or subject**.
- Add **pagination** for large result sets.
- Improve **favorites persistence** (e.g., sync with backend or cloud).
- Implement **light/dark mode toggle**.

---

## 🙌 Credits
- Built for **Alex (a college student)** to quickly find and save books for study and leisure.
- Data provided by [Open Library](https://openlibrary.org/).

---

## 📜 License
MIT License © 2025
