import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AnswerList() {
  const { id } = useParams();
  const [answers, setAnswers] = useState({ text: "", is_correct: false });

  useEffect(() => {
    fetch(`http://localhost:8000/catalog/api/answers/${id}/`)
      .then((res) => res.json())
      .then((data) => setAnswers(data))
      .catch((error) => {
        console.error(`Failed to fetch: ${error}`);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeCheck = () => {
    setAnswers((prev) => ({ ...prev, is_correct: !prev.is_correct }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/catalog/api/answers/${id}/`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(answers),
        }
      );

      if (!response.ok) throw new Error(`Failed to fecth: ${response.status}`);
      const update = response.json();
      setAnswers((prev) =>
        Object.entries(prev).map((data) =>
          data.id === update.id ? update : data
        )
      );
    } catch (err) {
      console.error(`Failed to fetch ${err}`);
    }
  };

  async function handleDelete(e) {
    e.preventDefault();
    if (confirm(`Are sure you want to delete Answer:${answers.text} ?`)) {
      try {
        const response = await fetch(
          `http://localhost:8000/catalog/api/answers/${id}/`,
          {
            method: "DELETE",
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        if (!response.ok)
          throw new Error(`Failed to fetch: ${response.status}`);
        setAnswers((prev) => prev.filter((data) => data.id === !answers.id));
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div>
      {answers !== null && (
        <form onSubmit={handleUpdate}>
          <label>Text</label>
          <textarea
            id="AnswerText"
            name="text"
            value={answers.text}
            onChange={handleChange}
          ></textarea>

          <input
            type="checkbox"
            name="is_correct"
            value={answers.is_correct}
            onChange={handleChangeCheck}
            checked={answers.is_correct}
          />
          <button type="submit">Update</button>
          <br />
          <button type="button" onClick={handleDelete}>
            Delete
          </button>
        </form>
      )}
    </div>
  );
}
