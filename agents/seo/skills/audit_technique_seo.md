# Skill : Audit Technique SEO (Expert)

## Instructions

Tu es un expert SEO technique senior. Tu analyses les exports Screaming Frog (interne_tous.csv, rapport_aperçu_problemes.csv) et les données live (robots.txt, sitemap, headers HTTP) pour produire un audit technique SEO exhaustif.

Tu couvres : indexation, crawlabilité, canonicalisation, redirections, performance serveur, structure HTML, sécurité, et conformité aux guidelines Google.

---

## PARTIE 1 : Crawlabilité

### 1.1 Robots.txt

**Éléments à vérifier :**
- Localisation : `https://domaine.fr/robots.txt` (doit retourner un 200)
- Directives `Disallow` : quelles sections sont bloquées ?
- Directives `Allow` : exceptions aux Disallow
- Déclaration `Sitemap:` : présence et URL correcte
- `User-agent` spécifiques : Googlebot, Bingbot, GPTBot, etc.
- Pas de `Disallow: /` global (bloquerait tout le site)
- Pas de blocage accidentel de CSS/JS (empêche le rendu)

**Erreurs fréquentes :**
| Erreur | Impact | Détection |
|--------|--------|-----------|
| Blocage de /wp-content/ ou /assets/ | Google ne peut pas rendre les pages | SF > Directives tab |
| Sitemap non déclaré | Google ne découvre pas les URLs | Lecture manuelle du robots.txt |
| Wildcard trop large (`Disallow: /*?`) | Bloque les paramètres légitimes | Tester avec Google robots.txt tester |
| robots.txt en 404/500 | Google considère tout comme autorisé pendant un temps, puis bloque tout | Vérifier le code HTTP |

**Gestion des crawlers IA (2025+) :**
| Crawler | User-agent | Éditeur | Action recommandée |
|---------|-----------|---------|-------------------|
| GPTBot | GPTBot | OpenAI | Autoriser le contenu public, bloquer les tunnels de conversion |
| ChatGPT-User | ChatGPT-User | OpenAI | Idem GPTBot |
| Google-Extended | Google-Extended | Google | Bloquer = empêche l'entraînement IA mais pas la recherche |
| ClaudeBot / anthropic-ai | anthropic-ai, Claude-Web | Anthropic | Autoriser le contenu informatif |
| PerplexityBot | PerplexityBot | Perplexity | Autoriser (source de trafic potentielle) |
| Applebot-Extended | Applebot-Extended | Apple | Bloquer = empêche l'utilisation par Apple Intelligence |

**Recommandation stratégique :** Autoriser les crawlers IA sur le contenu informatif (articles, guides, FAQ) et les bloquer sur les pages transactionnelles (souscription, panier, espace client).

### 1.2 Sitemap XML

**Vérifications obligatoires :**
- Le sitemap est-il déclaré dans le robots.txt ?
- Format : sitemap index vs sitemap unique
- Nombre d'URLs : cohérence avec le nombre de pages indexables crawlées
- Toutes les URLs ont-elles un `<lastmod>` ?
- Les dates `<lastmod>` sont-elles récentes et réalistes ?
- Pas de `<changefreq>` ni `<priority>` (ignorés par Google, bruit inutile)
- Pas d'URLs non-200 dans le sitemap (404, 301, 302 = pollution)
- Pas d'URLs noindex dans le sitemap (contradiction)
- Pas d'URLs non-canoniques dans le sitemap
- Namespace `xmlns:xhtml` déclaré mais pas utilisé = code mort

**Données GSC — Rétention limitée (source : Peak Ace, 2025) :**
Google Search Console ne conserve les données que pendant **16 mois**. Sans archivage automatisé, les données historiques de visibilité sont perdues, rendant impossible le suivi des tendances annuelles et les comparaisons year-over-year. Recommandation : mettre en place un export automatisé via l'API GSC vers une base de données dédiée (BigQuery, PostgreSQL) ou utiliser des outils comme Supermetrics, Data Studio, ou des scripts Python personnalisés.

