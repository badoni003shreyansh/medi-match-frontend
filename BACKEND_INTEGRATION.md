# Backend Integration Guide

This document explains how the Medi-Match frontend is integrated with the Hugging Face backend.

## Backend URL

The frontend is configured to connect to the Hugging Face Space backend at:
```
https://gungoo-medi-match-backend.hf.space
```

## Environment Configuration

The backend URL is configured in the `.env` file:
```
REACT_APP_FLASK_BACKEND_URL=https://gungoo-medi-match-backend.hf.space
REACT_APP_FLASK_URL=https://gungoo-medi-match-backend.hf.space
```

## Features Integrated

### 1. Medical Document Analysis
- **Endpoint**: `/process_image`
- **Method**: POST
- **Input**: JPEG/JPG image file (max 10MB)
- **Output**: AI diagnosis and medical insights
- **Location**: Medical Analysis page (`/medical_analysis`)

### 2. Clinical Trial Matching
- **Endpoint**: `/fetch_clinical_trials`
- **Method**: POST
- **Input**: User medical profile (age, gender, allergies, medications, diagnosis)
- **Output**: Matching clinical trials
- **Location**: Clinical Trial page (`/clinical_trial`)

## API Utility

The integration uses a centralized API utility (`src/utils/api.js`) that provides:

- **Centralized configuration**: Single place to manage backend URLs
- **Error handling**: Comprehensive error handling for common scenarios
- **Request/Response interceptors**: Logging and error processing
- **Timeout management**: 30-second timeout for AI processing
- **Health checks**: Backend status monitoring

## Backend Status Monitoring

Both pages include real-time backend status indicators:
- 🔄 **Checking**: Verifying backend connectivity
- ✅ **Connected**: Backend is available and responding
- ❌ **Unavailable**: Backend is down or unreachable

## Error Handling

The integration handles various error scenarios:

- **503 Service Unavailable**: Backend is starting up
- **413 Payload Too Large**: File size exceeds limits
- **Connection Timeout**: Request takes too long
- **Network Errors**: Connection issues

## Usage Instructions

### For Medical Document Analysis:
1. Navigate to the Medical Analysis page
2. Wait for the backend status to show "✅ Backend connected"
3. Upload a JPEG/JPG medical document (max 10MB)
4. Click "Upload File" to process
5. View AI diagnosis results

### For Clinical Trial Matching:
1. Navigate to the Clinical Trial page
2. Wait for the backend status to show "✅ Backend connected"
3. Fill out your medical profile form
4. Click "Find Matching Trials"
5. View personalized clinical trial recommendations

## Troubleshooting

### Backend Not Responding
- Check if the Hugging Face Space is running
- Verify the backend URL in `.env` file
- Check browser console for error messages

### File Upload Issues
- Ensure file is JPEG/JPG format
- Check file size (max 10MB)
- Verify backend status is "connected"

### Slow Response Times
- Hugging Face Spaces may take time to start up
- AI processing can take 10-30 seconds
- Check the loading indicators

## Development Notes

- The backend uses Hugging Face Spaces for deployment
- API endpoints follow RESTful conventions
- All requests include proper error handling
- Status indicators provide real-time feedback
- Timeout is set to 30 seconds for AI processing

## Security Considerations

- File uploads are validated for type and size
- No sensitive data is stored locally
- All communication uses HTTPS
- Error messages don't expose sensitive backend information 