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
    <div>
      <h3> Answer change</h3>
      <ul>
        {questions.map((data) => (
          <li key={data.id} onClick={() => handleSelectQuestion(data)}>
            {data.text}
          </li>
        ))}
      </ul>
      {selectQuestion !== null &&
        (selectQuestion.length > 0 ? (
          <div>
            <h3>Answers related to the question</h3>
            <ul>
              {selectQuestion.map((data) => (
                <li key={data.id}>
                  <Link to={`/answer/${data.id}`}>{data.text}</Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p> No answer for this question</p>
        ))}
    </div>
  );
}
