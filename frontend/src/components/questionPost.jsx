import React, { useState, useEffect } from "react";

function QuestionPost() {
  const [tests, setTests] = useState([]);
  const [te, setTe] = useState(null);
  const [selectedTestId, setSelectedTestId] = useState("");
  const [question, setQuestion] = useState({ text: "" });

  useEffect(() => {
    fetch("http://localhost:8000/catalog/api/tests/")
      .then((res) => res.json())
      .then((data) => setTests(data))
      .catch((err) => console.error("Failed to fetch tests:", err));
  }, []);

  const handleSelectChange = (id) => {
    setSelectedTestId(Number(id));
  };

  const handleInputChange = (e) => {
    setQuestion({ ...question, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTestId || !question.text.trim()) {
      console.log("Please select a test and enter a question.");
      return;
    }

    const payload = {
      text: question.text,
      test: selectedTestId,
    };

    try {
      const response = await fetch(
        "http://localhost:8000/catalog/api/questions/",
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        throw new Error("Failed to create question");
      }
      console.log("Question created successfully!");
      setQuestion({ text: "" });
      setSelectedTestId("");
    } catch (e) {
      console.error(`Error submitting question: ${e}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-md space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">
        Create New Question
      </h2>

      <div>
        <label htmlFor="testSelect" className="block text-gray-700 mb-2">
          Select Test:
        </label>
        <select
          id="testSelect"
          value={selectedTestId || ""}
          onChange={(e) => handleSelectChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select test --</option>
          {tests.map((test) => (
            <option key={test.id} value={test.id}>
              {test.name}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="questionText" className="block text-gray-700 mb-2">
            Question Text:
          </label>
          <textarea
            id="questionText"
            name="text"
            value={question.text}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your question here..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
        >
          Submit Question
        </button>
      </form>
    </div>
  );
}

export default QuestionPost;
