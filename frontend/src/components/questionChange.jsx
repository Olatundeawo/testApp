import { useState, useEffect } from "react";

const QuestionChange = () => {
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({ text: "" });

  useEffect(() => {
    fetch("http://localhost:8000/catalog/api/questions/")
      .then((res) => res.json())
      .then((data) => setQuestions(data.reverse()))
      .catch((error) => console.log(`Failed to fetch data: ${error}`));
  }, []);

  const handleSelect = (question) => {
    setSelected(question);
    setFormData({ text: question.text });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/catalog/api/questions/${selected.id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const update = await response.json();
      setQuestions((prev) =>
        prev.map((q) => (q.id === update.id ? update : q))
      );
      setSelected(null);
    } catch (error) {
      console.error(`Failed to update: ${error}`);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (confirm("Are you sure you want to delete?")) {
      try {
        const response = await fetch(
          `http://localhost:8000/catalog/api/questions/${selected.id}/`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        setQuestions((prev) => prev.filter((q) => q.id !== selected.id));
        setSelected(null);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Question Manager
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Question List */}
          <div className="bg-white rounded-xl shadow-sm border p-4 h-[600px] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              All Questions
            </h3>
            <ul className="space-y-3">
              {questions.map((q) => (
                <li
                  key={q.id}
                  onClick={() => handleSelect(q)}
                  className={`cursor-pointer p-4 rounded-lg transition border ${
                    selected?.id === q.id
                      ? "bg-blue-100 border-blue-500 text-blue-800 font-semibold"
                      : "hover:bg-gray-100 border-gray-200"
                  }`}
                >
                  <span className="block truncate">Q: {q.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Edit Form */}
          {selected && (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-between h-fit"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Editing Question #{selected.id}
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Question Text
                  </label>
                  <textarea
                    name="text"
                    value={formData.text}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    rows="5"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="bg-gray-500 text-white px-5 py-2 rounded-md hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionChange;
