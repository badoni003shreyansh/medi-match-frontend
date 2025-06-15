import React, { useState, useEffect } from "react";
import { medicalAPI, healthCheck } from "../../utils/api";
import "./Medical.css";

const Medical = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/jpg"].includes(file.type)) {
      alert("Please upload a JPEG or JPG image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB.");
      return;
    }

    setUploadedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileChange({ target: { files: [file] } });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uploadedFile) {
      alert("Please select a file.");
      return;
    }

    if (backendStatus !== "healthy") {
      alert("Backend service is currently unavailable. Please try again later.");
      return;
    }

    setIsUploading(true);
    setAnalysisResult(null); // Clear old result

    // Show initial processing message
    setAnalysisResult("🔄 Processing image... This may take up to 2 minutes for AI analysis.");

    try {
      const result = await medicalAPI.processImage(uploadedFile);
      
      console.log("🔍 Raw API response:", result);
      console.log("🔍 Response type:", typeof result);
      console.log("🔍 Response keys:", result ? Object.keys(result) : 'null');
      
      // Handle different response formats
      let diagnosisText = "No diagnosis found in image.";
      
      if (result) {
        if (typeof result === 'string') {
          diagnosisText = result;
        } else if (result.answer) {
          // Extract just the content from the answer property
          diagnosisText = typeof result.answer === 'string' ? result.answer : JSON.stringify(result.answer);
          console.log("📝 Extracted content:", diagnosisText);
        } else if (result.diagnosis) {
          diagnosisText = typeof result.diagnosis === 'string' ? result.diagnosis : JSON.stringify(result.diagnosis);
        } else if (result.description) {
          diagnosisText = typeof result.description === 'string' ? result.description : JSON.stringify(result.description);
        } else {
          // If result is an object but doesn't have expected properties, stringify it
          diagnosisText = JSON.stringify(result, null, 2);
        }
      }
      
      // Comprehensive cleanup to remove any "answer" text
      console.log("🧹 Before cleanup:", diagnosisText);
      
      // Remove "answer": prefix if it exists
      diagnosisText = diagnosisText.replace(/^"answer":\s*/, '');
      diagnosisText = diagnosisText.replace(/^answer:\s*/i, '');
      
      // Remove any JSON formatting
      diagnosisText = diagnosisText.replace(/^["']|["']$/g, '');
      diagnosisText = diagnosisText.replace(/^\{.*?"answer":\s*["']?/, '');
      diagnosisText = diagnosisText.replace(/["']?\s*\}$/, '');
      
      // Clean up whitespace
      diagnosisText = diagnosisText.trim();
      
      console.log("🧹 After cleanup:", diagnosisText);
      console.log("🎯 Final diagnosis text:", diagnosisText);
      setAnalysisResult(diagnosisText);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("❌ Upload failed:", error);
      
      let errorMessage = "Upload failed. Please try again.";
      
      if (error.response?.status === 503) {
        errorMessage = "Backend service is starting up. Please wait a moment and try again.";
      } else if (error.response?.status === 413) {
        errorMessage = "File size is too large. Please upload a smaller image.";
      } else if (error.response?.data?.error) {
        errorMessage = `Server error: ${error.response.data.error}`;
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Request timed out after 2 minutes. The AI processing is taking longer than expected. Please try again or contact support if the issue persists.";
      }
      
      setAnalysisResult(errorMessage);
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="medical-container">
      <div className="medical-content">
        {/* Hero Section */}
        <div className="hero-section">
          <h1>Medical Document Analysis</h1>
          <p>
            Upload your medical records, prescriptions, or test results to find
            personalized treatment options.
          </p>
          
          {/* Backend Status Indicator */}
          <div className="backend-status">
            <span className={`status-indicator ${backendStatus}`}>
              {backendStatus === "checking" && "🔄 Checking backend..."}
              {backendStatus === "healthy" && "✅ Backend connected"}
              {backendStatus === "unhealthy" && "❌ Backend unavailable"}
            </span>
          </div>
        </div>

        <hr />
        <br />

        <div className="main-sections">
          {/* Upload & Analyze Form */}
          <form onSubmit={handleSubmit}>
            <div className="upload-section">
              <div className="section-card">
                <div className="section-header">
                  <div className="section-icon upload-icon">📄</div>
                  <h3>Upload Medical Documents</h3>
                  <p>
                    Upload JPEG or JPG files of your prescriptions or reports.
                  </p>
                </div>

                <div
                  className="upload-area"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <input
                    type="file"
                    accept=".jpg,.jpeg"
                    onChange={handleFileChange}
                    className="file-input"
                    id="medical-file"
                    name="image"
                    disabled={backendStatus !== "healthy"}
                  />
                  <label htmlFor="medical-file" className="upload-label">
                    <div className="upload-icon-large">📋</div>
                    <div className="upload-text">
                      <span className="upload-title">
                        Click or Drag to Upload
                      </span>
                      <span className="upload-subtitle">
                        JPEG or JPG only (max 10MB)
                      </span>
                    </div>
                  </label>
                  {uploadedFile && (
                    <div className="uploaded-file">
                      <span>📄 {uploadedFile.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedFile(null);
                          setAnalysisResult(null);
                        }}
                        className="remove-file"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <div className="supported-docs">
                  <h4>Supported Documents:</h4>
                  <ul>
                    <li>• Medical prescriptions</li>
                    <li>• Lab test results</li>
                    <li>• Doctor's reports</li>
                    <li>• Diagnostic reports</li>
                  </ul>
                </div>

                <div className="btn-actions">
                  <button
                    className="analyze-btn"
                    type="submit"
                    disabled={isUploading || backendStatus !== "healthy"}
                  >
                    {isUploading ? "Processing (up to 2 min)..." : "Upload File"}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Recommendation Section */}
          <div className="recommendations-section">
            <div className="section-card">
              <div className="section-header">
                <div className="section-icon recommendations-icon">💡</div>
                <h3>AI Diagnosis Result</h3>
                <p>AI-powered insights based on your uploaded image</p>
              </div>

              <div className="recommendations-content">
                {analysisResult === null ? (
                  <div className="no-analysis">
                    <div className="no-analysis-icon">📊</div>
                    <h4>No Result Yet</h4>
                    <p>Upload a JPEG image to see the diagnosis.</p>
                  </div>
                ) : (
                  <div className="analysis-results">
                    <h4>AI Analysis Results:</h4>
                    <div className="diagnosis-content">
                      <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
                        {analysisResult}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Medical;
