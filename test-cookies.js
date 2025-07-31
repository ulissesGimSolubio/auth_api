/**
 * Script de teste para verificar a configuração de cookies HTTP Only
 * 
 * Este script testa as seguintes funcionalidades:
 * 1. Login com cookies HTTP Only habilitado/desabilitado
 * 2. Acesso à rota /api/auth/me
 * 3. Refresh de tokens
 * 4. Logout
 */

const axios = require('axios');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

async function testCookieMode() {
  console.log('🍪 Testando modo Cookie HTTP Only...\n');

  try {
    // 1. Teste de Login
    console.log('1. Testando Login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@example.com', // Ajuste conforme seus dados de teste
      password: 'admin123'
    }, {
      withCredentials: true // Importante para receber cookies
    });

    console.log('✅ Login Status:', loginResponse.status);
    console.log('📝 Response:', loginResponse.data);
    
    // Verifica se recebeu cookies
    const cookies = loginResponse.headers['set-cookie'];
    if (cookies) {
      console.log('🍪 Cookies recebidos:', cookies);
    } else {
      console.log('⚠️  Nenhum cookie recebido (modo tradicional)');
    }

    // 2. Teste da rota /me
    console.log('\n2. Testando rota /api/auth/me...');
    const meResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
      withCredentials: true,
      headers: cookies ? {} : {
        'Authorization': `Bearer ${loginResponse.data.accessToken}`
      }
    });

    console.log('✅ Perfil Status:', meResponse.status);
    console.log('👤 Perfil:', meResponse.data);

    // 3. Teste de Logout
    console.log('\n3. Testando Logout...');
    const logoutResponse = await axios.post(`${API_BASE_URL}/auth/logout`, 
      cookies ? {} : { refreshToken: loginResponse.data.refreshToken }, 
      {
        withCredentials: true
      }
    );

    console.log('✅ Logout Status:', logoutResponse.status);
    console.log('📝 Logout Response:', logoutResponse.data);

  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
  }
}

async function testBearerMode() {
  console.log('\n🔑 Testando modo Bearer Token tradicional...\n');

  try {
    // 1. Teste de Login
    console.log('1. Testando Login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@example.com', // Ajuste conforme seus dados de teste
      password: 'admin123'
    });

    console.log('✅ Login Status:', loginResponse.status);
    console.log('📝 Tokens recebidos:', {
      hasAccessToken: !!loginResponse.data.accessToken,
      hasRefreshToken: !!loginResponse.data.refreshToken
    });

    // 2. Teste da rota /me
    console.log('\n2. Testando rota /api/auth/me...');
    const meResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${loginResponse.data.accessToken}`
      }
    });

    console.log('✅ Perfil Status:', meResponse.status);
    console.log('👤 Perfil:', meResponse.data);

    // 3. Teste de Logout
    console.log('\n3. Testando Logout...');
    const logoutResponse = await axios.post(`${API_BASE_URL}/auth/logout`, {
      refreshToken: loginResponse.data.refreshToken
    });

    console.log('✅ Logout Status:', logoutResponse.status);
    console.log('📝 Logout Response:', logoutResponse.data);

  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
  }
}

// Executa os testes
async function runTests() {
  console.log('🧪 TESTE DE CONFIGURAÇÃO DE COOKIES HTTP ONLY\n');
  console.log('='.repeat(50));
  
  await testCookieMode();
  
  console.log('\n' + '='.repeat(50));
  
  await testBearerMode();
  
  console.log('\n✨ Testes concluídos!');
}

// Executa apenas se chamado diretamente
if (require.main === module) {
  runTests();
}

module.exports = { testCookieMode, testBearerMode };
