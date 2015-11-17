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

        // Activate arcade physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // Instantiate Stage
        this.stage = new Stage(this.game);
        this.stage.createObjects();
        this.stage.createPlatforms();
        
        // Create group Turrets
        this.turrets = this.game.add.group();

        this.players = this.game.add.group();

        // Create group Enemies
        this.enemies = this.game.add.group();
        this.stage.createEnemy(this.enemies); // peut etre creer dans le stage ou le level ?

        // Instantiate Player
        this.player = new Player(200,1000,this.game, this.turrets);
        this.game.add.existing(this.player);

},

    update : function () {

        // Collisions
        this.game.physics.arcade.collide(this.enemies, this.stage.platforms);
        this.game.physics.arcade.collide(this.turrets, this.stage.platforms);        
        this.game.physics.arcade.overlap(this.turrets.bullets, this.enemies, this.bulletVSenemy, null, this);
        this.game.physics.arcade.overlap(this.enemies, this.stage.skin, this.enemyVSskin, null, this);

        // Actions
        this.player.action(this.stage.platforms);
        this.stage.action(this.time, this.player);

        for (var x in this.turrets.children){
            this.turrets.children[x].action(this.enemies);          
        }
        for (var x in this.enemies.children)
            this.enemies.children[x].action();   

    },

    bulletVSenemy : function(bullet, enemy) {
        bullet.destroy();
        enemy.destroy();
    },

    enemyVSskin : function(skin, enemy) {

        enemy.body.velocity.x = -10;
    }

}