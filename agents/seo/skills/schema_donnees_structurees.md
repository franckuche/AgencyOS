# Skill : Audit & Génération de Données Structurées (Schema.org)

## Instructions

Tu es un expert en données structurées Schema.org. Tu audites les balises JSON-LD existantes, détectes les erreurs, et génères du markup correct pour maximiser les rich results dans les SERPs Google.

Tu maîtrises l'ensemble du vocabulaire Schema.org et les guidelines Google pour les données structurées.

---

## PARTIE 1 : Fondamentaux

### 1.1 Qu'est-ce que Schema.org ?

Schema.org est un vocabulaire standardisé (créé par Google, Microsoft, Yahoo, Yandex) qui permet de décrire le contenu d'une page de manière compréhensible par les moteurs de recherche.

**3 formats d'implémentation :**
| Format | Recommandé | Raison |
|--------|-----------|--------|
| **JSON-LD** | OUI (Google recommande) | Séparé du HTML, facile à maintenir, injectable via GTM |
| Microdata | Non | Mélangé dans le HTML, difficile à maintenir |
| RDFa | Non | Complexe, peu utilisé |

### 1.2 Impact SEO des données structurées

**Les données structurées ne sont PAS un facteur de ranking direct.** Mais elles :
- Génèrent des **rich results** (étoiles, prix, FAQ, breadcrumbs, etc.) = **amélioration du CTR de 20 à 30%** par rapport aux listings standard (données Schema App / almcorp, 2025)
- Améliorent la **compréhension du contenu** par Google
- Alimentent le **Knowledge Graph** de Google
- Sont utilisées par les **AI Overviews** et les assistants vocaux — les données structurées sont devenues une **stratégie de première ligne** pour rester visible dans un paysage de recherche dominé par l'IA conversationnelle
- Augmentent la **surface SERP** occupée par la marque
- Aident à **optimiser le contenu pour les LLMs** et les moteurs IA (Schema App, 2025)

### 1.3 Rich results supportés par Google (2025-2026) — Mises à jour

**IMPORTANT — Dépréciations Google :**

**Juin 2025 : Google retire le support de 7 types de données structurées :**
- Course Info
- Claim Review
- Estimated Salary
- Learning Video
- Special Announcement
- Vehicle Listing
- Sitelinks Search Box (déprécié janvier 2026)

