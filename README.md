# AgencyOS — Ton agence d'agents IA en local

Un dashboard multi-agents propulse par Claude. Chaque agent a sa personnalite, ses skills et son domaine d'expertise. Tu leur parles en chat, ils repondent en streaming avec acces a tes fichiers locaux. Zero cloud, tout tourne sur ta machine.

## Agents inclus

| Agent | Role | Specialite |
|-------|------|-----------|
| SEOmar | Analyste SEO | Audits techniques, maillage interne, E-E-A-T, Core Web Vitals |
| Bullshito | Expert LinkedIn | Scoring de posts (/100), redaction optimisee algorithme, anti-IA |
| Coach | Preparateur physique | Programmes musculation, nutrition, recuperation |
| Chef | Cuisinier personnel | Recettes, meal prep, equilibre nutritionnel |
| Alfred | Assistant personnel | Organisation, recherche, admin, productivite |

Chaque agent a son propre `CLAUDE.md` (personnalite + regles) et un dossier `skills/` avec ses fichiers de reference.

## Stack

- **Frontend** : Next.js 15 + React 19 + Tailwind CSS + TypeScript
- **Backend** : API Routes Next.js, streaming NDJSON
- **IA** : Claude CLI (Anthropic) — chaque chat spawn un process Claude avec le contexte de l'agent
- **Zero base de donnees** : conversations stockees en JSON local (`.data/`)

## Prerequis

- **Node.js 20.6+** (pour `--env-file` natif)
- **Claude CLI** installe et authentifie ([guide d'installation](https://docs.anthropic.com/en/docs/claude-code/overview))
- **Cle API Anthropic** configuree dans Claude CLI

### Installer Claude CLI

```bash
# macOS / Linux
npm install -g @anthropic-ai/claude-code

# Verifier l'installation
claude --version

# Premiere connexion (configure la cle API)
claude
```

## Installation

```bash
# 1. Cloner le repo
git clone <url-du-repo> qg
cd qg

# 2. Installer les dependances
npm install

# 3. Configurer l'environnement
cp .env.example .env
```

Edite `.env` si besoin :

```bash
# Chemin vers le binaire Claude (optionnel si claude est dans le PATH)
# CLAUDE_BIN=/usr/local/bin/claude

# Dossier agents (default: ./agents dans le repo)
# AGENTS_DIR=./agents

# Dossier clients (default: ./clients dans le repo)
# CLIENTS_DIR=./clients
```

## Personnaliser les agents

### Bullshito (obligatoire pour le scoring LinkedIn)

Edite `agents/bullshito/skills/profil.md` avec ton vrai profil :

```
- Qui tu es (metier, experience)
- Ton parcours avec chiffres cles
- Tes avantages concurrentiels
- Tes sujets d'expertise LinkedIn
- Ton ton et ta personnalite
```

Sans ce fichier rempli, Bullshito ne peut pas scorer correctement tes idees (il n'a aucun contexte sur ta credibilite et tes sujets).

### Coach

Edite `agents/coach/programme.md` avec ton programme d'entrainement, tes objectifs et ton equipement.

### Autres agents

Les agents Chef, Alfred et SEOmar fonctionnent directement. Tu peux personnaliser leur `CLAUDE.md` si tu veux ajuster leur personnalite.

## Lancement

```bash
# Developpement (avec hot reload)
npm run dev

# Ou via le script
./start.sh
```

Le QG demarre sur **http://localhost:3333**.

## Utilisation

### Chat
- Selectionne un agent dans la sidebar
- Pose ta question — la reponse arrive en streaming
- L'agent peut lire/ecrire des fichiers, lancer des commandes, chercher sur le web

### Clients (optionnel)
- Cree un dossier dans `clients/` (copie `clients/_template/`)
- Remplis le `CLAUDE.md` du client
- Selectionne le client dans le chat — l'agent aura le contexte du dossier client

### Skills
- Visualise les competences de chaque agent
- Les skills sont les fichiers `.md` dans `agents/<nom>/skills/`
- Tu peux en ajouter ou modifier via l'interface ou directement dans les fichiers

## Structure

```
qg/
├── app/                    # Pages et API Routes Next.js
│   └── api/
│       ├── chat/           # Endpoint streaming (POST, NDJSON)
│       ├── conversations/  # CRUD conversations
│       ├── clients/        # Gestion clients
│       └── agents/         # Skills et personnalites
├── components/             # UI React (ChatPanel, Sidebar, etc.)
├── lib/                    # Config agents + clients
├── agents/                 # Dossiers des agents
│   ├── bullshito/          # Expert LinkedIn
│   │   ├── CLAUDE.md       # Personnalite + regles
│   │   └── skills/         # Fichiers de reference
│   ├── seo/                # Analyste SEO (8 skills)
│   ├── coach/              # Preparateur physique
│   ├── chef/               # Cuisinier
│   └── alfred/             # Assistant personnel
├── clients/                # Dossiers clients
│   └── _template/          # Template nouveau client
├── .data/                  # Conversations et uploads (cree au runtime)
├── .env.example            # Template variables d'environnement
└── start.sh                # Script de lancement
```

## Ajouter un agent

1. Cree un dossier dans `agents/<nom>/`
2. Ajoute un `CLAUDE.md` (personnalite, regles, format de reponse)
3. Ajoute un dossier `skills/` avec tes fichiers de reference
4. Ajoute l'agent dans `lib/agents.ts` (id, nom, role, emoji, couleur, skills)
5. Relance le QG

## FAQ

**Le chat est lent a demarrer ?**
Normal — le premier message spawn un process Claude CLI. Les messages suivants dans la meme conversation sont plus rapides.

**Les requetes sont traitees une par une ?**
Oui, par design. Une queue serialise les appels Claude CLI pour eviter les conflits. Si tu envoies 2 messages, le 2e attend que le 1er finisse.

**Je peux utiliser GPT-4 / Gemini a la place ?**
Non, le QG depend de Claude CLI. Il faudrait reecrire la route `/api/chat` pour utiliser un autre provider.

**Mes conversations sont stockees ou ?**
En local dans `.data/conversations/` (fichiers JSON). Rien n'est envoye a un serveur externe (sauf les appels API Claude).
