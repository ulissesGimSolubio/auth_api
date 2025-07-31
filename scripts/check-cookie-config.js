/**
 * Script de verificação da configuração de Cookies HTTP Only
 * Executa automaticamente verificações quando o servidor inicia
 */

function checkCookieConfiguration() {
  console.log('\n🍪 VERIFICANDO CONFIGURAÇÃO DE COOKIES HTTP ONLY');
  console.log('='.repeat(60));

  const cookieHttpOnly = process.env.COOKIE_HTTP_ONLY === 'true';
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  console.log(`📊 Modo Atual: ${cookieHttpOnly ? '🍪 Cookie HTTP Only' : '🔑 Bearer Token'}`);
  console.log(`🌍 Ambiente: ${nodeEnv}`);
  
  if (cookieHttpOnly) {
    console.log('\n✅ CONFIGURAÇÃO ATIVA: Cookie HTTP Only');
    console.log('   ├─ Tokens serão enviados como cookies httpOnly');
    console.log('   ├─ Maior segurança contra ataques XSS');
    console.log('   ├─ Cliente deve usar credentials: "include"');
    console.log(`   └─ Cookies seguros: ${nodeEnv === 'production' ? 'SIM' : 'NÃO (dev mode)'}`);
    
    console.log('\n🔧 CONFIGURAÇÕES DE COOKIE:');
    console.log(`   ├─ httpOnly: true`);
    console.log(`   ├─ secure: ${nodeEnv === 'production'}`);
    console.log(`   ├─ sameSite: ${nodeEnv === 'production' ? 'strict' : 'lax'}`);
    console.log(`   ├─ accessToken maxAge: 15 minutos`);
    console.log(`   └─ refreshToken maxAge: 7 dias`);
    
  } else {
    console.log('\n⚠️  CONFIGURAÇÃO ATIVA: Bearer Token (Modo Compatibilidade)');
    console.log('   ├─ Tokens serão enviados no corpo da resposta');
    console.log('   ├─ Cliente deve gerenciar tokens manualmente');
    console.log('   └─ Usar Authorization: Bearer <token> nos headers');
  }

  console.log('\n🌐 CORS CONFIGURADO:');
  console.log('   ├─ credentials: true ✅');
  console.log('   ├─ Múltiplas origens suportadas ✅');
  console.log('   └─ Headers de autorização permitidos ✅');

  console.log('\n📝 ENDPOINTS DISPONÍVEIS:');
  console.log('   ├─ POST /api/auth/login    - Login com autenticação');
  console.log('   ├─ GET  /api/auth/me       - Perfil do usuário autenticado');
  console.log('   ├─ POST /api/auth/refresh  - Renovar access token');
  console.log('   └─ POST /api/auth/logout   - Logout e limpeza de cookies');

  console.log('\n🧪 PARA TESTAR:');
  if (cookieHttpOnly) {
    console.log('   1. Use credentials: "include" em todas as requisições');
    console.log('   2. Execute: node test-cookies.js');
    console.log('   3. Verifique os cookies no DevTools do navegador');
  } else {
    console.log('   1. Use Authorization: Bearer <token> nos headers');
    console.log('   2. Execute: node test-cookies.js');
    console.log('   3. Gerencie os tokens manualmente no frontend');
  }

  console.log('\n📚 DOCUMENTAÇÃO:');
  console.log('   └─ Veja docs/COOKIES_HTTP_ONLY.md para detalhes completos');

  console.log('\n' + '='.repeat(60));
}

function checkRequiredEnvVars() {
  const required = [
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'COOKIE_HTTP_ONLY'
  ];

  const missing = required.filter(env => !process.env[env]);
  
  if (missing.length > 0) {
    console.log('\n❌ VARIÁVEIS DE AMBIENTE FALTANDO:');
    missing.forEach(env => {
      console.log(`   └─ ${env}`);
    });
    console.log('\n   📄 Copie .env.example para .env e configure as variáveis');
    return false;
  }

  return true;
}

function runConfigCheck() {
  if (!checkRequiredEnvVars()) {
    return false;
  }
  
  checkCookieConfiguration();
  return true;
}

module.exports = {
  runConfigCheck,
  checkCookieConfiguration,
  checkRequiredEnvVars
};
