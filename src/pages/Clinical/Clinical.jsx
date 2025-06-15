import React, { useState, useEffect } from "react";
import { clinicalAPI, healthCheck } from "../../utils/api";
import "./Clinical.css";

export default function Clinical() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    allergies: [],
    medications: [],
    diagnosis: "",
  });
  const [showResults, setShowResults] = useState(false);
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking");

  // Check backend status on component mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const isHealthy = await healthCheck();
        setBackendStatus(isHealthy ? "healthy" : "unhealthy");
      } catch (error) {
        setBackendStatus("unhealthy");
      }
    };
    
    checkBackend();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (backendStatus !== "healthy") {
      alert("Backend service is currently unavailable. Please try again later.");
      return;
    }

    setShowResults(true);
    setLoading(true);
    
    // Show initial processing message
    setResponse([{ description: "🔄 Searching for clinical trials... This may take up to 2 minutes for AI analysis." }]);
    
    try {
      const result = await clinicalAPI.fetchClinicalTrials(formData); 
      
      // Handle different response formats
      let trials = [];
      
      if (result) {
        if (result.results && Array.isArray(result.results)) {
          // Backend returns {message: "...", results: [...]}
          trials = result.results;
        } else if (Array.isArray(result)) {
          trials = result;
        } else if (result.answer) {
          if (Array.isArray(result.answer)) {
            trials = result.answer;
          } else if (typeof result.answer === 'string') {
            trials = [{ description: result.answer }];
          } else {
            trials = [result.answer];
          }
        } else if (result.trials) {
          trials = Array.isArray(result.trials) ? result.trials : [result.trials];
        } else {
          // If result is an object but doesn't have expected properties, convert to array
          trials = [result];
        }
      }
      
      // Ensure all trials are objects with proper structure
      trials = trials.map((trial, index) => {
        if (typeof trial === 'string') {
          return { description: trial };
        } else if (typeof trial === 'object' && trial !== null) {
          // Clean up any JSON property prefixes in the trial object
          const cleanedTrial = {};
          Object.keys(trial).forEach(key => {
            let value = trial[key];
            if (typeof value === 'string') {
              // Remove JSON property prefixes if they exist
              value = value.replace(/^"[\w_]+":\s*/, '');
              value = value.replace(/^[\w_]+:\s*/i, '');
              value = value.replace(/^["']|["']$/g, '');
              value = value.trim();
            }
            cleanedTrial[key] = value;
          });
          return cleanedTrial;
        } else {
          return { description: `Trial ${index + 1}: ${String(trial)}` };
        }
      });
      
      setResponse(trials);
    } catch (error) {
      console.error("❌ Clinical trials fetch failed:", error);
      
      let errorMessage = "Failed to fetch clinical trials. Please try again.";
      
      if (error.response?.status === 503) {
        errorMessage = "Backend service is starting up. Please wait a moment and try again.";
      } else if (error.response?.data?.error) {
        errorMessage = `Server error: ${error.response.data.error}`;
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Request timed out after 2 minutes. The AI processing is taking longer than expected. Please try again or contact support if the issue persists.";
      }
      
      setResponse([{ error: errorMessage }]);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.age &&
    formData.gender &&
    formData.allergies &&
    formData.medications &&
    formData.diagnosis;

  return (
    <div className="clinical">
      <div className="clinical__container">
        {/* Main Content */}
        <div className="clinical__content">
          {/* Header */}
          <div className="clinical__header">
            <h1 className="clinical__title">Clinical Trial Matcher</h1>
            <p className="clinical__subtitle">
              Find clinical trials that match your medical profile
            </p>
            
            {/* Backend Status Indicator */}
            <div className="backend-status">
              <span className={`status-indicator ${backendStatus}`}>
                {backendStatus === "checking" && "🔄 Checking AI..."}
                {backendStatus === "healthy" && "✅ AI connected"}
                {backendStatus === "unhealthy" && "❌ AI unavailable"}
              </span>
            </div>
          </div>

          <hr />
          <br />
          <br />

          {/* Two Column Layout */}
          <div className="clinical__main">
            {/* Left Column - Form */}
            <div className="clinical__form-section">
              <div className="clinical__section-header">
                <div className="clinical__section-icon">👤</div>
                <div>
                  <h2 className="clinical__section-title">
                    Your Medical Profile
                  </h2>
                  <p className="clinical__section-subtitle">
                    Please provide your information to find matching clinical
                    trials
                  </p>
                </div>
              </div>

              <form
                className="clinical__form"
                onSubmit={handleSubmit}
                action="/fetch_clinical_trials"
                method="post"
              >
                <div className="clinical__form-group">
                  <label htmlFor="age" className="clinical__label">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Enter your age"
                    className="clinical__input"
                    min="1"
                    max="120"
                  />
                </div>

                <div className="clinical__form-group">
                  <label htmlFor="gender" className="clinical__label">
                    Gender
                  </label>
                  <input
                    type="text"
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    placeholder="e.g., Male, Female, Other"
                    className="clinical__input"
                  />
                </div>

                <div className="clinical__form-group">
                  <label htmlFor="allergies" className="clinical__label">
                    Known Allergies
                  </label>
                  <textarea
                    id="allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleInputChange}
                    placeholder="List any known allergies (food, medication, environmental)"
                    className="clinical__textarea"
                    rows="4"
                  />
                </div>

                <div className="clinical__form-group">
                  <label htmlFor="diagnosis" className="clinical__label">
                    Diagnosis
                  </label>
                  <textarea
                    id="diagnosis"
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleInputChange}
                    placeholder="Share your diagnosis"
                    className="clinical__textarea"
                    rows="4"
                  />
                </div>
                <div className="clinical__form-group">
                  <label htmlFor="medications" className="clinical__label">
                    Current Medications
                  </label>
                  <textarea
                    id="medications"
                    name="medications"
                    value={formData.medications}
                    onChange={handleInputChange}
                    placeholder="List current medications and dosages"
                    className="clinical__textarea"
                    rows="4"
                  />
                </div>

                <button
                  type="submit"
                  className="clinical__submit-btn"
                  disabled={!isFormValid || backendStatus !== "healthy"}
                >
                  {loading ? "Searching (up to 2 min)..." : "Find Matching Trials"}
                </button>
              </form>
            </div>

            {/* Right Column - Results */}
            <div className="clinical__results-section">
              <div className="clinical__section-header">
                <div className="clinical__section-icon">🔬</div>
                <div>
                  <h2 className="clinical__section-title">
                    Matching Clinical Trials
                  </h2>
                  <p className="clinical__section-subtitle">
                    Your personalized trial recommendations will appear here
                  </p>
                </div>
              </div>

              <div className="clinical__results">
                {!showResults ? (
                  <div className="clinical__no-results">
                    <div className="clinical__no-results-icon">👥</div>
                    <h3 className="clinical__no-results-title">
                      No Results Yet
                    </h3>
                    <p className="clinical__no-results-text">
                      Fill out the form to discover clinical trials that match
                      your profile
                    </p>
                  </div>
                ) : loading ? (
                  <div className="clinical__loading-spinner">
                    <div className="clinical__spinner"></div>
                    <p>Searching for matching trials...</p>
                  </div>
                ) : response.length > 0 ? (
                  <div className="clinical__trials-list">
                    {response.map((trial, index) => (
                      <div key={index} className="clinical__trial-card">
                        {trial.error ? (
                          <div className="clinical__error-message">
                            <h4>Error</h4>
                            <p>{trial.error}</p>
                          </div>
                        ) : (
                          <>
                            <h4 className="clinical__trial-title">
                              {trial.title || trial.trial_id || `Trial ${index + 1}`}
                            </h4>
                            
                            {/* Trial Summary */}
                            {trial.analysis?.trial_summary && (
                              <div className="clinical__trial-criteria">
                                <strong>📋 Trial Overview:</strong>
                                <p>{trial.analysis.trial_summary}</p>
                              </div>
                            )}
                            
                            {/* Suitability Score */}
                            {trial.analysis?.suitability_score && (
                              <div className="clinical__trial-criteria">
                                <strong>🎯 Match Score:</strong>
                                <p>{trial.analysis.suitability_score}</p>
                              </div>
                            )}
                            
                            {/* Eligibility Assessment */}
                            {trial.analysis?.eligibility_assessment && (
                              <div className="clinical__trial-criteria">
                                <strong>✅ Eligibility:</strong>
                                <p>{trial.analysis.eligibility_assessment}</p>
                              </div>
                            )}
                            
                            {/* Potential Benefits */}
                            {trial.analysis?.potential_benefits && (
                              <div className="clinical__trial-criteria">
                                <strong>💡 Potential Benefits:</strong>
                                <p>{trial.analysis.potential_benefits}</p>
                              </div>
                            )}
                            
                            {/* Risks and Considerations */}
                            {trial.analysis?.risks_considerations && (
                              <div className="clinical__trial-criteria">
                                <strong>⚠️ Risks & Considerations:</strong>
                                <p>{trial.analysis.risks_considerations}</p>
                              </div>
                            )}
                            
                            {/* Recommendation */}
                            {trial.analysis?.recommendation && (
                              <div className="clinical__trial-criteria">
                                <strong>💭 Recommendation:</strong>
                                <p>{trial.analysis.recommendation}</p>
                              </div>
                            )}
                            
                            {/* Trial Details */}
                            {trial.conditions && (
                              <div className="clinical__trial-criteria">
                                <strong>🏥 Conditions:</strong>
                                <p>{trial.conditions}</p>
                              </div>
                            )}
                            
                            {trial.phase && (
                              <div className="clinical__trial-criteria">
                                <strong>🔬 Phase:</strong>
                                <p>{trial.phase}</p>
                              </div>
                            )}
                            
                            {trial.status && (
                              <div className="clinical__trial-criteria">
                                <strong>📊 Status:</strong>
                                <p>{trial.status}</p>
                              </div>
                            )}
                            
                            {trial.url && (
                              <div className="clinical__trial-criteria">
                                <strong>🔗 More Info:</strong>
                                <a href={trial.url} target="_blank" rel="noopener noreferrer" className="clinical__trial-link">
                                  View on ClinicalTrials.gov
                                </a>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="clinical__no-results">
                    <div className="clinical__no-results-icon">🔍</div>
                    <h3 className="clinical__no-results-title">
                      No Matching Trials Found
                    </h3>
                    <p className="clinical__no-results-text">
                      Try adjusting your profile information or contact a healthcare provider for more options.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
