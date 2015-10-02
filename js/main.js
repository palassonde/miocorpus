/* global Phaser */

// Pierre-Alexandre Lassonde
// Julien Perron
// Firas Cherif

var game = new Phaser.Game(1024, 600, Phaser.AUTO, 'game', {preload: preload, create: create, update: update, render: render});

var server = '';//http://localhost:8080/';
var player;
var cursors;
var actionKey;
var platforms;
var playerFacing = 'right';
var core;
var skin;
var nbrTurrets = 0;
var turret;
var enemy;
var bullet;
var time;

function preload() {

    // Sprites
    game.load.image('core', server+'assets/core.png');
	game.load.image('fond', server+'assets/fond.png');
    game.load.image('turret', server+'assets/turret.png');
    game.load.image('skin', server+'assets/skin.png');
    game.load.image('platform', server+'assets/platform.png');
    game.load.spritesheet('player', server+'assets/player.png', 50, 100);
    game.load.spritesheet('ennemies', server+'assets/ennemies.png', 50, 100);
    game.load.image('bullet', server+'assets/bullet.png');
    game.load.audio('maintheme', 'assets/audio/maintheme.mp3');
	
}

function create() {

    // Game stage
	//var fond = game.add.sprite(0,0, 'fond');
	//fond.scale.setTo(0.6, 0.6);
	//fond.fixedToCamera = true;
	
	
    game.stage.backgroundColor = '#78fdff';
    game.physics.startSystem(Phaser.Physics.ARCADE);

    music = game.add.audio('maintheme');

    music.play();

    // Core n Skin
    core = game.add.sprite(0,600, 'core');
    skin = game.add.sprite(60,600, 'skin');
    game.physics.enable(core, Phaser.Physics.ARCADE);
    game.physics.enable(skin, Phaser.Physics.ARCADE);

    //game.physics.arcade.gravity.y = 600;
    game.world.setBounds(0, 0, 2200, 1200);

    // Platforms
    platforms = game.add.group();
    platforms.enableBody = true;

    //// Ground
    var ground = platforms.create(0,1170,'platform');
    ground.scale.setTo(10,2);
    var jungleGround = platforms.create(0,600,'platform');
    jungleGround.scale.setTo(10,1);

    //// Ledges
    createPlatforms();

    //platforms.create(200,1850,'platform');
   // platforms.create(580,1790,'platform');
   platforms.setAll('body.immovable', true);
   platforms.setAll('body.checkCollision.down', false);
   platforms.setAll('body.checkCollision.left', false);
   platforms.setAll('body.checkCollision.right', false);

    // Player
    player = game.add.sprite(200,1000, 'player');
    
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.gravity.y = 600;
    player.body.collideWorldBounds = true;
    player.animations.add('idleRight', [0,1,2], 5, true);
    player.animations.add('idleLeft', [9,10,11], 5, true);
    player.animations.add('right', [3,4,5], 5, true);
    player.animations.add('left', [6,7,8], 5, true);
    //player.animations.play('idle', 10, true);
    player.anchor.set(0.5);
    
	// Camera
	game.camera.y = 1200;

    // Full screen
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.input.onDown.add(fullscreen, this);

	// Ennemies
    ennemies = game.add.group();
    ennemies.enableBody = true;
    ennemies.physicsBodyType = Phaser.Physics.ARCADE;
    ennemies.setAll("body.gravity.y", 500);
    ennemies.setAll("body.collideWorldBounds", true);

    // Turrets
    turrets = game.add.group();
    turrets.enableBody = true;
    turrets.physicsBodyType = Phaser.Physics.ARCADE;

    // Bullets
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    enemyWave();

    // Initializing Controls
    cursors = game.input.keyboard.createCursorKeys();
    actionKey = game.input.keyboard.addKey(Phaser.Keyboard.T);
	actionKey2 = game.input.keyboard.addKey(Phaser.Keyboard.A);
    actionKey.onDown.add(function(actionKey){

        if (player.body.touching.down){

            turret = turrets.create(player.x + 30, player.y + 14, 'turret');
            nbrTurrets++;

        }

        
    });

    time = game.time.now;
}

function update() {

    // Collisions
    game.physics.arcade.collide(player, platforms,null,passerAtravers);
    game.physics.arcade.collide(ennemies, platforms);
    game.physics.arcade.collide(turrets, platforms);
	//game.physics.arcade.collide(ennemies, player);
	//game.physics.arcade.collide(ennemies);

	// Refresh changed values
	player.body.velocity.x = 0;
    player.body.acceleration.y = 0;

    movePlayer();
    moveCamera();

	changeBackgroundColor(game.time.now % 100000);

	
	
    if (nbrTurrets > 0 && Math.abs(turret.x - enemy.x) <= 400){

        turretShoot();
    }

    game.physics.arcade.overlap(bullets, ennemies, bulletVSenemy, null, this);
    game.physics.arcade.overlap(core, ennemies, coreVSenemy, null, this);
    game.physics.arcade.overlap(ennemies, skin, enemyVSskin, null, this);
}

