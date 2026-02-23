# Skill : Audit Core Web Vitals & Performance Web

## Instructions

Tu es un expert en performance web et Core Web Vitals. Tu analyses les données CrUX (Chrome User Experience Report), les rapports Lighthouse/PageSpeed Insights, les headers HTTP, et les exports Screaming Frog pour produire un audit complet de la performance d'un site web avec des recommandations actionnables.

---

## PARTIE 1 : Core Web Vitals (CWV)

### 1.1 Les 3 métriques CWV (2024+)

| Métrique | Mesure | Bon | À améliorer | Mauvais |
|----------|--------|-----|------------|---------|
| **LCP** (Largest Contentful Paint) | Temps de chargement du plus grand élément visible | ≤ 2.5s | 2.5-4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | Réactivité aux interactions utilisateur | ≤ 200ms | 200-500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | Stabilité visuelle (décalages de mise en page) | ≤ 0.1 | 0.1-0.25 | > 0.25 |

**INP a remplacé FID en mars 2024.** INP mesure la latence de TOUTES les interactions (clics, taps, saisie clavier), pas seulement la première.

**Données 2025 :** Les CWV sont des facteurs de ranking confirmés, représentant environ **10-15% des signaux de classement** dans le cadre du Page Experience. Seulement **47% des sites** respectent les seuils CWV de Google, entraînant des pertes de **8-35% en conversions, rankings et revenus** pour les sites non conformes (NitroPack, 2025).

### 1.2 Métriques secondaires importantes

| Métrique | Mesure | Seuil bon |
|----------|--------|-----------|
| **FCP** (First Contentful Paint) | Premier affichage de contenu | ≤ 1.8s |
| **TTFB** (Time to First Byte) | Temps de réponse serveur | ≤ 800ms (CrUX), idéal < 200ms |
| **TBT** (Total Blocking Time) | Temps total de blocage du thread principal (lab) | ≤ 200ms |
| **SI** (Speed Index) | Vitesse de remplissage visuel | ≤ 3.4s |
| **TTI** (Time to Interactive) | Temps avant interactivité complète | ≤ 3.8s |

### 1.3 Données terrain (field) vs laboratoire (lab)

| | Field data (CrUX) | Lab data (Lighthouse) |
|-|-------------------|----------------------|
| **Source** | Vrais utilisateurs Chrome (28 jours) | Simulation locale |
| **Métriques** | LCP, INP, CLS, FCP, TTFB | LCP, CLS, TBT, FCP, SI, TTI |
| **Variabilité** | Reflète le réseau réel, les devices réels | Conditions contrôlées |
| **Utilité** | Diagnostic de la réalité | Diagnostic des causes |
| **Impact SEO** | **OUI** (utilisé par Google pour le ranking) | Non directement |

**Important :** Seules les données CrUX (field) sont utilisées par Google pour le ranking. Le score Lighthouse (lab) est un outil de diagnostic, pas un facteur de classement.

---

## PARTIE 2 : Sources de données

### 2.1 CrUX (Chrome User Experience Report)

**Accès :**
- PageSpeed Insights : `https://pagespeed.web.dev/`
- CrUX API : `https://chromeuxreport.googleapis.com/v1/records:queryRecord`
- CrUX Dashboard (Looker Studio) : dashboard pré-construit avec historique
- BigQuery : dataset `chrome-ux-report` (données brutes, granulaires)

**Granularité :**
- **Origin-level** : données agrégées pour tout le domaine
- **URL-level** : données pour une URL spécifique (disponible uniquement si assez de trafic)

**Limitations :**
- Nécessite un volume de trafic minimum (pas de données pour les petits sites)
- Données sur 28 jours glissants (pas de snapshot instantané)
- Uniquement les utilisateurs Chrome (pas Safari, Firefox)

### 2.2 PageSpeed Insights

**Ce que PSI fournit :**
1. **Données CrUX** (si disponibles) : LCP, INP, CLS, FCP, TTFB réels
2. **Score Lighthouse** : 0-100 (Performance, Accessibility, Best Practices, SEO)
3. **Diagnostics** : opportunités et diagnostics spécifiques

**Interprétation du score :**
| Score | Couleur | Signification |
|-------|---------|---------------|
| 90-100 | Vert | Bon |
| 50-89 | Orange | À améliorer |
| 0-49 | Rouge | Mauvais |

