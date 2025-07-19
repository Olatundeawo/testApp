import Webcam from "react-webcam";
import { useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";

function CilentCam() {
  const webCamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [mirrored, setMirrored] = useState(false);

  const captureImage = useCallback(() => {
    if (webCamRef.current) {
      const image = webCamRef.current.getScreenshot();
      setImgSrc(image);
    }
  }, []);

  const retakeImage = () => {
    setImgSrc(null);
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-gray-50 font-sans p-4">
      <div className="max-w-md bg-white p-6 rounded-2xl shadow-md flex flex-col items-center space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Camera Verification
        </h2>

        {imgSrc ? (
          <img
            src={imgSrc}
            alt="Captured"
            className="rounded-lg w-72 h-72 object-cover"
          />
        ) : (
          <Webcam
            ref={webCamRef}
            screenshotFormat="image/jpeg"
            mirrored={mirrored}
            className="rounded-lg w-72 h-72 object-cover"
          />
        )}

        <label className="flex items-center space-x-2 text-gray-700">
          <input
            type="checkbox"
            checked={mirrored}
            onChange={(e) => setMirrored(e.target.checked)}
            className="accent-green-600"
          />
          <span>Mirror Camera</span>
        </label>

        {imgSrc ? (
          <div className="w-full space-y-3">
            <button
              onClick={retakeImage}
              className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors duration-200"
            >
              Retake Photo
            </button>
            <p className="text-gray-600 text-center text-sm">
              When you’re ready, click below to start your test.
            </p>
            <Link to="/test">
              <button className="w-full py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg transition-colors duration-200">
                Take Test
              </button>
            </Link>
          </div>
        ) : (
          <button
            onClick={captureImage}
            className="w-full py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg transition-colors duration-200"
          >
            Capture Photo
          </button>
        )}
      </div>
    </div>
  );
}

export default CilentCam;
