import { useState, useEffect } from "react";

const AnswerPost = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [answer, setAnswer] = useState({ text: "" });

  useEffect(() => {
    fetch("http://localhost:8000/catalog/api/questions/")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.error("Failed to fetch questions:", error));
  }, []);

  const handleSelectChange = (id) => {
    setSelectedQuestionId(Number(id));
  };

  const handleCheckboxChange = (e) => {
    setIsCorrect(e.target.checked);
  };

  const handleTextChange = (e) => {
    setAnswer({ ...answer, text: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.text || !selectedQuestionId) {
      console.log("Please fill in all fields.");
      return;
    }

    const payload = {
      text: answer.text,
      is_correct: isCorrect,
      question: selectedQuestionId,
    };
    console.log("Payload to send:", payload);

    try {
      const response = await fetch(
        "http://localhost:8000/catalog/api/answers/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        throw new Error("Failed to submit answer");
      }
      console.log("Answer submitted successfully!");
      setAnswer({ text: "" });
      setIsCorrect(false);
      setSelectedQuestionId("");
    } catch (error) {
      console.error(`Submission error: ${error}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Submit Your Answer
      </h2>

      <div className="mb-4">
        <label htmlFor="question" className="block text-gray-700 mb-2">
          Select Question:
        </label>
        <select
          id="question"
          value={selectedQuestionId}
          onChange={(e) => handleSelectChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select a question --</option>
          {questions.map((q) => (
            <option key={q.id} value={q.id}>
              {q.text}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="answer" className="block text-gray-700 mb-2">
            Your Answer:
          </label>
          <textarea
            id="answer"
            name="text"
            value={answer.text}
            onChange={handleTextChange}
            className="w-full border border-gray-300 rounded-lg p-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Type your answer here..."
          ></textarea>
        </div>

        <div className="flex items-center mb-4">
          <input
            id="isCorrect"
            type="checkbox"
            checked={isCorrect}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          <label htmlFor="isCorrect" className="text-gray-700">
            Mark as correct answer
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Submit Answer
        </button>
      </form>
    </div>
  );
};

export default AnswerPost;
