// Script para copiar arquivos do PWA para a pasta dist
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Definir caminhos
const publicDir = path.join(__dirname, '..', 'public');
const distDir = path.join(__dirname, '..', 'dist');

// Função para copiar pasta recursivamente
function copyFolderRecursiveSync(source, target) {
  // Verificar se o diretório de destino existe
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  // Ler os arquivos no diretório de origem
  const files = fs.readdirSync(source);

  // Copiar cada arquivo para o destino
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);

    // Se for diretório, copia recursivamente
    if (fs.lstatSync(sourcePath).isDirectory()) {
      copyFolderRecursiveSync(sourcePath, targetPath);
    } else {
      // Copiar arquivo
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

// Função para copiar um arquivo
function copyFileSync(source, target) {
  // Garantir que o diretório de destino exista
  const targetDir = path.dirname(target);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Copiar o arquivo
  fs.copyFileSync(source, target);
}

// Executar as cópias
try {
  // Copiar a pasta icons
  const iconsSource = path.join(publicDir, 'icons');
  const iconsTarget = path.join(distDir, 'icons');
  if (fs.existsSync(iconsSource)) {
    copyFolderRecursiveSync(iconsSource, iconsTarget);
    console.log('✅ Pasta icons copiada com sucesso');
  } else {
    console.warn('⚠️ Pasta icons não encontrada em public');
  }

  // Copiar offline.html
  const offlineSource = path.join(publicDir, 'offline.html');
  const offlineTarget = path.join(distDir, 'offline.html');
  if (fs.existsSync(offlineSource)) {
    copyFileSync(offlineSource, offlineTarget);
    console.log('✅ Arquivo offline.html copiado com sucesso');
  } else {
    console.warn('⚠️ Arquivo offline.html não encontrado em public');
  }

  // Copiar manifest.json
  const manifestSource = path.join(publicDir, 'manifest.json');
  const manifestTarget = path.join(distDir, 'manifest.json');
  if (fs.existsSync(manifestSource)) {
    copyFileSync(manifestSource, manifestTarget);
    console.log('✅ Arquivo manifest.json copiado com sucesso');
  } else {
    console.warn('⚠️ Arquivo manifest.json não encontrado em public');
  }

  console.log('🎉 Todos os arquivos PWA foram copiados com sucesso!');
} catch (err) {
  console.error('❌ Erro ao copiar arquivos:', err);
  process.exit(1);
} 