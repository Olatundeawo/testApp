import { useState } from "react";

function TestPost() {
  const [test, setTest] = useState({
    name: "",
    description: "",
    minutes: "",
  });

  const handleChanges = (e) => {
    setTest({
      ...test,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/catalog/api/tests/", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(test),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log("Test created successfully:", data);
      setTest({
        name: "",
        description: "",
        minutes: "",
      });
    } catch (error) {
      console.error(`Failed to create test: ${error}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-md space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Add New Test</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-700 mb-2">
            Test Name:
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={test.name}
            onChange={handleChanges}
            placeholder="e.g., Biology Basics"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-700 mb-2">
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={test.description}
            onChange={handleChanges}
            placeholder="Describe the test..."
            className="w-full border border-gray-300 rounded-lg p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="minutes" className="block text-gray-700 mb-2">
            Duration (minutes):
          </label>
          <input
            id="minutes"
            type="number"
            name="minutes"
            value={test.minutes}
            onChange={handleChanges}
            placeholder="e.g., 30"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="1"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
        >
          Submit Test
        </button>
      </form>
    </div>
  );
}

export default TestPost;
