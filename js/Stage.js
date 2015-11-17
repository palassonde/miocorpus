Stage = function(game){

	this.game = game;
	this.background_image = game.add.sprite(0,0, 'fond_degrader');
    this.background_image.fixedToCamera = true;
    this.game.world.setBounds(0, 0, 2200, 1200);
    this.game.camera.y = 1200;

    // Full screen
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    this.game.input.onDown.add(this.fullscreen, this);

}

Stage.prototype.action = function(time, player){

	this.moveCamera(player);
	this.changeBackgroundColor(time.now % 100000);
}

Stage.prototype.changeBackgroundColor = function (time){

    if(time <= 50000){
         var red = (120 - 0.0022*time);
         var green = (253 - 0.002*time);
    }else{
         var timeMod = time % 50000;
         var red = (0.0022*timeMod + 10);
         var green = (153 + 0.002*timeMod);
    }

    this.game.stage.backgroundColor = "#" + ((1 << 24) + (red << 16) + (green << 8) + 255).toString(16).slice(1);

 }


Stage.prototype.moveCamera = function(player){

    this.game.camera.x = player.x -512 ;

        if (player.y < 570){
            if (this.game.camera.y > 30){
                this.game.camera.y -= 15;
            }
        }else {
         if (this.game.camera.y < 600){
            this.game.camera.y += 15;
        }
    }
}

Stage.prototype.createPlatforms = function(){

	this.platforms = this.game.add.group();
    this.platforms.enableBody = true;
    this.ground = this.platforms.create(0,1170,'platform');
    this.ground.scale.setTo(10,2);
    this.jungleGround = this.platforms.create(0,600,'platform');
    this.jungleGround.scale.setTo(10,1);

    var x = 300;

    for (var j = 0; j < 5; j++){
        if(j % 2 === 0){
            for(var i = 0; i < 4 ; i++){
                var y = 1050 - (i * 110) ;
                this.p = this.platforms.create(x,y,'platform');
                this.p.scale.setTo(0.7,0.5);
            }
        } else {
            for(var i = 0; i < 3 ; i++){
                var y = 1000 - (i * 110) ;
                this.p = this.platforms.create(x,y,'platform');
                this.p.scale.setTo(0.7,0.5);
            }
        }
        x += 400;
    }

    this.platforms.setAll('body.immovable', true);
    this.platforms.setAll('body.checkCollision.down', false);
    this.platforms.setAll('body.checkCollision.left', false);
    this.platforms.setAll('body.checkCollision.right', false);
}

Stage.prototype.createObjects = function(){

	this.core = this.game.add.sprite(0,600, 'core');
    this.skin = this.game.add.sprite(60,600, 'skin');
    this.game.physics.enable(this.core, Phaser.Physics.ARCADE);
    this.game.physics.enable(this.skin, Phaser.Physics.ARCADE);
}

Stage.prototype.fullscreen = function() {

    if (this.game.scale.isFullScreen)
    {
        this.game.scale.stopFullScreen();
    }
    else
    {
        this.game.scale.startFullScreen(false);
    }

}


Stage.prototype.createEnemy = function(enemies){

	enemies.add(new Enemy(1900, 1000, this.game));
}