export async function getServerSideProps() {
  const res = await fetch("http://localhost:8080/books");
  const books = await res.json();
  if (!res.ok) {
    return {
      props: {
        error: "Failed to fetch data",
      },
    };
  }

  return {
    props: {
      books,
    },
  };
}

export default function Home({ books, error }) {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Online Library with AI Insights
        </h1>

        {error && (
          <div className="text-red-600 font-medium mb-4">{`Error: ${error}`}</div>
        )}

        {books.length > 0 ? (
          <ul className="space-y-6">
            {books.map((book) => (
              <li
                key={book.id}
                className="p-4 border rounded-lg shadow-sm hover:bg-gray-50"
              >
                <h2 className="text-2xl font-semibold text-gray-800">
                  {book.title}
                </h2>
                <p className="text-gray-600 text-lg">Author: {book.author}</p>
                <p className="text-gray-500">{book.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-lg text-gray-600">
            No books available.
          </p>
        )}
      </div>
    </div>
  );
}
