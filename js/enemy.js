Enemy = function (x, y, game, speed) {

	this.game = game;

    this.jumpTimer = 0;
    this.jumpTime = 500;
    this.jumpHeight = 300;
    this.speed = speed;

    this.hp = 100;

	Phaser.Sprite.call(this, game, x, y, "player")
	game.physics.enable(this, Phaser.Physics.ARCADE);

    this.body.velocity.x = -speed;        
    this.body.gravity.y = 500;
    this.body.collideWorldBounds = true;

    this.animations.add('left', [6,7,8], 5, true);
    this.animations.play('left');
    this.anchor.set(0.5);

	//var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: this.width, align: "center" };
    //this.text = this.game.add.text(this.body.x, this.body.y , this.hp, style);
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);

Enemy.prototype.action = function(time, powerups, stage){

    if ((time.now - this.jumpTimer) >= this.jumpTime){
        this.jump(time);
    }

    if (this.body.x < 30){
        stage.endGame();
    }

    if (this.hp <= 0){
		this.createResource(powerups);
        this.destroy();
    }

    
}

Enemy.prototype.createResource = function(){
	powerups.add(new Powerups(this.x,this.y,this.game,getRandomStone(), true));
}

Enemy.prototype.hurt = function(){

    this.hp -= 10;    
}

Enemy.prototype.displayHP = function(){

    this.text.setText(this.hp);
    this.text.x = this.body.x
    this.text.y = this.body.y - 30
}

Enemy.prototype.jump = function(time){

    if(Math.random() > 0.2){
        if (this.body.touching.down)
            this.body.velocity.y = -this.jumpHeight * (Math.random() + 1);
    }

    this.jumpTimer = time.now;
    
}

Enemy.prototype.slowDown = function(){

    this.body.velocity.x = -10;
    this.body.gravity.y = 0;
    this.body.velocity.y = 0;
}

