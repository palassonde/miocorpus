Turret = function(x, y, game){

	this.game = game;
	Phaser.Sprite.call(this, game, x, y, 'turret');

	// Turrets properties
	this.power = 0;
	this.hp = 100;
	this.time = 0;

	this.game.physics.enable(this, Phaser.Physics.ARCADE);
	this.body.gravity.y = 500;
    this.body.collideWorldBounds = true;

    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

}

Turret.prototype = Object.create(Phaser.Sprite.prototype);

Turret.prototype.action = function(enemies){

	this.game.physics.arcade.overlap(this.bullets, enemies, this.touchEnemy, null, this);

	for (var x in enemies.children){
		this.shoot(enemies.children[x]);
	}
}

Turret.prototype.shoot = function(enemy){

	this.time += this.game.time.elapsed;

	dis = Phaser.Point.distance(this.position, enemy.position);

	if(this.time > 1000 && dis < 400){
		this.time = 0;
		var speed = 10;
		this.bullet = this.bullets.create(this.body.x, this.body.y, 'bullet');

		if (this.x < enemy.x)
			this.bullet.body.velocity.x = speed;
		else
			this.bullet.body.velocity.x = -speed;

		this.game.physics.arcade.moveToObject(this.bullet, enemy,300);
	}
}

Turret.prototype.touchEnemy = function(bullet, enemy) {
    bullet.destroy();
    enemy.hurt();
}