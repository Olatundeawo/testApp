import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AnswerChange() {
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectQuestion, setSelectQuestion] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8000/catalog/api/answers/").then((res) =>
        res.json()
      ),
      fetch("http://localhost:8000/catalog/api/questions/").then((res) =>
        res.json()
      ),
    ])
      .then(([answerData, questionData]) => {
        setAnswers(answerData);
        setQuestions(questionData);
      })
      .catch((error) => {
        console.error(`Failed to fetch ${error}`);
      });
  }, []);

  function handleSelectQuestion(question) {
    if (!question?.id || answers.length === 0) return;
    setSelectQuestion(answers.filter((prev) => prev.question === question.id));
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Question List
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Click a question to view its answers
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {questions.map((data) => (
            <li
              key={data.id}
              onClick={() => handleSelectQuestion(data)}
              className="bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-200 cursor-pointer p-4 rounded-xl shadow-sm"
            >
              <p className="font-medium">{data.text}</p>
            </li>
          ))}
        </ul>

        {selectQuestion !== null && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            {selectQuestion.length > 0 ? (
              <>
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">
                  Related Answers
                </h3>
                <ul className="space-y-3">
                  {selectQuestion.map((data) => (
                    <li key={data.id}>
                      <Link
                        to={`/answer/${data.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {data.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-red-600 dark:text-red-400">
                No answer for this question
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
