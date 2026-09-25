import {
  db,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot
} from './firebase';

export interface FTTHUser {
  id: string;
  username: string;
  password?: string;
  name: string;
  email?: string;
  role: 'admin' | 'tecnico' | 'visualizador';
  avatarColor?: string;
  avatarUrl?: string;
  allowedProjectIds?: string[];
  customPermissions?: any;
  createdAt?: string;
  lastLogin?: string;
}

export interface FTTHProject {
  id: string;
  name: string;
  description?: string;
  city?: string;
  state?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  cables?: any[];
  pops?: any[];
  ceos?: any[];
  ctos?: any[];
  technicalSlacks?: any[];
  poles?: any[];
  lastModified?: string;
  updatedAt?: string;
  updatedBy?: string;
  [key: string]: any;
}

export interface FTTHSnapshot {
  id: string;
  projectId: string;
  label: string;
  timestamp: string;
  user: string;
  nodesCount: number;
  cablesCount: number;
  projectData: FTTHProject;
}

const USERS_COL = 'users';
const PROJECTS_COL = 'projects';
const SNAPSHOTS_COL = 'snapshots';

// --- USUÁRIOS NO BANCO DE DADOS (FIRESTORE) ---

export async function fetchUsersFromFirestore(): Promise<FTTHUser[]> {
  try {
    const colRef = collection(db, USERS_COL);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const users: FTTHUser[] = [];
      snap.forEach(d => {
        users.push(d.data() as FTTHUser);
      });
      return users;
    }
  } catch (err) {
    console.error('Erro ao buscar usuários do Firestore:', err);
  }
  return [];
}

export async function saveUserToFirestore(user: FTTHUser): Promise<void> {
  try {
    const userDocRef = doc(db, USERS_COL, user.id);
    await setDoc(userDocRef, user, { merge: true });
  } catch (err) {
    console.error(`Erro ao salvar usuário ${user.username} no Firestore:`, err);
  }
}

export async function deleteUserFromFirestore(userId: string): Promise<void> {
  try {
    const userDocRef = doc(db, USERS_COL, userId);
    await deleteDoc(userDocRef);
  } catch (err) {
    console.error(`Erro ao deletar usuário ${userId} no Firestore:`, err);
  }
}

export async function seedInitialUsersIfEmpty(defaultUsers: FTTHUser[]): Promise<FTTHUser[]> {
  try {
    const existing = await fetchUsersFromFirestore();
    if (existing.length > 0) {
      return existing;
    }
    // Grava usuários iniciais no Firestore
    for (const u of defaultUsers) {
      await saveUserToFirestore(u);
    }
    return defaultUsers;
  } catch (err) {
    console.warn('Falha no seed de usuários:', err);
    return defaultUsers;
  }
}

// --- PROJETOS E DADOS DA REDE NO BANCO DE DADOS (FIRESTORE) ---

export async function fetchProjectsFromFirestore(): Promise<FTTHProject[]> {
  try {
    const colRef = collection(db, PROJECTS_COL);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list: FTTHProject[] = [];
      snap.forEach(d => {
        list.push(d.data() as FTTHProject);
      });
      return list;
    }
  } catch (err) {
    console.error('Erro ao buscar projetos do Firestore:', err);
  }
  return [];
}

let saveProjectDebounceTimer: any = null;

export async function saveProjectToFirestore(project: FTTHProject, immediate = false): Promise<void> {
  if (!project || !project.id) return;

  const doSave = async () => {
    try {
      const projectDocRef = doc(db, PROJECTS_COL, project.id);
      const cleanData = JSON.parse(JSON.stringify(project));
      cleanData.updatedAt = new Date().toISOString();
      await setDoc(projectDocRef, cleanData, { merge: true });
      window.dispatchEvent(new CustomEvent('ftth_cloud_synced', { detail: { id: project.id, time: new Date() } }));
    } catch (err) {
      console.error(`Erro ao salvar projeto ${project.name} no Firestore:`, err);
    }
  };

  if (immediate) {
    if (saveProjectDebounceTimer) clearTimeout(saveProjectDebounceTimer);
    await doSave();
  } else {
    if (saveProjectDebounceTimer) clearTimeout(saveProjectDebounceTimer);
    saveProjectDebounceTimer = setTimeout(doSave, 800);
  }
}

export async function deleteProjectFromFirestore(projectId: string): Promise<void> {
  try {
    const projectDocRef = doc(db, PROJECTS_COL, projectId);
    await deleteDoc(projectDocRef);
  } catch (err) {
    console.error(`Erro ao deletar projeto ${projectId} no Firestore:`, err);
  }
}

export async function seedInitialProjectIfEmpty(defaultProject: FTTHProject): Promise<FTTHProject[]> {
  try {
    const existing = await fetchProjectsFromFirestore();
    if (existing.length > 0) {
      return existing;
    }
    if (defaultProject && defaultProject.id) {
      await saveProjectToFirestore(defaultProject, true);
      return [defaultProject];
    }
  } catch (err) {
    console.warn('Falha no seed de projetos:', err);
  }
  return defaultProject ? [defaultProject] : [];
}

// --- HISTÓRICO DE VERSÕES / SNAPSHOTS NO BANCO DE DADOS (FIRESTORE) ---

export async function fetchSnapshotsFromFirestore(projectId: string): Promise<FTTHSnapshot[]> {
  try {
    const colRef = collection(db, SNAPSHOTS_COL);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list: FTTHSnapshot[] = [];
      snap.forEach(d => {
        const item = d.data() as FTTHSnapshot;
        if (item.projectId === projectId) {
          list.push(item);
        }
      });
      return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
  } catch (err) {
    console.error('Erro ao buscar snapshots do Firestore:', err);
  }
  return [];
}

export async function saveSnapshotToFirestore(snapshot: FTTHSnapshot): Promise<void> {
  try {
    const docRef = doc(db, SNAPSHOTS_COL, snapshot.id);
    const cleanData = JSON.parse(JSON.stringify(snapshot));
    await setDoc(docRef, cleanData);
  } catch (err) {
    console.error('Erro ao salvar snapshot no Firestore:', err);
  }
}

export async function deleteSnapshotFromFirestore(snapshotId: string): Promise<void> {
  try {
    const docRef = doc(db, SNAPSHOTS_COL, snapshotId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Erro ao deletar snapshot no Firestore:', err);
  }
}
