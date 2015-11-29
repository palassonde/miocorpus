Minion = function (x, y, game, speed,hp,type, chanceDrop, nbDrop, domage) {
    this.speed = speed;
    this.hp = hp;
	this.domage = domage;
	this.chance = chanceDrop;
	this.nbrR = Math.floor(nbDrop * Math.random())+1; //1 à nbDrop

	warcry = game.add.audio('birds');
	warcry.volume = 0.3;
	enemyhurt = game.add.audio('enemyhurt');
	ennemibouffecore = game.add.audio('ennemibouffecore');	
	
	if(type === 1){
		//Zombie
		Phaser.Sprite.call(this, game, x, y, "player")
		this.animations.add('left', [6,7,8], 5, true);
		this.animations.play('left');
		this.anchor.set(0.5);

	}else if(type === 2){
		//Birds
		warcry.play();
		Phaser.Sprite.call(this, game, x, y, "player")
		this.animations.add('left', [6,7,8], 5, true);
		this.animations.play('left');
		this.anchor.set(0.5);

	}else{
		//BOSS
		Phaser.Sprite.call(this, game, x, y, "player")
		this.animations.add('left', [6,7,8], 5, true);
		this.animations.play('left');
		this.anchor.set(0.5);
		this.scale.y = 3;
		this.scale.x = 2;
	}
	game.physics.enable(this, Phaser.Physics.ARCADE);

    this.body.velocity.x = -speed;  

	//Enleve la gravité au oiseau
	if(type !== 2){
		this.body.gravity.y = 500;
	}
    this.body.collideWorldBounds = true;

	this.timerDomage = 0;
}

Minion.prototype = Object.create(Phaser.Sprite.prototype);

Minion.prototype.action = function(time, powerups, stage){

    if (this.hp <= 0){
		this.createResource(powerups);
        this.destroy();
    }

}

Minion.prototype.createResource = function(){
	if(Math.random() < this.chance){
		powerups.add(new Powerups(this.x,this.y,this.game,getRandomStone(), true, this.nbrR));
	}
}

Minion.prototype.hurt = function(dmg){

	enemyhurt.play();
    this.hp -= dmg;    
}

Enemy.prototype.displayHP = function(){

    this.text.setText(this.hp);
    this.text.x = this.body.x
    this.text.y = this.body.y - 30
}

Minion.prototype.slowDown = function(){


	ennemibouffecore.play();

    this.body.velocity.x = -10;
    this.body.gravity.y = 0;
    this.body.velocity.y = 0;
}