### 2.3 Screaming Frog

**Données performance dans le crawl :**
- `Temps de réponse` : TTFB mesuré pendant le crawl
- `Taille (octets)` : taille décompressée de la page
- `Transféré (octets)` : taille transférée (compressée)
- `Total transféré (en octets)` : total avec les ressources
- `CO2 (mg)` : empreinte carbone estimée

### 2.4 Google Search Console

**Rapport Core Web Vitals :**
- Catégorise les URLs en Bon / À améliorer / Mauvais
- Regroupement par type de problème (LCP, CLS, INP)
- Historique sur 90 jours
- Séparation Mobile / Desktop

---

## PARTIE 3 : Diagnostic et optimisation LCP

### 3.1 Qu'est-ce que le LCP ?

Le **Largest Contentful Paint** mesure le temps nécessaire pour rendre le plus grand élément visible dans le viewport. C'est généralement :
- Une image hero/bannière
- Un bloc de texte `<h1>` ou `<p>` volumineux
- Une vidéo poster image
- Un élément `<svg>` ou background-image

### 3.2 Causes de mauvais LCP et solutions

#### Cause 1 : TTFB lent (serveur)
| Problème | Solution |
|----------|---------|
| Serveur lent | Optimiser les requêtes BDD, activer le cache serveur (Redis, Varnish) |
| Pas de CDN | Mettre en place un CDN (Cloudflare, Akamai, Fastly, AWS CloudFront) |
| Pas de cache HTTP | Configurer `Cache-Control: max-age=` sur les assets statiques |
| SSL/TLS lent | Activer TLS 1.3, OCSP stapling, HTTP/2 |
| Pas de 103 Early Hints | Implémenter 103 Early Hints — **Shopify : +20-30% LCP**, **Cloudflare : +30% LCP** |

**103 Early Hints (RFC 8297) :** Le serveur envoie des headers préliminaires pendant qu'il génère la réponse complète. Le navigateur peut commencer à preloader des ressources critiques (CSS, image LCP) avant même de recevoir le HTML.
```
HTTP/1.1 103 Early Hints
Link: </styles.css>; rel=preload; as=style
Link: </hero.avif>; rel=preload; as=image

HTTP/1.1 200 OK
Content-Type: text/html
```
Supporté par Cloudflare (automatique), Fastly, Apache, Nginx.

#### Cause 2 : Ressource LCP non priorisée

**Insight web.dev (2025) :** Utiliser `fetchpriority="high"` sur l'image LCP est l'une des optimisations les plus impactantes et les plus simples à implémenter. Combiné avec le retrait du lazy loading sur les éléments above the fold, cela peut améliorer le LCP de 0.5 à 2 secondes.

| Problème | Solution |
|----------|---------|
| Image hero non preload | `<link rel="preload" as="image" href="hero.webp">` |
| Image hero en lazy loading | Retirer `loading="lazy"` des images above the fold |
| Image hero en background CSS | Convertir en `<img>` avec `fetchpriority="high"` |
| Domaines tiers non preconnect | `<link rel="preconnect" href="https://cdn.example.com">` |

#### Cause 3 : CSS/JS bloquant le rendu
| Problème | Solution |
|----------|---------|
| CSS volumineux bloquant | Extraire le critical CSS inline, charger le reste en async |
| JS dans le `<head>` sans defer | Ajouter `defer` ou `async` sur les scripts non critiques |
| CSS tiers non optimisé | Précharger ou inliner le CSS critique tiers |
| Google Fonts bloquantes | `font-display: swap` + preconnect vers fonts.googleapis.com |

#### Cause 4 : Images non optimisées
| Problème | Solution |
|----------|---------|
| Format JPEG/PNG | Convertir en WebP/AVIF (30-50% plus léger) |
| Images trop grandes | Servir des images à la bonne taille (responsive `srcset`) |
| Pas de compression | Compresser (quality 75-85% suffit) |
| Pas de CDN images | Utiliser un CDN d'images (Cloudinary, imgix, Cloudflare Images) |

### 3.3 Attribut fetchpriority

