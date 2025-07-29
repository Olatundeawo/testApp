import { useState, useEffect } from "react";

const QuestionChange = () => {
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({
    text: "",
  });

  useEffect(() => {
    fetch("http://localhost:8000/catalog/api/questions/")
      .then((res) => res.json())
      .then((data) => setQuestions(data.reverse()))
      .catch((error) => console.log(`failed to fetch data: ${error}`));
  }, []);

  const handleSelect = (question) => {
    setSelected(question);
    setFormData({
      text: question.text,
    });
  };

  function handleChange(e) {
    const [name, value] = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div>
      <ul>
        {questions.map((data) => (
          <li
            key={data.id}
            className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded shadow"
            onClick={() => handleSelect(data)}
          >
            Q: {data.text}
          </li>
        ))}
      </ul>

      {selected && (
        <form>
          <textarea
            name="text"
            value={formData.text}
            onChange={handleChange}
            placeholder="text"
            required
          />

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update
            </button>

            <button
              type="button"
              //   onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>

            <button
              type="button"
              onClick={() => setSelected(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default QuestionChange;
