import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import config from '../firebase-applet-config.json' with { type: 'json' };

const app = !getApps().length ? initializeApp(config) : getApp();
export const db = getFirestore(app, config.firestoreDatabaseId || undefined);

export {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit
};