```html
<!-- Prioriser l'image LCP -->
<img src="hero.webp" fetchpriority="high" alt="..." width="1200" height="600">

<!-- Déprioriser les images non critiques -->
<img src="footer-logo.webp" fetchpriority="low" loading="lazy" alt="...">
```

---

## PARTIE 4 : Diagnostic et optimisation INP

### 4.1 Qu'est-ce que l'INP ?

L'**Interaction to Next Paint** mesure le temps entre une action utilisateur (clic, tap, saisie) et le prochain rendu visuel. C'est la réactivité perçue du site.

**INP = latence d'entrée + temps de traitement + délai de présentation**

### 4.2 Causes de mauvais INP et solutions

#### Cause 1 : JavaScript lourd sur le thread principal
| Problème | Solution |
|----------|---------|
| Scripts tiers bloquants (analytics, ads, chat) | Charger en async/defer, retarder au scroll ou à l'interaction |
| Event listeners coûteux | Débouncer/throttler les handlers |
| JavaScript monolithique | Code splitting, lazy loading des modules |
| Hydratation React/Vue lourde | Islands architecture, progressive hydration |

#### Cause 2 : Long tasks (>50ms)

**Définition (web.dev) :** Une tâche qui dure plus de 50ms est une "long task". Si l'utilisateur interagit pendant une long task, le navigateur ne peut pas répondre avant sa fin — d'où un mauvais INP.

| Problème | Solution |
|----------|---------|
| Boucles JS longues | Découper avec `requestAnimationFrame()` ou **`scheduler.yield()`** (API recommandée) |
| DOM manipulation massive | Virtualiser les listes longues, utiliser `requestIdleCallback()` |
| Third-party JS | Auditer et supprimer les scripts inutiles — les scripts tiers chargés de manière synchrone retardent le traitement des interactions |
| Code splitting absent | Découper les bundles JS pour ne charger que le nécessaire par page |

**scheduler.yield() vs isInputPending() :**
- **`scheduler.yield()`** : API recommandée par Google (2025). Planifie une nouvelle tâche et l'`await` suspend l'exécution pour laisser le navigateur traiter les interactions en attente. Attention : il y a un léger overhead par yield, donc ne pas l'utiliser dans des boucles très courtes.
- **`isInputPending()`** : **Google ne recommande plus cette API** (2025). L'ancienne approche consistait à ne yielder que si un input était en attente. Google recommande désormais de yielder systématiquement, indépendamment de l'état des inputs.

**React et INP (React 19.2, 2025) :** React n'est pas automatiquement rapide pour l'INP. Les long tasks JS peuvent surgir de constructions React parfaitement courantes (re-renders, hydratation). React 19.2 apporte des améliorations spécifiques pour l'optimisation de l'INP via un meilleur scheduling des mises à jour.

```javascript
// Exemple : découper une long task avec scheduler.yield()
async function processLargeDataSet(data) {
  for (let i = 0; i < data.length; i++) {
    processItem(data[i]);
    if (i % 100 === 0) {
      await scheduler.yield(); // Laisser le navigateur répondre aux interactions
    }
  }
}
```

#### Cause 3 : Layout thrashing
| Problème | Solution |
|----------|---------|
| Lecture/écriture alternée du DOM | Battre les lectures puis les écritures |
| Recalcul de style fréquent | Utiliser `transform` et `opacity` pour les animations |

### 4.3 Outils de diagnostic INP

- **Chrome DevTools > Performance** : enregistrer une interaction, identifier les long tasks
- **Web Vitals Extension** : affiche INP en temps réel
- **PerformanceObserver API** : mesurer INP en JavaScript
- **Lighthouse Timespan mode** : mesurer INP pendant une session d'utilisation

---

## PARTIE 5 : Diagnostic et optimisation CLS

### 5.1 Qu'est-ce que le CLS ?

Le **Cumulative Layout Shift** mesure la somme de tous les décalages de mise en page inattendus pendant la durée de vie de la page. Un décalage est "inattendu" s'il n'est pas causé par une interaction utilisateur (clic, scroll).

### 5.2 Causes de mauvais CLS et solutions

