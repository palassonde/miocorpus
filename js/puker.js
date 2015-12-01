Puker = function (x, y, game, speed,hp, player, chanceDrop, nbDrop, domage, sm) {

	this.game = game;

	//Caracteristique
    this.speed = speed;
	this.domage = domage;
	this.player = player;
    this.hp = hp;
	this.chance = chanceDrop;
	this.nbrR = Math.floor(nbDrop * Math.random())+1; //1 à nbDrop

	// sons
	this.sm = sm;
	
	Phaser.Sprite.call(this, game, x, y, "puker")
	game.physics.enable(this, Phaser.Physics.ARCADE);

    this.body.velocity.x = -speed;        
    this.body.gravity.y = 500;
    this.body.collideWorldBounds = true;

    this.animations.add('left', [0,1,2], 5, true);
    this.animations.play('left');
    this.anchor.set(0.5);
    this.scale.setTo(0.15,0.15);
	
	this.timerDomage = 0;
	
	this.timeRandom = Math.floor((6)*Math.random() + 5);
	
	//Tire a chaque 5 à 10 seconde
	this.eventFire = game.time.events.add(this.timeRandom * 1000, this.fire, this);	
	this.nbFire = 4;
	
	// var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: this.width, align: "center" };
    // this.text = this.game.add.text(this.body.x, this.body.y , this.hp, style);
	
	//Bullet
	this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
	
}

Puker.prototype = Object.create(Phaser.Sprite.prototype);

Puker.prototype.action = function(time, powerups, stage){

    if (this.hp <= 0){
		this.createResource(powerups);
		this.game.time.events.remove(this.eventFire);
		this.bullets.destroy();
        this.destroy();
		return;
    }
	
	this.game.physics.arcade.overlap(this.player, this.bullets, this.hurtPlayer, null, this);
	this.game.physics.arcade.overlap(this.player.turrets, this.bullets, this.hurtPlayer, null, this);
   
}

Puker.prototype.fire = function(){

	var missile = this.game.add.sprite(this.x,this.y, 'bullet');
	
	if(this.nbFire === 4){
		this.sm.puke.play();
		this.game.time.events.add(3000, this.stopSound, this);
	}
	
	this.bullets.add(missile);
	this.game.physics.enable(missile, Phaser.Physics.ARCADE);
	missile.body.gravity.y = 200;
	
	var angle = this.game.math.angleBetween(
		this.x, this.y, this.player.x, this.player.y
		);
	
	missile.body.velocity.x = Math.cos(angle) * 400;
	missile.body.velocity.y = Math.sin(angle) * 400;

	if(this.nbFire > 0){
		this.eventFire = this.game.time.events.add(100, this.fire, this);
		this.nbFire--;
	}else{
		this.eventFire = this.game.time.events.add(this.timeRandom * 1000, this.fire, this);
		this.nbFire=4;
		
	}
}

Puker.prototype.stopSound = function(){
	puke.stop();
}

Puker.prototype.createResource = function(){
	if(Math.random() < this.chance){
		powerups.add(new Powerups(this.x,this.y,this.game,getRandomStone(), true, this.nbrR));
	}
	if(Math.random() < 0.05){
		powerups.add(new Powerups(this.x,this.y,this.game,'heart', true, 1));
	}
}

Puker.prototype.hurt = function(dmg, behavior){

	if (!(behavior ===  3)){
		this.sm.enemyhurt.play();
	}

    this.hp -= dmg;    
}

Puker.prototype.hurtPlayer = function(cible,bullet){
	cible.hurt(this.domage*10);  
	bullet.destroy();	
}

Puker.prototype.slowDown = function(){

	if(!ennemibouffecore.isPlaying){
		this.sm.ennemibouffecore.play();
	}

    this.body.velocity.x = -10;
    this.body.gravity.y = 0;
    this.body.velocity.y = 0;
}