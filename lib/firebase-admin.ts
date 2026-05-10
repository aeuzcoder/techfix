import * as admin from 'firebase-admin';
import dbConnect from './mongodb';
import { User } from '@/models/User';

if (!admin.apps.length) {
  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountKey) {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccountKey)),
      });
    } else {
      console.warn('FIREBASE_SERVICE_ACCOUNT_KEY is not defined. Firebase Admin SDK not initialized.');
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const adminAuth = admin.apps.length ? admin.auth() : null;

export async function verifyToken(request: Request): Promise<{ uid: string } | null> {
  if (!adminAuth) {
    console.error('Admin auth not initialized');
    return null;
  }

  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    return { uid: decodedToken.uid };
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

export async function getDbUser(uid: string) {
  await dbConnect();
  try {
    const user = await User.findOne({ firebaseUid: uid }).lean();
    return user;
  } catch (error) {
    console.error('Error getting DB user:', error);
    return null;
  }
}