**Analyse de cohérence crawl vs sitemap :**
| Situation | Signification | Action |
|-----------|--------------|--------|
| URL dans sitemap mais pas crawlée | Page orpheline ou bloquée | Vérifier l'accessibilité |
| URL crawlée mais pas dans sitemap | Oubli ou exclusion volontaire | Ajouter si indexable |
| URL 404 dans sitemap | Sitemap obsolète | Nettoyer le sitemap |
| URL noindex dans sitemap | Contradiction | Retirer du sitemap |

**Segmentation recommandée (gros sites) :**
- `sitemap-products.xml` : pages produits
- `sitemap-categories.xml` : pages catégories
- `sitemap-blog.xml` : articles de blog
- `sitemap-pages.xml` : pages statiques
- Max 50 000 URLs ou 50 Mo par fichier sitemap

### 1.3 Budget de crawl

**Précision John Mueller (2025-2026) :** Le crawl budget est un problème qui ne concerne principalement que les **sites de plus de 100 000 URLs**. Il n'existe pas de benchmark officiel Google pour le crawl budget — il n'y a pas de "nombre optimal" à viser. Pour la plupart des sites, il suffit de garder le sitemap propre, corriger les duplicatas et améliorer le maillage interne.

**En 2026, l'indexation n'est plus automatique.** Google crawle plus d'URLs qu'il n'en indexe, filtrant agressivement selon la valeur, la confiance et l'utilité. Avoir du contenu de qualité et des signaux de confiance est devenu un prérequis à l'indexation, pas uniquement au ranking.

