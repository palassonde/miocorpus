var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game',
               {preload: preload, create: create, update: update, render: render});

var server = 'http://localhost:8080/'

function preload() {

	game.load.image('wallh', server+'assets/wallh.png');
	game.load.image('wallv', server+'assets/wallv.png');
	game.load.image('ball', server+'assets/ball.png');
}

var ball;

function create() {

	game.physics.startSystem(Phaser.Physics.ARCADE);

    //  This creates a simple sprite that is using our loaded image and displays it on-screen and assign it to a variable
    wallh = game.add.sprite(0, 0, 'wallh');
    wallvr = game.add.sprite(600, 0, 'wallv');
    wallhd = game.add.sprite(0, 670, 'wallh');
    wallv = game.add.sprite(0, 0, 'wallv');
    

    ball = game.add.sprite(0,0, 'ball');

    game.physics.enable(ball, Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#DDDDDD';
    //  This gets it moving
    ball.body.velocity.setTo(200, 200);
    
    //  This makes the game world bounce-able
    ball.body.collideWorldBounds = true;
    
    //  This sets the image bounce energy for the horizontal  and vertical vectors (as an x,y point). "1" is 100% energy return
    ball.body.bounce.set(0.8);

    ball.body.gravity.set(0, 180);

    game.physics.enable(wallh, Phaser.Physics.ARCADE);
    wallh.body.immovable = true;

    game.physics.enable(wallv, Phaser.Physics.ARCADE);
    wallv.body.immovable = true;

    game.physics.enable(wallhd, Phaser.Physics.ARCADE);
    wallhd.body.immovable = true;

    game.physics.enable(wallvr, Phaser.Physics.ARCADE);
    wallvr.body.immovable = true;
}

function update() {

    game.physics.arcade.collide(ball, wallv);
    game.physics.arcade.collide(ball, wallh);
    game.physics.arcade.collide(ball, wallvr);
    game.physics.arcade.collide(ball, wallhd);
}

function render () {

    //debug helper
    //game.debug.bodyInfo(ball, 16, 24);

}