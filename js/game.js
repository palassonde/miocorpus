/* global Phaser */

// Pierre-Alexandre Lassonde
// Julien Perron

MyGame.Game = function (game) {

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)
};

MyGame.Game.prototype = {

    create : function () {

        this.music = this.add.audio('level');
        this.music.play();

        // Activate arcade physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        // Create group Enemies
        enemies = this.game.add.group();
        // Instantiate Player
        player = new Player(200, 1000, this.game);
        this.game.add.existing(player);
        // Instantiate Stage
        stage = new Stage(this.game, player,enemies);
        stage.createPlatforms();
        // Instantiate GUI
        gui = new GUI(this.game, stage, player);
		//Powerups
		powerups = this.game.add.group();
        // On top of 
        player.bringToTop();
    },

    update : function () {
        // Actions
        player.action(stage.platforms,enemies, powerups);
        stage.action(this.time, player, enemies, player.turrets, gui, powerups);
        gui.action();
        for (var x in enemies.children){
            if (enemies.children[x].body.x < 30 && stage.gameOver === false){
                stage.gameOver = true;
                gui.endGame(stage.waveCount);
            }
			 enemies.children[x].action(this.time, powerups, stage, player);             
		}
		for (var x in powerups.children){
			powerups.children[x].action();   
		} 
    }
}

//Retourne une random name stone
function getRandomStone(){

	var random = Math.random();
	
	if(random < 0.1){
		return 'heart';
	}else if(random < 0.4){
		return 'redstone';
	}else if(random < 0.7){
		return 'greenstone';
	}else{
		return 'bluestone';
	}
}