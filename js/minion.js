Minion = function (x, y, game, speed,hp,type, chanceDrop, nbDrop, domage) {

    this.speed = speed;
    this.hp = hp;
	this.domage = domage;
	this.chance = chanceDrop;
	this.nbrR = Math.floor(nbDrop * Math.random())+1; //1 à nbDrop
	this.type = type;

	// sons
	warcry = game.add.audio('birds');
	warcry.volume = 0.3;
	enemyhurt = game.add.audio('enemyhurt');
	ennemibouffecore = game.add.audio('ennemibouffecore');
	ennemibouffecore.volume = 4;
	drum2 = game.add.audio('drum2');
	
	if(type === 1){
		//Zombie
		Phaser.Sprite.call(this, game, x, y, "zombie")
		this.animations.add('left', [0,1,0,2], 4, true);
		this.animations.play('left');
		this.anchor.set(0.5);
		this.scale.setTo(0.10,0.10);

	}else if(type === 2){
		//Birds
		warcry.play();
		Phaser.Sprite.call(this, game, x, y, "birds")
		this.animations.add('left', [0,1,2,3], 5, true);
		this.animations.play('left');
		this.anchor.set(0.5);
		this.scale.setTo(0.15,0.15);

	}else{
		//BOSS
		Phaser.Sprite.call(this, game, x, y, "fatass")
		this.animations.add('left', [0,1,0,2], 5, true);
		this.animations.play('left');
		this.anchor.set(0.5);
		this.scale.setTo(0.55,0.55);
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
		drum2.stop();
        this.destroy();
    }

    if (this.type === 3 && !drum2.isPlaying){

    	drum2.play('',0,1,true);
    }
    

}

Minion.prototype.createResource = function(){
	if(Math.random() < this.chance){
		powerups.add(new Powerups(this.x,this.y,this.game,getRandomStone(), true, this.nbrR));
	}
	if(Math.random() < 0.05){
		powerups.add(new Powerups(this.x,this.y,this.game,'heart', true, 1));
	}
}

Minion.prototype.hurt = function(dmg, behavior){

	if (!(behavior ===  3)){
		enemyhurt.play();
	}
    this.hp -= dmg;    
}

Enemy.prototype.displayHP = function(){

    this.text.setText(this.hp);
    this.text.x = this.body.x
    this.text.y = this.body.y - 30
}

Minion.prototype.slowDown = function(){

	if(!ennemibouffecore.isPlaying){
		ennemibouffecore.play();
	}

    this.body.velocity.x = -10;
    this.body.gravity.y = 0;
    this.body.velocity.y = 0;
}