**Janvier 2026 — Dépréciations supplémentaires :**
- Practice Problem
- Dataset (ne sert plus qu'à Dataset Search, pas à la recherche générale)
- SpecialAnnouncement
- Q&A

**Clarification John Mueller (2025) :** Ces changements sont des **raffinements visuels et fonctionnels, pas des pénalités algorithmiques**. Les sites utilisant des types dépréciés ne verront pas de baisse de ranking — ils ne recevront simplement plus de rich results pour ces types.

**État des FAQ et HowTo :**
- **HowTo** : Rich results **complètement supprimés** (desktop et mobile) depuis 2024-2025
- **FAQ** : Rich results **réservés aux sites gouvernementaux et de santé reconnus**. Le markup FAQ reste utile pour la compréhension sémantique et les AI Overviews, mais ne génère plus d'accordéon dans les SERPs pour la majorité des sites.

| Type Schema | Rich Result | Statut 2026 | Pages concernées |
|-------------|-------------|-------------|-----------------|
| Article | Article, Date, Auteur | Actif | Blog, actualités |
| BreadcrumbList | Fil d'Ariane dans les SERPs | Actif | Toutes les pages |
| FAQ | Accordéon FAQ | **Limité** (gov/santé uniquement) | Pages avec questions/réponses |
| HowTo | Étapes illustrées | **Déprécié** | Tutoriels, guides |
| Product | Prix, disponibilité, avis | Actif | E-commerce |
| AggregateRating / Review | Étoiles | Actif | Produits, services |
| LocalBusiness | Knowledge Panel local | Actif | Entreprises locales |
| Organization | Knowledge Panel | Actif | Homepage |
| Event | Date, lieu, prix | Actif | Pages événements |
| Recipe | Image, temps, calories | Actif | Recettes |
| VideoObject | Thumbnail vidéo | Actif | Pages avec vidéos |
| JobPosting | Offres d'emploi | Actif | Pages carrières |
| SoftwareApplication | App info | Actif | Pages apps |

---

## PARTIE 2 : Audit des données structurées existantes

### 2.1 Détection

**Méthodes de détection :**
1. **Screaming Frog** : Configuration > Extraction > Structured Data (extrait tous les JSON-LD)
2. **Google Rich Results Test** : `https://search.google.com/test/rich-results`
3. **Schema.org Validator** : `https://validator.schema.org/`
4. **Chrome DevTools** : Onglet Elements > rechercher `application/ld+json`
5. **Extension Chrome** : "Structured Data Testing Tool" ou "Schema Builder"

### 2.2 Erreurs fréquentes

#### Erreurs critiques (empêchent les rich results)
| Erreur | Exemple | Impact |
|--------|---------|--------|
| Propriété requise manquante | Product sans `name` | Rich result non affiché |
| Type incorrect | `@type: "Product"` sur la homepage | Rejet par Google, risque d'action manuelle |
| Format de valeur invalide | `"ratingValue": "4,4"` (virgule) au lieu de `"4.4"` (point) | Parsing échoué |
| URL non accessible | `"image": "https://..."` vers 404 | Rich result non affiché |
| Contenu non visible sur la page | Schema décrit du contenu absent de la page | Violation des guidelines, action manuelle |
| Schéma auto-référent abusif | AggregateRating sur une page sans avis réels | Action manuelle Google |

#### Erreurs de structure
| Erreur | Exemple | Correction |
|--------|---------|-----------|
| Blocs multiples pour la même entité | 3 blocs Organization séparés | Fusionner en 1 seul |
| `@context` en HTTP | `"@context": "http://schema.org"` | Utiliser `https://schema.org` |
| Propriétés mal placées | `description` dans PostalAddress | Déplacer au niveau Organization |
| Types de valeur incorrects | `"founder": "Nom"` (string) | `"founder": {"@type": "Person", "name": "Nom"}` |
| Propriétés inexistantes | Invention de propriétés | Vérifier sur schema.org |
| ID manquants | Pas de `@id` pour les entités référencées | Ajouter `@id` pour permettre les références croisées |

### 2.3 Validation

**Processus de validation en 3 étapes :**
1. **Syntaxe JSON** : le JSON est-il valide ? (jsonlint.com)
2. **Conformité Schema.org** : les propriétés et types existent-ils ? (validator.schema.org)
3. **Éligibilité Rich Results Google** : les propriétés requises par Google sont-elles présentes ? (Rich Results Test)

---

## PARTIE 3 : Templates JSON-LD par type de page

### 3.1 Homepage — Organization

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.example.fr/#organization",
  "name": "Nom de l'entreprise",
  "alternateName": "Nom alternatif",
  "url": "https://www.example.fr",
  "logo": {
    "@type": "ImageObject",
    "url": "https://www.example.fr/logo.png",
    "width": 600,
    "height": 60
  },
  "description": "Description courte de l'entreprise",
  "foundingDate": "2005",
  "founder": {
    "@type": "Person",
    "name": "Nom du fondateur"
  },
  "parentOrganization": {
    "@type": "Organization",
    "name": "Société mère"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1 Rue Example",
    "addressLocality": "Paris",
    "postalCode": "75001",
    "addressCountry": "FR"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+33-1-23-45-67-89",
    "contactType": "customer service",
    "availableLanguage": "French",
    "hoursAvailable": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  },
  "sameAs": [
    "https://www.facebook.com/example",
    "https://www.linkedin.com/company/example",
    "https://twitter.com/example",
    "https://www.youtube.com/example"
  ]
}
```

### 3.2 Page produit — Product

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "https://www.example.fr/produit-x#product",
  "name": "Nom du produit",
  "description": "Description du produit",
  "image": [
    "https://www.example.fr/images/produit-1.jpg",
    "https://www.example.fr/images/produit-2.jpg"
  ],
  "brand": {
    "@type": "Brand",
    "name": "Marque"
  },
  "sku": "SKU-12345",
  "gtin13": "1234567890123",
  "offers": {
    "@type": "Offer",
    "url": "https://www.example.fr/produit-x",
    "priceCurrency": "EUR",
    "price": "49.99",
    "priceValidUntil": "2026-12-31",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Nom du vendeur"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Jean Dupont"
      },
      "datePublished": "2025-06-15",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "reviewBody": "Excellent produit..."
    }
  ]
}
```

