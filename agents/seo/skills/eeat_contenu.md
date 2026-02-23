# Skill : Audit E-E-A-T & Qualité de Contenu

## Instructions

Tu es un expert en stratégie de contenu SEO et en framework E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness). Tu évalues la qualité du contenu d'un site web selon les Quality Rater Guidelines de Google et les bonnes pratiques de content marketing SEO.

---

## PARTIE 1 : Framework E-E-A-T

### 1.1 Définition des 4 piliers

| Pilier | Signification | Ce que Google évalue |
|--------|--------------|---------------------|
| **Experience** | Expérience directe | Le créateur a-t-il une expérience personnelle/pratique du sujet ? |
| **Expertise** | Expertise technique | Le créateur a-t-il les compétences/connaissances nécessaires ? |
| **Authoritativeness** | Autorité | Le créateur ou le site est-il reconnu comme référence dans son domaine ? |
| **Trustworthiness** | Fiabilité | Le site/contenu est-il fiable, honnête, sûr ? (PILIER CENTRAL) |

**Trustworthiness est le pilier central** : sans confiance, les 3 autres piliers n'ont pas de valeur.

### 1.2 Niveaux d'E-E-A-T selon le type de contenu

**YMYL (Your Money or Your Life) — E-E-A-T critique :**
- Finance : crédit, investissement, assurance, impôts
- Santé : symptômes, traitements, médicaments
- Juridique : droits, procédures, lois
- Sécurité : informations pouvant affecter la sécurité physique
- Actualités : événements d'importance publique

**Non-YMYL — E-E-A-T important mais moins critique :**
- E-commerce (hors produits santé/finance)
- Divertissement, lifestyle
- Tutoriels techniques (informatique, bricolage)
- Avis et témoignages

### 1.3 Mises à jour Quality Rater Guidelines (2025-2026)

**Janvier 2025 :** Mise à jour des QRG avec de nouvelles spécifications spam et des révisions des métriques "Needs Met Rating".

**Septembre 2025 :** Clarifications majeures :
- Nouvelles définitions des sujets YMYL : l'ancienne catégorie **"YMYL Society"** est renommée **"YMYL Government, Civics & Society"**, ciblant le contenu pouvant influencer la confiance dans les institutions publiques
- **Première inclusion d'exemples concrets pour évaluer les AI Overviews** dans les QRG — les quality raters évaluent désormais aussi les résultats IA
- Extension des définitions de spam : **scaled content abuse** (production de contenu IA à grande échelle), **expired domain abuse** (rachat de domaines expirés), **site reputation abuse** (contenu tiers de mauvaise qualité sur des sites autoritaires)

**Décembre 2025 — Extension à toutes les requêtes concurrentielles :** Google applique les critères E-E-A-T de manière plus large, au-delà des seuls sujets YMYL. Tout contenu sur une requête concurrentielle est désormais évalué selon ces critères.

**2026 — Position sur le contenu IA (QRG) :** Le contenu généré par IA est acceptable **à condition qu'il apporte une réelle valeur humaine**. Le shift récompense la précision, l'expertise, et l'intention user-first tout en sanctionnant la production de masse sans valeur ajoutée.

**Le document complet des QRG est public :** disponible sur guidelines.raterhub.com (dernière version : septembre 2025).

---

## PARTIE 2 : Signaux d'Experience

### 2.1 Comment démontrer l'expérience

| Signal | Implémentation | Exemple |
|--------|---------------|---------|
| **Témoignage personnel** | Récit à la première personne | "J'ai testé ce produit pendant 3 mois..." |
| **Photos originales** | Images prises par l'auteur (pas de stock photos) | Photos du produit in situ, captures d'écran |
| **Détails pratiques** | Informations qu'on ne peut connaître que par l'expérience | "L'installation prend 45 minutes, pas 15 comme indiqué" |
| **Comparaisons vécues** | Comparer avec d'autres produits testés | "Contrairement au modèle X que j'ai aussi essayé..." |
| **Dates et contexte** | Quand et comment le produit a été testé | "Test réalisé en janvier 2026 avec la version 3.2" |
| **Vidéos démo** | Preuves visuelles d'utilisation | Unboxing, tutoriel pratique |

