# Processus d'Audit SEO — Workflow avec validation

## Rôle

Ce fichier définit le processus obligatoire pour tout audit SEO et tout livrable client. Il s'applique à TOUTES les missions, quel que soit le skill utilisé.

**Règle fondamentale : JAMAIS de livrable sans validation préalable.**

---

## ÉTAPE 1 : Cadrage (avant toute analyse)

### 1.1 Identifier le client et le contexte

Avant de commencer, confirmer avec l'utilisateur :
- **Client** : nom, secteur, URL du site
- **Type de site** : e-commerce, corporate, éditorial, SaaS, local, finance, etc.
- **CMS / Stack technique** : PrestaShop, WordPress, Shopify, Jahia, custom, etc.
- **Objectif de la mission** : audit complet, audit ciblé (maillage, performance, contenu...), suivi, recommandations ponctuelles
- **Destinataire du livrable** : le client direct, un DSI, un chef de projet, l'équipe marketing
- **Niveau technique du destinataire** : technique (développeur), marketing (CMO), direction (CEO)
- **Données disponibles** : exports Screaming Frog, accès GSC, accès analytics, accès PageSpeed, backlinks

### 1.2 Identifier les fichiers source

Lister explicitement les fichiers fournis et leur contenu :
```
Fichiers reçus :
- /chemin/vers/interne_tous.csv → crawl Screaming Frog (N lignes, N colonnes)
- /chemin/vers/rapport_aperçu_problemes.csv → rapport d'erreurs SF (N problèmes)
- /chemin/vers/liens_entrants_tous.csv → All Inlinks (N lignes)
- ...
```

### 1.3 Définir le périmètre

Confirmer quels axes d'analyse sont attendus :

| Axe | Skill associé | Inclus ? |
|-----|--------------|----------|
| Technique (crawl, indexation, redirections) | `audit_technique_seo.md` | ☐ |
| Maillage interne | `maillage_interne.md` | ☐ |
| Données structurées / Schema | `schema_donnees_structurees.md` | ☐ |
| Performance / Core Web Vitals | `core_web_vitals_performance.md` | ☐ |
| Contenu / E-E-A-T | `eeat_contenu.md` | ☐ |
| Visibilité IA / GEO | `geo_visibilite_ia.md` | ☐ |

---

## ÉTAPE 2 : Analyse brute (exploration des données)

### 2.1 Première passe

Effectuer une analyse exploratoire rapide des données :
- Nombre d'URLs crawlées, types de contenu, codes HTTP
- Top problèmes du rapport d'erreurs
- Données GSC si disponibles (pages à fort trafic, pages sans trafic)
- Premières observations notables

### 2.2 Synthèse flash

Rédiger une **synthèse flash** (10-15 lignes max) résumant :
- Les 3-5 constats majeurs
- Les chiffres clés
- Les axes qui semblent les plus impactants
- Les zones de risque ou d'opportunité identifiées

**→ PRÉSENTER LA SYNTHÈSE FLASH À L'UTILISATEUR POUR VALIDATION**

Questions à poser :
- "Voici ce que je vois dans les données. Est-ce que ça correspond à ce que tu attendais ?"
- "Y a-t-il des éléments que tu veux que j'approfondisse en priorité ?"
- "Y a-t-il des éléments que tu veux que je laisse de côté ?"
- "Le client a-t-il des sujets de préoccupation spécifiques ?"

**⚠️ NE PAS passer à l'étape 3 sans validation de l'étape 2.**

---

## ÉTAPE 3 : Analyse approfondie

### 3.1 Exécuter les analyses détaillées

Pour chaque axe validé à l'étape 2, appliquer le skill correspondant et produire les analyses complètes.

### 3.2 Prendre des décisions (pas "à vérifier")

**Règle absolue : le client nous paie pour des décisions, pas des suggestions floues.**

| ❌ À ne JAMAIS écrire | ✅ Écrire à la place |
|----------------------|---------------------|
| "À vérifier" | Décision concrète + justification |
| "À étudier" | Recommandation précise |
| "Il faudrait analyser" | "Nous recommandons X parce que Y" |
| "Potentiellement problématique" | "Problème confirmé : [détail]. Action : [action]" |
| "À discuter avec le client" | Proposer 2 options avec notre recommandation |

**Exception :** Si une décision nécessite des informations que seul le client détient (accès analytics, objectifs business, contraintes techniques), formuler la question précisément et proposer une recommandation par défaut.

### 3.3 Checkpoint analyse

Avant de créer le livrable, présenter :
- **Les constats principaux** (chiffres, données, faits)
- **Les décisions prises** et leur justification
- **Les recommandations** par ordre de priorité
- **Le format de livrable proposé** (Excel avec N onglets, rapport, email...)

**→ PRÉSENTER LE CHECKPOINT À L'UTILISATEUR POUR VALIDATION**

Questions à poser :
- "Voici mes constats et recommandations. Tu valides l'orientation ?"
- "Le format livrable [Excel / rapport / email] te convient ?"
- "Il y a des points où tu vois les choses différemment ?"

**⚠️ NE PAS créer le livrable sans validation de l'étape 3.**

---

## ÉTAPE 4 : Création du livrable

### 4.1 Structure standard d'un livrable Excel

