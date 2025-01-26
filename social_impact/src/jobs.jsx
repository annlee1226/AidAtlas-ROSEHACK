import { useEffect, useState } from 'react';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace these with actual values or dynamically calculate them
  const latitude = 33.9631353; // Example latitude
  const longitude = -117.3373967; // Example longitude

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/searchLocalJobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude: latitude, // Pass latitude dynamically
            longitude: longitude, // Pass longitude dynamically
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Assuming the response is an array of jobs
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {jobs.map((job, index) => (
        <div
          key={index}
          className="border rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow"
        >
          <h3 className="text-lg font-semibold mb-2">{job.title || "Untitled Job"}</h3>
          <p className="text-gray-600">
            <strong>City:</strong> {job.city || "N/A"}
          </p>
          <p className="text-gray-600">
            <strong>Country:</strong> {job.country || "N/A"}
          </p>
          <a
            href={job.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline mt-2 inline-block"
          >
            View Job
          </a>
        </div>
      ))}
    </div>
  );
};

export default Jobs;