### 2.2 Signaux d'absence d'expérience (red flags)

- Contenu 100% générique réécrit depuis d'autres sources
- Aucune photo originale
- Absence de détails pratiques ou de nuances
- Ton impersonnel sans aucun recul critique
- Pas de date de test/mise à jour
- Contenu visiblement généré par IA sans enrichissement humain

---

## PARTIE 3 : Signaux d'Expertise

### 3.1 Expertise de l'auteur

**Insight Lily Ray (2024-2025) :** Les sites ayant ajouté des attributions d'auteur correctes (bios, schema, credentials) ont constaté des **améliorations mesurables** dans les rankings YMYL après les core updates. L'auteur doit être une "entité" reconnaissable sur le web.

| Signal | Implémentation |
|--------|---------------|
| **Page auteur dédiée** | `/auteur/nom` avec bio, photo pro, qualifications, liens sociaux, liste des publications |
| **Schema Person** | JSON-LD `@type: Person` avec jobTitle, alumniOf, knowsAbout, sameAs |
| **Byline sur chaque article** | Nom de l'auteur visible, cliquable, vers la page auteur |
| **Qualifications visibles** | Diplômes, certifications, années d'expérience |
| **Publications/Citations** | Liens vers des publications dans des médias reconnus |
| **Profil LinkedIn** | Lien sameAs vers un profil LinkedIn complet et cohérent |
| **Reviewer/Fact-checker** | Pour YMYL : ajouter `reviewedBy` dans le schema Article (ex: "Vérifié par Dr. X") |
| **Knowledge Panel** | Développer l'entité auteur pour obtenir un Knowledge Panel Google |
| **Guest posting** | Publier des articles bylinés sur des publications autoritaires pour construire le portfolio |

### 3.2 Expertise du site

| Signal | Implémentation |
|--------|---------------|
| **Page "À propos"** | Histoire de l'entreprise, équipe, mission, expertise |
| **Page "Notre équipe"** | Photos et bios des experts |
| **Politique éditoriale** | Comment le contenu est créé, vérifié, mis à jour |
| **Certifications/Labels** | Affichage des certifications professionnelles |
| **Partenariats** | Collaborations avec des organismes reconnus |

### 3.3 Contenu d'expert vs contenu générique

| Critère | Contenu expert | Contenu générique |
|---------|---------------|-------------------|
| Profondeur | Couvre les nuances, les cas limites, les exceptions | Surface, généralités |
| Sources | Cite des sources primaires, des études, des données | Pas de sources ou sources faibles |
| Originalité | Apporte un angle unique, une analyse originale | Réécrit de ce qui existe déjà |
| Précision | Chiffres exacts, détails techniques | Approximations, vague |
| Mise à jour | Date de publication et de mise à jour visibles | Pas de date, contenu evergreen par défaut |

---

## PARTIE 4 : Signaux d'Authoritativeness

### 4.1 Autorité du domaine

| Signal | Comment le mesurer |
|--------|-------------------|
| **Backlinks de qualité** | Ahrefs/Semrush : DR/DA, nombre de domaines référents |
| **Mentions de marque** | Recherche `"nom de marque"` sans lien = mentions non liées |
| **Citations dans les médias** | Articles de presse mentionnant le site/l'entreprise |
| **Knowledge Panel Google** | Présence d'un Knowledge Panel pour la marque |
| **Wikipedia** | Existence d'un article Wikipedia (fort signal d'autorité) |
| **Position sur les requêtes de marque** | Le site est-il #1 sur son propre nom ? |

### 4.2 Autorité topique (topical authority)

**Principe :** Google évalue l'autorité d'un site sur un sujet spécifique, pas de manière globale.

