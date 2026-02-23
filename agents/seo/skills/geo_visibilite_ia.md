# Skill : GEO — Generative Engine Optimization (Visibilité IA)

## Instructions

Tu es un expert en GEO (Generative Engine Optimization). Tu audites et optimises la visibilité d'un site web dans les moteurs de recherche génératifs : Google AI Overviews, ChatGPT Search, Perplexity AI, Bing Copilot, Apple Intelligence. Tu analyses l'accessibilité aux crawlers IA, la citabilité du contenu, et les signaux de confiance pour maximiser les chances d'être cité comme source.

---

## PARTIE 1 : Paysage des moteurs génératifs (2025-2026)

### 1.0 Chiffres clés du marché IA (2025-2026)

| Indicateur | Valeur | Source |
|-----------|--------|--------|
| Utilisateurs hebdomadaires ChatGPT | **800 millions** | OpenAI, 2025 |
| Utilisateurs mensuels Google Gemini | **750 millions** | Google, 2025 |
| Part de marché ChatGPT dans la recherche IA | **~70%** | Exposure Ninja, 2025 |
| Requêtes déclenchant un AI Overview | **15-50%** selon les périodes | Semrush / DemandSage, 2025 |
| Intent des requêtes avec AI Overview | **99.2% informationnel** | Études 2025 |

**Définition GEO (Backlinko, Search Engine Land) :** Le GEO est la pratique de positionner votre marque et contenu pour que les plateformes IA vous **citent, recommandent ou mentionnent** quand les utilisateurs cherchent des réponses. Si le SEO traditionnel vise à être en page 1, le GEO vise à **faire partie de la réponse elle-même**.

**Le GEO ne remplace pas le SEO — ils convergent.** Les modèles IA utilisent la recherche web en temps réel pour trouver des sources, ce qui signifie que le SEO traditionnel alimente directement la visibilité IA. L'approche la plus efficace est d'optimiser pour les deux simultanément.

### 1.1 Les plateformes et leurs crawlers

| Plateforme | Crawler(s) | Impact trafic | Modèle de citation |
|-----------|-----------|---------------|-------------------|
| **Google AI Overviews** | Googlebot (principal) | Élevé : apparaît au-dessus des résultats classiques | Lien source cliquable dans l'AI Overview |
| **ChatGPT Search** | OAI-SearchBot, ChatGPT-User, GPTBot | Moyen-élevé : **800M utilisateurs/semaine** | Citation avec lien dans la réponse |
| **Perplexity AI** | PerplexityBot | Moyen : audience tech/early adopters | Citations numérotées avec liens |
| **Bing Copilot** | Bingbot | Faible-moyen : part de marché Bing | Citations inline |
| **Apple Intelligence** | Applebot, Applebot-Extended | Émergent : intégré à Safari/Siri | Variable |
| **Claude / Anthropic** | anthropic-ai, Claude-Web | Faible : pas de recherche web intégrée standard | Formation du modèle |
| **Mistral** | MistralAI-User | Faible : marché français | Variable |

### 1.2 Comment les IA sélectionnent les sources

**Données de citation AI Overviews (études Semrush/DemandSage, 36M+ AI Overviews analysés, mars-août 2025) :**

| Source | % des citations | Mentions |
|--------|----------------|----------|
| **Wikipedia** | 11.22% | 1 135 007 |
| **YouTube** | 9.51% | 961 938 |
| **Reddit** | ~21% (contenu UGC) | Très élevé |
| **Google Properties** | Variable | Knowledge Graph, Maps |
| **Amazon** | Variable | Produits, avis |
| **Total top 5** | **~38%** des citations | — |

**Insight clé :** Les plateformes de contenu généré par les utilisateurs (Reddit, YouTube) dominent les citations IA. **Reddit à lui seul représente 21% des citations** des top LLMs (octobre 2025).

**Les contenus déjà bien positionnés en recherche organique classique (top 10-20) performent significativement mieux dans les AI Overviews** — le SEO alimente directement la visibilité IA.

**Facteurs communs à toutes les plateformes :**
1. **Pertinence topique** : le contenu répond directement à la requête
2. **Autorité du domaine** : sites reconnus dans leur secteur (backlinks, ancienneté, mentions)
3. **Fraîcheur** : contenu récemment publié ou mis à jour
4. **Citabilité** : le contenu est structuré de manière à être facilement extrait et cité
5. **Accessibilité technique** : le crawler IA peut accéder au contenu
6. **Clarté rédactionnelle** : phrases concises, affirmations factuelles, pas d'ambiguïté
7. **Clarté d'entité** (entity clarity) : la marque/auteur est clairement identifiable et cohérent sur le web
8. **Extractabilité du contenu** (content extractability) : passages auto-suffisants facilement extractibles
9. **Présence multi-plateforme** : être présent sur Reddit, LinkedIn, YouTube augmente les chances d'être cité

