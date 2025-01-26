import { useEffect, useState } from "react";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const latitude = 33.9631353;
  const longitude = -117.3373967;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/searchLocalJobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude: latitude,
            longitude: longitude,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [latitude, longitude]);

  if (loading) {
    return <div>Loading jobs...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      className="flex flex-wrap justify-center items-center gap-8 p-8 min-h-screen bg-gray-100"
      style={{
        backgroundImage: "linear-gradient(145deg, #f4f4f9, #e9ecef)",
      }}
    >
      {jobs.map((job, index) => (
        <div
          key={index}
          className="bg-white w-full max-w-sm rounded-2xl shadow-lg p-6 transition-transform transform hover:scale-105"
          style={{
            border: "1px solid rgba(0, 0, 0, 0.1)",
            backgroundImage: "linear-gradient(145deg, #ffffff, #f9f9f9)",
          }}
        >
          <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
            {job.title || "Untitled Job"}
          </h3>
          <p className="text-gray-700 mb-2 text-center">
            <strong>City:</strong> {job.city || "N/A"}
          </p>
          <p className="text-gray-700 mb-4 text-center">
            <strong>Country:</strong> {job.country || "N/A"}
          </p>
          <div className="flex justify-center">
            <a
              href={job.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Job
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Jobs;