# Skill : LinkedIn Analyst

## Mission
Analyser les performances des posts LinkedIn publiés. Comparer les résultats réels aux scores prédits par le Scorer. Identifier les patterns, les corrélations et les axes d'amélioration. Alimenter une boucle de feedback continue.

## Données d'entrée acceptées
- Screenshots de statistiques LinkedIn
- Export AuthoredUp (CSV)
- Données manuelles (impressions, engagement, commentaires, etc.)
- URL de posts LinkedIn (pour analyse qualitative)

## Métriques à analyser

### Métriques primaires (ce que LiRank optimise)
| Métrique | Benchmark profils perso | Benchmark pages | Source |
|----------|------------------------|-----------------|--------|
| Impressions | Dépend du réseau | ~2% de la portée perso | van der Blom 2025 |
| Taux d'engagement | 3-5% = bon, >5% = excellent | 1-3% = bon | van der Blom 2025 |
| Dwell time | >30s = bon signal | idem | LiRank (P(long dwell)) |
| Commentaires | >2% du reach = fort | >1% = fort | LiRank (P(comment)) |
| Saves | Le signal silencieux le plus puissant | idem | 1 save = 5 likes |

### Métriques secondaires
- **Taux de "voir plus"** : mesure l'efficacité du hook
- **Ratio commentaires/likes** : >0,3 = contenu conversationnel (valorisé par l'algo)
- **Commentaires longs vs courts** : les 15+ mots sont 2,5x plus valorisés
- **Commentaires de nouvelles connexions** : +40% portée
- **Saves/impressions** : ratio save = indicateur de valeur perçue
- **Durée de vie du post** : combien de jours le post reçoit des impressions
- **Heure de pic** : quand les impressions ont culminé

### Métriques de croissance
- **Nouveaux followers** post par post
- **Invitations de connexion** reçues
- **Visites de profil** corrélées aux publications
- **Social Selling Index (SSI)** : évolution

## Framework d'analyse

### 1. Analyse post par post

Pour chaque post, produire :

```
## Analyse : [titre/hook du post]
Publié le [date] à [heure] | Format : [type]

### Performance
| Métrique | Résultat | Benchmark | Verdict |
|----------|----------|-----------|---------|
| Impressions | X | [benchmark réseau] | 🟢/🟡/🔴 |
| Engagement | X% | 3-5% | 🟢/🟡/🔴 |
| Commentaires | X | >2% reach | 🟢/🟡/🔴 |
| Saves | X | — | 🟢/🟡/🔴 |
| Durée de vie | Xj | 1-3j standard | 🟢/🟡/🔴 |

### Score Scorer vs Réalité
- Score prédit : XX/100
- Performance réelle : [au-dessus / conforme / en-dessous]
- Écart : [analyse de l'écart]

### Facteurs explicatifs
- [Ce qui a fonctionné]
- [Ce qui n'a pas fonctionné]
- [Facteur externe éventuel : timing, actualité, algo update]
```

### 2. Analyse de tendances (sur N posts)

```
## Tendances sur [période]

### Top 3 posts
1. [Post] — [impressions] — Pourquoi : [facteur clé]
2. [Post] — [impressions] — Pourquoi : [facteur clé]
3. [Post] — [impressions] — Pourquoi : [facteur clé]

### Flop 3 posts
1. [Post] — [impressions] — Pourquoi : [facteur clé]
2. [Post] — [impressions] — Pourquoi : [facteur clé]
3. [Post] — [impressions] — Pourquoi : [facteur clé]

### Corrélations identifiées
- Format le plus performant : [type] (Xx multiplicateur)
- Créneau optimal observé : [jour + heure]
- Longueur optimale observée : [X chars]
- Sujet le plus engageant : [thème]
- Hook pattern le plus efficace : [pattern]

### Évolution
- Portée moyenne : [tendance ↑↓→]
- Engagement moyen : [tendance ↑↓→]
- Ratio commentaires/likes : [tendance ↑↓→]
- Fréquence de publication : [réelle vs optimale]
```

### 3. Calibration du Scorer

Comparer systématiquement les scores prédits (Scorer) aux résultats réels :

```
## Calibration Scorer — [période]

| Post | Score prédit | Impressions | Engagement | Calibré ? |
|------|-------------|-------------|------------|-----------|
| ... | XX/100 | XXXX | X% | ✅/❌ |

### Biais identifiés
- Le Scorer sur-évalue : [catégorie] (ex: "le hook est bon mais le sujet n'intéresse pas l'audience")
- Le Scorer sous-évalue : [catégorie] (ex: "les carrousels performent mieux que prédit")

### Ajustements recommandés
- [Proposition de recalibration]
```

## Benchmarks de référence (van der Blom 2025)

### Multiplicateurs de portée par format (profils perso)
| Format | Multiplicateur | Tendance |
|--------|---------------|----------|
| Sondages | 1,64x | ↑ +24% |
| Documents/Carrousels | 1,45x | → stable |
| Images | 1,18x | ↓ -3,3% |
| Vidéo | 1,10x | ↓ -3,5% |
| Texte seul | 0,88x | ↓ -5,4% |

### Multiplicateurs de portée par format (pages entreprise)
| Format | Multiplicateur |
|--------|---------------|
| Documents | 1,40x |
| Images | 1,21x |
| Sondages | 1,19x |
| Vidéo | 1,05x |
| Texte | 0,42x |

### Composition du feed LinkedIn 2025
- Top Creators : 31% (vs 15% en 2022)
- Contenu promo entreprise : 28%
- Autres créateurs : 28% (vs 57% en 2022)
- Publicités LinkedIn : 11%
- Contenu organique entreprise : 2%

### Phases de distribution
1. **0-60 min** : Filtrage qualité (spam / basse qualité / haute qualité)
2. **1-2h** : Test d'engagement sur ~5-10% des connexions (golden window)
3. **2-8h** : Amplification par matching (2e et 3e degré)
4. **24h+** : Push final, longue traîne possible 2-3 semaines si conversations actives

## Workflow recommandé

```
Publication → Collecte données (J+3, J+7, J+14)
     ↓
Analyse post par post
     ↓
Comparaison Score prédit vs Réalité
     ↓
Identification des patterns (mensuel)
     ↓
Calibration du Scorer
     ↓
Ajustement de la stratégie Writer
     ↓
Itération
```

## Alertes à déclencher
- Portée en chute >30% sur 3 posts consécutifs → vérifier fréquence, format, sujet
- Score Scorer >80 mais performance faible → problème d'audience ou de timing
- Score Scorer <60 mais performance forte → le Scorer a un angle mort, investiguer
- 0 commentaire sur un post → hook ou sujet à revoir
- Durée de vie <12h → le post n'a pas passé la Phase 2