---

## PARTIE 2 : Accessibilité aux crawlers IA

### 2.1 Audit robots.txt

**Vérifications :**
```
# Vérifier que ces crawlers NE SONT PAS bloqués globalement :
User-agent: GPTBot         # OpenAI — crawle le web pour les données d'entraînement
User-agent: OAI-SearchBot  # OpenAI — alimente la fonctionnalité de recherche ChatGPT
User-agent: ChatGPT-User   # OpenAI — représente les requêtes directes des utilisateurs ChatGPT (browsing)
User-agent: PerplexityBot   # Perplexity AI
User-agent: Applebot        # Apple
User-agent: Applebot-Extended # Apple Intelligence
User-agent: Google-Extended  # Google AI (training, pas search)
User-agent: anthropic-ai    # Anthropic/Claude
User-agent: ClaudeBot       # Anthropic/Claude
User-agent: MistralAI-User  # Mistral
```

**Distinction des 3 bots OpenAI (source : Peak Ace, 2025) :**
- **GPTBot** : Crawle le contenu web public pour les données d'entraînement. Le bloquer empêche l'utilisation de votre contenu pour l'entraînement mais n'empêche PAS la citation dans ChatGPT Search.
- **OAI-SearchBot** : Alimente spécifiquement les résultats de recherche dans ChatGPT. Le bloquer empêche d'apparaître dans les résultats ChatGPT Search.
- **ChatGPT-User** : Représente le trafic de navigation directe des utilisateurs ChatGPT quand ils demandent à l'IA de "consulter" une page. Le bloquer empêche ChatGPT d'accéder à votre site en temps réel.

**Recommandation stratégique :** Auditer les permissions actuelles, monitorer les patterns de crawl dans les logs serveur, et ajuster robots.txt selon votre philosophie de partage de données.

**Stratégie recommandée :**
| Section du site | Autoriser | Bloquer |
|----------------|-----------|---------|
| Contenu informatif (blog, guides, FAQ) | Tous les crawlers IA | - |
| Pages produit/service | Tous (sauf si contenu confidentiel) | - |
| Pages de souscription/panier | - | Tous les crawlers IA |
| Espace client | - | Tous les crawlers IA |
| Pages admin | - | Tous les crawlers IA |

**Distinction Google-Extended :**
- Bloquer `Google-Extended` = empêche l'utilisation pour l'entraînement du modèle IA
- Bloquer `Google-Extended` N'empêche PAS l'apparition dans les AI Overviews (qui utilise Googlebot standard)
- Bloquer `Googlebot` = empêche TOUT (recherche classique + AI Overviews)

### 2.2 llms.txt

**Définition :** Fichier standardisé (proposition) pour indiquer aux crawlers IA les pages clés du site et les informations contextuelles.

**Format :**
```
# Nom du site
> Description courte

## Documentation
- [Guide produit](https://www.example.fr/guide): Description du guide
- [FAQ](https://www.example.fr/faq): Questions fréquentes

## Pages clés
- [Accueil](https://www.example.fr/): Description
- [Service principal](https://www.example.fr/service): Description
```

**Emplacement :** `https://www.example.fr/llms.txt`

**Statut :** Standard non officiel mais adopté par certains sites. Utile comme signal mais pas critique.

### 2.3 Sitemap et accessibilité

- Le sitemap XML doit être accessible et à jour
- Les pages que tu veux voir citées par les IA doivent être dans le sitemap
- Les lastmod doivent refléter la vraie date de mise à jour
- Le contenu doit être dans le HTML initial (pas uniquement en JS client-side)

---

## PARTIE 3 : Citabilité du contenu

### 3.1 Qu'est-ce que la citabilité ?

La **citabilité** est la facilité avec laquelle un moteur IA peut extraire une information factuelle claire de ton contenu pour la citer comme source dans sa réponse.

### 3.2 Structure de contenu citable

**Format optimal pour les AI Overviews et les réponses IA :**

#### Définitions claires
```
❌ "Le crédit à la consommation est un type de prêt qui peut être utilisé
    pour diverses dépenses et qui fonctionne de manière..."

✅ "Le crédit à la consommation est un prêt bancaire destiné à financer
    les achats courants (électroménager, auto, travaux). Son montant va
    de 200€ à 75 000€ et sa durée de 3 mois à 7 ans."
```

