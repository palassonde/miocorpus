Turret = function(x,y,game){
	Phaser.Sprite.call(this, game, x, y, 'turret');
	this.time = 0;
	//game.physics.arcade.enableBody(this);
	
	this.bullets = this.game.add.group();   
	this.bullets.enableBody = true;
	//this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
	
	
	//Caractéristique
	this.numberEnemyShoot = 2;
	this.cooldown = 3000; 
	this.domage = 1;
	this.rayon = 1000;
	
	this.cooldownTemp = 1000;
	
}

Turret.prototype = Object.create(Phaser.Sprite.prototype);
//Turret.prototype.constructor = Turret;

Turret.prototype.actionTurret = function(enemy){	
	this.time += this.game.time.elapsed; //Garde le temps lors de son dernier tir

	var cooldown = this.cooldownTemp;
	
	//tirer un nouveau bullet;	
	if (cooldown <= this.time){
		this.shootMissile(enemy,cooldown); 
	}
	
	//Action des missile
	for(var x in this.bullets.children){
		this.bullets.children[x].actionMissile();
	}
	
	//Verifier une collision
	this.game.physics.arcade.overlap(this.bullets, enemy, this.collisionMissile, function(){return true;}, this);
}

Turret.prototype.collisionMissile = function(bullet,enemy){
	console.log(bullet);
	console.log(enemy);
	enemy.hurt();
	bullet.needDestroy = true;
}


//Créer un missile s'il est a une bonne distance et remet un cooldown qui depend du nombre de missile lancé
Turret.prototype.shootMissile = function (enemy,cooldown){
	
	var maxEnemy = this.numberEnemyShoot; // Combien d'enemi qu'il peu tirer a la fois
	var isShoot = false; 
	
	loopEnemy : 
	for (var x in enemy.children){
		
		var dis = Phaser.Point.distance(this.position, enemy.children[x].position);
		//Tir a chaque seconde
		if(dis < this.rayon){
			this.bullets.add( new Bullet(this.x, this.y,this.game,'bullet',enemy.children[x]));
			maxEnemy -= 1;
			isShoot = true;
		}
		
		//Arret la boucle s'il ne peut plus tirer
		if(maxEnemy <= 0){
			break loopEnemy; //Arrete la boucle
		}
		
	}
	
	if(isShoot){
		this.time = 0;
		this.cooldownTemp = this.cooldown * ((this.numberEnemyShoot - maxEnemy)/this.numberEnemyShoot);
	}
}