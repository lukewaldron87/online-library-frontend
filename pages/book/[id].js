import { useState } from "react";
import Link from "next/link";

export async function getServerSideProps(context) {
  const { id } = context.params;
  const res = await fetch(`http://localhost:8080/books/${id}`);
  const book = await res.json();

  if (!res.ok) {
    return {
      notFound: true, // If the book doesn't exist, show the 404 page
    };
  }

  return {
    props: {
      book,
    },
  };
}

export default function BookDetails({ book }) {
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch AI insights for the selected book
  const handleGetAIInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `http://localhost:8080/books/${book.id}/ai-insights`
      );

      if (!res.ok) throw new Error("Failed to fetch AI insights");

      const data = await res.json();
      // Assuming the response contains an 'insights' field with the AI-generated insights
      setAiInsights(data.insight);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="top-0 left-0 mt-4 ml-4">
          <Link
            href="/"
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back to Book List
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          {book.title}
        </h1>

        <p className="text-lg text-gray-600 mb-4">Author: {book.author}</p>
        <p className="text-gray-500 mb-6">{book.description}</p>

        <div className="text-center mb-6">
          <button
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            onClick={handleGetAIInsights}
            disabled={loading} // Disable button while loading
          >
            {loading ? "Loading AI Insights..." : "Get AI Insights"}
          </button>
        </div>

        {error && (
          <div className="text-red-600 font-medium text-center mb-4">{`Error: ${error}`}</div>
        )}

        {aiInsights && (
          <div className="mt-6 p-4 bg-gray-200 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              AI Insights
            </h3>
            <p className="text-gray-700">{aiInsights}</p>
          </div>
        )}
      </div>
    </div>
  );
}
