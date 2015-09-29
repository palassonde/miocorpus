# <Titre du jeu>

INF5071 Projet de jeu vidéo

## Description du jeu

Le joueur doit empecher l'ennemi d'atteindre le coeur qui est situe a l'extremite gauche du tableau. Il y a une couche protectrice qui ralentit l'ennemi. Le joueur peut placer des turrets si il a les ressources necessaires, les turretes sont creer a partir de combinaise de 3 types d'ennemi. Le jeu continu tant qu'aucun ennemi n'a toucher le coeur et les vagues d'ennemi sont de plus en plus feroce et un score saccumule entre temps. Il y a un tableau au dessus du tableau principal qui est consacrer a lobtention de nouvelles ressources. Il y a des power ups qui donne au joueur de meilleur facultes tel que saute plus haut aller plus vite reprendre de la vie attaquer plus fort. Des que le joueur est toucher par un ennemi il perd toute ses faculte. Si le joueur meurt il doit attendre un certains nombre de temps avant de reaparaitre. Ce temps est incrementer plus il meurt souvent. Le joueur peut placer des turrets en haut comme en bas. Le theme du jeu n'est pas encore choisi.

## Processus de developpement 

10 1/2 semaines, remise le 9 decembre

1. Scenario, gameplay, idees, theme, deroulement du jeu, configuration des environnements + CVS - 2 semaines (Fin le 7 octobre) 
2. Coder les fonctionnalites, reorganiser le code, corriger les bugs - 6 semaines (Fin le 18 novembre) 
3. faire les graphismes - 1 semaine (Fin le 25 novembre) 
4. Faire le son - 1/2 semaines (Fin le 30 Novembre) 
5. S'occuper des bugs - 1 semaine (Fin le 5 Decembre) 

## Partir le serveur

```
$ cd ~/game
$ java Server
```

Naviguer à http://localhost:8080 affichera la page d'index donc le jeu,
les ressources sont accessibles par la même adresse exemple : http://localhost:8080/assets/ball.png

## Définitions des genres

* Tower Defense

>Tower defense is a subgenre of real-time strategy video games, where the goal is to stop the enemies from reaching a specific point on the map by building a variety of different towers which shoot at them as they pass. Enemies and towers usually have varied abilities, costs, and upgrade prices. When an enemy is defeated, the player earns money or points, which are used to buy or upgrade towers, or upgrade the number of money or points that are earned, or even upgrade the rate at which they upgrade.

* Platformer

>A platform game (or platformer) is a video game which involves guiding an avatar to jump between suspended platforms, over obstacles, or both to advance the game. These challenges are known as jumping puzzles or freerunning. The player controls the jumps to avoid letting the avatar fall from platforms or miss necessary jumps. The most common unifying element of games of this genre is the jump button. Jumping, in this genre, may include swinging from extendable arms, as in Ristar or Bionic Commando, or bouncing from springboards or trampolines, as in Alpha Waves. These mechanics, even in the context of other genres, are commonly called platforming, a verbification of platform. Games where jumping is automated completely, such as The Legend of Zelda, fall outside of the genre.

## Exemple minimaliste pour travailler sur un Issue

1. Faire une branche avec le numero du issue
2. Commit jusqua ce que le issue soit terminer
2. Merger avec le master 

Cas : Je veux travailler sur le issue 3. Saut des ennemies sur les plateformes

```
$ git checkout -b iss3
Switched to a new branch "iss3"
$ git commit -a -m 'Rajouter le saut pour un enemy [issue 3]'
[...]
$ git commit -a -m 'terminer le saut pour les ennemies [issue 3]'
$ git checkout master
Switched to branch 'master'
$ git merge iss3
```

C'est assez basic et ca devrait nous eviter beaucoup de probleme de conflits.

N.B si vos fichiers sont utiliser par le server, ca se pourrait que vous puissiez pas faire de pull puisquil sont ouvert ils ne pourront pas etre modifie