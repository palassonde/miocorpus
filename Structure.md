* Composantes du Jeux:

	* Stage(game)
		* Gestion de la scene
		* Fullscreen
		* Fond decran
		* platforms
		* tout ce qui bouge sur la scene
	* Player(game, ennemies, turrets, UI, powerups)
		* Gestion des controles
		* Gestion des actions du joueur
		* gestion des points de vies etc
		* gestion des powerups
		* Gestion de sa propre camera
	* Enemy(game, player, turrets)
		* Gestion de la creation de ennemies
		* Gere les sauts
		* gere les attaques
		* gere la creation de vague
		* Recoit une interaction du joueur
		* peut interagir avec le joueur
		* Interagis avec les turrets
		* recoit des interactions de la turrets
	* UI(game, player)
		* Affichage du niveau de vie du joueur
		* affichage du niveau de powerups du joueur
		* permettre un renvoi au menu
	* turret(game, player, ennemies)
		* Gere ses propres capacites en tant que turret
		* Gere son interaction propre en fonction du joueur (recoit des commandes du joueur mais ne peut en envoyer)
		* Affiche son niveau de vie (reparation)
		* Gere ses attaques
	* powerups(game, player)
		* Liste de powerups noms * effet
		* Gere sa consomation et active l'effet (interagit avec le joueur, envoie des commande au joueur)
	* game()
		* Instantie les composantes
		* appelle les methodes actions de chaque composantes durant lupdate