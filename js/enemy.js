Enemy = function (x, y, game) {

	this.game = game;

	Phaser.Sprite.call(this, game, x, y, "player")
	game.physics.enable(this, Phaser.Physics.ARCADE);

    this.body.velocity.x = -100;        
    this.body.gravity.y = 500;
    this.body.collideWorldBounds = true;

    this.animations.add('left', [6,7,8], 5, true);
    this.animations.play('left');
    this.anchor.set(0.5);
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);

Enemy.prototype.action = function(){

	
}
