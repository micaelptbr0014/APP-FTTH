import './index-imported.css';
import './index-CmeVClRL.js';
import { initializeFirestoreSync } from './syncBridge';

// Inicializa a integração persistente com Firestore (Usuários, Projetos e Histórico da Rede)
initializeFirestoreSync().catch(err => {
  console.error('Erro na sincronização inicial do Firestore:', err);
});