**Insight Lily Ray (Search Engine Land, 2025) :** Lily Ray, reconnue pour sa compréhension inégalée de l'E-E-A-T, a analysé en profondeur l'ajout du "Experience" au framework. L'expertise seule ne suffit plus — le contenu doit démontrer que le créateur a une **expérience directe et personnelle** du sujet. Ce signal est particulièrement difficile à fabriquer avec l'IA, ce qui en fait un différenciateur clé en 2026.

**Comment construire l'autorité topique :**
1. **Couverture exhaustive** : couvrir TOUS les aspects d'un sujet (pas juste les requêtes à fort volume)
2. **Maillage interne thématique** : cocon sémantique / topic clusters
3. **Contenu régulier** : publier fréquemment sur le même sujet
4. **Backlinks thématiques** : obtenir des liens de sites du même domaine d'expertise
5. **Entité reconnue** : être cité comme source par d'autres sites du secteur
6. **Présence multi-plateforme** : LinkedIn, Reddit, YouTube — les LLMs citent fréquemment ces plateformes comme sources (rapport AI Visibility 2025)

### 4.3 Relation auteur-sujet

Google essaie d'évaluer si l'auteur est reconnu comme expert SUR LE SUJET spécifique de la page :
- Un médecin qui écrit sur la santé = forte autorité
- Un médecin qui écrit sur la finance = faible autorité sur ce sujet
- L'association auteur-sujet se construit via les publications, citations, et profils en ligne

---

## PARTIE 5 : Signaux de Trustworthiness

### 5.1 Trust au niveau technique

| Signal | Implémentation |
|--------|---------------|
| **HTTPS** | Certificat SSL valide, pas de mixed content |
| **Politique de confidentialité** | Page accessible, à jour, conforme RGPD |
| **CGV / CGU** | Pages légales complètes et accessibles |
| **Mentions légales** | Raison sociale, SIRET, adresse, directeur publication |
| **Politique de retour** (e-commerce) | Claire, accessible, conforme |
| **Données de contact** | Téléphone, email, adresse physique visibles |

### 5.2 Trust au niveau éditorial

| Signal | Implémentation |
|--------|---------------|
| **Sources citées** | Liens vers les sources primaires dans le contenu |
| **Date de publication** | Visible sur chaque article |
| **Date de mise à jour** | Visible et distincte de la date de publication |
| **Processus de fact-checking** | Mention "Vérifié par..." ou processus éditorial décrit |
| **Corrections transparentes** | Notes de correction en cas de mise à jour factuelle |
| **Absence de contenu trompeur** | Pas de clickbait, pas de titres exagérés |

### 5.3 Trust au niveau commercial

| Signal | Implémentation |
|--------|---------------|
| **Avis clients vérifiés** | Intégration Trustpilot, Avis Vérifiés, Google Reviews |
| **Conditions claires** | Prix, frais, délais clairement affichés |
| **Service client accessible** | Plusieurs canaux (tel, email, chat), horaires visibles |
| **Labels et certifications** | Affichage des labels (Trusted Shops, PCI DSS, etc.) |
| **Politique de remboursement** | Claire et facile à trouver |

### 5.4 Pages "Trust" essentielles (à indexer)

| Page | Pourquoi l'indexer |
|------|-------------------|
| Politique de retour | Google Merchant Center l'exige ; signal Trust |
| Qui sommes-nous / À propos | Expertise et autorité de l'entreprise |
| Notre équipe | Expertise des personnes |
| Contact | Accessibilité et transparence |
| FAQ | Répond aux préoccupations des utilisateurs |
| Politique de confidentialité | Bien que technique, signal de conformité |

---

## PARTIE 6 : Audit de contenu

### 6.1 Métriques de qualité de contenu

