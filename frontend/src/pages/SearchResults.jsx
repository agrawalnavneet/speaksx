import { useState, useEffect } from "react";
import axios from "axios";
import SearchBox from "../components/SearchBox";

function SearchResults() {
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const pageSize = 10; 

  const fetchResults = async () => {
    try {
      // Normalize the selected type to be in uppercase with underscores (e.g., 'CONTENT_ONLY')
      const normalizedType =
        selectedType !== "all" ? selectedType.toUpperCase().replace(/([a-z])([A-Z])/g, "$1_$2") : undefined;

      const res = await axios.post("http://localhost:3000/search", {
        query,
        type: normalizedType, // Send the normalized type to the backend
        page,
        pageSize,
      });
      setResults(res.data.questions);
      setTotalResults(res.data.totalResults);
    } catch (err) {
      console.error("Error fetching search results", err);
    }
  };

  const handleSearch = (searchQuery, type) => {
    setQuery(searchQuery);
    setSelectedType(type);
    setPage(1); // Reset to the first page when a new search is initiated
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (page < Math.ceil(totalResults / pageSize)) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (query || selectedType !== "all") {
      fetchResults();
    }
  }, [query, selectedType, page]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Question Search</h1>
      <SearchBox onSearch={handleSearch} />
      <div style={styles.resultsContainer}>
        {results.length > 0 ? (
          results.map((q) => (
            <div key={q.id} style={styles.resultCard}>
              <h3>{q.title}</h3>
              <p>Type: {q.type}</p>
            </div>
          ))
        ) : (
          <p style={styles.noResults}>
            {query || selectedType !== "all"
              ? "No results found for your search."
              : "Start searching for questions!"}
          </p>
        )}
      </div>
      <div style={styles.pagination}>
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          style={{
            ...styles.pageButton,
            backgroundColor: page === 1 ? "#ccc" : "purple",
            cursor: page === 1 ? "not-allowed" : "pointer",
          }}
        >
          Previous
        </button>
        <span style={styles.pageInfo}>
          Page {page} of {Math.ceil(totalResults / pageSize)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === Math.ceil(totalResults / pageSize)}
          style={{
            ...styles.pageButton,
            backgroundColor: page === Math.ceil(totalResults / pageSize) ? "#ccc" : "purple",
            cursor: page === Math.ceil(totalResults / pageSize) ? "not-allowed" : "pointer",
          }}
        >
          Next
        </button>
      </div>
      <p style={styles.totalResults}>Total Results: {totalResults}</p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "80%",
    margin: "auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "16px",
    color: "#333",
  },
  resultsContainer: {
    marginTop: "16px",
  },
  resultCard: {
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "12px",
    margin: "8px 0",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  noResults: {
    textAlign: "center",
    color: "#888",
    marginTop: "16px",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    marginTop: "16px",
  },
  pageButton: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    color: "white",
    fontSize: "14px",
    transition: "background-color 0.3s ease",
  },
  pageInfo: {
    fontSize: "16px",
    color: "#333",
  },
  totalResults: {
    textAlign: "center",
    marginTop: "16px",
    color: "#333",
  },
};

export default SearchResults;
