import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";

function Test() {
  const [tests, setTests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8000/catalog/api/tests/").then((res) =>
        res.json()
      ),
      fetch("http://localhost:8000/catalog/api/questions/").then((res) =>
        res.json()
      ),
      fetch("http://localhost:8000/catalog/api/answers/").then((res) =>
        res.json()
      ),
    ])
      .then(([testData, questionData, answerData]) => {
        setTests(testData);
        setQuestions(questionData);
        setAnswers(answerData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load data:", err);
        setError(err);
        setLoading(false);
      });
  }, []);

  const handleTestSelection = (testId) => {
    const id = Number(testId);
    setSelectedTestId(id);
    const relatedQuestions = questions.filter((q) => q.test === id);
    setFilteredQuestions(relatedQuestions);
    setCurrentQuestionIndex(0);
  };

  const getAnswersForQuestion = (questionId) =>
    answers.filter((ans) => ans.question === questionId);

  const nextQuestion = () =>
    setCurrentQuestionIndex((prev) =>
      Math.min(prev + 1, filteredQuestions.length - 1)
    );

  const prevQuestion = () =>
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));

  const answerId = (e) => {
    setUserAnswers(e.target.id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let con = confirm("Are you sure u want to submit?");
    if (con) {
      alert("Click on end exam.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-48 text-gray-500 py-8">
        <ClipLoader loading={true} size={70} />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-48 text-red-500">
        Error: {error.message}
      </div>
    );

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const currentAnswers = currentQuestion
    ? getAnswersForQuestion(currentQuestion.id)
    : [];

  return (
    <div className="max-w-xl mx-auto p-4 mt-8 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Practice Test
      </h2>

      <div className="mb-4">
        <label htmlFor="testSelect" className="block text-gray-700 mb-2">
          Select a test:
        </label>
        <select
          id="testSelect"
          onChange={(e) => handleTestSelection(e.target.value)}
          value={selectedTestId || ""}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select your preferred test --</option>
          {tests.map((test) => (
            <option key={test.id} value={test.id}>
              {test.name}
            </option>
          ))}
        </select>
      </div>

      {selectedTestId && (
        <div>
          <div className="mb-4 text-gray-700">
            <p>{tests.find((t) => t.id === selectedTestId)?.description}</p>
            <p className="mt-1 text-sm">
              Estimated time:{" "}
              {tests.find((t) => t.id === selectedTestId)?.minutes} minutes
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Question {currentQuestionIndex + 1} of {filteredQuestions.length}
            </h3>
            <p className="text-gray-700">{currentQuestion?.text}</p>
          </div>

          <ol className="mb-4 space-y-2">
            {currentAnswers.map((ans) => (
              <li key={ans.id} className="flex items-center space-x-2">
                <input
                  type="radio"
                  onClick={(e) => {
                    answerId(e.target.ans.id);
                  }}
                  id={`answer-${ans.id}`}
                  name={`question-${currentQuestion?.id}`}
                  className="accent-blue-600"
                />
                {console.log(userAnswers)}
                <label htmlFor={`answer-${ans.id}`} className="text-gray-700">
                  {ans.text}
                </label>
              </li>
            ))}
          </ol>

          <div className="flex justify-between gap-2">
            <button
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`flex-1 py-2 rounded-lg text-white ${
                currentQuestionIndex === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition-colors duration-200`}
            >
              Prev
            </button>

            {currentQuestionIndex === filteredQuestions.length - 1 ? (
              <button
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                onClick={handleSubmit}
              >
                Submit
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                disabled={currentQuestionIndex === filteredQuestions.length - 1}
                className={`flex-1 py-2 rounded-lg text-white ${
                  currentQuestionIndex === filteredQuestions.length - 1
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } transition-colors duration-200`}
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Test;
