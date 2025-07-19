import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Instruction() {
  const [online, setOnline] = useState(null);

  useEffect(() => {
    async function checkOnlineStatus() {
      try {
        const response = await fetch("http://localhost:8000/catalog/ping/", {
          method: "HEAD",
          cache: "no-cache",
        });
        setOnline(response.ok);
      } catch (error) {
        setOnline(false);
      }
    }
    checkOnlineStatus();
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-50 font-serif">
      <div className="max-w-md bg-white p-6 rounded-xl shadow-md text-center space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Follow the Instructions
        </h2>
        <p className="text-gray-700">
          This app will verify your network. You must have a stable internet
          connection.
        </p>
        <p
          className={`font-medium ${
            online ? "text-green-600" : "text-red-500"
          }`}
        >
          {online === null
            ? "Checking connection..."
            : online
            ? "Secure connection detected"
            : "No internet connection"}
        </p>
        <p className="text-gray-700">
          Make sure you are in a well-lit environment.
        </p>

        {online ? (
          <Link to="/cam">
            <button
              type="button"
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
            >
              Go to Next Step
            </button>
          </Link>
        ) : (
          <p className="text-sm text-gray-500">
            Please ensure your network is stable before proceeding.
          </p>
        )}
      </div>
    </div>
  );
}

export default Instruction;
