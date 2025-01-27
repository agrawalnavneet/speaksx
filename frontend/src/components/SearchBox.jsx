import { useState } from "react";
import "./SearchBox.css"; 

function SearchBox({ onSearch }) {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const handleSearch = () => {
    onSearch(query, selectedType);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search questions..."
        className="search-input"
      />
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className="search-select"
      >
        <option value="all">All</option>
        <option value="mcq">MCQ</option>
        <option value="readAlong">Read Along</option>
        <option value="anagram">Anagram</option>
        <option value="contentOnly">Content Only</option> 
      </select>
      <button
        onClick={handleSearch}
        className={`search-button ${query.trim() || selectedType !== "all" ? "active" : "inactive"}`}
        disabled={!query.trim() && selectedType === "all"}
      >
        Search
      </button>
    </div>
  );
}

export default SearchBox;
