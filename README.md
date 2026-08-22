# GValue UI

Scaffold Vite base JavaScript avec Web Components natifs (Custom Elements + Shadow DOM).

## Scripts

- `npm run dev` : lance le serveur de dev Vite
- `npm run build` : build de production
- `npm run preview` : prévisualise le build

## Structure

- `src/main.js` : point d'entree
- `src/components/gvalue-app.js` : composant racine
- `src/components/wc-counter.js` : composant exemple avec etat local

## Glossaire d'une évaluation

Ce glossaire sert de référence commune pour nommer les éléments manipulés par l'interface, les jeux de données et les schémas JSON.

| Terme | Définition |
| --- | --- |
| **Évaluation** | La définition complète d'une grille d'évaluation. Elle contient un `title`, un `id`, une `description` et une liste de `criteria`. |
| **Critère** | Élément de la grille utilisé pour évaluer un aspect précis. Un critère possède au minimum un `id` et un `label`. |
| **Critère parent** | Critère qui regroupe d'autres critères via la propriété `criteria`. |
| **Critère feuille** | Critère sans sous-critères, directement noté pendant l'évaluation. |
| **Sous-critère** | Critère contenu dans la liste `criteria` d'un critère parent. |
| **`max`** | Pondération ou note maximale attribuée à un critère. Utilisée quand le critère définit directement son total. |
| **`zvalue`** | Pondération d'un critère parent quand son total doit être réparti entre ses sous-critères. |
| **Résultat d'évaluation** | Données de notation pour un étudiant. Elles relient une évaluation (`eval_id`) à un `student_id` et aux valeurs saisies dans `criteria`. |
| **`value`** | Note effectivement attribuée à un critère dans un résultat d'évaluation ou valeur portée par un commentaire. |
| **Commentaire** | Texte réutilisable associé à un critère via `criterion_id`, avec une éventuelle `value` numérique. |
| **`comments`** | Liste d'identifiants de commentaires appliqués à un critère ou à un niveau de la hiérarchie de critères. |

### Fichiers de référence

- `data/eval1.json`, `data/eval2.json` : définitions d'évaluations
- `data/eval1_0123456.json` : exemple de résultat d'évaluation
- `data/eval1_comments.json`, `data/eval2_comments.json` : catalogue de commentaires
- `schemas/evaluation.schema.json` : structure attendue pour une définition d'évaluation
- `schemas/scoring.schema.json` : structure attendue pour un résultat d'évaluation
- `schemas/comments.schema.json` : structure attendue pour les commentaires
