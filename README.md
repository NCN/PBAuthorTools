# Picture Book Author Tools

A web-based application that helps picture book authors analyze their manuscripts, count words, and visualize text data. This tool provides author-specific utilities like art note detection, readability analysis, and word clouds.

## Architecture Overview

This project uses a modern, serverless architecture with several interconnected components:

### 1. Web Application (Frontend)

- **Technology**: HTML, CSS, JavaScript, Bootstrap 5, Quill.js editor
- **Hosting**: GitHub Pages with custom subdomain (`authortools.hellonathan.ca`)
- **Key Features**:
  - Rich text editor for manuscript editing
  - Real-time word count and art note detection
  - Readability analysis and grade level assessment
  - Word cloud generation and word frequency analysis
  - Adverb detector and problematic rhyme word identification

### 2. Authentication & Database (Firebase)

- **Services Used**:
  - Firebase Authentication for user login/signup
  - Firestore for data storage
  - Firebase SDK for client-side integration
- **Authentication Methods**:
  - Email/password authentication
  - Google OAuth integration
  - Password reset functionality
- **Collections**:
  - `users`: Stores user profile information
  - `feature_suggestions`: Manages user-submitted feature requests

### 3. Monitoring & Notifications (AWS)

- **Lambda Function**: `firebase-monitor`
  - Checks for new users and feature suggestions
  - Sends email notifications using Amazon SES
- **DynamoDB**: `FirebaseLastChecked` table
  - Tracks when collections were last monitored
  - Prevents duplicate notifications
- **Amazon SES (Simple Email Service)**:
  - Sends formatted email alerts
  - Used for administrative notifications only

### 4. DNS & Domain Configuration

- **Primary Domain**: `hellonathan.ca` 
- **Subdomain**: `authortools.hellonathan.ca`
- **DNS Configuration**:
  - CNAME record pointing to GitHub Pages
  - TXT records for domain verification

## Data Flow

1. **User Interaction**:
   - User authenticates via Firebase Authentication
   - Client-side JavaScript processes manuscript text locally
   - No manuscript text is sent to servers (privacy-focused)

2. **Data Storage**:
   - User account data saved to Firebase Firestore
   - Feature suggestions and feedback stored in Firestore

3. **Monitoring**:
   - AWS Lambda function periodically polls Firestore collections
   - New entries trigger email notifications via SES
   - Last check timestamps stored in DynamoDB

## Development & Deployment

### Local Development

```bash
# Clone the repository

# Navigate to the project directory
cd pb-author-tools

# Use a local server for testing
python -m http.server 8000
```

### Firebase Setup

1. Create a Firebase project
2. Enable Authentication methods (Email/Password, Google)
3. Set up Firestore collections
4. Add Firebase configuration to the web application

### AWS Setup

1. Create Lambda function with Firebase Service Account
2. Configure DynamoDB table for tracking
3. Set up SES for email sending
4. Create appropriate IAM roles and permissions

### GitHub Pages Deployment

1. Enable GitHub Pages in repository settings
2. Set custom domain in GitHub repository settings
3. Configure DNS with appropriate CNAME records

## Firebase Monitor Lambda Function

The Lambda function (`firebase-monitor/index.js`) serves as a bridge between Firebase and email notifications:

1. **Authentication**: Uses Firebase Admin SDK with service account credentials
2. **Monitoring**: Checks Firestore collections for new entries since last run
3. **Notification**: Formats and sends email alerts via Amazon SES
4. **State Management**: Updates DynamoDB with timestamps of last checks

## Privacy & Security Considerations

- Manuscript text is never transmitted to servers
- All text analysis happens client-side in the browser
- Firebase Authentication provides secure user management
- AWS Lambda function uses IAM role with least privilege

## License

See the LICENSE file for details.

## Author

Created by Nathan Christopher ([hellonathan.ca](https://hellonathan.ca))
