/* =======================================================================
 * CONFIGURAÇÃO E INICIALIZAÇÃO DO FIREBASE (BACKEND-AS-A-SERVICE)
 * ======================================================================= */

// ==========================================
// 1. IMPORTAÇÃO DOS MÓDULOS DO FIREBASE (CDN)
// ==========================================
// Utilizamos a versão modular (v10+) para otimização de performance.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// ==========================================
// 2. CREDENCIAIS DO PROJETO (CHAVES PÚBLICAS)
// ==========================================
// NOTA TÉCNICA DE SEGURANÇA: Em aplicações hospedadas estaticamente (GitHub Pages), 
// é padrão e esperado que essas chaves fiquem visíveis no código-fonte do navegador. 
// A proteção dos dados contra hackers deve ser feita OBRIGATORIAMENTE através das 
// "Firebase Security Rules" direto no painel do Firebase, e não ocultando chaves.
const firebaseConfig = {
  apiKey: "AIzaSyDlLP8kRaLVsnqQ-BHnFa6_neoEklqWT9c",
  authDomain: "feira-da-quebrada.firebaseapp.com",
  databaseURL: "https://feira-da-quebrada-default-rtdb.firebaseio.com",
  projectId: "feira-da-quebrada",
  storageBucket: "feira-da-quebrada.firebasestorage.app",
  messagingSenderId: "109312191536",
  appId: "1:109312191536:web:a4d382be3c353d2199d1f5",
  measurementId: "G-7V93SNZJ2D"
};

// ==========================================
// 3. INICIALIZAÇÃO E EXPORTAÇÃO
// ==========================================
// Inicializa a aplicação principal com as credenciais fornecidas
const app = initializeApp(firebaseConfig);

// Exporta os serviços de Autenticação e Banco de Dados para serem 
// importados e consumidos pelos outros arquivos da plataforma (ex: painel.js).
export const auth = getAuth(app);
export const db = getDatabase(app);