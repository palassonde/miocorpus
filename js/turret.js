Turret = function(x, y, game){

	this.time = 0;

	Phaser.Sprite.call(this, game, x, y, 'turret');
	this.anchor.x = 0.5;
	this.game.physics.enable(this, Phaser.Physics.ARCADE);
	this.body.gravity.y = 500;
    this.body.collideWorldBounds = true;

    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    //this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
	
	
	//Caractéristique
	this.numberEnemyShoot = 2;
	this.cooldown = 8000; //ICI 
	this.domage = 1;
	this.rayon = 300;
	
	
	this.cooldownTemp = 0;
	this.kind = 2;
	this.enemyList = [];
	this.changeEnemieList = [];
}

Turret.prototype = Object.create(Phaser.Sprite.prototype);

Turret.prototype.actionTurret = function(enemy){	
	this.time += this.game.time.elapsed; //Garde le temps lors de son dernier tir

	var cooldown = this.cooldownTemp;
	
	this.enemyList = [];
	this.changeEnemieList = [];
	
	//Liste des enemie attaquer par un laser et liste de missile a changer de target
	for(var x in this.bullets.children){
		if(this.bullets.children[x].behavior === 3){
			this.enemyList.push(this.bullets.children[x].target);
		}
		if(this.bullets.children[x].needChangeTarget){
			this.changeEnemieList.push(this.bullets.children[x]);
		}
	}
	
	//Change le target du missile
	for(var x in this.changeEnemieList){
		for (var y in enemy.children){
			if(this.enemyList.indexOf(enemy.children[y]) !== -1){
				continue; //Si l'ennemie est deja target
			}
			
			var dis = Phaser.Point.distance(this.position, enemy.children[y].position);
			if(dis < this.rayon){
				this.changeEnemieList[x].target = enemy.children[y];
				this.changeEnemieList[x].needChangeTarget = false;
				this.enemyList.push(enemy.children[y]); //Garde concience de l'ennemie attaquer
			}
		}
	}
	
	//tirer un nouveau bullet;	
	if (cooldown <= this.time){
		this.shootMissile(enemy,cooldown); 
	}
	
	//Action des missile
	for(var x in this.bullets.children){
		this.bullets.children[x].actionMissile();
	}
	
	//Verifier une collision
	this.game.physics.arcade.overlap(this.bullets, enemy, this.collisionMissile, null, this);
}

Turret.prototype.collisionMissile = function(bullet,enemy){
	enemy.hurt();
	bullet.needDestroy = true;
}

//Créer un missile s'il est a une bonne distance et remet un cooldown qui depend du nombre de missile lancé
Turret.prototype.shootMissile = function (enemy,cooldown){

	var maxEnemy = this.numberEnemyShoot; // Combien d'enemi qu'il peu tirer a la fois
	
	var isShoot = false; 
	 
	for (var x in enemy.children){
		
		//Arret la boucle s'il ne peut plus tirer
		if(maxEnemy <= 0){
			break; 
		}
		
		var dis = Phaser.Point.distance(this.position, enemy.children[x].position);
		//Tir a chaque seconde
		if(dis < this.rayon){
			this.bullets.add( new Bullet(this.x, this.y,this.game,enemy.children[x],this.rayon, this.kind));
			maxEnemy -= 1;
			isShoot = true;
		}
	}
	
	if(isShoot){
		this.time = 0;
		this.cooldownTemp = this.cooldown * ((this.numberEnemyShoot - maxEnemy)/this.numberEnemyShoot);
	}
}