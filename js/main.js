// Pierre-Alexandre Lassonde
// Julien Perron

var game = new Phaser.Game(1024, 600, Phaser.AUTO, 'game', {preload: preload, create: create, update: update, render: render});

var server = 'http://localhost:8080/';
var player;
var cursors;
var platforms;
var playerFacing = 'right';

function preload() {

    // Sprites
	game.load.image('platform', server+'assets/platform.png');
	//game.load.image('player', server+'assets/char.png');
    game.load.spritesheet('player', server+'assets/player.png', 50, 100);
    game.load.spritesheet('ennemies', server+'assets/ennemies.png', 50, 100);

}

function create() {

    // Game stage
    game.stage.backgroundColor = '#6666FF';
	game.physics.startSystem(Phaser.Physics.ARCADE);

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
    player = game.add.sprite(20,1000, 'player');
    
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.gravity.y = 600;
    player.body.collideWorldBounds = true;
    player.animations.add('right', [3,4,5], 5, true);
    player.animations.add('left', [6,7,8], 5, true);
    //player.animations.play('idle', 10, true);
    player.anchor.set(0.5);
    
	// Camera
	game.camera.y = 1200;

	// Ennemies
	 ennemies = game.add.group();
	 ennemies.enableBody = true;
	 ennemies.physicsBodyType = Phaser.Physics.ARCADE;
	 ennemies.setAll("body.gravity.y", 500);
	 ennemies.setAll("body.collideWorldBounds", true);
	
    // Initializing Controls
    cursors = game.input.keyboard.createCursorKeys();
}

function update() {

    // Collisions
    game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(ennemies, platforms);
	//game.physics.arcade.collide(ennemies, player);
	//game.physics.arcade.collide(ennemies);
    
	// Refresh changed values
	player.body.velocity.x = 0;
    player.body.acceleration.y = 0;

    movePlayer();
    moveCamera();
    ennemyWave();
}

function moveCamera(){

    game.camera.x = player.x -512 ;

    if (player.y < 570){
        if (game.camera.y > 30){
            game.camera.y -= 15;
        }
    }
}

function ennemyWave(){

    var lol = 0;
    var time = 0;
    var ihih = 0;

    time += (game.time.now % 1000);

    if(time > 30000 && ihih < 3000){

        lol = -50;
        var x = 1000;
    
        var y = 1800;
        var ennemy = ennemies.create(1900,1000,'player');
        //console.log(x + "ss" + y)
        ennemy.body.velocity.x = lol;
        time = 0;
        ihih += 1;
        
        game.physics.enable(ennemy, Phaser.Physics.ARCADE);
        ennemy.body.gravity.y = 500;
        ennemy.body.collideWorldBounds = true;
    }   
}

function createPlatforms(){

    var x = 200;

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

        if (playerFacing != 'left')
        {
            player.animations.play('left');
            playerFacing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 300;

        if (playerFacing != 'right')
        {
            player.animations.play('right');
            playerFacing = 'right';
        }
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -400;
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

    player.animations.play('idle');
    playerFacing = 'idle';
}

function render () {

    //game.debug.bodyInfo(player, 16, 50);
    //game.debug.cameraInfo(game.camera, 32, 32);

}
