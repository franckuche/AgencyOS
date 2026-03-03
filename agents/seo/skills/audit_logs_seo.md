# Process d'audit de logs SEO — Checklist universelle

> Framework complet applicable à tout type de site.
> Chaque étape suit un ordre logique : collecter → segmenter → analyser → croiser → recommander.

---

## PHASE 0 — PRÉREQUIS & COLLECTE

### 0.1 Données à récupérer avant de commencer

| Source | Données | Format attendu | Période min. |
|--------|---------|-----------------|--------------|
| Logs serveur (Apache/Nginx/Cloudflare/CDN) | Toutes les requêtes HTTP | CSV ou log brut | 30 jours min. |
| Screaming Frog | Crawl complet (no-JS + avec JS si SPA/framework) | Export CSV | Jour J |
| Sitemap XML | Toutes les URLs déclarées | URL du sitemap | Jour J |
| Google Search Console | Rapport couverture + stats crawl + performances | Export CSV | 90 jours |
| robots.txt | Fichier complet | Texte brut | Jour J |
| CrUX / PageSpeed Insights | Core Web Vitals terrain + labo | API ou export | Jour J |
| Outil backlinks (Babbar, Ahrefs, Majestic) | Métriques d'autorité du domaine | Export | Jour J |

### 0.2 Champs indispensables dans les logs

| Champ | Pourquoi |
|-------|----------|
| Date + heure | Analyse temporelle |
| IP client | Identification bots, déduplication |
| User-Agent | Classification bot vs humain |
| URL demandée | Analyse par section/type de page |
| Code HTTP | Performance serveur |
| Méthode HTTP | GET/POST/HEAD |
| Temps de réponse (TTFB) | Performance |
| Octets transférés | Bande passante, poids pages |
| Referer | Source de la requête |
| Protocole (HTTP/1.1, 2, 3) | Négociation serveur |

**Si des champs manquent** → le signaler dès le début du livrable. Ça conditionne ce qu'on peut analyser ou non.

### 0.3 Préparation des données

- [ ] Vérifier la couverture temporelle (dates début/fin, jours manquants)
- [ ] Vérifier la volumétrie (nb total de lignes, cohérence avec le trafic estimé)
- [ ] Nettoyer les requêtes internes (monitoring, healthchecks, IPs internes)
- [ ] Classifier les User-Agents : humains / bots identifiés / bots non classés
- [ ] Valider les "vrais" Googlebot (reverse DNS ou IP ranges officiels Google)
- [ ] Segmenter les URLs par section du site (regex sur les paths)
- [ ] Segmenter les URLs par type : HTML / CSS / JS / images / fonts / API / autre

---

## PHASE 1 — PANORAMA GÉNÉRAL DU CRAWL

> Objectif : donner une vue macro avant de plonger dans les détails.

### 1.1 Volumétrie globale

- [ ] Nombre total de requêtes sur la période
- [ ] Répartition humains / bots identifiés / bots non classés (donut chart)
- [ ] Nombre d'URLs uniques crawlées
- [ ] Ratio URLs uniques / total requêtes (taux de re-crawl)
- [ ] Répartition par méthode HTTP (GET / POST / HEAD / PUT)

### 1.2 Identification et classification des bots

- [ ] Volume de crawl par bot (top 15-20, bar chart)
- [ ] Regroupement par famille :
  - Google (Googlebot, AdsBot, Googlebot-Image, Storebot, etc.)
  - Bing (Bingbot, msnbot, BingPreview)
  - Bots IA (ChatGPT-User, GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Bytespider)
  - SEO tiers (AhrefsBot, SemrushBot, MJ12bot, DataForSEO)
  - Social (Meta/Facebook, Twitterbot, LinkedInBot)
  - Autres (PetalBot, Amazonbot, Applebot, Seekport, Sogou, Yandex)
- [ ] Bots non identifiés : analyse des User-Agents bruts (bots déguisés en navigateurs ?)
- [ ] Détection de faux Googlebot (vérification IP)
- [ ] Nouveaux bots apparus sur la période vs historique

### 1.3 Codes réponse par bot

