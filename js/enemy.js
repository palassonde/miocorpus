Enemy = function (x, y, game, speed, hp, chanceDrop, nbDrop, domage, sm) {

	this.game = game;

    this.jumpTimer = 0;
    this.jumpTime = 500;
    this.jumpHeight = 300;
    this.speed = speed;
	this.domage = domage;
	this.chance = chanceDrop;
	this.nbrR = Math.floor(nbDrop * Math.random())+1; //1 à nbDrop
    this.hp = hp;

    this.sm = sm;

	Phaser.Sprite.call(this, game, x, y, "enemy")
	game.physics.enable(this, Phaser.Physics.ARCADE);

    this.body.velocity.x = -speed;        
    this.body.gravity.y = 500;
    this.body.collideWorldBounds = true;

    this.animations.add('left', [6,7,6,8], 5, true);
    this.animations.play('left');
    this.anchor.set(0.5);
	
	this.timerDomage = 0;
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);

Enemy.prototype.action = function(time, powerups, stage){
	
    if ((time.now - this.jumpTimer) >= this.jumpTime){
        this.jump(time);
    }

    if (this.hp <= 0){
		this.createResource(powerups);
        this.destroy();
    }
}

Enemy.prototype.createResource = function(){
	if(Math.random() < this.chance){
		powerups.add(new Powerups(this.x,this.y,this.game,getRandomStone(), true, this.nbrR));
	}
	if(Math.random() < 0.05){
		powerups.add(new Powerups(this.x,this.y,this.game,'heart', true, 1));
	}
}

Enemy.prototype.hurt = function(dmg, behavior){

    if (!(behavior ===  3)){
        this.sm.enemyhurt.play();
    }
    this.hp -= dmg;    
}

Enemy.prototype.jump = function(time){

    if(Math.random() > 0.2){
        if (this.body.touching.down)
            this.body.velocity.y = -this.jumpHeight * (Math.random() + 1);
    }

    this.jumpTimer = time.now;
    
}

Enemy.prototype.slowDown = function(){
	
	if(!this.sm.ennemibouffecore.isPlaying){
		this.sm.ennemibouffecore.play();
	}
	
    this.body.velocity.x = -10;
    this.body.gravity.y = 0;
    this.body.velocity.y = 0;
}

