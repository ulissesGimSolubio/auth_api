#!/bin/bash

DB_NAME="agendei_api"
DB_USER="postgres"

echo "🚨 Este script irá RESETAR COMPLETAMENTE o banco '$DB_NAME'."
read -p "Tem certeza que deseja continuar? (s/N): " confirm

if [[ "$confirm" != "s" && "$confirm" != "S" ]]; then
  echo "❌ Operação cancelada."
  exit 1
fi

echo "✅ Encerrando sessões ativas no banco $DB_NAME..."
sudo -u $DB_USER psql -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME' AND pid <> pg_backend_pid();"

echo "🧨 Apagando banco $DB_NAME..."
sudo -u $DB_USER psql -c "DROP DATABASE IF EXISTS $DB_NAME;"

echo "📦 Recriando banco $DB_NAME..."
sudo -u $DB_USER psql -c "CREATE DATABASE $DB_NAME;"

echo "🧹 Removendo migrações existentes..."
rm -rf prisma/migrations

echo "⚙️ Rodando npx prisma migrate dev --name init"
npx prisma migrate dev --name init

echo "🔁 Gerando client do Prisma..."
npx prisma generate

echo "🌱 Rodando seed (multi-tenant)..."
npm run multitenancy:seed

echo "🎉 Banco resetado com sucesso."
