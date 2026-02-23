# Skill : LinkedIn Scorer

## Mission
Deux modes d'évaluation :
1. **Mode Buzz** : reçoit une idée brute (sujet, angle, format) → retourne un score de potentiel de buzz /100 AVANT rédaction
2. **Mode Post** : reçoit un brouillon rédigé → retourne un score qualité /100 avec sous-scores détaillés

Ne génère rien — évalue uniquement.

---

## MODE 1 : Score de potentiel de buzz (idée brute → /100)

Évalue une idée AVANT d'investir du temps à écrire. L'input peut être une phrase, un sujet, un angle, un format envisagé.

### Grille de buzz potential (100 points)

#### 1. Résonance audience (30 points)
| Critère | Points | Détail |
|---------|--------|--------|
| Le sujet touche un pain point réel | 10 | Les gens se reconnaissent-ils ? Ça gratte où ça fait mal ? |
| Taille de l'audience concernée | 10 | Niche SEO only (5pts) vs tout marketeur (8pts) vs tout professionnel (10pts) |
| Timing / actualité | 10 | Sujet chaud (update Google, tendance IA) = boost. Sujet evergreen = 5pts. Sujet daté = 2pts |

#### 2. Potentiel de débat (25 points)
| Critère | Points | Détail |
|---------|--------|--------|
| Prise de position clivante | 10 | "Les pods sont morts" > "Le SEO c'est important". L'algo récompense P(comment) |
| Les gens auront un avis | 8 | Le sujet génère des "oui mais..." ou des "pas d'accord" |
| Partageabilité | 7 | Les gens voudront tagger quelqu'un ou save pour plus tard ? 1 save = 5 likes |

#### 3. Crédibilité Franck (20 points)
Consulter `profil_franck.md` obligatoirement.
| Critère | Points | Détail |
|---------|--------|--------|
| Sujet dans l'expertise primaire | 10 | SEO technique, automatisation, IA, data, grands comptes = 10pts. Secondaire = 6pts. Hors expertise = 2pts |
| Franck a des chiffres / un vécu à citer | 10 | Mercedes 2M→10M, suite primée SMX, 9000 contenus = crédibilité béton. Pas de vécu = 3pts |

#### 4. Potentiel de hook (15 points)
| Critère | Points | Détail |
|---------|--------|--------|
| Le sujet permet un hook choc | 8 | Chiffre surprenant, affirmation contre-intuitive, résultat inattendu |
| Le sujet crée de la curiosité | 7 | Le "voir plus" sera cliqué ? L'algo valorise ce signal |

#### 5. Format & exécution (10 points)
| Critère | Points | Détail |
|---------|--------|--------|
| Format adapté au sujet | 5 | Data → carrousel (1,45x). REX → texte seul long. Décryptage → texte + image |
| Effort vs impact | 5 | Un post texte qui buzze > un carrousel 20 slides qui flop. Ratio effort/potentiel |

### Format de sortie (Mode Buzz)

```
## Potentiel de buzz : XX/100

| Catégorie | Score | Max |
|-----------|-------|-----|
| Résonance audience | XX | 30 |
| Potentiel de débat | XX | 25 |
| Crédibilité Franck | XX | 20 |
| Potentiel de hook | XX | 15 |
| Format & exécution | XX | 10 |
| **TOTAL** | **XX** | **100** |

### Verdict
[GO / PIVOT / POUBELLE]

### Si GO
- Angle recommandé : [l'angle le plus fort]
- Hook suggéré : [1-2 propositions de hooks]
- Format : [texte / carrousel / vidéo]
- Chiffre clé à utiliser : [tiré du profil Franck]

### Si PIVOT
- Pourquoi l'idée brute ne suffit pas
- Angle alternatif qui score mieux

### Si POUBELLE
- Pourquoi (hors expertise, pas de débat, déjà vu 1000x)
```

### Seuils de décision
- **80-100** : GO — fonce, le sujet a un vrai potentiel
- **60-79** : GO avec ajustements — bon sujet mais pivote l'angle
- **40-59** : PIVOT — l'idée a un noyau mais il faut tout reframer
- **<40** : POUBELLE — ne perds pas ton temps