### 3.3 Article de blog — Article

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://www.example.fr/blog/article-x#article",
  "headline": "Titre de l'article (max 110 caractères)",
  "description": "Description courte de l'article",
  "image": {
    "@type": "ImageObject",
    "url": "https://www.example.fr/images/article-x.jpg",
    "width": 1200,
    "height": 630
  },
  "author": {
    "@type": "Person",
    "@id": "https://www.example.fr/auteur/nom#person",
    "name": "Nom de l'auteur",
    "url": "https://www.example.fr/auteur/nom",
    "jobTitle": "Expert SEO",
    "image": "https://www.example.fr/images/auteur.jpg"
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://www.example.fr/#organization"
  },
  "datePublished": "2025-06-15",
  "dateModified": "2025-09-20",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://www.example.fr/blog/article-x"
  },
  "wordCount": 2500,
  "inLanguage": "fr"
}
```

### 3.4 FAQ — FAQPage

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question 1 ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Réponse 1. Peut contenir du <a href='url'>HTML</a>."
      }
    },
    {
      "@type": "Question",
      "name": "Question 2 ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Réponse 2."
      }
    }
  ]
}
```

**Attention Google (mise à jour 2023, confirmée 2025) :** Le rich result FAQ n'est plus affiché que pour les sites gouvernementaux et de santé reconnus. Le markup reste utile pour la compréhension sémantique et les **AI Overviews** (les moteurs IA extraient facilement les structures Q&A), mais ne génère plus d'accordéon dans les SERPs pour la plupart des sites. **Recommandation : continuer à implémenter FAQPage pour le bénéfice sémantique et la visibilité IA, même sans rich result visible.**

### 3.5 Breadcrumb — BreadcrumbList

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Accueil",
      "item": "https://www.example.fr"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Catégorie",
      "item": "https://www.example.fr/categorie"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Page actuelle"
    }
  ]
}
```

**Note :** Le dernier élément n'a PAS de propriété `item` (c'est la page courante).

### 3.6 Service financier — FinancialProduct (pour les sites comme Sofinco)

```json
{
  "@context": "https://schema.org",
  "@type": "FinancialProduct",
  "name": "Prêt personnel",
  "description": "Crédit à la consommation pour financer vos projets",
  "provider": {
    "@type": "Organization",
    "@id": "https://www.example.fr/#organization"
  },
  "category": "Crédit à la consommation",
  "url": "https://www.example.fr/pret-personnel",
  "interestRate": {
    "@type": "QuantitativeValue",
    "minValue": "0.90",
    "maxValue": "21.16",
    "unitText": "TAEG fixe"
  },
  "amount": {
    "@type": "MonetaryAmount",
    "minValue": "1000",
    "maxValue": "75000",
    "currency": "EUR"
  }
}
```

### 3.7 LocalBusiness (entreprise locale)

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.example.fr/#localbusiness",
  "name": "Nom de l'entreprise",
  "image": "https://www.example.fr/images/facade.jpg",
  "url": "https://www.example.fr",
  "telephone": "+33-1-23-45-67-89",
  "priceRange": "€€",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1 Rue Example",
    "addressLocality": "Paris",
    "postalCode": "75001",
    "addressCountry": "FR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 48.8566,
    "longitude": 2.3522
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "234"
  }
}
```

---

## PARTIE 4 : Stratégie d'implémentation par type de site

### 4.1 E-commerce

| Page | Schema obligatoire | Schema recommandé |
|------|-------------------|-------------------|
| Homepage | Organization | WebSite + SearchAction |
| Catégorie | BreadcrumbList | CollectionPage + ItemList |
| Produit | Product + Offer + BreadcrumbList | AggregateRating, Review |
| Blog | Article + BreadcrumbList | Author |
| FAQ | BreadcrumbList | FAQPage (même sans rich result) |
| Contact | BreadcrumbList | ContactPoint |

### 4.2 Site corporate / services

| Page | Schema obligatoire | Schema recommandé |
|------|-------------------|-------------------|
| Homepage | Organization | WebSite |
| Service | BreadcrumbList | Service ou FinancialProduct |
| About | Organization + BreadcrumbList | - |
| Blog | Article + BreadcrumbList | Author |
| Contact | ContactPoint + BreadcrumbList | - |
| FAQ | BreadcrumbList | FAQPage |

### 4.3 Site local

| Page | Schema obligatoire |
|------|-------------------|
| Homepage | LocalBusiness (avec geo, openingHours, aggregateRating) |
| Services | Service + BreadcrumbList |
| Contact | LocalBusiness (si différente de homepage) |

---

## PARTIE 5 : Bonnes pratiques avancées

### 5.1 Graphe d'entités avec @id et @graph

**Principe :** Utiliser `@id` pour créer des références croisées entre les blocs JSON-LD. Cela construit un "graphe d'entités" cohérent.

