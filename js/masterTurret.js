MasterTurret = function(x,y,game,domage,nbrMissile,cooldown,hp, rayon){
	Phaser.Sprite.call(this, game, x, y, 'turret');
	this.anchor.x = 0.5;
	this.game.physics.enable(this, Phaser.Physics.ARCADE);
	this.body.gravity.y = 500;
	this.body.collideWorldBounds = true;
	
	this.time = 0;
	
	//Caractéristique
	this.hp = hp;
	this.nbrMissile = nbrMissile;
	this.cooldown = cooldown;
	this.domage = domage;
	this.rayon = rayon;
	this.cooldownTemp = 0;
	this.turretList = [];
	this.changeTurretList = [];
	
	//Missile
	this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
}

MasterTurret.prototype = Object.create(Phaser.Sprite.prototype);

MasterTurret.prototype.action = function(a,b,c,player){	

	//Mort
	if (this.hp <= 0){
		for(var x in this.bullets.children){
			this.bullets.children[x].graphic.destroy();
		}
		this.bullets.destroy();
        this.destroy();
		return;
    }

	this.time += this.game.time.elapsed; //Garde le temps lors de son dernier tir

	var cooldown = this.cooldownTemp;
	
	this.turretList = [];
	this.changeTurretList = [];
	
	//Liste des enemie attaquer par un laser et liste de missile a changer de target
	for(var x in this.bullets.children){
		if(this.bullets.children[x].behavior === 3){
			this.turretList.push(this.bullets.children[x].target);
		}
		if(this.bullets.children[x].needChangeTarget){
			this.changeTurretList.push(this.bullets.children[x]);
		}
	}
	
	//Change le target du missile
	for(var x in this.changeTurretList){
		
		if(this.turretList.indexOf(player) === -1){
			this.changeTurretList[x].target = player;
			this.changeTurretList[x].needChangeTarget = false;
			this.turretList.push(player);
			continue;
		}
		
		for (var y in player.turrets.children){
			if(this.turretList.indexOf(player.turrets.children[y]) !== -1){
				continue; //Si l'ennemie est deja target
			}
			
			var dis = Phaser.Point.distance(this.position, player.turrets.children[y].position);
			if(dis < this.rayon){
				this.changeTurretList[x].target = player.turrets.children[y];
				this.changeTurretList[x].needChangeTarget = false;
				this.turretList.push(player.turrets.children[y]); //Garde concience de l'ennemie attaquer
			}
		}
	}
	
	//tirer un nouveau bullet;	
	if (cooldown <= this.time){	
		this.shootMissile(player,cooldown); 
	}
	
	//Action des missile
	for(var x in this.bullets.children){
		this.bullets.children[x].actionMissile();
	}
	
	//Verifier une collision
	this.game.physics.arcade.overlap(player, this.bullets, this.collisionMissile, null, this);
	//this.game.physics.arcade.overlap(player.turrets, this.bullets, this.collisionMissile, null, this);
}


MasterTurret.prototype.collisionMissile = function(cible,bullet){
	if(bullet.behavior ===  2 || bullet.behavior ===  4){
		if(bullet.timeDomageEffet < this.game.time.now){
			cible.hurt(this.domage*25);
			bullet.timeDomageEffet = this.game.time.now + 1000;
		}
	}else{
		cible.hurt(this.domage*100);
		bullet.needDestroy = true;
	}
}


//Créer un missile s'il est a une bonne distance et remet un cooldown qui depend du nombre de missile lancé
MasterTurret.prototype.shootMissile = function (player,cooldown){
	var maxEnemy = this.nbrMissile; // Combien d'enemi qu'il peu tirer a la fois
	
	var isShoot = false; 
	
	//Vise le player
	var dis = Phaser.Point.distance(this.position, player.position);
	if(dis < this.rayon){
		this.bullets.add( new Bullet(this.x, this.y,this.game,player,this.rayon, 1, this.domage, 4000));
		this.bullets.add( new Bullet(this.x, this.y,this.game,player,this.rayon, 2, this.domage, 4000));
		this.bullets.add( new Bullet(this.x, this.y,this.game,player,this.rayon, 3, this.domage, 4000));
		maxEnemy -= 1;
		isShoot = true;
	}

	
	for (var x in player.turrets.children){
		
		//Arret la boucle s'il ne peut plus tirer
		if(maxEnemy <= 0){
			break; 
		}
		
		dis = Phaser.Point.distance(this.position, player.turrets.children[x].position);
		//Tir
		if(dis < this.rayon){
			this.bullets.add( new Bullet(this.x, this.y,this.game,player.turrets.children[x],this.rayon, 1, this.domage, 5000));
			this.bullets.add( new Bullet(this.x, this.y,this.game,player.turrets.children[x],this.rayon, 2, this.domage, 5000));
			this.bullets.add( new Bullet(this.x, this.y,this.game,player.turrets.children[x],this.rayon, 3, this.domage, 5000));
			maxEnemy -= 1;
			isShoot = true;
		}
	}
	
	if(isShoot){
		this.time = 0;
		this.cooldownTemp = this.cooldown * ((this.nbrMissile - maxEnemy)/this.nbrMissile);
	}
}

MasterTurret.prototype.hurt = function(dmg){
    this.hp -= dmg;    
}