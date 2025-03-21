import React, { useState } from 'react';

/** Example data type for a single scoring criterion */
interface ScoringCriterion {
  id: string;
  name: string;        // e.g., "Employee Count > 500"
  condition: string;   // e.g., "employee_count > 500"
  points: number;      // e.g., +20
}

/** Example data type for a training run record */
interface TrainingRecord {
  date: string;
  modelType: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  notes?: string;
}

/** The main Lead Scoring Config component */
const LeadScoringConfig: React.FC = () => {
  // State for which tab is active
  const [activeTab, setActiveTab] = useState<
    'ScoringModel' | 'ScoringCriteria' | 'Thresholds' | 'TrainingHistory'
  >('ScoringModel');

  // State for model type (could be "gradientBoosting", "randomForest", etc.)
  const [modelType, setModelType] = useState<string>('gradientBoosting');

  // Example toggles for data sources
  const [dataSources, setDataSources] = useState({
    linkedinData: true,
    crunchbaseData: true,
    jobBoardData: false,
    websiteData: false,
  });

  // Example performance metrics
  const [accuracy] = useState<number>(92);
  const [precision] = useState<number>(88);
  const [recall] = useState<number>(85);
  const [f1Score] = useState<number>(86);

  // Example scoring criteria list
  const [criteria, setCriteria] = useState<ScoringCriterion[]>([
    { id: '1', name: 'Employee Count > 500', condition: 'employee_count>500', points: 20 },
    { id: '2', name: 'Funding > $10M', condition: 'funding>10000000', points: 10 },
    { id: '3', name: 'Visited Pricing Page', condition: 'pricingPageVisits>=1', points: 5 },
  ]);

  // Example thresholds
  const [hotThreshold, setHotThreshold] = useState<number>(80);
  const [warmThreshold, setWarmThreshold] = useState<number>(50);

  // Example training history
  const [trainingHistory] = useState<TrainingRecord[]>([
    {
      date: '2023-09-15',
      modelType: 'Gradient Boosting',
      accuracy: 92,
      precision: 88,
      recall: 85,
      f1: 86,
      notes: 'Fine-tuned XGBoost model',
    },
    {
      date: '2023-08-20',
      modelType: 'Random Forest',
      accuracy: 90,
      precision: 85,
      recall: 80,
      f1: 82,
      notes: 'Initial model on small dataset',
    },
  ]);

  // Handler for toggling data sources
  const handleToggleDataSource = (sourceKey: keyof typeof dataSources) => {
    setDataSources((prev) => ({
      ...prev,
      [sourceKey]: !prev[sourceKey],
    }));
  };

  // Handler for applying model changes
  const handleApplyChanges = () => {
    alert(
      `Applying changes:\nModel: ${modelType}\nLinkedIn: ${dataSources.linkedinData}\nCrunchbase: ${dataSources.crunchbaseData}\nJob Board: ${dataSources.jobBoardData}\nWebsite: ${dataSources.websiteData}`
    );
  };

  // Handler for training the model
  const handleTrainModel = () => {
    alert('Triggering a model training run...');
    // You could call your backend here to start a training job
  };

  // Handler for adding a new scoring criterion
  const handleAddCriterion = () => {
    const newCriterion: ScoringCriterion = {
      id: String(Date.now()),
      name: 'New Criterion',
      condition: 'someCondition',
      points: 10,
    };
    setCriteria((prev) => [...prev, newCriterion]);
  };

  // Handler for updating thresholds
  const handleThresholdsSave = () => {
    alert(`Saving thresholds:\nHot >= ${hotThreshold}\nWarm >= ${warmThreshold}`);
    // Possibly call an API to persist these
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-800">
      {/* Header / Title Row */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Lead Scoring Configuration</h1>
        <div className="flex items-center space-x-4">
          <button
            className="bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md text-sm text-gray-700"
            onClick={() => alert('Connect CRM clicked')}
          >
            Connect CRM
          </button>
          <button
            onClick={handleTrainModel}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Train Model
          </button>
        </div>
      </header>

      {/* Tabs Row */}
      <div className="border-b border-gray-200 px-6 mt-2">
        <ul className="flex space-x-6 text-sm font-medium text-gray-600">
          <li>
            <button
              className={`py-2 ${
                activeTab === 'ScoringModel' ? 'text-indigo-600 border-b-2 border-indigo-600' : ''
              }`}
              onClick={() => setActiveTab('ScoringModel')}
            >
              Scoring Model
            </button>
          </li>
          <li>
            <button
              className={`py-2 ${
                activeTab === 'ScoringCriteria' ? 'text-indigo-600 border-b-2 border-indigo-600' : ''
              }`}
              onClick={() => setActiveTab('ScoringCriteria')}
            >
              Scoring Criteria
            </button>
          </li>
          <li>
            <button
              className={`py-2 ${
                activeTab === 'Thresholds' ? 'text-indigo-600 border-b-2 border-indigo-600' : ''
              }`}
              onClick={() => setActiveTab('Thresholds')}
            >
              Thresholds
            </button>
          </li>
          <li>
            <button
              className={`py-2 ${
                activeTab === 'TrainingHistory' ? 'text-indigo-600 border-b-2 border-indigo-600' : ''
              }`}
              onClick={() => setActiveTab('TrainingHistory')}
            >
              Training History
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-6">
        {/* Tab: Scoring Model */}
        {activeTab === 'ScoringModel' && (
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column: Model Configuration */}
            <div className="col-span-1 bg-white shadow rounded-lg p-4">
              <h2 className="text-md font-semibold mb-4">AI Lead Scoring Model</h2>
              <p className="text-sm text-gray-500 mb-4">
                Configure your machine learning model for lead scoring tasks
              </p>

              {/* Model Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model Type
                </label>
                <select
                  value={modelType}
                  onChange={(e) => setModelType(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                >
                  <option value="gradientBoosting">Gradient Boosting</option>
                  <option value="randomForest">Random Forest</option>
                  <option value="logisticRegression">Logistic Regression</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Gradient boosting typically performs well for lead scoring.
                </p>
              </div>

              {/* Data Sources */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Data Sources</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>LinkedIn Data</span>
                    <input
                      type="checkbox"
                      checked={dataSources.linkedinData}
                      onChange={() => handleToggleDataSource('linkedinData')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Crunchbase Data</span>
                    <input
                      type="checkbox"
                      checked={dataSources.crunchbaseData}
                      onChange={() => handleToggleDataSource('crunchbaseData')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Job Board Data</span>
                    <input
                      type="checkbox"
                      checked={dataSources.jobBoardData}
                      onChange={() => handleToggleDataSource('jobBoardData')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Website Visitor Data</span>
                    <input
                      type="checkbox"
                      checked={dataSources.websiteData}
                      onChange={() => handleToggleDataSource('websiteData')}
                    />
                  </div>
                </div>
              </div>

              {/* Apply Changes Button */}
              <button
                onClick={handleApplyChanges}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm"
              >
                Apply Changes
              </button>
            </div>

            {/* Right Column: Model Performance */}
            <div className="col-span-2 bg-white shadow rounded-lg p-4">
              <h2 className="text-md font-semibold text-gray-800 mb-4">Model Performance</h2>
              <p className="text-sm text-gray-500 mb-4">
                Analyze your model accuracy and metrics
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Accuracy</p>
                  <p className="text-lg font-bold text-gray-800">{accuracy}%</p>
                </div>
                <div>
                  <p className="font-medium">Precision</p>
                  <p className="text-lg font-bold text-gray-800">{precision}%</p>
                </div>
                <div>
                  <p className="font-medium">Recall</p>
                  <p className="text-lg font-bold text-gray-800">{recall}%</p>
                </div>
                <div>
                  <p className="font-medium">F1 Score</p>
                  <p className="text-lg font-bold text-gray-800">{f1Score}%</p>
                </div>
              </div>
              <div className="mt-4">
                <button className="underline text-sm text-indigo-600">
                  View Detailed Metrics
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Scoring Criteria */}
        {activeTab === 'ScoringCriteria' && (
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-md font-semibold mb-4">Scoring Criteria</h2>
            <p className="text-sm text-gray-500 mb-4">
              Define or adjust the rules and weights for each lead scoring factor
            </p>
            <table className="min-w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Criterion</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Condition</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Points</th>
                </tr>
              </thead>
              <tbody>
                {criteria.map((crit) => (
                  <tr key={crit.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{crit.name}</td>
                    <td className="px-4 py-2">{crit.condition}</td>
                    <td className="px-4 py-2">{crit.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={handleAddCriterion}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm"
            >
              + Add Criterion
            </button>
          </div>
        )}

        {/* Tab: Thresholds */}
        {activeTab === 'Thresholds' && (
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-md font-semibold mb-4">Lead Score Thresholds</h2>
            <p className="text-sm text-gray-500 mb-4">
              Define numeric cutoffs for hot/warm/cold leads
            </p>
            <div className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-gray-700">Hot Lead Threshold</label>
                <input
                  type="number"
                  value={hotThreshold}
                  onChange={(e) => setHotThreshold(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-2 mt-1"
                />
                <p className="text-xs text-gray-500">Leads with a score {'>'}= this value are considered "hot".</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Warm Lead Threshold</label>
                <input
                  type="number"
                  value={warmThreshold}
                  onChange={(e) => setWarmThreshold(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-2 mt-1"
                />
                <p className="text-xs text-gray-500">Leads with a score {'>'}= this value are "warm", below are "cold".</p>
              </div>
            </div>
            <button
              onClick={handleThresholdsSave}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm"
            >
              Save Thresholds
            </button>
          </div>
        )}

        {/* Tab: Training History */}
        {activeTab === 'TrainingHistory' && (
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-md font-semibold mb-4">Training History</h2>
            <p className="text-sm text-gray-500 mb-4">
              View past training runs and performance metrics
            </p>
            <table className="min-w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Date</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Model Type</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Accuracy</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Precision</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Recall</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">F1 Score</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Notes</th>
                </tr>
              </thead>
              <tbody>
                {trainingHistory.map((run, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{run.date}</td>
                    <td className="px-4 py-2">{run.modelType}</td>
                    <td className="px-4 py-2">{run.accuracy}%</td>
                    <td className="px-4 py-2">{run.precision}%</td>
                    <td className="px-4 py-2">{run.recall}%</td>
                    <td className="px-4 py-2">{run.f1}%</td>
                    <td className="px-4 py-2">{run.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default LeadScoringConfig;
