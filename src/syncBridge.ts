import {
  fetchUsersFromFirestore,
  saveUserToFirestore,
  deleteUserFromFirestore,
  seedInitialUsersIfEmpty,
  fetchProjectsFromFirestore,
  saveProjectToFirestore,
  seedInitialProjectIfEmpty,
  fetchSnapshotsFromFirestore,
  saveSnapshotToFirestore,
  deleteSnapshotFromFirestore,
  type FTTHUser,
  type FTTHProject,
  type FTTHSnapshot
} from './database';

declare global {
  interface Window {
    __FTTH_INTERNAL__?: {
      React: any;
      AuthProvider: any;
      MainApp: any;
      defaultUsers: FTTHUser[];
      defaultProject: FTTHProject;
      AuthContext: any;
    };
    __FTTH_SAVE_USER__?: (user: FTTHUser) => void;
    __FTTH_DELETE_USER__?: (userId: string) => void;
    __FTTH_SYNC_PROJECT__?: (project: FTTHProject) => void;
    __FTTH_SAVE_SNAPSHOT__?: (snapshot: FTTHSnapshot) => void;
    __FTTH_DELETE_SNAPSHOT__?: (snapshotId: string) => void;
    __FTTH_SNAPSHOTS_LOADED__?: boolean;
    __FTTH_CUSTOM_ROOT__?: boolean;
  }
}

const LOCAL_STORAGE_USERS_KEY = "ftth_telecom_users_v3";
const LOCAL_STORAGE_PROJECTS_KEY = "ftth_telecom_projects_list_v2";
const LOCAL_STORAGE_ACTIVE_PROJECT_KEY = "ftth_telecom_active_project_id_v2";
const LOCAL_STORAGE_SNAPSHOTS_KEY = "ftth_project_snapshots_v1";

export async function initializeFirestoreSync(): Promise<void> {
  // Bind global hooks used inside the core app bundle
  window.__FTTH_SAVE_USER__ = (user: FTTHUser) => {
    saveUserToFirestore(user).catch(err => console.error('Firestore saveUser error:', err));
  };

  window.__FTTH_DELETE_USER__ = (userId: string) => {
    deleteUserFromFirestore(userId).catch(err => console.error('Firestore deleteUser error:', err));
  };

  window.__FTTH_SYNC_PROJECT__ = (project: FTTHProject) => {
    saveProjectToFirestore(project).catch(err => console.error('Firestore saveProject error:', err));
  };

  window.__FTTH_SAVE_SNAPSHOT__ = (snapshot: FTTHSnapshot) => {
    saveSnapshotToFirestore(snapshot).catch(err => console.error('Firestore saveSnapshot error:', err));
  };

  window.__FTTH_DELETE_SNAPSHOT__ = (snapshotId: string) => {
    deleteSnapshotFromFirestore(snapshotId).catch(err => console.error('Firestore deleteSnapshot error:', err));
  };

  try {
    // 1. Sincroniza Usuários do Firestore com o cache da sessão
    const defaultUsers = window.__FTTH_INTERNAL__?.defaultUsers || [
      {
        id: "user_portalnet_admin",
        username: "portalnet",
        name: "PortalNet Administrador",
        role: "admin",
        password: "10302040",
        email: "admin@portalnet.com.br",
        avatarColor: "#8b5cf6"
      },
      {
        id: "user_tecnico_op",
        username: "tecnico",
        name: "Técnico de Campo FTTH",
        role: "tecnico",
        password: "88197052",
        email: "tecnico@ftth-telecom.com.br",
        avatarColor: "#06b6d4"
      },
      {
        id: "user_visualizador_demo",
        username: "visualizador",
        name: "Visitante / Consulta",
        role: "visualizador",
        password: "88197052",
        email: "visitante@ftth-telecom.com.br",
        avatarColor: "#10b981"
      }
    ];

    const cloudUsers = await seedInitialUsersIfEmpty(defaultUsers);
    if (cloudUsers && cloudUsers.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(cloudUsers));
    }

    // 2. Sincroniza Projetos de Rede do Firestore
    const defaultProj = window.__FTTH_INTERNAL__?.defaultProject;
    if (defaultProj) {
      const cloudProjects = await seedInitialProjectIfEmpty(defaultProj);
      if (cloudProjects && cloudProjects.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(cloudProjects));
        if (!localStorage.getItem(LOCAL_STORAGE_ACTIVE_PROJECT_KEY)) {
          localStorage.setItem(LOCAL_STORAGE_ACTIVE_PROJECT_KEY, cloudProjects[0].id);
        }
      }
    } else {
      const cloudProjects = await fetchProjectsFromFirestore();
      if (cloudProjects && cloudProjects.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(cloudProjects));
      }
    }

    // 3. Sincroniza Snapshots / Histórico de Versões do Firestore
    const activeProjectId = localStorage.getItem(LOCAL_STORAGE_ACTIVE_PROJECT_KEY) || "proj-cg-pb";
    const cloudSnapshots = await fetchSnapshotsFromFirestore(activeProjectId);
    if (cloudSnapshots && cloudSnapshots.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_SNAPSHOTS_KEY, JSON.stringify(cloudSnapshots));
    }

    console.info('✅ Banco de dados Firestore sincronizado com sucesso para usuários, projetos e histórico.');
  } catch (err) {
    console.error('Falha na inicialização do Firestore:', err);
  }
}