| Métrique SF | Seuil | Action si non respecté |
|-------------|-------|----------------------|
| Nombre de mots | > 300 (page standard), > 1000 (article) | Enrichir ou fusionner |
| Score de lisibilité Flesch | > 60 (grand public), > 40 (technique) | Simplifier le langage |
| Ratio texte | > 25% (ratio texte/HTML) | Réduire le template ou enrichir le contenu |
| Nombre de phrases | Proportionnel au nombre de mots | Vérifier la cohérence |

### 6.2 Analyse du thin content

**Définition :** Pages avec un contenu insuffisant pour satisfaire l'intention de recherche.

**Seuils indicatifs :**
| Type de page | Minimum de mots recommandé |
|-------------|---------------------------|
| Page produit e-commerce | 150-300 mots uniques (hors specs) |
| Page catégorie | 100-200 mots d'introduction |
| Article de blog informatif | 800-1500 mots |
| Guide complet / pillar page | 2000-5000 mots |
| Page service B2B | 500-1000 mots |
| Fiche lexique / glossaire | 200-500 mots |
| FAQ | 50-200 mots par réponse |

**Attention :** Le nombre de mots n'est pas un facteur de ranking. C'est un proxy pour la profondeur et l'exhaustivité du contenu. Un article de 500 mots parfaitement ciblé peut surclasser un article de 3000 mots générique.

### 6.3 Analyse de la cannibalisation de contenu

**Définition :** Plusieurs pages du même site ciblent le même mot-clé, se font concurrence dans les SERPs.

**Détection :**
1. **GSC** : Performances > Pages > filtrer par requête. Si 2+ URLs se partagent les clics sur la même requête = cannibalisation
2. **SF** : Comparer les Titles et H1 pour détecter les similitudes
3. **Semrush/Ahrefs** : Rapport de cannibalisation intégré
4. **Google** : `site:domaine.fr "mot-clé"` — si plusieurs pages remontent, il y a cannibalisation

**Solutions :**
| Situation | Solution |
|-----------|---------|
| 2 pages de contenu similaire | Fusionner en 1 + 301 depuis la supprimée |
| Page catégorie vs page article | Clarifier l'intention : catégorie = commercial, article = informatif |
| Multiples articles sur le même sujet | Créer un pillar page + satellites avec maillage clair |
| Cannibalisation title/H1 | Différencier les titles et H1 pour cibler des variantes distinctes |

### 6.4 Content pruning (élagage de contenu)

**Pourquoi c'est critique post-HCU :** Le Helpful Content System applique un **classificateur site-wide**. Si une part significative du contenu du site est jugée "unhelpful", **tout le site** peut être déclassé, pas seulement les pages faibles.

**Framework de décision :**
| Situation | Action | Justification |
|-----------|--------|---------------|
| 0 trafic organique depuis 6+ mois, pas de backlinks | **Supprimer (noindex ou 410)** | Ne contribue pas, peut nuire au score global |
| Backlinks mais contenu obsolète | **301 vers un meilleur contenu** | Préserve le PRi acquis |
| Plusieurs pages thin sur le même sujet | **Fusionner en une page complète** + 301 | Consolide l'autorité |
| Contenu daté mais potentiel | **Mettre à jour et republier** | "Content relaunch" (recommandé par Ahrefs) |
| Contenu performant et à jour | **Garder** | Ne pas toucher |

**Données sur le content pruning :**
- **Siege Media** : +10-30% de trafic organique après pruning de 20-40% du contenu
- **HubSpot** : a supprimé ~3 000 articles de blog → amélioration des performances globales
- **Kevin Indig** : sites ayant supprimé des centaines de pages low-quality = amélioration en 1-2 cycles de core update

**Questions d'auto-évaluation Google (officielles) :**
- Le contenu apporte-t-il des informations originales, un reporting, une recherche ou une analyse ?
- Fournit-il une description substantielle et complète du sujet ?
- Offre-t-il une analyse perspicace au-delà de l'évidence ?
- Est-ce le genre de page que vous voudriez mettre en favori ou recommander à un ami ?
- **Qui** a créé le contenu ? (auteur identifiable ?)
- **Comment** a-t-il été créé ? (IA ? quel rôle humain ?)
- **Pourquoi** a-t-il été créé ? (pour aider les utilisateurs ou pour ranker ?)

