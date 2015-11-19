var Bullet = function(x,y,game, target, rayon, kind){
	
	if(kind === 2){
		Phaser.Sprite.call(this, game, x, y, 'boomerang');
	}else{
		Phaser.Sprite.call(this, game, x, y, 'bullet');
	}
	this.anchor.setTo(0.5, 0.5);
	
	this.speed = 300;
    this.angleMax = 0.5;
	this.behavior = kind; // comportement (1 = chercheuse, 2 = boomerang, 3 = ...)
	this.domage = 1; //Dommage
	this.timeLive = 5000; //Temps de vie du missile
	this.rayon = rayon; //Distance de tir
	
	this.tween;
	this.time = 0;
	this.needDestroy = false;
	this.needChangeTarget = false; //Chage de target (pour laser)
	this.target = target; 
	this.stop = false; //Sert a changer le comportement (boomerang (lance un tween seulement)
	this.graphic = this.game.add.graphics(0, 0);
}

Bullet.prototype = Object.create(Phaser.Sprite.prototype);


Bullet.prototype.actionMissile = function(){
	this.time += this.game.time.elapsed; //Garde le temps que la bullet existe
	
	this.graphic.clear();
	this.graphic.position = new Phaser.Point();
	
	if(this.time >= this.timeLive || this.needDestroy && this.behavior !==2){
		this.destroy();
		return;
	}
	
	//Mouvement
	switch(this.behavior){
		case 1:
			this.homing();
			break;
		case 2:
			this.boomerang();
			break;
		case 3:
			this.laser();
			break;
	}

}

//Missile a tête chercheuse
Bullet.prototype.homing = function(){
	
	var angleTarget = this.game.math.angleBetween(
		this.x, this.y, this.target.x, this.target.y
	);
	
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
	
	if(dis >= this.rayon){
		this.needChangeTarget = true;
		return;
	}
	
	this.graphic.moveTo(this.x, this.y);
	this.graphic.lineTo(this.target.x,this.target.y);
}

