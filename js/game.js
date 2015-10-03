/* global Phaser */

// Pierre-Alexandre Lassonde
// Julien Perron
// Firas Cherif

var game = game

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


    // Variables du jeu
    this.server = '';//http://localhost:8080/';
    this.player;
    this.cursors;
    this.actionKey;
    this.platforms;
    this.playerFacing = 'right';
    this.core;
    this.skin;
    this.nbrTurrets = 0;
    this.turret;
    this.enemy;
    this.bullet;
    this.timer;
};

MyGame.Game.prototype = {

    create : function (game) {

        // Game stage
        //var fond = game.add.sprite(0,0, 'fond');
        //fond.scale.setTo(0.6, 0.6);
        //fond.fixedToCamera = true;
        
        
        
        this.game.physics.startSystem(Phaser.Physics.ARCADE);


        // Core n Skin
        this.core = this.game.add.sprite(0,600, 'core');
        this.skin = this.game.add.sprite(60,600, 'skin');
        this.game.physics.enable(this.core, Phaser.Physics.ARCADE);
        this.game.physics.enable(this.skin, Phaser.Physics.ARCADE);

        //this.game.physics.arcade.gravity.y = 600;
        this.game.world.setBounds(0, 0, 2200, 1200);

        // Platforms
        this.platforms = this.game.add.group();
        this.platforms.enableBody = true;

        //// Ground
        this.ground = this.platforms.create(0,1170,'platform');
        this.ground.scale.setTo(10,2);
        this.jungleGround = this.platforms.create(0,600,'platform');
        this.jungleGround.scale.setTo(10,1);

        //// Ledges
        this.createPlatforms();

        //platforms.create(200,1850,'platform');
       // platforms.create(580,1790,'platform');
       this.platforms.setAll('body.immovable', true);
       this.platforms.setAll('body.checkCollision.down', false);
       this.platforms.setAll('body.checkCollision.left', false);
       this.platforms.setAll('body.checkCollision.right', false);

        // Player
        this.player = this.game.add.sprite(200,1000, 'player');
        
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.gravity.y = 600;
        this.player.body.collideWorldBounds = true;
        this.player.animations.add('idleRight', [0,1,2], 5, true);
        this.player.animations.add('idleLeft', [9,10,11], 5, true);
        this.player.animations.add('right', [3,4,5], 5, true);
        this.player.animations.add('left', [6,7,8], 5, true);
        //player.animations.play('idle', 10, true);
        this.player.anchor.set(0.5);
        
        // Camera
        this.game.camera.y = 1200;

        // Full screen
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.game.input.onDown.add(this.fullscreen, this);

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
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.actionKey = this.game.input.keyboard.addKey(Phaser.Keyboard.T);
        this.actionKey2 = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.actionKey.onDown.add(creationTurret, this);
        function creationTurret (){
            if (this.player.body.touching.down){

                this.turret = this.turrets.create(this.player.x + 30, this.player.y + 14, 'turret');
                this.nbrTurrets++;

            }
        }

        this.time = this.game.time.now;
    },
    
    update : function () {
        
        var variable = this;
        // Collisions
        this.game.physics.arcade.collide(this.player, this.platforms,null,this.passerAtravers, this);
        this.game.physics.arcade.collide(this.ennemies, this.platforms);
        this.game.physics.arcade.collide(this.turrets, this.platforms);
        //this.game.physics.arcade.collide(ennemies, player);
        //this.game.physics.arcade.collide(ennemies);

        // Refresh changed values
        this.player.body.velocity.x = 0;
        this.player.body.acceleration.y = 0;

        this.movePlayer();
        this.moveCamera();

        this.changeBackgroundColor(this.game.time.now % 100000);

        
        
        if (this.nbrTurrets > 0 && Math.abs(this.turret.x - this.enemy.x) <= 400){

            this.turretShoot();
        }

        this.game.physics.arcade.overlap(this.bullets, this.ennemies, this.bulletVSenemy, null, this);
        this.game.physics.arcade.overlap(this.core, this.ennemies, this.coreVSenemy, null, this);
        this.game.physics.arcade.overlap(this.ennemies, this.skin, this.enemyVSskin, null, this);
    },

    passerAtravers : function(player, platform, game){

        return !this.actionKey2.isDown;
        // if(this.actionKey2.isDown){
            // return false;
        // }
        // return true;
    },

    changeBackgroundColor : function (time){
        if(time <= 25000){
            this.game.stage.backgroundColor = '#78fdff';
        }else if(time <= 50000 || (time <= 100000 && time > 75000)){
            this.game.stage.backgroundColor = "#67d2ff"
        }else{
            this.game.stage.backgroundColor = '#079eff';
        }
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

    moveCamera : function(){

        this.game.camera.x = this.player.x -512 ;

        if (this.player.y < 570){
            if (this.game.camera.y > 30){
                this.game.camera.y -= 15;
            }
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

    createPlatforms : function(){

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
    },

    movePlayer : function(){


        if (this.cursors.left.isDown)
        {
            this.player.body.velocity.x = -300;

            if (this.playerFacing !== 'left')
            {
                this.player.animations.play('left');
                this.playerFacing = 'left';
            }
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.velocity.x = 300;

            if (this.playerFacing !== 'right')
            {
                this.player.animations.play('right');
                this.playerFacing = 'right';
            }
        } else {

            if (this.playerFacing !== 'idle')
            {


                this.player.animations.stop();

                if (this.playerFacing === 'left')
                {
                   this.player.animations.play('idleLeft');
               }
               else
               {
                   this.player.animations.play('idleRight');
               }

               this.playerFacing = 'idle';
           }
       }

       if (this.cursors.up.isDown && this.player.body.touching.down)
       {
        this.player.body.velocity.y = -400;

    }

    if (!this.player.body.touching.down){

        if (this.playerFacing === 'left')
            this.player.frame = 12;
        else if (this.playerFacing === 'idle')
            this.player.frame = 13;
        else if (this.playerFacing === 'right')
            this.player.frame = 14;
    }

    if (!this.player.body.touching.down && this.cursors.down.isDown){

        this.player.body.acceleration.y = 2000;
    }

    else if (this.player.body.touching.down && this.cursors.down.isDown){

            // crouching
        }

        if (this.player.body.touching.down && this.cursors.shiftKey && this.cursors.down.isDown){

            // getting down from platforms
        }

    },

    fullscreen : function() {

        if (this.game.scale.isFullScreen)
        {
            this.game.scale.stopFullScreen();
        }
        else
        {
            this.game.scale.startFullScreen(false);
        }

    },

    render : function () {

        //game.debug.bodyInfo(enemy, 16, 50);
        //game.debug.cameraInfo(game.camera, 32, 32);

    }



}