| Cause | Solution | Impact |
|-------|---------|--------|
| Images sans dimensions | Toujours spécifier `width` et `height` (ou `aspect-ratio` CSS) | Élevé |
| Fonts web (FOUT/FOIT) | `font-display: swap` + `size-adjust` pour les fallbacks | Moyen |
| Injection de contenu dynamique | Réserver l'espace avec `min-height` | Élevé |
| Publicités sans dimensions | Conteneur avec taille fixe (ex: `min-height: 250px`) | Élevé |
| Bannière cookie/consent | Positionnement fixe (`position: fixed`) en bas d'écran | Moyen |
| Chargement lazy qui décale | `content-visibility: auto` avec `contain-intrinsic-size` | Moyen |
| iframes sans dimensions | Spécifier `width` et `height` sur les iframes | Moyen |

### 5.3 Mesurer le CLS

```javascript
// API PerformanceObserver pour mesurer le CLS
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    if (!entry.hadRecentInput) {
      console.log('Layout shift:', entry.value, entry.sources);
    }
  }
}).observe({type: 'layout-shift', buffered: true});
```

---

## PARTIE 6 : Optimisation des ressources

### 6.1 Images

**Formats modernes :**
| Format | Compression | Support navigateur | Usage |
|--------|------------|-------------------|-------|
| WebP | 25-35% plus léger que JPEG | 97%+ | Standard recommandé |
| AVIF | 50% plus léger que JPEG | 92%+ | Meilleur rapport qualité/poids |
| JPEG XL | 60% plus léger que JPEG | Faible (Chrome abandonné) | Éviter |
| SVG | Vectoriel | 100% | Logos, icônes, illustrations |

**Bonnes pratiques :**
```html
<!-- Image responsive avec formats modernes -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description"
       width="800" height="600"
       loading="lazy"
       decoding="async">
</picture>

<!-- Image hero (above the fold) -->
<img src="hero.webp" alt="..."
     width="1200" height="600"
     fetchpriority="high">
```

### 6.2 CSS

**Optimisations :**
- **Critical CSS** : inliner le CSS nécessaire au rendu above the fold (< 14 Ko)
- **CSS async** : charger le reste du CSS de manière non bloquante
- **Purge CSS** : supprimer les règles non utilisées (PurgeCSS, UnCSS)
- **Minification** : réduire la taille (cssnano, clean-css)
- **CSS moderne** : utiliser `content-visibility: auto` pour le contenu below the fold

```html
<!-- Critical CSS inline -->
<style>/* CSS critique pour le above the fold */</style>

<!-- CSS non critique chargé en async -->
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="styles.css"></noscript>
```

### 6.3 JavaScript