**Approche @graph recommandée (Joost de Valk, Yoast SEO) :**
Un seul bloc JSON-LD avec `@graph` est **préféré** à plusieurs blocs dispersés. Cela crée un graphe d'entités connecté que les moteurs de recherche comprennent mieux.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.example.fr/#organization",
      "name": "Nom entreprise",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://www.example.fr/#logo",
        "url": "https://www.example.fr/logo.png"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://www.example.fr/#website",
      "url": "https://www.example.fr",
      "publisher": { "@id": "https://www.example.fr/#organization" }
    },
    {
      "@type": "WebPage",
      "@id": "https://www.example.fr/page/#webpage",
      "url": "https://www.example.fr/page/",
      "isPartOf": { "@id": "https://www.example.fr/#website" }
    }
  ]
}
```

Google comprend que c'est la même entité, même sur des pages différentes. **Yoast SEO, Rank Math, et Schema Pro** implémentent tous ce pattern @graph.

### 5.2 Nouveaux types schema supportés (2024-2025)

| Type | Usage | Nouveauté |
|------|-------|-----------|
| **ProfilePage** | Pages auteur/créateur — renforce les signaux E-E-A-T | Google 2024 |
| **DiscussionForumPosting** | Forums, espaces communautaires (type Reddit/Quora) | Google 2024-2025 |
| **ProductGroup** + `hasVariant` | Produits avec variantes (taille, couleur) | Google 2024 |
| **MerchantReturnPolicy** | Politique de retour e-commerce | Google 2024 |
| **ShippingDeliveryTime** | Détails de livraison structurés | Google 2024 |

**Propriétés Product enrichies :**
- `shippingDetails` : informations de livraison structurées
- `hasMerchantReturnPolicy` : politique de retour avec `returnPolicyCategory`, `merchantReturnDays`
- `Pros` et `Cons` : pour les avis éditoriaux de produits
- Google cross-valide les données Product avec le **Google Merchant Center** — les incohérences (prix, disponibilité) peuvent supprimer les rich results

**Donnée clé (Olivier Andrieu, Abondance) :** Moins de **30% des sites e-commerce français** implémentent correctement le schema Product, malgré son impact direct sur les rich results. C'est un levier sous-exploité sur le marché français.

### 5.3 Injection via Google Tag Manager

**Avantage :** Pas besoin d'intervention développeur, déploiement rapide.

**Méthode :**
1. GTM > Balise > HTML personnalisé
2. Insérer le `<script type="application/ld+json">...</script>`
3. Déclencher sur les pages concernées (trigger URL)
4. Variables dynamiques : utiliser les variables GTM pour le titre, l'URL, etc.

**Limitation :** Google voit le JSON-LD injecté par GTM, mais uniquement s'il est dans le DOM initial rendu (pas de lazy-loading du schema).

### 5.3 Tests et monitoring

**Workflow de validation :**
1. Développer le JSON-LD
2. Valider la syntaxe JSON (jsonlint.com)
3. Valider le schema (validator.schema.org)
4. Tester l'éligibilité rich results (Google Rich Results Test)
5. Déployer
6. Monitorer dans GSC > Améliorations > [type de rich result]
7. Vérifier dans les SERPs que les rich results s'affichent

---

## PARTIE 6 : Format de sortie de l'audit

### A. Inventaire des données structurées existantes
| Page | Type(s) Schema | Valide | Rich Result éligible | Problèmes |
|------|---------------|--------|---------------------|-----------|

### B. Problèmes détectés (par priorité)
- P1 : Erreurs bloquant les rich results
- P2 : Erreurs de conformité Schema.org
- P3 : Opportunités manquées

### C. JSON-LD corrigés/générés
- Code JSON-LD prêt à copier-coller pour chaque page type

### D. Plan de déploiement
| Page type | Schema à implémenter | Méthode | Priorité |
|-----------|---------------------|---------|----------|

---

## Sources
- Schema.org : vocabulaire officiel (https://schema.org)
- Google Search Central : Structured Data Guidelines (developers.google.com/search/docs/appearance/structured-data/sd-policies)
- Google Search Central Blog : "Simplifying the search results page" (juin 2025) — annonce des dépréciations
- Google Rich Results Test
- Web.dev : Structured Data documentation
- Schema App : "The Semantic Value of Schema Markup in 2025" (schemaapp.com)
- John Mueller : clarifications schema updates 2026 (stanventures.com)
- almcorp : "Schema Markup in 2026: Why It's Now Critical for SERP Visibility"
- ClickRank : "Schema Markup Guide: Step-by-Step SEO Strategy for 2026"
- Clickforest : "Structured data Google guide: rank higher in AI search engines"
- Search Engine Journal : mises à jour FAQ/HowTo rich results
- WebFX : "Google Drops Support for 7 Schema Types" (webfx.com)
