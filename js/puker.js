Puker = function (x, y, game, speed, hp, player) {

	this.game = game;

    this.player = player;

    this.speed = speed;
	this.domage = 1;

    this.distance = 15;

    this.spikes = this.game.add.group();
    this.spikes.enableBody = true;

    this.hp = hp;

	Phaser.Sprite.call(this, game, x, y, "player")
	game.physics.enable(this, Phaser.Physics.ARCADE);

    //this.body.velocity.x = -speed;        
    //this.body.gravity.y = 500;
    this.body.collideWorldBounds = true;

    this.body.checkCollision.up = false;

    this.animations.add('left', [6,7,8], 5, true);
    this.animations.play('left');
    this.anchor.set(0.5);
	
	this.timerDomage = 0;

	// var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: this.width, align: "center" };
    // this.text = this.game.add.text(this.body.x, this.body.y , this.hp, style);
}

Puker.prototype = Object.create(Phaser.Sprite.prototype);

Puker.prototype.action = function(time, powerups, stage){

    this.moveToXY(this.player.x, this.player.y);

    if (this.body.x < this.player.body.x + this.distance){

        this.explode();
    }


    if (this.hp <= 0){
        this.createResource(powerups);
        this.destroy();
    }

    
}

Puker.prototype.createResource = function(){
    powerups.add(new Powerups(this.x,this.y,this.game,getRandomStone(), true));
}

Puker.prototype.hurt = function(dmg){

    this.hp -= dmg;    
}

Puker.prototype.displayHP = function(){

    this.text.setText(this.hp);
    this.text.x = this.body.x
    this.text.y = this.body.y - 30
}

Puker.prototype.slowDown = function(){

    this.body.velocity.x = -10;
    this.body.gravity.y = 0;
    this.body.velocity.y = 0;
}

Puker.prototype.explode = function(){

    for (var i = 0; i < 10 ; i++) {

        spike = this.spikes.create(this.body.x,this.body.y, 'bullet');
        spike.body.velocity = -i;

        
    }

    this.destroy();
}

