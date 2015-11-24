Bullet = function(x,y,game, target, rayon, kind, domage, timeLive, pointDestination, cursor){
	
	this.speed = 300;
    this.angleMax = 0.5;
	this.behavior = kind; // comportement (1 = chercheuse, 2 = boomerang, 3 = ...)
	this.domage = domage; //Dommage
	this.timeLive = timeLive; //Temps de vie du missile
	this.rayon = rayon; //Distance de tir
	this.timeDomageEffet = game.time.now;
	this.nbScale = 0.1;
	this.cursor = cursor;
	
	this.tween;
	this.time = 0;
	this.needDestroy = false;
	this.needChangeTarget = false; //Chage de target (pour laser)
	this.target = target; 
	this.pointDestination = pointDestination;
	this.stop = false; //Sert a changer le comportement (boomerang (lance un tween seulement)
	this.graphic = game.add.graphics(0, 0);
	
	if(kind === 2){
		Phaser.Sprite.call(this, game, x, y, 'boomerang');
	}else if(kind === 4){
		this.circle(game,x,y);
	}else{
		Phaser.Sprite.call(this, game, x, y, 'bullet');
	}
	this.anchor.setTo(0.5, 0.5);
	if(kind === 3){
		this.kill();
	}
}

Bullet.prototype = Object.create(Phaser.Sprite.prototype);


Bullet.prototype.actionMissile = function(){
	this.time += this.game.time.elapsed; //Garde le temps que la bullet existe
	
	this.graphic.clear();
	this.graphic.position = new Phaser.Point();
	if(this.time >= this.timeLive || this.needDestroy){
		this.destroy();
		return;
	}
	
	//Mouvement
	switch(this.behavior){
		case 0: 
			this.simpleFire();
			break;
		case 1:
		case 5:
			this.homing();
			break;
		case 2:
			this.boomerang();
			break;
		case 3:
			this.laser();
			break;
		case 4:
			this.ajuster();
			break;
	}

}

//Fire personnage
Bullet.prototype.simpleFire = function(){
	
	if(this.stop){
		return;
	}
	var vistesse = 600;
	
	if(this.cursor.left.isDown){
		this.body.velocity.x = -vistesse;
	}else if (this.cursor.up.isDown){
		this.body.velocity.y = -vistesse;
	}else if(this.cursor.down.isDown){
		this.body.velocity.y = vistesse;
	}else{
		this.body.velocity.x = vistesse;
	}
	this.scale.setTo(2,2);
	this.stop = true;
}


//Missile a tête chercheuse
Bullet.prototype.homing = function(){
	var angleTarget;
	
	if(this.behavior === 1){
		angleTarget = this.game.math.angleBetween(
		this.x, this.y, this.target.x, this.target.y
		);
	}else{
		angleTarget = this.game.math.angleBetween(
		this.x, this.y, this.pointDestination.x, this.pointDestination.y
		);
	}

	if(this.rotation !== angleTarget){
		var differenceAngle = angleTarget - this.rotation;
		
		if(differenceAngle > Math.PI){
			differenceAngle -= Math.PI * 2;
		}else if(differenceAngle < -Math.PI){
			differenceAngle += Math.PI * 2;
		}
		
		if(Math.abs(differenceAngle) < this.angleMax){
			this.rotation = angleTarget;
		}else if (differenceAngle > 0){
			this.rotation += this.angleMax;
		}else{
			this.rotation -= this.angleMax;
		}
	}
	
	this.body.velocity.x = Math.cos(this.rotation) * this.speed;
	this.body.velocity.y = Math.sin(this.rotation) * this.speed;
	
}


Bullet.prototype.boomerang = function(){
	
	if(this.stop){
		this.rotation += 0.2;
		return;
	}
	
	var angleTarget = this.game.math.angleBetween(
		this.x, this.y, this.target.x, this.target.y
	);
	
	var x = (Math.cos(angleTarget) * this.rayon) + this.x;
	var y = (Math.sin(angleTarget) * this.rayon) + this.y;
	
	this.tween = this.game.add.tween(this).to( { x: x, y: y}, this.timeLive/2);
	this.tween.yoyo(true);
	this.tween.start();
	this.tween.onComplete.removeAll();
	this.stop = true;
}

Bullet.prototype.laser = function(){
	
	//Permet de creer un fleche
	this.graphic.lineStyle(5, 0xFF0000, 1);

	var dis = Phaser.Point.distance(this.position, this.target.position);
	
	if(dis >= this.rayon || !this.target.alive){
		this.needChangeTarget = true;
		return;
	}
	
	this.graphic.moveTo(this.x, this.y);
	this.graphic.lineTo(this.target.x,this.target.y);
	this.target.hurt(this.domage);
}

//Bonus
Bullet.prototype.circle = function(game,x,y){
	
	//Permet de creer un cercle
	//this.graphic.lineStyle(10, 0x881111,1);
    this.graphic.beginFill(0x881111, 0.15);
    this.graphic.drawCircle(x, y, this.rayon);
    this.graphic.endFill();
	
	Phaser.Sprite.call(this, game, x, y, this.graphic.generateTexture());
	this.scale.setTo(0.1,0.1);
}

Bullet.prototype.ajuster = function(){
	if(this.stop){
		return;
	}
	
	this.tween = this.game.add.tween(this.scale).to( { x: 1, y: 1}, this.timeLive/2);
	this.tween.yoyo(true);
	this.tween.start();
	this.tween.onComplete.removeAll();
	this.stop = true;
	
}


