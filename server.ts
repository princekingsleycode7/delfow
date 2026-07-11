import express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDoc 
} from 'firebase/firestore';

const PORT = 3000;

// Interface Declarations
interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'Super Admin' | 'Admin' | 'Support Agent' | 'User';
  createdAt: string;
}

interface Parcel {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderEmail: string;
  receiverName: string;
  receiverEmail: string;
  origin: string;
  destination: string;
  currentStatus: 'Registered' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Exception';
  estimatedDelivery: string;
  chooseServices: string;
  createdAt: string;
}

interface ParcelHistory {
  id: string;
  parcelId: string;
  status: string;
  location: string;
  description: string;
  timestamp: string;
}

interface ChatSession {
  id: string; // Session ID (usually anonymous)
  createdAt: string;
  lastActiveAt: string;
  status: 'active' | 'closed';
}

interface Message {
  id: string;
  sessionId: string;
  senderType: 'user' | 'agent';
  senderId: string; // user email or session ID
  senderName: string;
  text: string;
  timestamp: string;
}

interface DatabaseSchema {
  users: User[];
  parcels: Parcel[];
  parcel_history: ParcelHistory[];
  chat_sessions: ChatSession[];
  messages: Message[];
}

// Removed in-memory sessions store to use Firestore instead

// Helper to clean environment variables (removes quotes and leading/trailing whitespace)
const cleanEnvVar = (val: string | undefined): string | undefined => {
  if (!val) return undefined;
  return val.trim().replace(/^["']|["']$/g, '').trim();
};

// Check if Firebase keys are fully provided
const isFirebaseConfigured = (): boolean => {
  return !!(
    cleanEnvVar(process.env.FIREBASE_API_KEY) &&
    cleanEnvVar(process.env.FIREBASE_PROJECT_ID) &&
    cleanEnvVar(process.env.FIREBASE_APP_ID)
  );
};

// Lazy-initialized Firestore Instance
let firestoreInstance: any = null;
function getDBInstance() {
  if (!isFirebaseConfigured()) {
    throw new Error('Delflow is configured to run ONLY on production Firebase. However, one or more Firebase environment variables (FIREBASE_API_KEY, FIREBASE_PROJECT_ID, FIREBASE_APP_ID) are missing or not set in the environment.');
  }
  if (!firestoreInstance) {
    try {
      const firebaseConfig = {
        apiKey: cleanEnvVar(process.env.FIREBASE_API_KEY),
        authDomain: cleanEnvVar(process.env.FIREBASE_AUTH_DOMAIN),
        projectId: cleanEnvVar(process.env.FIREBASE_PROJECT_ID),
        storageBucket: cleanEnvVar(process.env.FIREBASE_STORAGE_BUCKET),
        messagingSenderId: cleanEnvVar(process.env.FIREBASE_MESSAGING_SENDER_ID),
        appId: cleanEnvVar(process.env.FIREBASE_APP_ID),
      };
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      firestoreInstance = getFirestore(app);
      console.log('✅ Delflow successfully connected to your production Firebase Firestore database!');
    } catch (err: any) {
      console.error('❌ Failed to initialize Firebase Firestore:', err);
      throw new Error(`Failed to initialize Firebase Firestore: ${err.message}`);
    }
  }
  return firestoreInstance;
}

// Database Helper (Pure Firebase - No Local Fallbacks)
class DB {
  constructor() {
    this.seedInitialData();
  }

  private async seedInitialData() {
    try {
      const dbInstance = getDBInstance();
      const parcelsRef = collection(dbInstance, 'parcels');
      const snap = await getDocs(parcelsRef);
      if (snap.empty) {
        const demoParcelId = 'p1';
        const trackingNumber = 'DF-874291';
        
        await setDoc(doc(dbInstance, 'parcels', demoParcelId), {
          id: demoParcelId,
          trackingNumber,
          senderName: 'John Doe',
          senderEmail: 'john@example.com',
          receiverName: 'Alice Smith',
          receiverEmail: 'alice@example.com',
          origin: 'Los Angeles, CA',
          destination: 'New York, NY',
          currentStatus: 'In Transit',
          estimatedDelivery: '2026-07-02',
          chooseServices: 'Road Transport',
          createdAt: new Date().toISOString()
        });

        await setDoc(doc(dbInstance, 'parcel_history', 'h1'), {
          id: 'h1',
          parcelId: demoParcelId,
          status: 'Registered',
          location: 'Los Angeles, CA',
          description: 'Shipment has been registered in the system.',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
        });

        await setDoc(doc(dbInstance, 'parcel_history', 'h2'), {
          id: 'h2',
          parcelId: demoParcelId,
          status: 'In Transit',
          location: 'Chicago Hub, IL',
          description: 'Shipment is in transit between processing facilities.',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        });
        console.log('Firebase Firestore initialized with demo seed data.');
      }
    } catch (err) {
      console.error('Error seeding Firebase:', err);
    }
  }

  // --- Users Operations ---
  public async getUsers(): Promise<User[]> {
    const dbInstance = getDBInstance();
    const snap = await getDocs(collection(dbInstance, 'users'));
    const users: User[] = [];
    snap.forEach(docSnap => {
      users.push(docSnap.data() as User);
    });
    return users;
  }

  public async saveUser(user: User): Promise<void> {
    const dbInstance = getDBInstance();
    await setDoc(doc(dbInstance, 'users', user.id), user);
  }

  public async deleteUser(id: string): Promise<void> {
    const dbInstance = getDBInstance();
    await deleteDoc(doc(dbInstance, 'users', id));
  }

  // --- Parcels Operations ---
  public async getParcels(): Promise<Parcel[]> {
    const dbInstance = getDBInstance();
    const snap = await getDocs(collection(dbInstance, 'parcels'));
    const parcels: Parcel[] = [];
    snap.forEach(docSnap => {
      parcels.push(docSnap.data() as Parcel);
    });
    return parcels;
  }

  public async saveParcel(parcel: Parcel): Promise<void> {
    const dbInstance = getDBInstance();
    await setDoc(doc(dbInstance, 'parcels', parcel.id), parcel);
  }

  public async deleteParcel(id: string): Promise<void> {
    const dbInstance = getDBInstance();
    await deleteDoc(doc(dbInstance, 'parcels', id));
  }

  // --- Parcel History Operations ---
  public async getParcelHistory(): Promise<ParcelHistory[]> {
    const dbInstance = getDBInstance();
    const snap = await getDocs(collection(dbInstance, 'parcel_history'));
    const history: ParcelHistory[] = [];
    snap.forEach(docSnap => {
      history.push(docSnap.data() as ParcelHistory);
    });
    return history;
  }

  public async saveParcelHistory(history: ParcelHistory): Promise<void> {
    const dbInstance = getDBInstance();
    await setDoc(doc(dbInstance, 'parcel_history', history.id), history);
  }

  public async deleteParcelHistoryForParcel(parcelId: string): Promise<void> {
    const dbInstance = getDBInstance();
    const snap = await getDocs(collection(dbInstance, 'parcel_history'));
    const deletePromises: Promise<void>[] = [];
    snap.forEach((docSnap) => {
      const item = docSnap.data() as ParcelHistory;
      if (item.parcelId === parcelId) {
        deletePromises.push(deleteDoc(doc(dbInstance, 'parcel_history', docSnap.id)));
      }
    });
    await Promise.all(deletePromises);
  }

  // --- Chat Sessions Operations ---
  public async getChatSessions(): Promise<ChatSession[]> {
    const dbInstance = getDBInstance();
    const snap = await getDocs(collection(dbInstance, 'chat_sessions'));
    const sessionsList: ChatSession[] = [];
    snap.forEach(docSnap => {
      sessionsList.push(docSnap.data() as ChatSession);
    });
    return sessionsList;
  }

  public async saveChatSession(session: ChatSession): Promise<void> {
    const dbInstance = getDBInstance();
    await setDoc(doc(dbInstance, 'chat_sessions', session.id), session);
  }

  // --- Messages Operations ---
  public async getMessages(): Promise<Message[]> {
    const dbInstance = getDBInstance();
    const snap = await getDocs(collection(dbInstance, 'messages'));
    const messages: Message[] = [];
    snap.forEach(docSnap => {
      messages.push(docSnap.data() as Message);
    });
    return messages.sort((a, b) => {
      const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return timeA - timeB;
    });
  }

  public async saveMessage(message: Message): Promise<void> {
    const dbInstance = getDBInstance();
    await setDoc(doc(dbInstance, 'messages', message.id), message);
  }

  // --- Auth Sessions Operations ---
  public async getAuthSessionUserId(token: string): Promise<string | null> {
    const dbInstance = getDBInstance();
    const docSnap = await getDoc(doc(dbInstance, 'auth_sessions', token));
    if (docSnap.exists()) {
      return docSnap.data().userId as string;
    }
    return null;
  }

  public async saveAuthSession(token: string, userId: string): Promise<void> {
    const dbInstance = getDBInstance();
    await setDoc(doc(dbInstance, 'auth_sessions', token), { userId, createdAt: new Date().toISOString() });
  }

  public async deleteAuthSession(token: string): Promise<void> {
    const dbInstance = getDBInstance();
    await deleteDoc(doc(dbInstance, 'auth_sessions', token));
  }

  public async deleteUserAuthSessions(userId: string): Promise<void> {
    const dbInstance = getDBInstance();
    const snap = await getDocs(collection(dbInstance, 'auth_sessions'));
    const deletePromises: Promise<void>[] = [];
    snap.forEach(docSnap => {
      if (docSnap.data().userId === userId) {
        deletePromises.push(deleteDoc(doc(dbInstance, 'auth_sessions', docSnap.id)));
      }
    });
    await Promise.all(deletePromises);
  }
}

const db = new DB();

// Password hashing function using Node's crypto
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Generate random alphanumeric password for newly invited staff/admin users
function generateRandomPassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

const app = express();
app.use(express.json());

// --- Auth Middleware ---
const authenticate = async (req: any, res: any, next: any) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing token' });
      }
      const token = authHeader.split('Bearer ')[1];
      const userId = await db.getAuthSessionUserId(token);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
      const users = await db.getUsers();
      const user = users.find(u => u.id === userId);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized: User not found' });
      }
      req.user = user;
      next();
    } catch (error) {
      console.error('Authentication Error:', error);
      return res.status(500).json({ error: 'Internal Server Error during authentication' });
    }
  };

  const requireRole = (roles: string[]) => {
    return (req: any, res: any, next: any) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      }
      next();
    };
  };

  // --- API Routes ---

  // Auth Endpoints
  app.get('/api/auth/has-admin', async (req: any, res: any) => {
    const users = await db.getUsers();
    const hasAdmin = users.filter(u => u.email !== '__check__').length > 0;
    res.json({ hasAdmin });
  });

  app.post('/api/auth/register', async (req: any, res: any) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const emailNormalized = email.toLowerCase().trim();
    const users = await db.getUsers();
    const existing = users.find(u => u.email === emailNormalized);
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Role assignment: first user is Super Admin, subsequent users are normal Users by default
    const isFirstUser = users.length === 0;
    if (!isFirstUser) {
      return res.status(403).json({ error: 'Public registration is disabled. Please contact your system administrator to be granted access.' });
    }

    const role = 'Super Admin';

    const newUser: User = {
      id: crypto.randomUUID(),
      email: emailNormalized,
      passwordHash: hashPassword(password),
      role,
      createdAt: new Date().toISOString()
    };

    await db.saveUser(newUser);

    const token = crypto.randomBytes(32).toString('hex');
    await db.saveAuthSession(token, newUser.id);

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });
  });

  app.post('/api/auth/login', async (req: any, res: any) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const emailNormalized = email.toLowerCase().trim();
    const hash = hashPassword(password);
    const users = await db.getUsers();
    const user = users.find(u => u.email === emailNormalized && u.passwordHash === hash);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    await db.saveAuthSession(token, user.id);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  });

  app.get('/api/auth/me', authenticate, (req: any, res: any) => {
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        createdAt: req.user.createdAt
      }
    });
  });

  app.post('/api/auth/logout', authenticate, async (req: any, res: any) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split('Bearer ')[1];
        await db.deleteAuthSession(token);
      }
      res.json({ success: true });
    } catch (err) {
      console.error('Logout error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Users Management (Super Admin only)
  app.get('/api/users', authenticate, requireRole(['Super Admin']), async (req: any, res: any) => {
    const users = await db.getUsers();
    const sanitized = users.map(u => ({
      id: u.id,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt
    }));
    res.json(sanitized);
  });

  // Create new staff/admin user with auto-generated password (Super Admin only)
  app.post('/api/users', authenticate, requireRole(['Super Admin']), async (req: any, res: any) => {
    const { email, role } = req.body;
    if (!email || !role) {
      return res.status(400).json({ error: 'Email and role are required' });
    }

    const emailNormalized = email.toLowerCase().trim();
    const users = await db.getUsers();
    const existing = users.find(u => u.email === emailNormalized);
    if (existing) {
      return res.status(400).json({ error: 'User with this email already registered' });
    }

    const allowedRoles = ['Super Admin', 'Admin', 'Support Agent', 'User'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const generatedPassword = generateRandomPassword();
    const newUser: User = {
      id: crypto.randomUUID(),
      email: emailNormalized,
      passwordHash: hashPassword(generatedPassword),
      role: role as any,
      createdAt: new Date().toISOString()
    };

    await db.saveUser(newUser);

    res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      },
      generatedPassword,
      mockEmailSent: {
        to: newUser.email,
        subject: 'Delflow Staff Invitation & Credentials',
        body: `Welcome to Delflow! You have been granted access as a staff member with the role of: ${role}.\n\nYour login credentials are:\nEmail: ${newUser.email}\nPassword: ${generatedPassword}\n\nPlease sign in at the Delflow portal to get started.`
      }
    });
  });

  // Delete/Revoke staff user (Super Admin only)
  app.delete('/api/users/:id', authenticate, requireRole(['Super Admin']), async (req: any, res: any) => {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({ error: 'You cannot revoke your own Super Admin access.' });
    }

    const users = await db.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userToDelete = users[index];
    
    // Safety check: do not delete the last remaining Super Admin
    if (userToDelete.role === 'Super Admin') {
      const superAdminsCount = users.filter(u => u.role === 'Super Admin').length;
      if (superAdminsCount <= 1) {
        return res.status(400).json({ error: 'Cannot delete the only remaining Super Admin user.' });
      }
    }

    await db.deleteUser(id);

    // Revoke any active sessions of the deleted user
    await db.deleteUserAuthSessions(id);

    res.json({ success: true, message: `Access for user ${userToDelete.email} has been successfully revoked.` });
  });

  app.put('/api/users/:id/role', authenticate, requireRole(['Super Admin']), async (req: any, res: any) => {
    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = ['Super Admin', 'Admin', 'Support Agent', 'User'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const users = await db.getUsers();
    const user = users.find(u => u.id === id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Ensure we don't accidentally leave the system without any Super Admin
    if (user.role === 'Super Admin' && role !== 'Super Admin') {
      const superAdminsCount = users.filter(u => u.role === 'Super Admin').length;
      if (superAdminsCount <= 1) {
        return res.status(400).json({ error: 'Cannot demote the only remaining Super Admin' });
      }
    }

    user.role = role as any;
    await db.saveUser(user);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  });

  // Public Tracking Endpoint
  app.get('/api/parcels/track/:code', async (req: any, res: any) => {
    const code = req.params.code.trim().toUpperCase();
    const parcels = await db.getParcels();
    const parcel = parcels.find(p => p.trackingNumber.toUpperCase() === code);

    if (!parcel) {
      return res.status(404).json({ error: 'Shipment code not found' });
    }

    const historyAll = await db.getParcelHistory();
    const history = historyAll
      .filter(h => h.parcelId === parcel.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json({ parcel, history });
  });

  // Admin/Staff Parcels Management
  app.get('/api/parcels', authenticate, requireRole(['Super Admin', 'Admin', 'Support Agent']), async (req: any, res: any) => {
    const parcels = await db.getParcels();
    const historyAll = await db.getParcelHistory();
    const parcelsWithHistory = parcels.map(p => {
      const history = historyAll.filter(h => h.parcelId === p.id);
      return { ...p, history };
    });
    res.json(parcelsWithHistory);
  });

  app.post('/api/parcels', authenticate, requireRole(['Super Admin', 'Admin', 'Support Agent']), async (req: any, res: any) => {
    const {
      senderName,
      senderEmail,
      receiverName,
      receiverEmail,
      origin,
      destination,
      currentStatus,
      estimatedDelivery,
      chooseServices,
      historyLocation,
      historyDescription
    } = req.body;

    if (!senderName || !receiverName || !origin || !destination || !currentStatus) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Generate neat tracking number
    const randCode = Math.floor(100000 + Math.random() * 90000).toString();
    const trackingNumber = `DF-${randCode}`;

    const newParcel: Parcel = {
      id: crypto.randomUUID(),
      trackingNumber,
      senderName,
      senderEmail: senderEmail || '',
      receiverName,
      receiverEmail: receiverEmail || '',
      origin,
      destination,
      currentStatus,
      estimatedDelivery: estimatedDelivery || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      chooseServices: chooseServices || 'Road Transport',
      createdAt: new Date().toISOString()
    };

    await db.saveParcel(newParcel);

    // Initial history checkpoint
    const initialHistory: ParcelHistory = {
      id: crypto.randomUUID(),
      parcelId: newParcel.id,
      status: currentStatus,
      location: historyLocation || origin,
      description: historyDescription || `Shipment initialized and registered in system with status: ${currentStatus}`,
      timestamp: new Date().toISOString()
    };

    await db.saveParcelHistory(initialHistory);

    res.status(201).json({ ...newParcel, history: [initialHistory] });
  });

  app.put('/api/parcels/:id/status', authenticate, requireRole(['Super Admin', 'Admin', 'Support Agent']), async (req: any, res: any) => {
    const { id } = req.params;
    const { currentStatus, location, description } = req.body;

    if (!currentStatus) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const parcels = await db.getParcels();
    const parcel = parcels.find(p => p.id === id);
    if (!parcel) {
      return res.status(404).json({ error: 'Parcel not found' });
    }

    parcel.currentStatus = currentStatus;
    await db.saveParcel(parcel);

    const newHistory: ParcelHistory = {
      id: crypto.randomUUID(),
      parcelId: parcel.id,
      status: currentStatus,
      location: location || parcel.origin,
      description: description || `Status updated to ${currentStatus}`,
      timestamp: new Date().toISOString()
    };

    await db.saveParcelHistory(newHistory);

    const historyAll = await db.getParcelHistory();
    res.json({ parcel, history: historyAll.filter(h => h.parcelId === parcel.id) });
  });

  app.delete('/api/parcels/:id', authenticate, requireRole(['Super Admin', 'Admin']), async (req: any, res: any) => {
    const { id } = req.params;
    const parcels = await db.getParcels();
    const parcelIndex = parcels.findIndex(p => p.id === id);

    if (parcelIndex === -1) {
      return res.status(404).json({ error: 'Parcel not found' });
    }

    await db.deleteParcel(id);
    await db.deleteParcelHistoryForParcel(id);

    res.json({ success: true });
  });

  // Real-time Support Chat Endpoints
  // Anonymous Users: Request chat session or retrieve history
  app.post('/api/chat/session', async (req: any, res: any) => {
    const { anonymousSessionId } = req.body;
    let sessionId = anonymousSessionId || crypto.randomUUID();

    const chatSessions = await db.getChatSessions();
    let session = chatSessions.find(s => s.id === sessionId);
    if (!session) {
      session = {
        id: sessionId,
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        status: 'active'
      };
      await db.saveChatSession(session);
      
      // Seed initial greeting message from support
      await db.saveMessage({
        id: crypto.randomUUID(),
        sessionId: session.id,
        senderType: 'agent',
        senderId: 'system',
        senderName: 'Delflow Assistant',
        text: 'Welcome to Delflow Support! How can we help you with your shipments today?',
        timestamp: new Date().toISOString()
      });
    } else if (session.status === 'closed') {
      session.status = 'active';
      session.lastActiveAt = new Date().toISOString();
      await db.saveChatSession(session);
    }

    const messagesAll = await db.getMessages();
    const messages = messagesAll.filter(m => m.sessionId === sessionId);
    res.json({ session, messages });
  });

  app.get('/api/chat/messages/:sessionId', async (req: any, res: any) => {
    const { sessionId } = req.params;
    const messagesAll = await db.getMessages();
    const messages = messagesAll.filter(m => m.sessionId === sessionId);
    res.json(messages);
  });

  app.post('/api/chat/messages', async (req: any, res: any) => {
    const { sessionId, senderType, senderId, senderName, text } = req.body;

    if (!sessionId || !senderType || !text) {
      return res.status(400).json({ error: 'Required message fields missing' });
    }

    // Ensure session exists
    const chatSessions = await db.getChatSessions();
    let session = chatSessions.find(s => s.id === sessionId);
    if (!session) {
      session = {
        id: sessionId,
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        status: 'active'
      };
      await db.saveChatSession(session);
    } else {
      session.lastActiveAt = new Date().toISOString();
      await db.saveChatSession(session);
    }

    const newMessage: Message = {
      id: crypto.randomUUID(),
      sessionId,
      senderType,
      senderId: senderId || 'anonymous',
      senderName: senderName || 'User',
      text,
      timestamp: new Date().toISOString()
    };

    await db.saveMessage(newMessage);

    res.status(201).json(newMessage);
  });

  // Admin Active Support Chats
  app.get('/api/chat/active-sessions', authenticate, requireRole(['Super Admin', 'Admin', 'Support Agent']), async (req: any, res: any) => {
    const chatSessions = await db.getChatSessions();
    const messagesAll = await db.getMessages();
    const activeSessions = chatSessions.filter(s => s.status === 'active');
    const enriched = activeSessions.map(session => {
      const messages = messagesAll.filter(m => m.sessionId === session.id);
      const lastMessage = messages[messages.length - 1] || null;
      return { ...session, messages, lastMessage };
    }).sort((a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime());

    res.json(enriched);
  });

  app.post('/api/chat/sessions/:id/close', authenticate, requireRole(['Super Admin', 'Admin', 'Support Agent']), async (req: any, res: any) => {
    const { id } = req.params;
    const chatSessions = await db.getChatSessions();
    const session = chatSessions.find(s => s.id === id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    session.status = 'closed';
    await db.saveChatSession(session);

    await db.saveMessage({
      id: crypto.randomUUID(),
      sessionId: session.id,
      senderType: 'agent',
      senderId: 'system',
      senderName: 'System',
      text: 'This chat session has been marked as resolved.',
      timestamp: new Date().toISOString()
    });

    res.json({ success: true, session });
  });

  // --- Catch-all for undefined API routes to prevent serving HTML ---
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: `API endpoint not found: ${req.method} ${req.path}` });
  });

  // --- Global Error Handling Middleware ---
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({
      error: err?.message || 'An unexpected server error occurred.',
      stack: process.env.NODE_ENV === 'development' ? err?.stack : undefined
    });
  });

const startDirectServer = async () => {
  // --- Serve Client in Dev vs Prod ---
  if (process.env.NODE_ENV === 'production' || !fs.existsSync(path.join(process.cwd(), 'src'))) {
    // Production Mode: Serve compiled frontend
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Development Mode: Use Vite dev server as middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Delflow logistics fullstack server running at http://0.0.0.0:${PORT}`);
  });
};

if (!process.env.VERCEL) {
  startDirectServer().catch((e) => {
    console.error('Failed to start logistics server:', e);
  });
}

export { app };