#### Listes et énumérations
```
✅ Les 3 types de crédit à la consommation :
   1. **Prêt personnel** : montant fixe, taux fixe, échéances constantes
   2. **Crédit renouvelable** : réserve d'argent utilisable à la demande
   3. **Crédit affecté** : lié à un achat spécifique (auto, travaux)
```

#### Tableaux comparatifs
```
✅ | Type de crédit | Taux moyen | Durée max | Montant max |
   |---------------|-----------|----------|------------|
   | Prêt personnel | 4-8% TAEG | 84 mois | 75 000€ |
   | Crédit renouvelable | 15-21% TAEG | Indéfinie | 6 000€ |
```

#### Questions/Réponses explicites
```
✅ **Quel est le taux moyen d'un prêt personnel en 2026 ?**
   Le taux moyen d'un prêt personnel en France en 2026 se situe
   entre 4% et 8% TAEG, selon le montant et la durée.
```

### 3.3 Scoring de citabilité (grille d'évaluation)

| Critère | Score 0 | Score 1 | Score 2 |
|---------|---------|---------|---------|
| **Réponse directe** | La page ne répond pas clairement à la requête | Réponse présente mais noyée dans le texte | Réponse claire dans les 2 premières phrases |
| **Données factuelles** | Pas de chiffres/données | Quelques données sans source | Données précises, sourcées, datées |
| **Structure** | Texte continu sans structure | Quelques sous-titres | H2/H3, listes, tableaux, gras |
| **Fraîcheur** | Pas de date visible | Date > 1 an | Date < 6 mois + date de mise à jour |
| **Longueur du passage citable** | Pas de passage extractible | Passage extractible mais > 300 mots | Passage citable de 50-150 mots |
| **Autorité** | Pas d'auteur, pas de source | Auteur nommé | Auteur expert avec bio + sources citées |

**Score total : /12.** Objectif : ≥ 8/12 pour chaque page stratégique.

### 3.4 Passage-level citability

Les moteurs IA extraient des **passages** (fragments) du contenu, pas la page entière. Chaque section de la page doit pouvoir fonctionner comme un "passage autonome" citable :

**Caractéristiques d'un bon passage :**
- Auto-suffisant (compréhensible hors contexte)
- 50-200 mots
- Contient une affirmation factuelle ou une réponse directe
- Bien délimité (entre deux H2/H3)
- Commence par le sujet (pas par "En effet..." ou "Il faut savoir que...")

---

## PARTIE 4 : Signaux de confiance pour les IA

### 4.1 Brand mentions (mentions de marque)

**Principe :** Les IA favorisent les sources qu'elles "reconnaissent" comme fiables. La notoriété de la marque influence la sélection.

**Comment renforcer les brand mentions :**
- Relations presse / médias en ligne (articles mentionnant la marque)
- Participation à des conférences, webinaires (transcriptions indexées)
- Présence sur les encyclopédies (Wikipedia, Wikidata)
- Avis clients sur les plateformes publiques (Trustpilot, Google Reviews)
- Profils sociaux actifs et vérifiés

### 4.2 Knowledge Graph et entités

**Objectif :** Être reconnu comme une "entité" par Google Knowledge Graph.

**Comment devenir une entité :**
1. Page Wikipedia (le signal le plus fort)
2. Fiche Wikidata (plus accessible que Wikipedia)
3. Google Business Profile (pour les entreprises locales)
4. Schema Organization complet avec sameAs
5. Mentions cohérentes sur le web (même nom, même adresse, mêmes infos)

### 4.3 Structured data pour les IA

Les données structurées aident les IA à comprendre le contenu de manière programmatique :

| Schema | Utilité pour les IA |
|--------|-------------------|
| Organization | Identifie l'entité émettrice |
| Article + Author | Identifie l'expert et la date |
| FAQ | Structure question/réponse directement extractible |
| HowTo | Étapes directement extractibles |
| Product + AggregateRating | Données produit structurées |
| BreadcrumbList | Contexte hiérarchique de la page |

---

## PARTIE 5 : Optimisation spécifique par plateforme

### 5.1 Google AI Overviews

**Évolution du taux de déclenchement :**
- Janvier 2025 : 6.49% des recherches
- Mi-2025 : ~24% des recherches
- Octobre 2025 : **>50% des recherches** (pic)
- Novembre 2025 : ~15-16% (variation saisonnière)
- Tendance : croissance globale avec fluctuations, significativement plus élevé sur les requêtes de comparaison et de haute intention

