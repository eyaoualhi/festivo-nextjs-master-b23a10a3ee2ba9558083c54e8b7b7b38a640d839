## Ce que fait cette demande de fusion

<!-- Une ou deux phrases : quoi, et pour quel besoin du cahier des charges. -->

Besoin concerné : BF-0? <!-- ou « aucun » (correction, outillage) -->

## Comment tester

<!-- Les pages à ouvrir et les actions à faire pour vérifier le résultat. -->

1.

## Vérifications

- [ ] `npm run check` passe en local (le pipeline le refait de toute façon)
- [ ] Textes d'interface dans les trois dictionnaires (`fr.ts`, `en.ts`, `ar.ts`), mêmes clés
- [ ] Affichage vérifié sur téléphone et sur ordinateur, et en arabe (droite à gauche)
- [ ] Aucun secret ni adresse de serveur dans le code (variables d'environnement seulement)
- [ ] Décision technique ou bibliothèque ajoutée consignée dans `docs/decisions.md`
- [ ] Si `public/sw.js` change : `VERSION` modifiée
