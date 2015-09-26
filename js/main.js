// Pierre-Alexandre Lassonde
// Julien Perron

var game = new Phaser.Game(1024, 600, Phaser.AUTO, 'game', {preload: preload, create: create, update: update});//,render : remder});

var server = 'http://localhost:8080/';
var player;
var cursors;
var platforms;

var lol = 0;
var time = 0;
var ihih = 0;

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
    game.world.setBounds(0, 0, 2000, 1200);

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
    player.body.gravity.y = 500;
    player.body.collideWorldBounds = true;
    
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

function createPlatforms(){

    var x = 200;

    for (var j = 0; j < 4; j++){

        if(j % 2 === 0){

            for(var i = 0; i < 4 ; i++){
    
                var y = 1050 - (i * 110) ;
                platforms.create(x,y,'platform');
            }

        } else {

            for(var i = 0; i < 3 ; i++){
    
                var y = 1000 - (i * 110) ;
                platforms.create(x,y,'platform');
            }
        }

        x += 400;
    }

}

function movePlayer(){
	if (cursors.left.isDown)
    {
        player.body.velocity.x = -300;
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 300;
    }

    if (cursors.up.isDown)// && player.body.touching.down)
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

function update() {

    // Collisions
    game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(ennemies, platforms);
	//game.physics.arcade.collide(ennemies, player);
	//game.physics.arcade.collide(ennemies);
    
	// Refresh changed values
	player.body.velocity.x = 0;
    player.body.acceleration.y = 0;
	game.camera.x = player.x -512 ;

	if (player.y >= 600){

	game.camera.y = 600;

	}



    // controls
    if (cursors.left.isDown)
    {
        player.body.velocity.x = -300;
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 300;
    }

    if (cursors.up.isDown)// && player.body.touching.down)
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
	time += (game.time.now % 1000);
//console.log (time);
	//time += (game.time.now % 1000);
    //// Ledges
	if(time > 30000 && ihih < 3000){

		lol = -50;
		var x = 1000;
	
		var y = 1800;
		var ennemie = ennemies.create(1900,1000,'player');
		//console.log(x + "ss" + y)
		ennemie.body.velocity.x = lol;
		time = 0;
		ihih += 1;
		
		game.physics.enable(ennemie, Phaser.Physics.ARCADE);
        ennemie.body.gravity.y = 500;
        ennemie.body.collideWorldBounds = true;
	}	


}

//  function render () {

//     // //debug helper
//     game.debug.bodyInfo(player, 16, 24);

// }