| Onglet | Contenu | Obligatoire |
|--------|---------|-------------|
| **Synthèse** | Vue d'ensemble, score de santé, top problèmes, top actions, métriques clés | OUI |
| **[Axe 1]** | Données détaillées du premier axe d'analyse | Selon périmètre |
| **[Axe 2]** | Données détaillées du deuxième axe | Selon périmètre |
| **...** | ... | ... |
| **Plan d'action** | Actions priorisées P1/P2/P3 avec responsable, délai, impact estimé | OUI |

### 4.2 Conventions du livrable

**Colonnes obligatoires sur chaque onglet d'analyse :**
- URL
- Problème / Constat
- **Décision** (pas "à vérifier")
- **Action recommandée** (précise et actionnable)
- **Justification** (pourquoi cette décision)
- Priorité (P1/P2/P3)

**Code couleur standard :**
| Couleur | Signification |
|---------|---------------|
| 🟢 Vert | OK / Action positive (passer en index, garder, etc.) |
| 🔵 Bleu | Création / Nouvelle action (nouvelle page, nouveau contenu) |
| 🟡 Orange | Attention / À modifier |
| 🔴 Rouge | Problème / Garder noindex / Supprimer |

**Onglet Synthèse — Structure obligatoire :**
```
Ligne 1 : Titre "Audit SEO — [Nom du client]"
Ligne 2 : Date de l'audit
Ligne 3 : URL du site
Ligne 4 : Outil utilisé + date du crawl
Ligne 5 : vide
Ligne 6 : "Métriques clés"
Lignes 7+ : Tableau des métriques (pages crawlées, indexables, erreurs, etc.)
Ligne N : vide
Ligne N+1 : "Constats principaux"
Lignes N+2 : Liste numérotée des constats
Ligne M : vide
Ligne M+1 : "Actions prioritaires"
Lignes M+2 : Tableau P1/P2/P3
```

### 4.3 Conventions de nommage des fichiers

```
[nom_client]_audit_seo_[AAAA-MM-JJ].xlsx
[nom_client]_audit_maillage_[AAAA-MM-JJ].xlsx
[nom_client]_recommandations_[sujet]_[AAAA-MM-JJ].xlsx
```

---

## ÉTAPE 5 : Validation du livrable

### 5.1 Checklist avant livraison

Avant de considérer le livrable comme terminé, vérifier :

**Complétude :**
- [ ] Onglet Synthèse présent et complet
- [ ] Tous les axes validés à l'étape 2 sont couverts
- [ ] Plan d'action priorisé présent
- [ ] Toutes les URLs mentionnées sont correctes et cliquables

**Qualité des décisions :**
- [ ] AUCUNE mention de "à vérifier", "à étudier", "à analyser"
- [ ] Chaque problème a une décision + action + justification
- [ ] Les priorités sont cohérentes (P1 = impact fort / effort faible d'abord)

**Lisibilité :**
- [ ] Mise en forme correcte (couleurs, largeur colonnes, filtres activés)
- [ ] Langage adapté au destinataire (technique vs business)
- [ ] Pas de jargon non expliqué si le destinataire n'est pas technique

**Données :**
- [ ] Les chiffres sont cohérents entre les onglets
- [ ] Les sources de données sont identifiées
- [ ] Les données GSC sont présentes si disponibles

### 5.2 Présentation finale

**→ PRÉSENTER LE LIVRABLE À L'UTILISATEUR POUR VALIDATION FINALE**

- "Voici le livrable [nom_fichier]. Il contient X onglets couvrant [axes]."
- "L'onglet Synthèse résume les Y constats principaux et Z actions prioritaires."
- "Tu veux que je modifie quelque chose avant envoi au client ?"

---

## ÉTAPE 6 : Suivi post-livrable (optionnel)

Si l'utilisateur prépare une présentation client ou un email :
- Proposer de rédiger l'email d'accompagnement
- Anticiper les questions du client sur les recommandations
- Préparer des réponses aux objections courantes (coût, délai, faisabilité technique)

---

## Résumé des gates de validation

```
ÉTAPE 1 : Cadrage          → Validation périmètre et objectifs
    ↓
ÉTAPE 2 : Synthèse flash   → ⚠️ VALIDATION OBLIGATOIRE (constats + axes)
    ↓
ÉTAPE 3 : Analyse complète → ⚠️ VALIDATION OBLIGATOIRE (décisions + format)
    ↓
ÉTAPE 4 : Création livrable → Production
    ↓
ÉTAPE 5 : QA + présentation → ⚠️ VALIDATION OBLIGATOIRE (livrable final)
    ↓
ÉTAPE 6 : Suivi            → Optionnel
```

**3 gates de validation minimum avant tout livrable.**

---

## Application selon le type de mission

### Audit complet (nouveau client)
→ Toutes les étapes, tous les axes, livrable Excel multi-onglets

### Audit ciblé (un seul axe)
→ Étapes 1-5 mais avec un seul skill. Livrable Excel simplifié (Synthèse + 1 onglet analyse + Plan d'action)

### Réponse à une question client (email Hélène, question DSI...)
→ Étapes 1-3 rapides (cadrage = relire la question, analyse = chercher dans les données, validation = "voici ce que je propose de répondre"). Livrable = email ou mise à jour du fichier existant.

### Mise à jour d'un livrable existant
→ Étape 1 (identifier le fichier), Étape 3 (analyse), Étape 5 (vérifier la cohérence avec l'existant). Pas de création from scratch.
