import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AnswerList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({ text: "", is_correct: false });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({ text: "" });

  useEffect(() => {
    async function fetchAnswer() {
      try {
        const res = await fetch(
          `http://localhost:8000/catalog/api/answers/${id}/`
        );
        const data = await res.json();
        setAnswers(data);
      } catch (error) {
        console.error(`Failed to fetch: ${error}`);
      } finally {
        setLoading(false);
      }
    }

    fetchAnswer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({ ...prev, [name]: value }));

    // Clear error on type
    if (name === "text" && value.trim()) {
      setErrors((prev) => ({ ...prev, text: "" }));
    }
  };

  const handleChangeCheck = (e) => {
    setAnswers((prev) => ({ ...prev, is_correct: e.target.checked }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!answers.text.trim()) {
      newErrors.text = "Answer text is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(
        `http://localhost:8000/catalog/api/answers/${id}/`,
        {
          method: "PUT",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(answers),
        }
      );

      if (!response.ok) throw new Error(`Failed to update: ${response.status}`);

      alert("Answer updated successfully");
      navigate("/answerchange"); // Return to where the answer was selected
    } catch (err) {
      console.error(`Update failed: ${err}`);
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm(`Are you sure you want to delete this answer?`);
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:8000/catalog/api/answers/${id}/`,
        {
          method: "DELETE",
          headers: { "Content-type": "application/json" },
        }
      );

      if (!response.ok) throw new Error(`Failed to delete: ${response.status}`);

      alert("Answer deleted successfully");
      navigate("/answerchange");
    } catch (error) {
      console.error(`Delete failed: ${error}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-10">
      {loading ? (
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm">Loading answer...</p>
        </div>
      ) : (
        <div className="max-w-xl w-full bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-6">Edit Answer</h2>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label
                htmlFor="AnswerText"
                className="block text-sm font-medium mb-1"
              >
                Answer Text
              </label>
              <textarea
                id="AnswerText"
                name="text"
                rows={4}
                className={`w-full p-3 border ${
                  errors.text
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={answers.text}
                onChange={handleChange}
              />
              {errors.text && (
                <p className="text-red-500 text-sm mt-1">{errors.text}</p>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="is_correct"
                name="is_correct"
                checked={answers.is_correct}
                onChange={handleChangeCheck}
                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_correct" className="text-sm font-medium">
                Is this answer correct?
              </label>
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Update
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
