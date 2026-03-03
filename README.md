# QG — Quartier General

Un dashboard multi-agents IA qui tourne en local. Chaque agent a sa personnalite, ses connaissances et ses outils. Tu leur parles en chat, ils repondent en streaming avec acces a tes fichiers. Zero cloud, tout reste sur ta machine.

> Propulse par Claude (Anthropic). Necessite Claude CLI installe en local.


## Sommaire

- [Demarrage rapide](#demarrage-rapide)
- [Les agents](#les-agents)
- [Le chat](#le-chat)
- [Les clients](#les-clients)
- [Les skills (base de connaissances)](#les-skills)
- [Enrichissement depuis le chat](#enrichissement-depuis-le-chat)
- [Les services MCP](#les-services-mcp)
- [Structure des donnees](#structure-des-donnees)
- [Personnalisation](#personnalisation)
- [FAQ](#faq)


## Demarrage rapide

### Prerequis

- **Node.js 20.6+**
- **Claude CLI** installe et authentifie

```bash
# Installer Claude CLI
npm install -g @anthropic-ai/claude-code

# Verifier
claude --version

# Premiere connexion (configure la cle API)
claude
```

### Installation

```bash
git clone <url-du-repo> qg
cd qg
npm install
cp .env.example .env
```

### Lancement

```bash
npm run dev
```

Le QG demarre sur **http://localhost:3333**.


## Les agents

Un agent est un assistant IA avec une identite propre : un nom, un role, une personnalite et des connaissances specifiques.

### Agents inclus

| Agent | Role | Ce qu'il sait faire |
|-------|------|---------------------|
| David (SEO) | Analyste SEO Senior | Audits techniques, maillage interne, E-E-A-T, Core Web Vitals, donnees structurees |
| Bullshito | Expert LinkedIn | Scoring de posts (/100), redaction optimisee algorithme, style anti-IA |
| Coach | Preparateur physique | Programmes musculation, nutrition, recuperation |
| Chef | Cuisinier personnel | Recettes, meal prep, equilibre nutritionnel |
| Alfred | Assistant personnel | Organisation, recherche, admin, productivite |

### Creer un agent

Deux methodes :

**Depuis l'interface** : bouton "Nouvel agent" en bas de la sidebar. Un assistant en 3 etapes guide la creation (nom, role, emoji, couleur, personnalite).

**Manuellement** : creer un dossier dans `agents/`, y placer un `agent.json` (metadonnees) et un `CLAUDE.md` (personnalite et regles).

### Ce qui definit un agent

| Element | Role | Ou le modifier |
|---------|------|----------------|
| Personnalite (`CLAUDE.md`) | Definit comment l'agent se comporte, ses regles, son ton | Onglet Config > Personnalite |
| Skills (fichiers `.md`) | Sa base de connaissances, ce qu'il sait | Onglet Config > Skills |
| Services MCP | Outils externes (API, bases de donnees...) | Onglet Config > Services |
| Identite (nom, emoji, couleur) | Visuel dans l'interface | `agent.json` |


## Le chat

### Envoyer un message

Selectionne un agent dans la sidebar, tape ton message, envoie. La reponse arrive en temps reel (streaming). Tu vois l'agent reflechir (bloc de reflexion depliable) et utiliser ses outils si besoin.

### Joindre des fichiers

Clique l'icone trombone ou glisse des fichiers dans la zone de saisie. Formats supportes : CSV, PDF, Excel, Word, JSON, HTML, XML. L'agent peut lire et analyser ces fichiers.

### Historique

Toutes les conversations sont sauvegardees automatiquement. Elles apparaissent dans la sidebar triees par date. Le champ de recherche (ou `Cmd+K`) filtre par titre ou nom d'agent.

### Changer d'agent

Le selecteur d'agent dans le header du chat permet de changer d'agent en cours de conversation.

### Capacites de l'agent en chat

L'agent peut :
- Lire et ecrire des fichiers sur ta machine
- Lancer des commandes terminal
- Chercher sur le web
- Utiliser ses outils MCP (si configures)
- Acceder au contexte client (si un client est selectionne)


## Les clients

Les clients permettent de donner du contexte a l'agent sur un dossier en cours. Quand un client est selectionne dans le chat, l'agent recoit automatiquement les informations du client (objectifs, fichiers, notes).

### Creer un client

Page Clients > bouton "Nouveau client". Renseigne le nom, le secteur et l'URL. Un dossier est cree avec un fichier `CLAUDE.md` (la fiche du client).

### Fiche client

Chaque client a trois zones :

- **Infos** : objectifs, repertoire de travail, statut du CLAUDE.md
- **Fichiers** : upload de livrables, documents, exports. Organises par type (Excel/PDF, documents, autres)
- **Notes** : ajouter des notes qui s'ajoutent au CLAUDE.md du client. Visibles par tous les agents

### Utiliser un client dans le chat

Dans le header du chat, selectionne un client dans le menu deroulant. A partir de la, chaque message envoye inclura le contexte du client. L'agent adapte ses reponses en consequence.


## Les skills

Les skills sont la base de connaissances d'un agent. Ce sont des fichiers Markdown (`.md`) stockes dans le dossier `skills/` de l'agent. L'agent les consulte pour repondre avec expertise.

### Consulter et editer

Onglet Config > Skills. La vue se divise en deux :
- **A gauche** : liste des skills, barre de recherche, bouton de creation
- **A droite** : editeur Markdown avec sauvegarde (`Cmd+S`)

### Creer un skill

Clique "Nouveau" dans la liste, donne un nom. Un fichier `.md` est cree et s'ouvre dans l'editeur.

### Diviser un skill

Si un skill devient trop long, le bouton "Diviser" parse les sections (`## Titre`) et permet d'extraire certaines sections dans des fichiers separes.


## Enrichissement depuis le chat

Quand un agent produit une reponse utile (une methode, un processus, une strategie), tu peux capturer un passage et l'injecter directement dans un de ses skills. L'agent s'ameliore au fil des conversations.

### Comment ca marche

1. **Surligne** un passage dans une reponse de l'agent
2. Un bouton **"+ Sauver dans un skill"** apparait au-dessus de la selection
3. **Clique** — une fenetre s'ouvre avec :
   - Le passage pre-rempli (editable)
   - Un champ pour le titre de section
   - La liste des skills de l'agent
   - Une option "Nouveau skill" si aucun existant ne convient
4. **Valide** — le contenu est ajoute a la fin du skill avec un separateur et la date

Le contenu ajoute ressemble a ca dans le fichier :

```
[contenu existant du skill...]

---

## Strategie maillage e-commerce — 2026-02-24

[le passage sauvegarde]
```

### Copier un message

Au survol d'un message de l'agent, un bouton "Copier" apparait en haut a droite pour copier l'integralite du message.


## Les services MCP

MCP (Model Context Protocol) permet de connecter des outils externes a un agent : API, bases de donnees, services web. L'agent peut ensuite les utiliser en conversation.

### Ajouter un service

Onglet Config > Services.

**Depuis GitHub** : colle l'URL d'un repo MCP, clique "Installer". Le systeme detecte automatiquement la configuration (commande, arguments, variables d'environnement).

**Manuellement** : ajoute un serveur de type `stdio` (commande locale) ou `sse` (URL HTTP).

### Tester un service

Le bouton "Tester" valide que le serveur repond correctement avant de le sauvegarder.

### Activer / desactiver

Chaque service a un toggle. Seuls les services actives sont passes a l'agent en chat.


## Structure des donnees

Tout est stocke en local sur le filesystem. Pas de base de donnees.

```
qg/
├── agents/                     # Un dossier par agent
│   └── seo/
│       ├── agent.json          # Nom, role, emoji, couleur
│       ├── CLAUDE.md           # Personnalite et regles
│       ├── skills/             # Fichiers de connaissances (.md)
│       └── mcp.json            # Configuration des services MCP
│
├── clients/                    # Un dossier par client
│   └── mon-client/
│       ├── CLAUDE.md           # Fiche client (objectifs, notes)
│       └── fichiers...         # Livrables, exports, documents
│
├── .data/                      # Donnees d'execution
│   ├── conversations/          # Historique des chats (JSON)
│   └── upload/                 # Fichiers uploades temporaires
│
└── .env                        # Configuration (chemin Claude, dossiers)
```

### Sauvegardes

Les donnees vivent sur le filesystem. Pour sauvegarder : copie les dossiers `agents/`, `clients/` et `.data/`. Un `git init` dans le dossier QG permet de versionner l'ensemble.


## Personnalisation

### Modifier la personnalite d'un agent

Onglet Config > Personnalite. C'est un editeur Markdown qui correspond au fichier `CLAUDE.md` de l'agent. Ce texte est envoye a Claude a chaque message — c'est ce qui donne a l'agent son caractere.

### Adapter Bullshito a ton profil

Edite `agents/bullshito/skills/profil.md` avec ton vrai profil LinkedIn (metier, experience, sujets d'expertise, ton). Sans ca, le scoring des posts est generique.

### Adapter Coach a ton programme

Edite `agents/coach/programme.md` avec ton programme d'entrainement, tes objectifs et ton equipement.

### Variables d'environnement

Fichier `.env` a la racine :

```bash
# Chemin vers le binaire Claude (optionnel si claude est dans le PATH)
# CLAUDE_BIN=/usr/local/bin/claude

# Dossier agents (default: ./agents)
# AGENTS_DIR=./agents

# Dossier clients (default: ./clients)
# CLIENTS_DIR=./clients
```


## FAQ

**Le chat est lent au premier message ?**
Normal. Le premier message de chaque conversation lance un process Claude CLI. Les messages suivants sont plus rapides.

**Les requetes sont traitees une par une ?**
Oui, par design. Une file d'attente gere les appels pour eviter les conflits. Si tu envoies 2 messages rapidement, le second attend que le premier finisse.

**Je peux utiliser un autre modele (GPT, Gemini) ?**
Non. Le QG utilise Claude CLI comme moteur. Un autre provider necesiterait de reecrire le module de chat.

**Ou sont mes conversations ?**
En local dans `.data/conversations/`. Ce sont des fichiers JSON. Rien n'est envoye a un serveur externe (a part les appels API Claude).

**Comment supprimer un agent ?**
Clic droit sur l'agent dans la sidebar ou supprime son dossier dans `agents/`.

**Comment reset un skill apres un mauvais enrichissement ?**
Ouvre le skill dans Config > Skills, trouve le bloc ajoute (separe par `---` avec la date), supprime-le manuellement et sauvegarde.
