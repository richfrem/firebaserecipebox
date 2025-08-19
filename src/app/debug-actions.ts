
"use server";

import { GoogleAuth } from 'google-auth-library';

export async function logCurrentServiceAccount() {
  try {
    console.log("Attempting to get service account from Google Auth Library...");

    const auth = new GoogleAuth({
      scopes: 'https://www.googleapis.com/auth/cloud-platform'
    });
    const client = await auth.getClient();
    
    // The client object might be complex, let's safely access the email
    // @ts-ignore - We expect .email to exist on a service account client
    const serviceAccountEmail = client.email || 'Email not found on client object';
    
    console.log('--- THIS CODE IS RUNNING AS ---');
    console.log('Service Account Email:', serviceAccountEmail);
    console.log('------------------------------');

    return `Success! Service Account: ${serviceAccountEmail}`;

  } catch (error: any) {
    console.error("CRITICAL ERROR in logCurrentServiceAccount:", error);
    return `Failed to get service account. Check server logs. Error: ${error.message}`;
  }
}
