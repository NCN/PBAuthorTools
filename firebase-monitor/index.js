const AWS = require('aws-sdk');
const admin = require('firebase-admin');
const ses = new AWS.SES({ region: 'us-east-1' }); // Change region if needed
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Initialize Firebase Admin with your service account
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const EMAIL_FROM = 'nathanchristopherbooks@gmail.com';
const EMAIL_TO = 'nathanchristopherbooks@gmail.com';

exports.handler = async (event) => {
  try {
    // Collections to monitor
    const collections = ['users', 'feature_suggestions'];
    let hasNewEntries = false;
    let emailBody = 'New entries in your Firebase database:\n\n';
    
    // Check each collection for new entries
    for (const collectionName of collections) {
      // Get last check time from DynamoDB
      const lastCheckData = await dynamoDB.get({
        TableName: 'FirebaseLastChecked',
        Key: { collectionName }
      }).promise();
      
      // Default to epoch if no last check time exists
      const lastCheckTime = lastCheckData.Item?.timestamp || 0;
      const lastCheckDate = new Date(lastCheckTime);
      
      console.log(`Checking collection ${collectionName} for entries after ${lastCheckDate.toISOString()}`);
      
      // Query Firestore for new entries
      const query = db.collection(collectionName)
        .where('timestamp', '>', admin.firestore.Timestamp.fromDate(lastCheckDate))
        .orderBy('timestamp', 'desc');
      
      const snapshot = await query.get();
      
      if (!snapshot.empty) {
        hasNewEntries = true;
        emailBody += `\n== ${collectionName} ==\n`;
        emailBody += `Found ${snapshot.size} new entries.\n\n`;
        
        // Add details for each new entry
        snapshot.forEach(doc => {
          const data = doc.data();
          
          // Format the entry differently based on collection
          if (collectionName === 'users') {
            emailBody += `User: ${data.email}\n`;
            emailBody += `Signed up: ${data.timestamp?.toDate().toISOString()}\n\n`;
          } else if (collectionName === 'feature_suggestions') {
            emailBody += `Title: ${data.title}\n`;
            emailBody += `From: ${data.userEmail}\n`;
            emailBody += `Description: ${data.description}\n`;
            emailBody += `Submitted: ${data.timestamp?.toDate().toISOString()}\n\n`;
          }
        });
      }
      
      // Update the last check time in DynamoDB
      await dynamoDB.put({
        TableName: 'FirebaseLastChecked',
        Item: {
          collectionName,
          timestamp: Date.now()
        }
      }).promise();
    }
    
    // Send email if there are new entries
    if (hasNewEntries) {
      await sendEmail(emailBody);
      return { statusCode: 200, body: 'Email sent with new entries' };
    } else {
      return { statusCode: 200, body: 'No new entries found' };
    }
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: 'Error checking for new entries' };
  }
};

async function sendEmail(body) {
  const params = {
    Source: EMAIL_FROM,
    Destination: { ToAddresses: [EMAIL_TO] },
    Message: {
      Subject: { Data: 'New Firebase Entries Alert' },
      Body: { Text: { Data: body } }
    }
  };
  
  return ses.sendEmail(params).promise();
}