**Impact sur le CTR organique :** Les AI Overviews réduisent le CTR classique de **jusqu'à 61%** pour les requêtes où ils apparaissent (Dataslayer, 2025). D'où l'importance d'être DANS l'AI Overview plutôt qu'en dessous.

**Comment être cité :**
- Déjà bien positionné dans les résultats classiques (top 10-20)
- Contenu qui répond directement et de manière concise
- Structure H2/H3 + listes/tableaux
- Données structurées schema.org
- Expertise E-E-A-T démontrée
- Fraîcheur du contenu

**Ce qui déclenche un AI Overview :**
- Requêtes informationnelles complexes (99.2% des AI Overviews ont un intent informationnel)
- Requêtes de comparaison
- Requêtes "comment faire"
- Requêtes YMYL (avec précautions)
- Requêtes à haute intention avec besoin de synthèse

**Ce qui ne déclenche PAS d'AI Overview :**
- Requêtes navigationnelles simples ("facebook login")
- Requêtes très courtes (1 mot)
- Requêtes très locales

### 5.2 ChatGPT Search (SearchGPT)

**Spécificités :**
- Utilise OAI-SearchBot et ChatGPT-User pour crawler
- Citations avec liens dans le texte de la réponse
- Favorise les contenus récents et bien structurés
- Respecte le robots.txt (bloquer OAI-SearchBot = pas de citation)

### 5.3 Perplexity AI

**Spécificités :**
- Citations numérotées [1][2][3] avec liens cliquables
- Forte préférence pour les sources récentes (< 6 mois)
- Favorise les sites autoritaires dans leur niche
- Interface "Sources" visible = transparence pour l'utilisateur
- PerplexityBot respecte le robots.txt

### 5.4 Bing Copilot

**Spécificités :**
- Utilise l'index Bing (pas Google)
- Important : soumettre le site à Bing Webmaster Tools (pas seulement GSC)
- IndexNow : protocole de soumission instantanée compatible Bing
- Citations inline dans la réponse conversationnelle

---

## PARTIE 6 : Anti-patterns (ce qui nuit à la visibilité IA)

| Anti-pattern | Pourquoi c'est problématique |
|-------------|----------------------------|
| Bloquer tous les crawlers IA | Aucune chance d'être cité, perte de visibilité croissante |
| Contenu uniquement en JavaScript client-side | Les crawlers IA ne rendent pas toujours le JS |
| Paywall sans preview | Le crawler ne peut pas accéder au contenu |
| Contenu 100% IA sans valeur ajoutée | Pas d'expérience/expertise, contenu identique à des milliers d'autres |
| Pas de données structurées | Les IA peinent à identifier le type de contenu |
| Contenu non daté | Aucun signal de fraîcheur |
| Clickbait / titres exagérés | Les IA privilégient les sources fiables |
| Pas de page auteur | Pas de signal d'expertise |
| Contenu dupliqué d'autres sources | L'IA citera la source originale, pas la copie |
| Blocking DataDome/Cloudflare trop agressif | Peut bloquer les crawlers IA en plus des bots |

---

## PARTIE 7 : Monitoring de la visibilité IA

### 7.1 Outils de suivi

| Outil | Ce qu'il mesure |
|-------|----------------|
| **GSC > Search Appearance** | Apparitions dans les AI Overviews (filtre en cours de déploiement) |
| **Semrush AI Overview tracker** | Suivi des citations AI Overviews par mot-clé |
| **Perplexity** | Tester manuellement les requêtes et vérifier si le site est cité |
| **ChatGPT** | Tester manuellement les requêtes avec la fonctionnalité Search |
| **Web analytics (GA4)** | Filtrer le trafic référent : `source contains "perplexity"`, `chatgpt` |

### 7.2 KPIs GEO

| KPI | Comment le mesurer | Objectif |
|-----|-------------------|---------|
| Taux de citation AI Overviews | Semrush / suivi manuel | ≥ 20% des requêtes cibles |
| Trafic référent IA | GA4 filtrage source | Croissance mois par mois |
| Score de citabilité moyen | Grille d'évaluation (section 3.3) | ≥ 8/12 |
| % pages accessibles aux crawlers IA | Audit robots.txt | ≥ 80% des pages indexables |
| Mentions de marque dans les réponses IA | Tests manuels + outils | Présence sur les requêtes de marque |

---

## PARTIE 8 : Format de sortie de l'audit

### A. Accessibilité IA
| Crawler | Autorisé | Bloqué | Recommandation |
|---------|---------|--------|----------------|

