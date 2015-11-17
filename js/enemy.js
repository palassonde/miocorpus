Enemy = function (x, y, game) {

	this.game = game;

    this.hp = 100;

	Phaser.Sprite.call(this, game, x, y, "player")
	game.physics.enable(this, Phaser.Physics.ARCADE);

    this.body.velocity.x = -100;        
    this.body.gravity.y = 500;
    this.body.collideWorldBounds = true;

    this.animations.add('left', [6,7,8], 5, true);
    this.animations.play('left');
    this.anchor.set(0.5);

    var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: this.width, align: "center" };
    this.text = this.game.add.text(this.body.x, this.body.y , this.hp, style);

}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);

Enemy.prototype.action = function(){

    this.displayHP();

    if (this.hp <= 0){
        this.destroy();
        this.text.destroy();
    }
}

Enemy.prototype.hurt = function(){

    this.hp -= 10;    
}

Enemy.prototype.displayHP = function(){

    this.text.setText(this.hp);
    this.text.x = this.body.x
    this.text.y = this.body.y - 30
}
