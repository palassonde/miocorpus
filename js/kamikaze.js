Kamikaze = function (x, y, game, speed, hp, player, chance, nbItem, domage, sm) {

    this.player = player;

    this.speed = speed;
    this.spikeSpeed = 200;
	this.domage = domage;
	this.hp = hp;
	this.chance = chance;
	this.nbrR = Math.floor(nbItem * Math.random())+1; //1 à nbItem
    this.exploded = false;

    this.angleMax = 0.5;
    this.distance = 200;

	//Son
	this.sm = sm;
	
	//Spike
    this.spikes = game.add.group();
    this.spikes.enableBody = true;

	//Kamikaze
	Phaser.Sprite.call(this, game, x, y, "kamikaze");
	this.scale.setTo(0.2,0.2);
	game.physics.enable(this, Phaser.Physics.ARCADE);

    this.body.collideWorldBounds = false;
    this.body.checkCollision.up = false;
    this.body.checkCollision.down = false;
    this.body.checkCollision.left = false;
    this.body.checkCollision.right = false;
    this.exploding = false;
	
    this.anchor.set(0.5);
	
	this.timerDomage = 0;
}

Kamikaze.prototype = Object.create(Phaser.Sprite.prototype);

Kamikaze.prototype.action = function(time, powerups, stage){

    this.game.physics.arcade.overlap(this.player.turrets, this.spikes, this.spikeCollision, null, this);
    this.game.physics.arcade.overlap(this.player, this.spikes, this.spikeCollision, null, this);

	if(!this.alive)return;
 
    if ((Phaser.Point.distance(this.position, this.player.position) < this.distance) && !this.exploding){
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.game.time.events.add(Phaser.Timer.SECOND * 1.5, this.explode, this);
        this.exploding = true;
    }
    else if (!this.exploding){

        this.homing();
    }


    if (this.hp <= 0){
        this.dropResource(powerups);
        this.destroy();
		return;
    }

    if (this.exploded){

        this.kill()
        this.game.time.events.add(Phaser.Timer.SECOND * 4, this.destroy, this);
    }

    
}

Kamikaze.prototype.dropResource = function(){
    if(Math.random() < this.chance){
		powerups.add(new Powerups(this.x,this.y,this.game,getRandomStone(), true, this.nbrR));
	}
	if(Math.random() < 0.05){
		powerups.add(new Powerups(this.x,this.y,this.game,'heart', true, 1));
	}
}

Kamikaze.prototype.hurt = function(dmg, behavior){

    if (!(behavior ===  3)){
        this.sm.enemyhurt.play();
    }

    this.hp -= dmg;    
}

Kamikaze.prototype.explode = function(){

    var angle = 0;

    if (this.alive){
		this.sm.turretneutretir.play();
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

	var rotation = (this.angle - 90) * (Math.PI/180); 
	
    if(rotation !== angleTarget){
        var differenceAngle = angleTarget - rotation;
        
        if(differenceAngle > Math.PI){
            differenceAngle -= Math.PI * 2;
        }else if(differenceAngle < -Math.PI){
            differenceAngle += Math.PI * 2;
        }
        
        if(Math.abs(differenceAngle) < this.angleMax){
            rotation = angleTarget;
        }else if (differenceAngle > 0){
            rotation += this.angleMax;
        }else{
            rotation -= this.angleMax;
        }
    }
    
    this.body.velocity.x = Math.cos(rotation) * this.speed;
    this.body.velocity.y = Math.sin(rotation) * this.speed;
	
	this.rotation = rotation;
	this.angle += 90;
}

Kamikaze.prototype.spikeCollision = function(target, spike){

    target.hurt(this.domage * 100);
    spike.destroy();

}

Kamikaze.prototype.slowDown = function(){

	if(!ennemibouffecore.isPlaying){
		this.sm.ennemibouffecore.play();
	}

    this.body.velocity.x = -10;
    this.body.gravity.y = 0;
    this.body.velocity.y = 0;
}