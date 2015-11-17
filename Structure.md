* Composantes du Jeux:

	* Stage(game)
		* Gestion de la scene
		* Fullscreen
		* Fond decran
		* platforms
		* tout ce qui bouge sur la scene
		* Controle le temps et fabrique les vagues dennemies (par exemple si ils sont tous morts)
	* Player(game, ennemies, turrets, UI, powerups)
		* Gestion des controles
		* Gestion des actions du joueur
		* gestion des points de vies etc
		* gestion des powerups
		* Gestion de sa propre camera
		* Creer des turrets
	* Enemy(game, player, turrets)
		* Gestion de la creation de ennemies
		* Gere les sauts
		* gere les attaques
		* gere la creation de vague
		* Recoit une interaction du joueur
		* peut interagir avec le joueur
		* Interagis avec les turrets
		* recoit des interactions de la turrets
		* est destroy si hp = 0
		* peuve attaquer turret
	* UI(game, player)
		* Affichage du niveau de vie du joueur
		* affichage du niveau de powerups du joueur
		* permettre un renvoi au menu
	* turret(game, player, ennemies)
		* Gere ses propres capacites en tant que turret
		* Gere son interaction propre en fonction du joueur (recoit des commandes du joueur mais ne peut en envoyer)
		* Affiche son niveau de vie (reparation)
		* Gere ses attaques
		* bullets peuvent attaquer ennemies
		* est destroy si repair = 0
	* powerups(game, player)
		* Liste de powerups noms * effet
		* Gere sa consomation et active l'effet (interagit avec le joueur, envoie des commande au joueur)
	* game()
		* Instantie les composantes
		* appelle les methodes actions de chaque composantes durant lupdate
		* gere les groupe de turrets, ennemies et powerups

# Collisions

Comment choisir les collisions ?

C'est l'objet qui initie la collision qui devrait lancer l'action relier a celle-ci, exemple c'est la balle qui entre en collision avec l'ennemie et non l'inverse
C'est l'ennemie qui rentre en collision avec les platformes et non l'inverse ETC...