---

## MODE 2 : Score qualité post (brouillon rédigé → /100)

## Grille de scoring (100 points)

### 1. Hook (25 points)
Le hook = les ~110 premiers caractères (avant "voir plus"). L'utilisateur a 7 secondes pour décider.

| Critère | Points | Détail |
|---------|--------|--------|
| Accroche en <110 chars | 8 | Doit tenir avant le "voir plus" |
| Pattern efficace | 8 | Problème, chiffre surprenant, affirmation audacieuse, question rhétorique |
| Incitation au "voir plus" | 5 | Le clic "voir plus" = signal d'engagement fort pour LiRank |
| Pas d'engagement bait | 4 | Pas de "Commentez OUI", "Likez si...", "Tag un ami" → pénalité algo |

**Exemples de hooks forts :**
- Chiffre choc : "J'ai perdu 80% de ma portée LinkedIn en 3 mois. Voici ce que j'ai compris."
- Problème universel : "Tu publies 3x par semaine et personne ne te lit."
- Affirmation contre-intuitive : "Les hashtags tuent ta portée LinkedIn. Data inside."

**Red flags (-5 points chacun) :**
- Hook générique ("Je suis ravi de partager...")
- Trop long (>150 chars avant le point de coupure)
- Clickbait pur sans substance

### 2. Dwell Time & Structure (25 points)
Le dwell time est le signal #1 de LiRank en 2025. La structure doit maximiser le temps de lecture.

| Critère | Points | Détail |
|---------|--------|--------|
| Paragraphes courts (max 4 lignes) | 6 | +15% portée (van der Blom) |
| Espacement généreux | 5 | +25% lisibilité, scrolle = dwell time |
| Niveau de lecture 6-9 ans | 5 | >lycée = -35% portée |
| Utilisation de symboles | 4 | Bullet points, flèches, check marks (+2,1x perf) |
| Rythme de lecture engageant | 5 | Alternance phrases courtes/moyennes, relances |

**Scoring dwell time :**
- Le post force-t-il à lire jusqu'au bout ? (pas juste le hook)
- Y a-t-il des "micro-hooks" internes qui relancent l'attention ?
- Le formatage mobile-first ? (sessions moyennes = 1,27 min)

### 3. Contenu & Expertise (20 points)
LinkedIn récompense le "knowledge sharing" — l'expertise vérifiable, pas la viralité.

| Critère | Points | Détail |
|---------|--------|--------|
| Expertise démontrable | 6 | L'auteur parle de son domaine ? Vérifiable via profil ? |
| Originalité | 5 | Pas un recyclage de platitudes LinkedIn |
| Valeur actionnable | 5 | Le lecteur repart avec quelque chose de concret |
| Audience ciblée | 4 | Le post cible un segment précis, pas "tout le monde" |

**Red flags (-3 points chacun) :**
- Contenu motivationnel générique ("Croyez en vos rêves")
- Storytelling sans substance (histoire perso sans enseignement)
- Contenu qui sent le ChatGPT (détecté à 94%, -30% portée)

### 4. Longueur (10 points)

**RÈGLE GÉNÉRALE : la concision prime. Un post LinkedIn ne doit pas dépasser 1 000 caractères, quel que soit le format.** Au-delà, le risque de décrochage lecteur augmente et le dwell time effectif baisse.

#### Si texte + image / infographie :
| Plage | Points | Source |
|-------|--------|--------|
| 700-900 chars | 10 | Sweet spot texte+image |
| 600-700 ou 900-1000 chars | 7 | Légèrement hors zone |
| >1000 chars | 0 | **TROP LONG — pénalité -5 en bonus** |

#### Si texte seul (pas de média) :
| Plage | Points | Source |
|-------|--------|--------|
| 800-1000 chars | 10 | Sweet spot concis |
| 600-800 chars | 7 | Un peu court mais OK si dense |
| >1000 chars | 0 | **TROP LONG — pénalité -5 en bonus** |

