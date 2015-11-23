Turret = function(x, y, game){

	this.time = 0;

	//Attribut
	Phaser.Sprite.call(this, game, x, y, 'turret');
	this.anchor.x = 0.5;
	this.game.physics.enable(this, Phaser.Physics.ARCADE);
	this.body.gravity.y = 500;
    this.body.collideWorldBounds = true;
	
	//Missile
    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    //this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
	
	
	//Caractéristique
	this.numberEnemyShoot = 2;
	this.cooldown = 8000; //ICI 
	this.domage = 1;
	this.rayon = 300;
	
	this.cooldownTemp = 0;
	this.kind = 1;
	this.enemyList = [];
	this.changeEnemyList = [];
}

Turret.prototype = Object.create(Phaser.Sprite.prototype);

Turret.prototype.actionTurret = function(enemies){	
	this.time += this.game.time.elapsed; //Garde le temps lors de son dernier tir

	var cooldown = this.cooldownTemp;
	
	this.enemyList = [];
	this.changeEnemyList = [];
	
	//Liste des enemie attaquer par un laser et liste de missile a changer de target
	for(var x in this.bullets.children){
		if(this.bullets.children[x].behavior === 3){
			this.enemyList.push(this.bullets.children[x].target);
		}
		if(this.bullets.children[x].needChangeTarget){
			this.changeEnemyList.push(this.bullets.children[x]);
		}
	}
	
	//Change le target du missile
	for(var x in this.changeEnemyList){
		for (var y in enemies.children){
			if(this.enemyList.indexOf(enemies.children[y]) !== -1){
				continue; //Si l'ennemie est deja target
			}
			
			var dis = Phaser.Point.distance(this.position, enemies.children[y].position);
			if(dis < this.rayon){
				this.changeEnemyList[x].target = enemies.children[y];
				this.changeEnemyList[x].needChangeTarget = false;
				this.enemyList.push(enemies.children[y]); //Garde concience de l'ennemie attaquer
			}
		}
	}
	
	//tirer un nouveau bullet;	
	if (cooldown <= this.time){
		
		this.shootMissile(enemies,cooldown); 
	}
	
	//Action des missile
	for(var x in this.bullets.children){
		this.bullets.children[x].actionMissile();
	}
	
	//Verifier une collision
	this.game.physics.arcade.overlap(this.bullets, enemies, this.collisionMissile, null, this);
}

Turret.prototype.collisionMissile = function(bullet,enemy){
	if(bullet.behavior ===  2){
		if(bullet.timeDomageEffet < this.game.time.now){
			enemy.hurt(this.domage*10);
			bullet.timeDomageEffet = this.game.time.now + 1000;
		}
	}else{
		enemy.hurt(this.domage*100);
		bullet.needDestroy = true;
	}
	
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
			this.bullets.add( new Bullet(this.x, this.y,this.game,enemy.children[x],this.rayon, this.kind, this.domage));
			maxEnemy -= 1;
			isShoot = true;
		}
	}
	
	if(isShoot){
		this.time = 0;
		this.cooldownTemp = this.cooldown * ((this.numberEnemyShoot - maxEnemy)/this.numberEnemyShoot);
	}
}