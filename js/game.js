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

    create : function (game) {

        // La physique du jeu ARCADE
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // Configuration des objets sur la scene
        this.stage = new Stage(game);
        stage.createObjects();

        // Configuration des limites du monde
        this.game.world.setBounds(0, 0, 2200, 1200);

        // Platforms && ground && ledges
        this.stage.createPlatforms();

        // Player
        this.player = new player(game);

        // Camera
        this.game.camera.y = 1200;

        // Full screen
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.game.input.onDown.add(stage.fullscreen, this);

        // Ennemies
        this.ennemies = this.game.add.group();
        this.ennemies.enableBody = true;
        this.ennemies.physicsBodyType = Phaser.Physics.ARCADE;
        this.ennemies.setAll("body.gravity.y", 500);
        this.ennemies.setAll("body.collideWorldBounds", true);

        // Turrets
        this.turrets = this.game.add.group();
        this.turrets.enableBody = true;
        this.turrets.physicsBodyType = Phaser.Physics.ARCADE;

        // Bullets
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

        this.enemyWave();

        // Initializing Controls
        //this.cursors = this.game.input.keyboard.createCursorKeys();
        this.actionKey = this.game.input.keyboard.addKey(Phaser.Keyboard.T);
        this.actionKey2 = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.actionKey.onDown.add(creationTurret, this);

        function creationTurret (){
         if (this.player.player.body.touching.down){

                this.nbrTurrets++;
				this.turrets.add(new Turret(this.player.player.x + 30, this.player.player.y + 14,this.game));

        }
    }

    this.time = this.game.time.now;
},

update : function () {

    this.en.action("mofo");

    var variable = this;
        // Collisions
        this.game.physics.arcade.collide(this.player.player, this.platforms,null,this.player.passerAtravers, this);
        this.game.physics.arcade.collide(this.ennemies, this.platforms);
        this.game.physics.arcade.collide(this.turrets, this.platforms);
        //this.game.physics.arcade.collide(ennemies, player);
        //this.game.physics.arcade.collide(ennemies);

        // Refresh changed values
        this.player.player.body.velocity.x = 0;
        this.player.player.body.acceleration.y = 0;

        this.player.movePlayer();
        this.moveCamera();

        this.changeBackgroundColor(this.game.time.now % 100000);

        
        
        for (var x in this.turrets.children){
			this.turrets.children[x].time += this.game.time.elapsed;
			
			
			
			var dis = Phaser.Point.distance(this.turrets.children[x].position, this.enemy.position);
			
			if(this.turrets.children[x].time > 1000 && dis < 400){
				console.log("bang bang");
				this.turrets.children[x].time = 0;
			}
		}
		
		
        this.game.physics.arcade.overlap(this.bullets, this.ennemies, this.bulletVSenemy, null, this);
        this.game.physics.arcade.overlap(this.core, this.ennemies, this.coreVSenemy, null, this);
        this.game.physics.arcade.overlap(this.ennemies, this.skin, this.enemyVSskin, null, this);
    },



 bulletVSenemy : function(bullet, enemy) {
    bullet.kill();
    enemy.kill();
    this.enemyWave();
},

coreVSenemy : function(core, enemy) {
    this.gui = this.game.add.text(0,0,'YOU LOSE', { fontSize: '32px', fill: '#000' });
    this.gui.fixedToCamera = true;
},

enemyVSskin : function(skin, enemy) {

    enemy.body.velocity.x = -10;
},


turretShoot : function(){

    var speed = 50;

    this.time += this.game.time.now % 1000;

    if (this.time > 30000) {

        this.bullet = this.bullets.create(this.turret.x, this.turret.y, 'bullet');

        if (this.turret.x < this.enemy.x)
            this.bullet.body.velocity.x = speed;
        else
            this.bullet.body.velocity.x = -speed;

            //bullet.body.velocity.y = -(Math.abs(turret.y - enemy.y));

            this.game.physics.arcade.moveToObject(this.bullet, this.enemy,300);

            this.time = 0;
        }
    },


enemyWave : function(){

    this.enemy = this.ennemies.create(1900,1000,'player');
    this.enemy.body.velocity.x = -100;        
    this.game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
    this.enemy.body.gravity.y = 500;
    this.enemy.body.collideWorldBounds = true;
    this.enemy.animations.add('left', [6,7,8], 5, true);
    this.enemy.animations.play('left');
    this.enemy.anchor.set(0.5);
},

render : function () {

        //game.debug.bodyInfo(enemy, 16, 50);
        //game.debug.cameraInfo(game.camera, 32, 32);

    }

}