#### Si carrousel :
| Plage | Points | Source |
|-------|--------|--------|
| 300-500 chars | 10 | Sweet spot accompagnement carrousel |
| 200-300 ou 500-700 chars | 6 | Hors zone |
| >700 chars | 0 | **TROP LONG — pénalité -5 en bonus** |

**Red flag automatique :** tout post >1000 chars → signaler "post trop long, couper" dans le diagnostic, quelle que soit la qualité du contenu.

### 5. Engagement Potential (10 points)
L'algorithme prédit P(comment) et P(share). Le post doit provoquer des réactions de qualité.

| Critère | Points | Détail |
|---------|--------|--------|
| Appel à discussion naturel | 4 | Question ouverte, prise de position qui invite au débat |
| Potentiel de commentaires longs | 3 | Les commentaires 15+ mots = 2,5x plus valorisés |
| Partageabilité | 3 | Le contenu a de la valeur "à faire suivre" (= saves + shares) |

### 6. Éléments techniques (10 points)

| Critère | Points | Détail |
|---------|--------|--------|
| Hashtags (0-2) | 3 | 0 OK, 1-2 optimal, 3+ = -29% portée |
| Emojis (1-3 pertinents) | 2 | +25% engagement si usage pro |
| Liens externes | 2 | OK en 2025, 4+ liens > 1 lien, pas de bit.ly |
| Format média adapté | 3 | Carrousel 8-10 slides, vidéo verticale, image/infographie |

**Pénalités automatiques (algorithme LinkedIn) :**
- Hashtags >5 : -10 points (filtre anti-spam)
- Engagement bait détecté : -15 points
- Raccourcisseur de liens (bit.ly) : -5 points

**Pénalités détection IA (consulter `anti_ia_ecriture_humaine.md`) :**
- Tirets longs "—" : -5 points
- 3+ mots du vocabulaire IA (crucial, met en lumière, paysage, au cœur de...) : -5 points
- "Voici pourquoi/comment/ce que" : -3 points
- Ton uniformément lisse, zéro aspérité : -5 points
- Inflation d'importance injustifiée ("marque un tournant", "révolutionne") : -3 points
- Analyses superficielles en participe présent ("soulignant l'importance de...") : -3 points
- Structure template visible (Problème/Solution/Résultat en gras) : -5 points
- Règle de trois systématique : -3 points
- Ouverture par une définition : -3 points
- Conclusion qui résume le post : -3 points
- Anglicismes inutiles ("mindset", "game changer", "insights") : -3 points
- Parallélismes négatifs ("Ce n'est pas X, c'est Y") : -3 points

**Seuil** : si la checklist anti-IA donne 4+ OUI sur 10, le post est rétrogradé à "À refaire" quel que soit le score brut.

## Format de sortie

```
## Score LinkedIn : XX/100

| Catégorie | Score | Max |
|-----------|-------|-----|
| Hook | XX | 25 |
| Dwell Time & Structure | XX | 25 |
| Contenu & Expertise | XX | 20 |
| Longueur | XX | 10 |
| Engagement Potential | XX | 10 |
| Éléments techniques | XX | 10 |
| **TOTAL** | **XX** | **100** |
| Pénalités | -XX | — |
| **SCORE FINAL** | **XX** | **100** |

### Diagnostic
[2-3 phrases : points forts et faiblesses principales]

### Corrections prioritaires
1. [Action concrète #1]
2. [Action concrète #2]
3. [Action concrète #3]

### Prédiction de performance
- Portée estimée : [faible / moyenne / forte / virale]
- Meilleur créneau : [jour + heure recommandés]
- Format recommandé : [texte seul / texte+image / carrousel / vidéo]
```

## Seuils d'interprétation
- **90-100** : Exceptionnel — publier tel quel
- **75-89** : Solide — corrections mineures recommandées
- **60-74** : Passable — retravailler le hook ou la structure
- **40-59** : Faible — réécriture nécessaire
- **<40** : À refaire — problèmes structurels majeurs