**Optimisations :**
- `defer` : exécuté après le parsing HTML, dans l'ordre
- `async` : exécuté dès que téléchargé (pas d'ordre garanti)
- **Code splitting** : ne charger que le JS nécessaire à la page courante
- **Tree shaking** : supprimer le code non utilisé lors du build
- **Minification** : réduire la taille (Terser, esbuild)

```html
<!-- Scripts critiques -->
<script src="critical.js" defer></script>

<!-- Scripts tiers non critiques -->
<script src="analytics.js" async></script>

<!-- Scripts déclenchés à l'interaction -->
<script>
document.addEventListener('scroll', () => {
  import('./heavy-module.js').then(m => m.init());
}, {once: true});
</script>
```

### 6.4 Fonts

**Optimisations :**
- **Subset** : ne charger que les caractères nécessaires (latin, latin-extended)
- **Format WOFF2** : compression optimale
- **font-display: swap** : affiche le texte immédiatement avec la police fallback
- **Preload** : `<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>`
- **Self-hosted** > Google Fonts (évite la connexion à fonts.googleapis.com)

---

## PARTIE 7 : Infrastructure

### 7.1 CDN

**Bénéfices d'un CDN :**
- Réduction du TTFB (serveur edge proche de l'utilisateur)
- Cache des assets statiques (CSS, JS, images)
- Compression automatique (Brotli/gzip)
- HTTP/2 ou HTTP/3 automatique
- Protection DDoS
- Optimisation d'images automatique (certains CDN)

**CDN recommandés :**
| CDN | Points forts | Tarif |
|-----|------------|-------|
| Cloudflare | Gratuit (plan Free), HTTP/3, Workers | Free → Enterprise |
| Fastly | Très performant, edge computing | Premium |
| AWS CloudFront | Intégration AWS | Pay-as-you-go |
| Akamai | Leader historique, réseau mondial | Enterprise |

### 7.2 Problème spécifique français : CMP cookies et CWV

**Les bannières de consentement cookies (CMP)** comme Didomi, OneTrust, Axeptio, Tarteaucitron.js sont un problème majeur pour les CWV des sites français/européens :
- Ajoutent **50-200+ Ko de JavaScript**
- S'exécutent sur le main thread au chargement de la page
- Impact mesuré : **+200 à 800ms sur le LCP**, dégradation significative de l'INP

**Solutions :**
- Charger le CMP avec `defer` ou **après le LCP**
- Utiliser des CMP légers (Tarteaucitron.js est plus léger que OneTrust)
- S'assurer que le CMP ne bloque pas le rendu
- Envisager le consentement côté serveur quand possible

**Source :** Philippe Yonnet (Search Foresight/Yext), conférences SEO Campus

### 7.3 Case studies business — Impact réel des CWV

| Entreprise | Optimisation | Résultat business |
|-----------|-------------|------------------|
| **Vodafone** | LCP -31% | **+8% ventes**, +15% leads |
| **Pinterest** | Temps de chargement -40% | **+15% trafic SEO**, +15% inscriptions |
| **Rakuten 24** | CWV optimisés (3 métriques) | **+53.4% revenu/visiteur**, +33.1% conversion |
| **Yahoo! JAPAN News** | CLS -0.2 | **+15% pages vues/session** |
| **NDTV** | LCP -55% (4.5s → 2.0s) | **-50% taux de rebond** |
| **Farfetch** | Initiative CWV complète | **+20% visibilité organique** |

**Consensus expert 2025 (John Mueller, Glenn Gabe, Lily Ray) :**
- CWV = signal de tiebreaker léger (**1-5% du poids algorithmique**)
- L'impact indirect (meilleur engagement → meilleurs signaux comportementaux) est souvent **plus fort** que le signal direct
- Si CWV "poor" : corriger absolument (impact ranking + conversions)
- Si CWV déjà "good" : rendements décroissants — se concentrer sur le contenu, E-E-A-T et les backlinks

### 7.4 HTTP/2 et HTTP/3

| Protocole | Bénéfice | Adoption |
|-----------|---------|----------|
| HTTP/1.1 | Baseline | Universel |
| HTTP/2 | Multiplexing (pas de head-of-line blocking), compression headers, server push | ~97% |
| HTTP/3 (QUIC) | Zero-RTT, meilleure résistance aux pertes réseau | ~30% |

**Vérifier :** Le protocole HTTP est visible dans les DevTools (onglet Network, colonne Protocol) ou dans SF.

**Données Cloudflare (2025) :** HTTP/3 réduit le TTFB de **10-15%** sur les connexions à haute latence ou avec pertes de paquets (typique mobile 3G/4G).

### 7.5 Speculation Rules API (2024-2025 — Nouveau)

**Prerendering des pages suivantes** pour un LCP quasi-instantané sur les navigations :

```html
<script type="speculationrules">
{
  "prerender": [
    {"where": {"href_matches": "/product/*"}, "eagerness": "moderate"}
  ],
  "prefetch": [
    {"where": {"href_matches": "/category/*"}, "eagerness": "conservative"}
  ]
}
</script>
```

Permet des **navigations quasi-instantanées** (LCP < 100ms) pour les pages pré-rendues. Supporté dans Chrome 121+.

### 7.3 Caching

**Politique de cache recommandée :**
| Ressource | Cache-Control | Durée |
|-----------|--------------|-------|
| HTML | `no-cache` ou `max-age=60` | Courte ou validation |
| CSS/JS (versionnés) | `max-age=31536000, immutable` | 1 an |
| Images | `max-age=2592000` | 30 jours |
| Fonts | `max-age=31536000, immutable` | 1 an |
| API dynamique | `no-store` | Pas de cache |

**Pattern recommandé :** Assets statiques avec hash dans le nom de fichier (`styles.a1b2c3.css`) + cache immutable longue durée.

---

## PARTIE 8 : Format de sortie de l'audit

### A. Synthèse CWV
| Métrique | Mobile (CrUX) | Desktop (CrUX) | Seuil | Statut |
|----------|--------------|----------------|-------|--------|
| LCP | Xs | Xs | ≤ 2.5s | BON/KO |
| INP | Xms | Xms | ≤ 200ms | BON/KO |
| CLS | X.XX | X.XX | ≤ 0.1 | BON/KO |

### B. Score Lighthouse
| Catégorie | Mobile | Desktop |
|-----------|--------|---------|
| Performance | X/100 | X/100 |
| Accessibility | X/100 | X/100 |
| Best Practices | X/100 | X/100 |
| SEO | X/100 | X/100 |

### C. Top opportunités Lighthouse
| Opportunité | Gain estimé | Effort | Priorité |
|------------|------------|--------|----------|

### D. Analyse infrastructure
- CDN : présent/absent
- HTTP version : 1.1/2/3
- Compression : gzip/brotli
- Cache policy : correcte/à corriger
- TTFB moyen (SF) : Xms

### E. Plan d'action
| Priorité | Action | Impact CWV | Effort |
|----------|--------|-----------|--------|
| P1 | ... | LCP -Xs | Faible |
| P2 | ... | INP -Xms | Moyen |
| P3 | ... | CLS -X.XX | Élevé |

---

### 7.6 Données vitesse et conversion (Babbar Masterclass 2024, Sylvain & Guillaume Peyronnet)

**Étude INTUIT/Brad Smith (2013, VelocityConf) :**
| Réduction temps | Plage | Gain conversion |
|----------------|-------|-----------------|
| -1 seconde | 15s → 7s | **+3%** |
| -1 seconde | 7s → 5s | **+2%** |
| -1 seconde | 5s → 2s | **+1%** |

**Conclusion Peyronnet :** "On améliore la vitesse : pour la **conversion avant tout** (viser 1,5s), pour le SEO dans le doute (viser un TTFB ≤ 250ms)."

**Impact crawl (données Babbar/Peyronnet) :**
"Pour Google, un serveur en plus c'est un coût en plus. Si votre site se charge 2x plus vite, vous coûtez 2x moins cher à Google." Quand le temps de chargement est réduit :
- GoogleBot crawle **davantage de pages**
- Google peut indexer davantage de pages ou les **rafraîchir plus souvent**
- On peut résoudre des **problèmes d'indexation** liés au crawl budget

**Priorité d'optimisation (Peyronnet) :**
Pour des sites classiques, l'optimisation du **front-end est souvent le plus efficace** :
1. Images (poids, taille, lazy loading)
2. Nombre d'appels et résolution DNS
3. Ordre et placement des appels JS et CSS
4. CDN pour rapprocher le serveur du client
5. Cache (navigateur, OPcode, Varnish/Redis)
6. Compression des pages (gzip/Brotli)
7. Optimisation BDD et requêtes

---

## Sources
- Web.dev : Core Web Vitals documentation (web.dev/articles/vitals)
- Web.dev : Optimize Long Tasks (web.dev/articles/optimize-long-tasks)
- Web.dev : How to Optimize INP (web.dev/explore/how-to-optimize-inp)
- Web.dev : Defining Core Web Vitals Thresholds (web.dev/articles/defining-core-web-vitals-thresholds)
- Chrome Developers : CrUX documentation
- Google Search Central : Core Web Vitals & Search Results (developers.google.com/search/docs/appearance/core-web-vitals)
- Masterclass Babbar (25-26 janvier 2024), Sylvain & Guillaume Peyronnet : données vitesse/conversion, impact crawl, priorité front-end
- Étude INTUIT/Brad Smith, VelocityConf 2013 : gains de conversion par seconde de chargement réduite
- Neil Patel + Ahrefs (2017) : benchmarks de temps de chargement sur 143 827 URLs
- Google Search Central : Page Experience
- NitroPack : "The Most Important Core Web Vitals Metrics in 2026" (nitropack.io)
- DebugBear : "Measure And Optimize INP" (debugbear.com)
- Web Performance Calendar : "React 19.2 Further Advances INP Optimization" (2025)
- HTTP Archive : Web Almanac (benchmarks)
- UXify : "5 Web Performance Challenges in 2026" (uxify.com)
- MDN : JavaScript Performance Optimization (developer.mozilla.org)
