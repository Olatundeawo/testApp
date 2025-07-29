import { useState, useEffect } from "react";

const TestChange = () => {
  const [test, setTest] = useState([]);
  const [selectTest, setSelectedTest] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    minutes: "",
  });

  useEffect(() => {
    fetch("http://localhost:8000/catalog/api/tests/")
      .then((res) => res.json())
      .then((res) => setTest(res))
      .catch((error) => console.error("failed to fetch", error));
  }, []);

  const handleSelect = (test) => {
    setSelectedTest(test);
    setFormData({
      name: test.name,
      description: test.description,
      minutes: test.minutes,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/catalog/api/tests/${selectTest.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const updated = await response.json();

      // Update the test list
      setTest((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setSelectedTest(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/catalog/api/tests/${selectTest.id}/`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      setTest((prev) => prev.filter((t) => t.id !== selectTest.id));
      setSelectedTest(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Select a Test to Edit</h2>

      <ul className="space-y-2 mb-8">
        {test.map((data) => (
          <li
            key={data.id}
            onClick={() => handleSelect(data)}
            className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded shadow"
          >
            {data.name}
          </li>
        ))}
      </ul>

      {selectTest && (
        <form
          onSubmit={handleUpdate}
          className="bg-white shadow-md rounded p-6 space-y-4"
        >
          <h3 className="text-xl font-semibold text-gray-700">
            Editing: {selectTest.name}
          </h3>

          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border border-gray-300 rounded px-4 py-2 h-24"
            required
          />

          <input
            name="minutes"
            value={formData.minutes}
            onChange={handleChange}
            placeholder="Duration (minutes)"
            className="w-full border border-gray-300 rounded px-4 py-2"
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
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>

            <button
              type="button"
              onClick={() => setSelectedTest(null)}
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

export default TestChange;
