// Julien Perron

var game = new Phaser.Game(1024, 600, Phaser.AUTO, 'game', {preload: preload, create: create, update: update, render: render});

var server = 'http://localhost:8080/';
var player;
var cursors;
var platforms;

function preload() {

    // Sprites
	game.load.image('platform', server+'assets/platform.png');
	game.load.image('player', server+'assets/player.png');
}

function create() {

    // Game stage
    game.stage.backgroundColor = '#AAAAAA';
	game.physics.startSystem(Phaser.Physics.ARCADE);

    //game.physics.arcade.gravity.y = 600;
    game.world.setBounds(0, 0, 2000, 2000);

    // Platforms
    platforms = game.add.group();
    platforms.enableBody = true;

    //// Ground
    var ground = platforms.create(0,1910,'platform');
    ground.scale.setTo(10,3);

    //// Ledges
    platforms.create(200,1850,'platform');
    platforms.create(580,1790,'platform');
    platforms.setAll('body.immovable', true);
    platforms.setAll('body.checkCollision.down', false);
    platforms.setAll('body.checkCollision.left', false);
    platforms.setAll('body.checkCollision.right', false);
    
    // Player
    player = game.add.sprite(5,1800, 'player');
    game.camera.follow(player);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.gravity.y = 500;
    player.body.collideWorldBounds = true;
    
    // Initializing Controls
    cursors = game.input.keyboard.createCursorKeys();
}

function update() {

    // Collisions
    game.physics.arcade.collide(player, platforms);

    // Refresh changed values
    player.body.velocity.x = 0;
    player.body.acceleration.y = 0;


    // controls
    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -250;
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

function render () {

    //debug helper
    game.debug.bodyInfo(player, 16, 24);

}