Kamikaze = function (x, y, game, speed, hp, player) {

	this.game = game;

    this.player = player;

    this.speed = 400;
    this.spikeSpeed = 200;
	this.domage = 1;
    this.exploded = false;

    this.angleMax = 0.5;

    this.distance = 200;

    this.spikes = this.game.add.group();
    this.spikes.enableBody = true;

    this.hp = hp;

	Phaser.Sprite.call(this, game, x, y, "player")
	game.physics.enable(this, Phaser.Physics.ARCADE);

    this.body.collideWorldBounds = false;
    this.body.checkCollision.up = false;
    this.body.checkCollision.down = false;
    this.body.checkCollision.left = false;
    this.body.checkCollision.right = false;
    this.exploding = false;

    //this.body.velocity.x = -speed;        
    //this.body.gravity.y = 500;

    this.animations.add('left', [6,7,8], 5, true);
    this.animations.play('left');
    this.anchor.set(0.5);
	
	this.timerDomage = 0;

    //this.move = this.game.add.tween(this).to({x: this.player.body.x, y: this.player.body.y }, 5000, "Linear", true);

	 // var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: this.width, align: "center" };
     // this.text = this.game.add.text(this.body.x, this.body.y , this.hp, style);
}

Kamikaze.prototype = Object.create(Phaser.Sprite.prototype);

Kamikaze.prototype.action = function(time, powerups, stage){


    this.game.physics.arcade.overlap(this.player, this.spikes, this.spikeCollision, null, this);

 
    if ((Phaser.Point.distance(this.position, this.player.position) < this.distance) && !this.exploding){

        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.game.time.events.add(Phaser.Timer.SECOND * 2, this.explode, this);
        this.exploding = true;
    }
    else if (!this.exploding){

        this.homing();
    }


    if (this.hp <= 0){
        this.dropResource(powerups);
        this.destroy();
    }

    if (this.exploded){

        this.kill()
        this.game.time.events.add(Phaser.Timer.SECOND * 4, this.destroy, this);
    }

    
}

Kamikaze.prototype.dropResource = function(){
    powerups.add(new Powerups(this.x,this.y,this.game,getRandomStone(), true));
}

Kamikaze.prototype.hurt = function(dmg){

    this.hp -= dmg;    
}

Kamikaze.prototype.displayHP = function(){

    this.text.setText(this.hp);
    this.text.x = this.body.x
    this.text.y = this.body.y - 30
}

Kamikaze.prototype.slowDown = function(){

    this.body.velocity.x = -10;
    this.body.gravity.y = 0;
    this.body.velocity.y = 0;
}

Kamikaze.prototype.explode = function(){

    var angle = 0;

    if (this.alive){

        for (var i = 0; i < 10 ; i++) {

            spike = this.spikes.create(this.body.x,this.body.y, 'bullet');
            spike.body.velocity.x = Math.cos(angle) * this.spikeSpeed;
            spike.body.velocity.y = Math.sin(angle) * this.spikeSpeed;
            spike.lifespan = 4000;
            angle += ((2 * Math.PI) / 10);
        }
        this.exploded = true;
    }


}

Kamikaze.prototype.homing = function(){

    var angleTarget;

    angleTarget = this.game.math.angleBetween(this.x, this.y, this.player.x, this.player.y);

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

Kamikaze.prototype.spikeCollision = function(player, spike){

    this.player.hurt(this.domage * 100);
    spike.destroy();

}