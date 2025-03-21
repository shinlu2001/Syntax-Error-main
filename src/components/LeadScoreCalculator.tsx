// src/components/LeadScoreCalculator.tsx
import React, { useState } from 'react';

interface LeadFeatures {
  employee_count: number;
  total_funding: number;
  founded_year: number;
}

interface PredictionResponse {
  prediction: number;
  probability: number[][];
}

const LeadScoreCalculator: React.FC = () => {
  const [features, setFeatures] = useState<LeadFeatures>({
    employee_count: 300,
    total_funding: 5000000,
    founded_year: 2010,
  });
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const computeLeadScore = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(features),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: PredictionResponse = await response.json();
      setPrediction(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Compute Lead Score</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Employee Count</label>
          <input
            type="number"
            value={features.employee_count}
            onChange={(e) =>
              setFeatures({ ...features, employee_count: Number(e.target.value) })
            }
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Total Funding (USD)</label>
          <input
            type="number"
            value={features.total_funding}
            onChange={(e) =>
              setFeatures({ ...features, total_funding: Number(e.target.value) })
            }
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Founded Year</label>
          <input
            type="number"
            value={features.founded_year}
            onChange={(e) =>
              setFeatures({ ...features, founded_year: Number(e.target.value) })
            }
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <button
          onClick={computeLeadScore}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
        >
          {loading ? "Computing..." : "Compute Lead Score"}
        </button>
        {error && <p className="text-red-600 mt-2">Error: {error}</p>}
        {prediction && (
          <div className="mt-4">
            <p className="font-semibold">Prediction: {prediction.prediction}</p>
            <p className="font-semibold">
              Probability: {prediction.probability[0].join(", ")}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadScoreCalculator;