**Indicateurs de problème de budget de crawl :**
- Pages profondes non crawlées par Google (vérifier dans GSC > Statistiques d'exploration)
- Temps de réponse serveur > 500ms (ralentit le crawl)
- Taux d'erreur serveur élevé (5xx)
- Pages dupliquées massives (paramètres URL, filtres, pagination)
- Redirect chains longues (3+ maillons)

**Optimisations :**
1. Réduire le nombre de pages non indexables accessibles au crawler
2. Corriger les erreurs serveur
3. Améliorer le temps de réponse (**Mueller recommande < 300-400ms** pour que Google crawle efficacement, idéalement < 200ms)
4. Obfusquer les liens vers les pages sans valeur SEO
5. Consolider les variantes de pages (canonicals, paramètres)
6. Analyser les logs serveur pour identifier quelles pages sont réellement crawlées, à quelle fréquence, et lesquelles sont ignorées

---

## PARTIE 2 : Indexation

### 2.1 Statuts d'indexabilité

**Catégorisation des pages crawlées :**

| Statut | Signification | Action |
|--------|--------------|--------|
| Indexable | Page accessible, pas de directive noindex, canonical self-referencing | OK |
| Non-Indexable (noindex) | Directive `noindex` dans meta robots ou X-Robots-Tag | Vérifier si intentionnel |
| Non-Indexable (canonicalisée) | Canonical pointe vers une autre URL | Vérifier la pertinence du canonical |
| Non-Indexable (nofollow + noindex) | Double blocage | Vérifier si intentionnel |
| Non-Indexable (robots.txt) | Bloqué par robots.txt | Vérifier si intentionnel |

### 2.2 Balise canonical

**Règles de la canonical :**
- Chaque page indexable doit avoir un canonical **self-referencing** (pointant vers elle-même)
- Le canonical doit être en URL absolue (pas relative)
- Le canonical doit correspondre au protocole (https, pas http)
- Le canonical doit correspondre à la version www/non-www utilisée
- Pas de canonical vers une page 404 ou redirigée
- Pas de canonical vers une page noindex
- Canonical dans le `<head>` HTML ET/OU dans le header HTTP `Link: <url>; rel="canonical"`

**Erreurs fréquentes :**
| Erreur | Impact | Prévalence |
|--------|--------|-----------|
| Canonical manquant | Google choisit seul la version canonique | Très fréquent |
| Canonical vers une mauvaise URL | Google peut déindexer la bonne page | Grave |
| Canonical HTTP vs HTTPS | Signal contradictoire | Fréquent |
| Canonical avec paramètres de tracking | Fragmentation du signal | Fréquent |
| Canonical en chaîne (A→B→C) | Signal dilué | Moins fréquent |
| Canonical + noindex sur la même page | Contradiction (Google ignore l'un des deux) | Fréquent |

### 2.3 Meta robots et X-Robots-Tag

**Directives possibles :**
- `index` / `noindex` : autoriser ou bloquer l'indexation
- `follow` / `nofollow` : suivre ou non les liens de la page
- `noarchive` : empêcher la mise en cache par Google
- `nosnippet` : empêcher l'affichage d'un extrait dans les SERPs
- `max-snippet:N` : limiter la longueur de l'extrait à N caractères
- `max-image-preview:large|standard|none` : contrôler l'affichage des images
- `max-video-preview:N` : contrôler la preview vidéo
- `notranslate` : empêcher la traduction automatique
- `unavailable_after:date` : planifier le retrait de l'index

**X-Robots-Tag (header HTTP) :**
- Même directives que meta robots
- Utile pour les fichiers non-HTML (PDF, images)
- Priorité : si meta robots ET X-Robots-Tag, la directive la plus restrictive s'applique

### 2.4 Hreflang (sites multilingues)

**Format :**
```html
<link rel="alternate" hreflang="fr" href="https://www.site.fr/page" />
<link rel="alternate" hreflang="en" href="https://www.site.com/page" />
<link rel="alternate" hreflang="x-default" href="https://www.site.com/page" />
```

**Règles :**
- Chaque page doit référencer TOUTES les versions linguistiques Y COMPRIS elle-même
- `x-default` = version par défaut (généralement anglais ou page de sélection de langue)
- Les URLs doivent être en version canonique (pas de redirections)
- Bidirectionnel : si A hreflang→B, alors B doit hreflang→A
- Peut être implémenté en HTML `<head>`, header HTTP, ou sitemap XML

**Erreurs fréquentes :**
- Balises hreflang non réciproques
- Code langue/pays incorrect (fr-FR vs fr)
- URLs non canoniques dans les hreflang
- Hreflang manquant pour certaines pages/langues

---

## PARTIE 3 : Contenu et on-page

### 3.1 Title

**Règles :**
- Longueur : 50-60 caractères (max ~568px en largeur)
- Mot-clé principal au début
- Unique par page (pas de duplicatas)
- Descriptif et incitatif au clic
- Inclure le nom de marque (fin du title, séparé par | ou -)

**Problèmes courants :**
| Problème | Seuil | Impact |
|----------|-------|--------|
| Title manquant | 0 caractères | Critique : Google génère un title automatique |
| Title trop court | < 30 caractères | Sous-optimisé, faible CTR |
| Title trop long | > 60 chars / > 568px | Tronqué dans les SERPs |
| Title dupliqué | 2+ pages identiques | Cannibalisation |
| Title = H1 | Identique | Opportunité manquée de cibler des variantes |

### 3.2 Meta description

**Règles :**
- Longueur : 120-155 caractères (max ~920px)
- Unique par page
- Contient le mot-clé principal (Google met en gras les termes recherchés)
- Incitatif au clic (CTA implicite, bénéfice utilisateur)
- Pas d'impact direct sur le ranking, mais impact sur le CTR

**Note :** Google réécrit la meta description dans ~60-70% des cas (étude Ahrefs 2024 : 62.78% des meta descriptions sont réécrites). Une bonne meta description augmente quand même les chances qu'elle soit utilisée et impacte directement le CTR.

### 3.3 Headings (H1-H6)

**Règles :**
- Un seul H1 par page (contenant le mot-clé principal)
- Structure hiérarchique logique (H1 > H2 > H3, pas de saut de niveau)
- H1 ≠ Title (variante du mot-clé, pas copie exacte)
- H2 : sous-thèmes principaux (mots-clés secondaires)
- H3-H6 : sous-sections détaillées

**Problèmes :**
| Problème | Impact |
|----------|--------|
| H1 manquant | Google ne comprend pas le sujet principal |
| H1 multiples | Signal dilué (acceptable en HTML5 mais déconseillé pour le SEO) |
| H1 vide | Pire que manquant |
| Structure non hiérarchique | Confusion sémantique |
| H2/H3 génériques ("Notre offre", "En savoir plus") | Opportunité de mot-clé perdue |

### 3.4 Contenu dupliqué

**Types :**
- **Exact duplicate** : même contenu sur 2+ URLs (paramètres, www/non-www, http/https, trailing slash)
- **Near duplicate** : contenu très similaire (>85% de similarité)
- **Thin content** : pages avec très peu de contenu unique (<100 mots)
- **Boilerplate dominant** : le template représente >70% du contenu de la page

**Détection SF :**
- Colonne "Quasi-doublon le plus proche" + "Nombre de quasi-doublons"
- Colonne "Hachage" : pages avec le même hash = exact duplicate

**Solutions :**
| Type | Solution |
|------|----------|
| Exact duplicate (URLs techniques) | Canonical vers la version principale |
| Exact duplicate (pages distinctes) | Fusionner les contenus + 301 |
| Near duplicate | Différencier le contenu OU fusionner + 301 |
| Thin content | Enrichir (>300 mots minimum) ou noindex |
| Boilerplate dominant | Augmenter le ratio texte/template |

### 3.5 Images

**Optimisation SEO des images :**
- Attribut `alt` descriptif (mot-clé si pertinent, pas de bourrage)
- Nom de fichier descriptif (`credit-auto-simulation.jpg` > `IMG_4523.jpg`)
- Format moderne : WebP ou AVIF (compression supérieure)
- Lazy loading : `loading="lazy"` sur les images below the fold
- Dimensions explicites : `width` et `height` pour éviter le CLS
- Compression : viser < 100 Ko pour les images de contenu
- Sitemap images : optionnel mais utile pour les sites visuels

---

## PARTIE 4 : Redirections

### 4.1 Types de redirections

| Code | Type | Usage | Transfert PRi |
|------|------|-------|---------------|
| 301 | Permanente | Page supprimée définitivement, migration | ~100% (confirmé Google 2016+) |
| 302 | Temporaire | Maintenance, A/B test, contenu saisonnier | ~100% (Google traite comme 301 sur le long terme) |
| 308 | Permanente (POST preserved) | API, formulaires | Comme 301 |
| 307 | Temporaire (POST preserved) | API | Comme 302 |
| Meta refresh | Lente | À ÉVITER | Partiel, mauvaise UX |
| JavaScript redirect | Lente | À ÉVITER | Partiel, non fiable |

**Bonnes pratiques :**
- Utiliser 301 par défaut pour les redirections permanentes
- Vérifier que la destination est en 200 (pas de chaîne de redirections)
- Rediriger vers la page la plus pertinente (pas systématiquement vers la homepage)
- Conserver les redirections au minimum 1 an (Google les "oublie" au-delà)

### 4.2 Redirect chains et loops

**Redirect chain :** A → 301 → B → 301 → C
- Chaque maillon = latence supplémentaire + consommation budget crawl
- Google suit max 5 redirections puis abandonne
- Correction : A → 301 → C (directement)

**Redirect loop :** A → 301 → B → 301 → A
- Page inaccessible, erreur de crawl
- Détection : SF > Redirect Chains report > filtrer les boucles
- Correction : casser la boucle en fixant la destination finale

### 4.3 Redirections problématiques

| Problème | Détection SF | Impact |
|----------|-------------|--------|
| Redirection HTTP → HTTPS → www | Response Codes > 3xx | Double redirect, latence |
| Redirect vers 404 | Redirect chain > destination 404 | PRi perdu |
| Redirect chain > 3 niveaux | Redirect Chains report | Budget crawl gaspillé |
| Redirect loop | Redirect Chains report | Page inaccessible |
| Redirect temporaire (302) pour du permanent | Response Codes > 302 | Confusion Google |
| Page avec liens vers des 301 | All Inlinks > destination 301 | PRi dilué (léger) |

---

## PARTIE 5 : Performance serveur

### 5.1 TTFB (Time to First Byte)

**Seuils :**
| TTFB | Évaluation |
|------|-----------|
| < 200ms | Excellent |
| 200-500ms | Acceptable |
| 500ms-1s | Problématique |
| > 1s | Critique |

**Données SF :** Colonne "Temps de réponse" dans le crawl.

**Facteurs :**
- Configuration serveur (Apache, Nginx, IIS)
- Base de données (requêtes lentes)
- CMS/Application (temps de rendu server-side)
- CDN (présence ou absence)
- Distance géographique serveur-utilisateur
- Caching serveur (Varnish, Redis, Memcached)

### 5.2 Taille des pages

**Seuils recommandés :**
| Ressource | Max recommandé |
|-----------|---------------|
| HTML | < 100 Ko (décompressé) |
| CSS total | < 100 Ko |
| JS total | < 300 Ko |
| Images (par image) | < 100 Ko (contenu), < 200 Ko (hero) |
| Page totale | < 3 Mo |

### 5.3 Compression

**Vérifier que la compression gzip ou Brotli est activée :**
- Header `Content-Encoding: gzip` ou `Content-Encoding: br`
- Ratio de compression attendu : 60-80% pour le HTML/CSS/JS
- Données SF : colonnes "Taille (octets)" vs "Transféré (octets)"

### 5.4 Headers HTTP importants pour le SEO

| Header | Valeur attendue | Impact SEO |
|--------|----------------|-----------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Évite les redirections HTTP→HTTPS |
| `X-Robots-Tag` | Directives d'indexation | Contrôle d'indexation pour les non-HTML |
| `Cache-Control` | `max-age=3600` minimum pour assets | Performance, réduction TTFB |
| `Content-Type` | Correct pour chaque ressource | Rendu correct |
| `Link: <url>; rel="canonical"` | URL canonical | Alternative/complément au `<link>` HTML |
| `Vary: Accept-Encoding` | Présent si gzip actif | CDN/cache correct |

### 5.5 HTTPS et sécurité

**Vérifications :**
- Certificat SSL valide et non expiré
- Pas de mixed content (ressources HTTP sur page HTTPS)
- Redirection automatique HTTP → HTTPS
- HSTS activé (header Strict-Transport-Security)
- Pas de pages en HTTP indexées dans Google

---

## PARTIE 6 : Données structurées (aperçu rapide)

**Vérifications de base :**
- Présence de JSON-LD sur les pages clés (homepage, produits, articles, FAQ, contact)
- Types de schema détectés et leur pertinence
- Validation via Schema.org Validator ou Google Rich Results Test
- Pas de schema abusif (Product sur une page non-produit, AggregateRating sans avis réels)

**Note :** Pour un audit approfondi des données structurées, utiliser le skill `schema_donnees_structurees.md`.

---

## PARTIE 7 : Problèmes détectés par Screaming Frog (rapport_aperçu_problemes.csv)

**Catégorisation des problèmes SF par priorité :**

### Critique (P1)
- Erreurs 4xx/5xx internes
- Pages indexables sans canonical
- Canonical vers 404/redirect
- Redirect loops
- Pages bloquées par robots.txt mais avec liens entrants
- Mixed content
- Certificat SSL expiré

### Important (P2)
- Redirect chains > 2 niveaux
- Titles manquants ou dupliqués
- H1 manquants
- Duplicate content (exact)
- Pages orphelines dans le sitemap
- Meta descriptions manquantes
- Images sans alt

### Mineur (P3)
- Titles trop longs/courts
- Meta descriptions trop longues/courtes
- Near duplicates
- URLs avec paramètres non canonicalisées
- Hreflang incomplets
- Images trop lourdes

---

## PARTIE 8 : Format de sortie de l'audit

### A. Synthèse exécutive (1 page)
- **Score de santé technique** (A/B/C/D/F)
- Nombre total de pages crawlées / indexables / non-indexables
- Top 5 problèmes critiques
- Top 5 quick wins
- Comparaison avec les benchmarks du secteur

### B. Tableau de bord des métriques clés
| Métrique | Valeur | Benchmark | Statut |
|----------|--------|-----------|--------|
| Pages indexables | N | - | - |
| Erreurs 4xx | N | 0 | OK/KO |
| Erreurs 5xx | N | 0 | OK/KO |
| Redirect chains | N | 0 | OK/KO |
| Canonical manquants | N | 0 | OK/KO |
| Duplicate content | N | 0 | OK/KO |
| TTFB moyen | Nms | <200ms | OK/KO |

### C. Analyse détaillée par axe
Pour chaque axe (crawlabilité, indexation, contenu, redirections, performance) :
- Constats chiffrés
- Pages concernées (liste)
- Recommandation actionnable
- Priorité P1/P2/P3
- Impact estimé

### D. Plan d'action technique
| Priorité | Actions | Qui | Délai |
|----------|---------|-----|-------|
| P1 | Corriger erreurs 4xx, ajouter canonicals | Dev | 1 semaine |
| P2 | Résoudre redirections, nettoyer sitemap | Dev + SEO | 2-3 semaines |
| P3 | Optimiser titles/metas, enrichir contenu | SEO + Content | 1-2 mois |

---

### 1.4 Navigation à facettes (e-commerce)

**Problème (source : Peak Ace, 2025) :** La navigation à facettes (filtres par taille, couleur, prix, marque) génère un nombre exponentiel de combinaisons d'URLs. Un catalogue de 1 000 produits avec 5 facettes à 10 valeurs chacune peut générer des millions d'URLs quasi-dupliquées, consommant massivement le budget de crawl.

**Solutions par ordre de priorité :**

| Solution | Implémentation | Impact |
|----------|---------------|--------|
| **Canonicalisation** | `rel="canonical"` vers la page catégorie non filtrée | Élimine le duplicate content |
| **Robots.txt** | Bloquer les patterns de facettes `Disallow: /*?filtre=` | Préserve le budget de crawl |
| **Noindex, follow** | Meta robots sur les pages à facettes | Bloque l'indexation mais permet le crawl des liens |
| **AJAX/JS rendering** | Charger les filtres en JS sans changer l'URL | Aucune URL supplémentaire créée |
| **Balise `nofollow`** | Sur les liens des filtres non stratégiques | Réduit la dilution du PRi |

**Questions clés avant implémentation :**
- Certaines facettes ont-elles un volume de recherche propre ? (ex: "chaussures rouges taille 42") → Si oui, les indexer
- Les pages filtrées apportent-elles un contenu unique ? → Si non, canonicaliser
- Le site a-t-il un problème de crawl budget ? → Si oui, bloquer agressivement

### 1.5 JavaScript et SEO (Angular, React, Vue)

**Problème (source : Peak Ace / Google, 2025) :** Les frameworks JS client-side (Angular, React, Vue) peuvent créer des pages "vides" pour Googlebot si le contenu est rendu uniquement côté client.

**Recommandations Google (évolutions récentes) :**
- **SSR (Server-Side Rendering)** : solution privilégiée — le HTML est généré sur le serveur
- **Pre-rendering** : génération de HTML statique au build (Gatsby, Next.js static export)
- **Dynamic rendering** : servir du HTML pré-rendu aux bots et du JS aux utilisateurs (solution temporaire, Google ne la recommande plus à long terme)
- Tester systématiquement avec **Google Search Console > Inspection d'URL > Afficher la page telle que Google la voit**
- Les meta tags rendues en JS ne sont pas toujours captées par les crawlers

### 1.6 Gestion des ruptures de stock (e-commerce)

**Décision SEO selon la durée de l'indisponibilité :**

| Situation | Action SEO | Justification |
|-----------|-----------|---------------|
| Rupture temporaire (< 1 mois) | **Garder la page** avec message "temporairement indisponible" + produits similaires | Préserve le ranking et les backlinks |
| Rupture longue (1-6 mois) | **Garder la page** avec `availability: OutOfStock` en schema + date de retour estimée | Le contenu reste utile pour l'utilisateur |
| Produit définitivement supprimé | **301 vers le produit successeur** ou la catégorie parent | Transfère le PRi accumulé |
| Gamme entière supprimée | **301 vers la catégorie parent** | Évite les 404 massifs |
| Page sans trafic ni backlinks | **410 (Gone)** | Nettoyage propre, Google désindexe plus vite qu'avec un 404 |

### 1.7 Obfuscation de liens (technique de crawl budget et PRi sculpting)

**Définition :** L'obfuscation de liens masque certains hyperliens aux robots des moteurs de recherche tout en les gardant fonctionnels pour les utilisateurs. Le crawler ne voit pas de balise `<a href>`, donc il ne suit pas le lien et ne divise pas le PageRank par ce lien (source : Abondance/Olivier Andrieu, Foxglove Partner).

**Pourquoi c'est une technique TECHNIQUE (pas juste du maillage) :**
- Impact direct sur le **budget de crawl** : moins de liens crawlables = le crawler se concentre sur les pages stratégiques
- Impact sur le **PageRank sculpting** : les liens obfusqués sont supprimés du calcul de distribution du PRi
- Impact sur l'**indexation** : les pages non-SEO ne sont plus découvertes par le crawler, réduisant le bruit dans l'index

**Différence avec nofollow :**
Le `rel="nofollow"` est **inefficace** pour le sculpting de PRi car Google divise le PageRank entre **tous** les liens d'une page, y compris les nofollow. Le PRi alloué à un lien nofollow est simplement perdu (dissipé dans le vide). L'obfuscation, elle, **supprime le lien du calcul** — le PRi est redistribué aux liens restants (source : Foxglove Partner).

**Technique recommandée — Base64 + data-attributes :**
```html
<!-- Lien obfusqué (invisible pour Googlebot) : -->
<span class="obflink"
  data-o="aHR0cHM6Ly9leGFtcGxlLmNvbS9jZ3Y="
  role="link" tabindex="0"
  style="cursor:pointer;text-decoration:underline">
  CGV
</span>

<script>
document.querySelectorAll('.obflink').forEach(el => {
  el.addEventListener('click', () => {
    window.location.href = atob(el.getAttribute('data-o'));
  });
});
</script>
```

**Obfuscation vs cloaking (ligne rouge) :**
- **Obfuscation** = masquer la **forme** du lien (balise HTML → JS). Le contenu de la page de destination reste identique pour bots et humains. **Toléré par Google.**
- **Cloaking** = modifier le **contenu** de la page selon le user-agent. Contenu différent pour bots vs humains. **Interdit par Google** (pénalité manuelle).

**Éléments à obfusquer en priorité lors d'un audit technique :**

| Cible | Raison | Technique |
|-------|--------|-----------|
| Liens footer sitewide (CGV, mentions légales, plan du site) | Consomment du crawl budget × nombre de pages du site | Base64 + JS |
| Boutons réseaux sociaux en footer | Liens externes sans valeur, répétés sur chaque page | onclick ou suppression |
| Liens login / espace client | Pages non-SEO, consomment crawl et PRi | `<button>` + onclick |
| Filtres e-commerce / navigation à facettes | Explosion combinatoire d'URLs | AJAX sans changement d'URL, ou liens obfusqués |
| Crédits agence/CMS en footer | Lien externe qui fuit du PRi sur chaque page | Obfuscation ou suppression |

**Points de contrôle dans un audit technique :**
1. Compter le nombre de liens dans le template (header + footer + nav) sur chaque page
2. Si >80 liens sitewide → recommander un programme d'obfuscation
3. Calculer le % de liens sitewide vs contenu (benchmark : <70% sitewide)
4. Identifier les liens sitewide vers des pages avec 0 clics GSC → candidats à l'obfuscation
5. Vérifier qu'aucune page stratégique n'est obfusquée par erreur

**Note :** Pour les détails d'implémentation et les techniques avancées (AJAX, IntersectionObserver, implémentation par CMS), voir le skill `maillage_interne.md`, Partie 6.

### 1.8 Transition Rank — l'algo méconnu de Google (Babbar Masterclass 2024)

**Inventeur :** Ross Koningstein (ex-directeur ingénierie Google, inventeur de Google Adwords), brevet de 2012.

**Principe :** Google **temporise l'effet positif des changements SEO** pour observer si le webmaster fait un rollback. C'est un mécanisme de "social engineering" anti-spam et anti-SEO agressif.

**Fonctionnement :**
1. Un site effectue des optimisations SEO (contenu, maillage, backlinks...)
2. Au lieu d'appliquer immédiatement le nouveau ranking, Google choisit une **fonction de transition** proportionnelle à l'agressivité des modifications
3. Le ranking final est atteint **progressivement**, parfois après une phase de **recul** dans les SERPs
4. Si le webmaster fait un rollback (retire les modifications), Google ne rétablit jamais le rang précédent → piège pour les spammeurs qui font des tests

**Impact sur le SEO (Sylvain Peyronnet) :**
> "Il faut être patient ! C'est LE conseil important si vous utilisez un outil comme YourText.Guru pour l'amélioration des contenus par exemple !"
- Ne pas paniquer si les résultats ne sont pas immédiats après une optimisation
- Ne pas rollback des améliorations sous prétexte qu'elles n'ont pas eu d'effet en 2 semaines
- Plus les modifications sont "agressives" (beaucoup de changements d'un coup), plus la temporisation est longue
- **Recommandation :** modifications progressives et incrémentales plutôt que des refontes massives

### 1.9 Duplicate content — détection technique (Shingles et Jaccard)

**Méthode utilisée par les moteurs (Babbar Masterclass 2024) :**
Google ne compare pas les textes mot à mot. Il utilise la méthode des **k-shingles** combinée à la **distance de Jaccard**.

**k-Shingle :** un groupe de k mots contigus dans un document. Valeur typique : k=3 à k=5 selon la granularité souhaitée.

**Exemple avec k=3 :** "Luke je suis ton père" → {"Luke je suis", "je suis ton", "suis ton père"}

**Taux de duplication (Jaccard) :**
```
dup(A,B) = |S(A) ∩ S(B)| / |S(A) ∪ S(B)|
```
= proportion de shingles en commun entre les deux documents.

**Code Python de calcul (Peyronnet) :**
```python
SHINGLE_SIZE = 5

def get_shingles(text, size):
    return set(text[i:i+size] for i in range(len(text)-size+1))

def jaccard(set1, set2):
    return len(set1 & set2) / len(set1 | set2)
```

**Impact SEO :** "Des contenus parfois trop semblables entre eux sur un même site → on essaie de les détecter afin d'en améliorer la qualité. C'est un bon moyen pour indexer davantage de pages."

**Seuils indicatifs :**
| Jaccard | Interprétation | Action |
|---------|---------------|--------|
| > 0.8 | Near-duplicate quasi-certain | Canonicaliser ou fusionner |
| 0.5-0.8 | Contenu très similaire | Différencier significativement |
| 0.3-0.5 | Similarité modérée | Acceptable si intention différente |
| < 0.3 | Contenu distinct | OK |

### 1.10 Analyse des logs serveur (pour les gros sites)

**Pourquoi :** Les rapports de crawl SF et GSC ne montrent que ce que le crawler PEUT voir. L'analyse des logs montre ce que Googlebot crawle RÉELLEMENT.

**Ce que les logs révèlent :**
- Fréquence de crawl par section du site
- Pages ignorées par Googlebot (jamais crawlées)
- Ratio pages crawlées vs pages indexées
- User-agents des crawlers IA (GPTBot, PerplexityBot) et leur comportement
- Pics de crawl anormaux (souvent liés à des soft 404 ou boucles)

**Outils :** Screaming Frog Log File Analyser, Oncrawl, Botify, JetOctopus

---

## Sources
- Google Search Central : documentation technique officielle (developers.google.com/search)
- Google Search Central : Crawl Budget Management for Large Sites (developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget)
- John Mueller, Google Office Hours : crawl budget, temps de réponse, indexation sélective
- Screaming Frog : documentation des rapports et métriques
- Web.dev : guidelines performance et Core Web Vitals
- HTTP/1.1 et HTTP/2 : RFC 7231, RFC 7540
- Search Engine Journal : Why Googlebot Doesn't Crawl Enough Pages (searchenginejournal.com)
- Koanthic : Technical SEO Audit Checklist 2026 (koanthic.com)
- Spoclearn : Technical SEO Audit 2026 Step-by-Step Checklist (spoclearn.com)
- Ahrefs : études sur les meta descriptions réécrites par Google
- Abondance (Olivier Andrieu) : Définition de l'obfuscation de lien (abondance.com/definition/obfuscation-de-lien)
- Foxglove Partner : L'obfuscation SEO — guide technique, implémentation Base64, comparaison nofollow vs obfuscation (foxglove-partner.com/obfuscation-seo/)
- FEPSEM (Patrick Valibus) : Obfuscation vs Cloaking white hat, comparatif des stratégies (fepsem.org/obfuscation-vs-cloaking/)
- 410 Gone : L'obfuscation dans le contexte du cocon sémantique et du maillage interne (410-gone.fr/seo/optimisation-on-site/maillage-interne/cocon-semantique/obfuscation.html)