### B. Score de citabilité (échantillon de pages)
| URL | Réponse directe | Données | Structure | Fraîcheur | Passage | Autorité | Score |
|-----|-----------------|---------|-----------|-----------|---------|----------|-------|

### C. Signaux de confiance
| Signal | Présent | Qualité | Action |
|--------|---------|---------|--------|
| Knowledge Panel | | | |
| Schema Organization | | | |
| Pages auteur | | | |
| Avis clients | | | |

### D. Plan d'action GEO
| Priorité | Action | Impact | Effort |
|----------|--------|--------|--------|
| P1 | Débloquer les crawlers IA / créer llms.txt | Accessibilité | Faible |
| P2 | Restructurer le contenu pour la citabilité | Citations | Moyen |
| P3 | Renforcer les signaux d'autorité | Trust IA | Élevé |

---

### Insights Babbar Masterclass (janvier 2024, Sylvain & Guillaume Peyronnet)

**L'analogie historique BERT → GPT → ChatGPT :**
Peyronnet utilise une analogie avec la révolution industrielle :
- **BERT** = une avancée technique (le marteau-pilon)
- **GPT** = une rupture technologique (la machine à vapeur)
- **ChatGPT** = une révolution industrielle (usage massif de la technologie)
"Les sites web sont les clous dans cette analogie" → les sites sont les objets sur lesquels cette révolution s'applique.

**Impact SGE (Search Generative Experience) — prédictions janvier 2024 :**
- "Il n'y a pas de résultats organiques above the fold" dans les résultats SGE
- La surface du contenu sponsorisé reste constante
- La surface du no-click (maintien visiteur dans Google) augmente
- **La surface de l'organique est divisée environ par 2**
- Prédictions observateurs US : **18 à 64% de baisse de trafic organique**, moyenne autour de **25%** (source : SE Ranking)

**Deux types de SGE identifiés par Peyronnet :**
1. **Réponse directe** à une intention de recherche : prolongation de ce que Google fait déjà (featured snippets, Knowledge Graph). Risque : "la disparition des intermédiaires — pourquoi visiter un site où il faudra passer du temps pour trouver une info qu'on nous donne par ailleurs ?"
2. **Mode conversationnel** : préciser sa recherche. Google devient un assistant de recherche. "Le moteur s'humanise — on passe de la logique interrogation d'une base de données à une logique d'assistant qui nous comprend."

**Insight clé :** "La révolution de l'IA c'est une **révolution d'interface utilisateur** d'abord. La machine se rapproche des usages humains réels."

**Recommandations Peyronnet pour le futur :**
- Anticiper la **hausse des budgets publicitaires** : les perdants en trafic organique compenseront par les Ads
- **Maximiser les critères E-E-A-T** : les sites qui sont déjà des références dans leur domaine auront un avantage
- Exemple Bing : un site peut être "présent 2 fois en organique" mais n'avoir "qu'un seul lien sur 3" en mode conversationnel → le trafic réel est capté par les concurrents cités dans la réponse IA

---

## Sources
- Google Search Central : AI Overviews documentation
- OpenAI : GPTBot documentation
- Perplexity : Publisher guidelines
- Web.dev : Structured Data for AI
- Études GEO : Princeton, Georgia Tech (2024)
- Backlinko : "Generative Engine Optimization (GEO)" (backlinko.com/generative-engine-optimization-geo)
- Search Engine Land : "What is GEO" (searchengineland.com)
- Semrush : "AI Overviews Study 2025" (semrush.com/blog/semrush-ai-overviews-study)
- DemandSage : "50 AI Overviews Statistics 2026" (demandsage.com)
- Exposure Ninja : "AI Search Statistics for 2026" (exposureninja.com)
- Masterclass Babbar (25-26 janvier 2024), Sylvain & Guillaume Peyronnet : analogie BERT/GPT/ChatGPT, impact SGE, deux types de SGE, recommandations futur
- The Digital Bloom : "Google AI Overviews 2025: Top Cited Domains" + "2025 AI Visibility Report" (thedigitalbloom.com)
- Seer Interactive : "AIO Impact on Google CTR: September 2025 Update" (seerinteractive.com)
- Dataslayer : "AI Overviews Killed CTR 61%" (dataslayer.ai)
- LLMrefs : "Generative Engine Optimization (GEO): The 2026 Guide" (llmrefs.com)
- Passionfruit : "Why AI Citations Come from Top 10 Rankings" (getpassionfruit.com)
- Evergreen Media : "GEO explained" (evergreen.media)