function passerAtravers(player, platforms){
	console.log(actionKey2.onDown)
	if(actionKey2.isDown){
		return false;
	}
	return true;
}

function changeBackgroundColor (time){
	if(time <= 25000){
		game.stage.backgroundColor = '#78fdff';
	}else if(time <= 50000 || (time <= 100000 && time > 75000)){
		game.stage.backgroundColor = "#67d2ff"
	}else{
		game.stage.backgroundColor = '#079eff';
	}
}

function bulletVSenemy(bullet, enemy) {
            bullet.kill();
            enemy.kill();
            enemyWave();
}

function coreVSenemy(core, enemy) {
            var gui = game.add.text(0,0,'YOU LOSE', { fontSize: '32px', fill: '#000' });
            gui.fixedToCamera = true;
}

function enemyVSskin(skin, enemy) {

            enemy.body.velocity.x = -10;
}


function turretShoot(){

    var speed = 50;

    time += game.time.now % 1000;

    if (time > 30000) {

        bullet = bullets.create(turret.x, turret.y, 'bullet');
        
        if (turret.x < enemy.x)
            bullet.body.velocity.x = speed;
        else
            bullet.body.velocity.x = -speed;

        //bullet.body.velocity.y = -(Math.abs(turret.y - enemy.y));

        game.physics.arcade.moveToObject(bullet, enemy,300);

        time = 0;
    }
}

function moveCamera(){

    game.camera.x = player.x -512 ;

    if (player.y < 570){
        if (game.camera.y > 30){
            game.camera.y -= 15;
        }
    }
}

function enemyWave(){

    enemy = ennemies.create(1900,1000,'player');
    enemy.body.velocity.x = -100;        
    game.physics.enable(enemy, Phaser.Physics.ARCADE);
    enemy.body.gravity.y = 500;
    enemy.body.collideWorldBounds = true;
    enemy.animations.add('left', [6,7,8], 5, true);
    enemy.animations.play('left');
    enemy.anchor.set(0.5);
}

function createPlatforms(){

    var x = 300;

    for (var j = 0; j < 5; j++){
        if(j % 2 === 0){
            for(var i = 0; i < 4 ; i++){
                var y = 1050 - (i * 110) ;
                var p = platforms.create(x,y,'platform');
                p.scale.setTo(0.7,0.5);
            }
        } else {
            for(var i = 0; i < 3 ; i++){
                var y = 1000 - (i * 110) ;
                var p = platforms.create(x,y,'platform');
                p.scale.setTo(0.7,0.5);
            }
        }
        x += 400;
    }
}

function movePlayer(){


    if (cursors.left.isDown)
    {
        player.body.velocity.x = -300;

        if (playerFacing !== 'left')
        {
            player.animations.play('left');
            playerFacing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 300;

        if (playerFacing !== 'right')
        {
            player.animations.play('right');
            playerFacing = 'right';
        }
    } else {

        if (playerFacing !== 'idle')
        {


            player.animations.stop();

            if (playerFacing === 'left')
            {
               player.animations.play('idleLeft');
           }
           else
           {
               player.animations.play('idleRight');
           }

           playerFacing = 'idle';
       }
   }

   if (cursors.up.isDown && player.body.touching.down)
   {
    player.body.velocity.y = -400;

}

if (!player.body.touching.down){

    if (playerFacing === 'left')
        player.frame = 12;
    else if (playerFacing === 'idle')
        player.frame = 13;
    else if (playerFacing === 'right')
        player.frame = 14;
}

if (!player.body.touching.down && cursors.down.isDown){

    player.body.acceleration.y = 2000;
}

else if (player.body.touching.down && cursors.down.isDown){

        // crouching
    }

    if (player.body.touching.down && cursors.shiftKey && cursors.down.isDown){

        // getting down from platforms
    }

}

function fullscreen() {

    if (game.scale.isFullScreen)
    {
        game.scale.stopFullScreen();
    }
    else
    {
        game.scale.startFullScreen(false);
    }

}

function render () {

    //game.debug.bodyInfo(enemy, 16, 50);
    //game.debug.cameraInfo(game.camera, 32, 32);

}