- [ ] Tableau croisé complet : bot × code HTTP (200, 301, 302, 304, 403, 404, 410, 500, 503)
- [ ] Taux de 200 OK par bot
- [ ] Taux d'erreur (4xx + 5xx) par bot
- [ ] Identification des bots à problème (taux d'erreur anormalement élevé)
- [ ] Taux de redirections (301/302) par bot — signal de liens obsolètes
- [ ] Taux de 304 Not Modified par bot — le bot reçoit-il du contenu frais ou du cache ?

---

## PHASE 2 — ANALYSE TEMPORELLE

> Objectif : détecter les patterns, anomalies, corrélations dans le temps.

### 2.1 Volume de crawl dans le temps

- [ ] Courbe jour par jour du crawl total (30 jours)
- [ ] Courbe jour par jour par bot principal (Googlebot, Bingbot, bots IA sur le même graphe)
- [ ] Détection de pics et chutes anormaux
- [ ] Corrélation avec événements connus (déploiements, updates sitemap, updates algo Google)
- [ ] Comparaison week-end vs semaine par bot

### 2.2 Pattern horaire

- [ ] Crawl horaire par bot principal (line chart multi-séries)
- [ ] Identification des pics horaires par bot
- [ ] Superposition crawl bots vs trafic humain par heure (bots aux heures de pic = surcharge ?)
- [ ] Volume crawl par heure × section du site (les pages stratégiques sont-elles crawlées ?)

### 2.3 Heatmaps

- [ ] **Heatmap erreurs 4xx** : heures × jours de la semaine (Googlebot)
- [ ] **Heatmap erreurs 5xx** : heures × jours (tous bots + humains)
- [ ] **Heatmap codes HTTP complets** : 200/301/304/4xx/5xx par heure (Googlebot)
- [ ] **Heatmap volume crawl** : heures × jours (Googlebot) — quand crawle-t-il le plus ?
- [ ] **Heatmap multi-bots simultanés** : nombre de bots actifs par créneau horaire
- [ ] Corrélation volume de requêtes simultanées vs apparition de 5xx

---

## PHASE 3 — PERFORMANCE SERVEUR

> Objectif : mesurer la capacité du serveur à répondre aux bots.

### 3.1 Temps de réponse (TTFB)

- [ ] TTFB moyen / médian / P75 / P90 / P95 par bot
- [ ] TTFB par tranche horaire (Googlebot) — fenêtres de dégradation
- [ ] TTFB par section du site — sections lentes vs rapides
- [ ] TTFB par code réponse — les 301 sont-elles instantanées ? les 404 passent-elles par la DB ?
- [ ] TTFB par profondeur d'URL (nb de segments dans le path)
- [ ] TTFB Googlebot vs humains — le serveur traite-t-il les bots différemment ?
- [ ] Distribution du TTFB (histogramme) — forme bimodale = cache hit vs miss
- [ ] Évolution du TTFB jour par jour — dégradation progressive vs pic soudain
- [ ] Identification des URLs les plus lentes (top 20 par TTFB moyen)

### 3.2 Taille des réponses (si disponible dans les logs)

- [ ] Octets transférés par bot
- [ ] Taille moyenne par type de page / section
- [ ] Impact des bots IA sur la bande passante (volume × taille)
- [ ] Pages anormalement lourdes (> 5MB)
- [ ] Ratio compression gzip/brotli

### 3.3 Protocole

- [ ] Répartition HTTP/1.1 vs HTTP/2 vs HTTP/3 par bot
- [ ] Googlebot reçoit-il bien du HTTP/2 ?

### 3.4 Erreurs serveur (5xx)

- [ ] Volume total de 5xx (par code : 500, 502, 503, 504)
- [ ] Répartition 5xx bots vs humains
- [ ] 5xx par bot (Googlebot touché ?)
- [ ] Top URLs générant des 5xx (avec fréquence)
- [ ] Distribution temporelle des 5xx (pattern de déploiement ? pic de charge ?)
- [ ] Impact sur le crawl rate : Googlebot ralentit-il après une série de 5xx ?
- [ ] Pages critiques business touchées par les 5xx (formulaires, checkout, conversion)

---

## PHASE 4 — BUDGET CRAWL

> Objectif : mesurer l'efficacité du crawl — combien de requêtes sont utiles vs gaspillées.

### 4.1 Fréquence de crawl par URL

- [ ] Distribution : URLs crawlées 1 fois vs 2-5 fois vs 10+ fois vs 50+ fois
- [ ] Top 50 URLs les plus crawlées (avec code réponse dominant)
- [ ] URLs stratégiques sous-crawlées (pages de conversion, catégories clés)
- [ ] Ratio pages crawlées / pages totales du site
- [ ] Pages jamais crawlées sur la période (croiser avec sitemap)

### 4.2 Crawl par type de ressource

- [ ] Répartition HTML / CSS / JS / images / fonts / API / sitemap / robots.txt
- [ ] Requêtes gaspillées sur des ressources non-HTML
- [ ] Si CDN en place : les ressources statiques apparaissent-elles dans les logs ? (CDN = pas dans les logs serveur d'origine)

### 4.3 Crawl par section du site

- [ ] Volume de crawl par section (bar chart top 10-15)
- [ ] Part du crawl budget par section vs part du trafic organique de cette section
- [ ] Sections sur-crawlées (beaucoup de crawl, peu de trafic/valeur SEO)
- [ ] Sections sous-crawlées (pages stratégiques ignorées par Googlebot)
- [ ] Crawl des URLs paramétrées — combien d'URLs uniques générées par les paramètres ?

### 4.4 Budget crawl par profondeur

- [ ] Nombre de requêtes Googlebot par profondeur de page (clics depuis la home)
- [ ] Croisement profondeur × fréquence de crawl — les pages profondes sont-elles visitées ?

### 4.5 Gaspillage de crawl

- [ ] Requêtes sur des pages en 301 (liens internes obsolètes)
- [ ] Requêtes sur des pages en 404 (pages mortes encore linkées/dans sitemap)
- [ ] Requêtes sur des pages noindex (crawlées mais pas indexables)
- [ ] Requêtes sur des URLs paramétrées (gclid, utm, filtres facettés, pagination)
- [ ] Requêtes sur des pages techniques (/admin, /login, /api, /node, etc.)
- [ ] **Total du gaspillage** : % du crawl budget Googlebot qui ne sert pas le SEO
- [ ] Estimation du crawl budget récupérable avec les corrections

---

## PHASE 5 — ERREURS CLIENT (4xx)

> Objectif : nettoyer les erreurs qui gaspillent du budget et dégradent la qualité.

### 5.1 Volumétrie 404

- [ ] Total des 404 (tous bots + humains)
- [ ] 404 vues par Googlebot spécifiquement
- [ ] Top 50 URLs en 404 (par nombre de hits)
- [ ] Source des 404 : liens internes / sitemap / backlinks externes / scraping ?
- [ ] Catégorisation des 404 par pattern (/wp-*, /.well-known/*, /images/*, anciennes URLs migrées, etc.)

### 5.2 Autres erreurs client

- [ ] Pages en 403 (Forbidden) crawlées par Googlebot — bloquées par erreur ?
- [ ] Pages en 410 (Gone) — signal explicite de suppression, bien géré ?
- [ ] Soft 404 — pages qui renvoient 200 mais avec un contenu "page introuvable" (croiser avec Screaming Frog)

---

## PHASE 6 — REDIRECTIONS

> Objectif : identifier les chaînes de redirections et les liens internes obsolètes.

### 6.1 Analyse des redirections

- [ ] Volume de 301 et 302 par bot
- [ ] Top 50 URLs redirigées les plus crawlées
- [ ] Chaînes de redirections (A → 301 → B → 301 → C) — nombre et profondeur
- [ ] Redirections 302 (temporaires) qui devraient être des 301 (permanentes)
- [ ] Boucles de redirection (A → B → A)
- [ ] Redirections vers des 404 (301 → 404)
- [ ] Redirections depuis des pages à backlinks (perte de jus si chaîne trop longue)

### 6.2 Liens internes obsolètes

- [ ] Liens internes qui pointent vers des 301 (au lieu de la destination finale)
- [ ] Volume de crawl Googlebot gaspillé en redirections (% du total)
- [ ] Évolution dans le temps : le taux de 301 baisse-t-il ? (signe que les liens sont corrigés)

---

## PHASE 7 — CROISEMENTS LOGS × AUTRES SOURCES

> Objectif : croiser les logs avec Screaming Frog, GSC, sitemap pour des insights impossibles à obtenir avec une seule source.

### 7.1 Logs × Sitemap

- [ ] URLs dans le sitemap jamais crawlées par Googlebot → problème de découverte
- [ ] URLs crawlées par Googlebot mais absentes du sitemap → sitemap incomplet
- [ ] URLs dans le sitemap en erreur (404, 500) → sitemap sale
- [ ] URLs mal formées dans le sitemap (majuscules, espaces, caractères spéciaux)
- [ ] Fréquence de crawl des URLs du sitemap vs hors sitemap
- [ ] Cohérence lastmod du sitemap vs date réelle de crawl

### 7.2 Logs × Screaming Frog

- [ ] Pages dans les logs mais pas dans le crawl SF → découvertes uniquement via JS, backlinks, ou sitemap
- [ ] Pages dans le crawl SF mais jamais dans les logs → jamais crawlées par Googlebot
- [ ] Pages indexables dans SF mais en 301/404 dans les logs → incohérence
- [ ] Croisement profondeur SF × fréquence de crawl dans les logs

### 7.3 Logs × GSC (si accès disponible)

- [ ] Pages crawlées dans les logs mais "Découverte, actuellement non indexée" dans GSC
- [ ] Pages crawlées mais "Explorée, actuellement non indexée" → problème de qualité
- [ ] Pages indexées dans GSC mais jamais dans les logs (période récente) → Google garde en index sans re-crawler
- [ ] Corrélation fréquence de crawl × impressions GSC → les pages re-crawlées performent-elles mieux ?
- [ ] Stats de crawl GSC vs logs → les chiffres correspondent-ils ?

### 7.4 Logs × Rendering JS (si site JS-dépendant)

- [ ] Pages dont le contenu change radicalement entre HTML brut et rendu JS
- [ ] Pages dont la canonical n'apparaît qu'après rendering JS
- [ ] Pages dont le statut d'indexabilité change après rendering JS
- [ ] Liens internes visibles uniquement après rendering JS
- [ ] Ratio poids HTML brut vs HTML rendu (×170 = tout est en JS)

---

## PHASE 8 — BOTS IA (spécifique post-2024)

> Objectif : mesurer et gérer l'impact des bots IA sur le crawl et la visibilité GEO.

### 8.1 Volumétrie bots IA

- [ ] Volume par bot IA : ChatGPT-User, GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Bytespider, Applebot (si Apple Intelligence)
- [ ] Part des bots IA dans le crawl total
- [ ] Évolution du volume bots IA sur la période (tendance croissante ?)

### 8.2 Comportement des bots IA

- [ ] Pattern horaire : crawl temps réel (utilisateurs qui posent des questions) vs crawl batch (indexation)
- [ ] Sections ciblées par les bots IA vs Googlebot — crawlent-ils les mêmes pages ?
- [ ] URLs les plus crawlées par les bots IA (top 20) — quels contenus intéressent les LLM ?
- [ ] Codes réponse par bot IA
- [ ] TTFB par bot IA
- [ ] Impact sur la bande passante (volume × taille réponse)

### 8.3 Gestion des bots IA

- [ ] Directives robots.txt pour chaque bot IA (autorisé, limité, bloqué ?)
- [ ] Crawl-delay configuré ?
- [ ] Fichier llms.txt présent ?
- [ ] Stratégie : quels bots autoriser (ceux qui citent la source) vs bloquer (ceux qui scrappent sans attribution)
- [ ] Superposition crawl bots IA × Googlebot par heure → surcharge cumulée ?

---

## PHASE 9 — PAGES ORPHELINES & COUVERTURE

> Objectif : identifier les pages invisibles ou sous-exploitées.

### 9.1 Pages orphelines

- [ ] Pages dans les logs mais à 0 lien interne entrant (SF) → découvertes uniquement via sitemap ou backlinks
- [ ] Pages dans le sitemap mais à 0 lien interne entrant → orphelines déclarées
- [ ] Pages quasi-orphelines (1-3 liens entrants uniques) → insuffisamment maillées
- [ ] Quantification : nb de pages orphelines / quasi-orphelines, par section

### 9.2 Couverture de crawl

- [ ] Diagramme de Venn : Sitemap ∩ Crawl SF ∩ Logs Googlebot
- [ ] URLs exclusives à chaque source (dans sitemap mais pas crawlées, crawlées mais pas dans sitemap, etc.)
- [ ] Taux de couverture : % des pages indexables effectivement crawlées sur la période
- [ ] Temps moyen pour qu'une nouvelle page soit crawlée après ajout au sitemap

---

## PHASE 10 — SÉCURITÉ & ANOMALIES

> Objectif : détecter les comportements suspects et les failles.

### 10.1 Sécurité

- [ ] Tentatives d'accès à des chemins sensibles (/wp-admin, /wp-login, /phpmyadmin, /.env, /.git)
- [ ] Volume de scanners de vulnérabilité (par IP/UA)
- [ ] Données personnelles exposées dans les URLs (emails, téléphones, tokens dans les query strings)
- [ ] APIs internes accessibles publiquement

### 10.2 Anomalies de crawl

- [ ] URLs anormalement longues (> 200 caractères)
- [ ] URLs avec des paramètres infinis (crawl traps : filtres facettés, calendriers, pagination infinie)
- [ ] Pics soudains de crawl d'un bot spécifique (attaque ou reconfiguration ?)
- [ ] Requêtes POST de bots (normalement les bots ne font que des GET)

---

## PHASE 11 — SYNTHÈSE & RECOMMANDATIONS

> Objectif : transformer les données en plan d'action priorisé.

### 11.1 Tableau de synthèse

- [ ] Score par axe (A/B/C/D/F) avec justification data
- [ ] Top 10 actions priorisées (P0/P1/P2/P3)
- [ ] Pour chaque action : impact estimé + effort + données qui justifient

### 11.2 KPIs de suivi

- [ ] Taux de 200 Googlebot (cible > 90%)
- [ ] % de crawl budget gaspillé (cible < 10%)
- [ ] Nombre de 5xx Googlebot (cible = 0)
- [ ] TTFB P95 Googlebot (cible < 500ms)
- [ ] Taux de couverture crawl (pages crawlées / pages indexables)
- [ ] Part des bots IA dans le trafic bot (suivi tendance)

### 11.3 Process de suivi

- [ ] Fréquence recommandée de re-analyse des logs (mensuel, trimestriel)
- [ ] Alertes à mettre en place (pic de 5xx, nouveau bot inconnu, chute de crawl rate)
- [ ] Dashboard de monitoring recommandé (outils, métriques clés)

---

## ADAPTATIONS PAR TYPE DE SITE

| Type de site | Points à renforcer |
|-------------|-------------------|
| **E-commerce** | Crawl des pages filtrées/facettées, pagination produits, URLs paramétrées (tri, filtres), crawl des fiches produit vs catégories, impact soldes/promos sur le crawl |
| **Média / éditorial** | Fréquence de crawl des articles frais, crawl des pages AMP, Google News bot, crawl des archives vs contenu récent |
| **SaaS / app** | Pages derrière authentification, single-page app (SPA) rendering, crawl des pages de documentation |
| **Site vitrine / PME** | Budget crawl limité = chaque requête compte, focus sur la couverture (toutes les pages sont-elles crawlées au moins 1×/mois ?) |
| **Marketplace** | Crawl des fiches vendeurs, UGC (avis, questions), pages de résultats de recherche interne, canonical des variantes produit |
| **Site YMYL (santé, finance, assurance)** | Schema.org critique, bots IA à gérer stratégiquement (visibilité GEO), E-E-A-T via données structurées |
| **Site international** | Crawl par version linguistique, hreflang dans les logs, bots régionaux (Yandex, Baidu, Naver) |
| **Site à CDN (Cloudflare, Fastly)** | Logs CDN vs logs origine, cache hit ratio par bot, ressources statiques invisibles dans les logs origine |
