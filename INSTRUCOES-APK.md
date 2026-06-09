# +MAIS POWER — Guia para gerar o APK

O jogo já está completo com:
✅ Hand grip SVG com animações 3D
✅ Timer crescente 3:00 (ou 2:30 com pergunta)
✅ Bónus até 5:30
✅ Barras de Força e Resistência
✅ Aba de Balanço com capital inicial
✅ PWA (funciona offline no Chrome)
✅ Capacitor (para gerar APK nativo)

---

## 📲 Opção 1 — PWA (mais rápida, já funciona)

O jogo já é uma **PWA (Progressive Web App)**. No teu Samsung A05s:

1. Abre o Chrome e acede ao link do jogo
2. Carrega no menu ⋮ (três pontos) → **Adicionar ao ecrã inicial**
3. O ícone aparece no teu telefone como uma app normal
4. Funcina offline depois de carregar uma vez

Se já tentaste e não funcionou, segue a **Opção 2** abaixo.

---

## 📲 Opção 2 — APK com Capacitor (Android nativo)

### No teu computador (Windows/Linux/Mac):

**1. Instalar Node.js** (se não tiver)
https://nodejs.org (versão 18 ou superior)

**2. Instalar Android Studio** (para o Android SDK)
https://developer.android.com/studio

Depois de instalar o Android Studio, abre e vai a:
- More Actions → SDK Manager
- Instala o SDK da plataforma Android (Android 14 / API 34)

**3. Prepara o projecto**

No teu computador, cria uma pasta `+MAIS_POWER` e cola **todo o conteúdo deste ZIP** dentro dela.

Abre o terminal/CMD dentro dessa pasta e executa:

```bash
# Instalar dependências
npm install

# Construir a web app
npm run build

# Sincronizar com Android
npx cap sync android
```

**4. Gerar o APK**

```bash
# Abrir no Android Studio
npx cap open android
```

No Android Studio:
- Espera carregar (pode demorar na primeira vez)
- Vai a **Build → Build Bundle(s) / APK(s) → Build APK(s)**
- O APK aparece em: `android/app/build/debug/app-debug.apk`

**5. Instalar no telefone**

- Envia o `app-debug.apk` para o teu telefone (WhatsApp, email, cabo USB)
- No telefone, abre o ficheiro APK e permite "Instalar de fontes desconhecidas"

---

## ⚙️ Alternativa rápida (só o APK)

Se não quiseres instalar o Android Studio, usa esta ferramenta online grátis:

1. Faz upload desta pasta ZIP para: https://app.netlify.com/drag-and-drop
2 Ou usa https://app.netlify.com/drop (solta a pasta)
3. Obténs um link online funcional com PWA

**Mas para APK mesmo, precisas do Android Studio no computador.**

---

## 🎮 Como jogar

1. Define o valor da aposta (Kz 100 – Kz 500.000)
2. Carrega em **APERTADO 💪** e segura o grip
3. Não soltes! A barra de Força enche em 30s, a Resistência vai até 3:00
4. Se aguentares 3:00 (ou 2:30 se acertaste pergunta), ganhas 3× o valor
5. Se a aposta for ≥ Kz 500, podes tentar o Bónus até 5:30
6. Vê o teu balanço na aba BALANÇO

Boa sorte! 💪🏾🔥