### 6.5 Content freshness (fraîcheur du contenu)

**Quand la fraîcheur compte :**
- Requêtes d'actualité ou de tendance
- Requêtes avec une composante temporelle ("meilleur X 2026")
- Requêtes YMYL (finance, santé, juridique) où les informations changent
- Requêtes sur des technologies qui évoluent vite

**Signaux de fraîcheur :**
- Date de publication visible et récente
- Date de dernière mise à jour (schema `dateModified`)
- Contenu factuellement à jour (pas de chiffres obsolètes)
- Lastmod sitemap récent et honnête (ne pas mettre la date du jour si le contenu n'a pas changé)

---

## PARTIE 7 : Contenu et IA générative

### 7.1 Position de Google sur le contenu IA

**Google ne pénalise pas le contenu généré par IA en tant que tel.** Ce qui est pénalisé :
- Le contenu de mauvaise qualité (IA ou humain)
- Le contenu créé uniquement pour manipuler le ranking
- Le contenu sans valeur ajoutée (paraphrase de ce qui existe déjà)
- Le spam de contenu à grande échelle

**Ce qui est valorisé :**
- Le contenu utile à l'utilisateur, quelle que soit la méthode de production
- Le contenu enrichi par l'expertise humaine (IA + humain > IA seule)
- Le contenu qui apporte des perspectives uniques
- Le contenu vérifié et factuellement correct

### 7.2 Scaled Content Abuse (politique spam mars 2024)

Google a introduit la politique **"scaled content abuse"** (mars 2024) :
- Cible la production massive de contenu (IA, humain, ou combinaison) destinée à manipuler les rankings
- Signal clé : contenu produit **principalement pour ranker** plutôt que pour aider les utilisateurs
- A résulté en **actions manuelles** et **désindexations** de sites publiant de l'IA en masse sans supervision éditoriale
- Glen Gabe a documenté des sites ayant perdu **80-90% de leur trafic organique** après publication massive de contenu IA sans contrôle qualité

### 7.3 Bonnes pratiques contenu IA

| Pratique | Pourquoi |
|----------|---------|
| IA comme assistant de rédaction (brouillon → enrichissement humain) | Le meilleur des deux mondes |
| Ajout d'expérience personnelle | Signal Experience impossible à fabriquer |
| Fact-checking systématique | Corriger les hallucinations IA |
| Optimisation éditoriale humaine | Ton, style, nuances que l'IA ne maîtrise pas |
| Ne PAS publier du contenu IA brut en masse | Risque de spam action |

---

## PARTIE 8 : Format de sortie de l'audit

### A. Score E-E-A-T global
| Pilier | Score (1-5) | Justification |
|--------|------------|---------------|
| Experience | X/5 | ... |
| Expertise | X/5 | ... |
| Authoritativeness | X/5 | ... |
| Trustworthiness | X/5 | ... |

### B. Audit des pages Trust
| Page | Existe | Indexée | Contenu suffisant | Action |
|------|--------|--------|-------------------|--------|

### C. Audit du contenu (échantillon)
| URL | Mots | Lisibilité | Fraîcheur | Qualité E-E-A-T | Action |
|-----|------|-----------|-----------|-----------------|--------|

### D. Problèmes de cannibalisation
| Mot-clé | URLs en concurrence | Page à prioriser | Action |
|---------|-------------------|-----------------|--------|

### E. Plan d'action contenu
| Priorité | Action | Impact | Effort |
|----------|--------|--------|--------|
| P1 | Créer les pages Trust manquantes | Trust +++ | Faible |
| P2 | Enrichir les thin content | Ranking | Moyen |
| P3 | Résoudre les cannibalisations | Ranking | Élevé |

---

### Insights Babbar Masterclass (janvier 2024, Sylvain & Guillaume Peyronnet)

**Learning to Rank et signaux implicites :**
Google utilise le "learning to rank" (LTR) : un algorithme de ML qui apprend pour **chaque requête** quels signaux sont importants et les pondère en conséquence. Il n'y a pas un algorithme unique mais un système adaptatif. Le SEO a deux leviers pour augmenter la qualité perçue par le moteur :
1. **Augmenter l'attractivité des snippets** (copywriting, CTA dans la meta description, A/B test via Ads) → faire cliquer
2. **Améliorer le ratio rétention/bounce** → l'UX est le facteur déterminant

**La notion de click-skip (Filip Radlinski, Google & Thorsten Joachims) :**
Google analyse les patterns de clics utilisateurs : si un utilisateur clique sur le résultat 1, revient, puis clique sur le résultat 3 (en "skippant" le 2), le moteur interprète que le résultat 3 a été préféré au résultat 2. C'est un signal de pertinence implicite utilisé dans le LTR.

**Alignement sémantique (principe fondamental) :**
"Pour être pertinent sur un ensemble de mots-clés, un texte doit être en alignement sémantique sur ces mots-clés." Conséquence pratique : **une page spécialisée par groupe de requêtes proches**, pas une page fourre-tout.

**Expansion de Rocchio et la "vraie requête" :**
Google ne cherche pas les mots littéraux de la requête. Via l'expansion de Rocchio (feedback des quality raters), la requête réelle est un **vecteur composite** qui combine les termes de la requête + les termes des pages jugées pertinentes. "Seul un outil d'analyse automatique est réellement capable de comprendre ce qu'attend le moteur. Un humain ne peut pas savoir formellement ce que les humains veulent voir." → Justification de l'utilisation d'outils comme YourText.Guru, Surfer SEO, etc.

**BERT a remplacé Rocchio :**
"BERT remplit le rôle qu'avait Rocchio, sans interaction avec les utilisateurs." BERT prédit si un mot est attendu dans un contexte et si des phrases sont contextuellement compatibles → il sait lever les ambiguïtés sémantiques. C'est ce qui a "tout changé pour Google".

**Données ranking Babbar (19 788 KWs, 2M pages) :**
- Les scores d'optimisation YTG sont corrélés avec la taille du texte, et entre eux
- "BERT n'est corrélé à rien" dans les données de ranking → BERT n'est pas un signal de ranking direct, c'est un outil de compréhension de la requête
- "Text quality n'est corrélé à rien" → la qualité textuelle seule ne suffit pas sans les signaux de popularité et trust
- Les 3 axes qui comptent : **Value (popularité), Trust (confiance), Semantic Value** — les trois doivent être travaillés ensemble

---

## Sources
- Google Quality Rater Guidelines (version septembre 2025, guidelines.raterhub.com)
- Google Search Central : E-E-A-T documentation
- Google Search Central : "Creating Helpful, Reliable, People-First Content" (developers.google.com/search/docs/fundamentals/creating-helpful-content)
- Google Helpful Content Update documentation
- Mise à jour Core Update décembre 2025
- Lily Ray : analyses E-E-A-T et Quality Rater Guidelines (Search Engine Land)
- SEOzoom : "Search Quality Rater Guidelines: take a peek inside Google" (seozoom.com)
- Masterclass Babbar (25-26 janvier 2024), Sylvain & Guillaume Peyronnet : Learning to Rank, click-skip, alignement sémantique, expansion de Rocchio, BERT, données ranking 19 788 KWs
- YourText.Guru : outil d'analyse d'alignement sémantique référencé par Peyronnet
- seo-kreativ : "Google Quality Raters Guidelines Update September 2025" (seo-kreativ.de)
- Broworks : "Google's 2026 Search Quality Rater Guidelines" (broworks.net)
- sitecentre : "Google E-E-A-T: Algorithms & The Future of SEO in 2026" (sitecentre.com.au)
