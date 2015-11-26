MyGame.Preloader = function(game) {
    this.loadingBar = null;
    this.ready = false;
};

MyGame.Preloader.prototype = {

    preload: function () {

        // loading
        this.loadingBar = this.add.sprite(this.world.centerX, this.world.centerY,"loading");
        this.loadingBar.anchor.setTo(0.5,0.5);
        this.load.setPreloadSprite(this.loadingBar, 0);

        // Menu
        this.load.image('title', 'assets/title.png');
        this.load.image('play-button', 'assets/play-button.png');
        this.load.image('options-button', 'assets/options-button.png');
        this.load.image('controls-button', 'assets/controls-button.png');
        this.load.image('cell', 'assets/cell.png');
        this.load.image('cursor', 'assets/cursor.png');
        this.load.image('options', 'assets/options.png');
        this.load.image('back-button', 'assets/back-button.png');
        this.load.image('controls', 'assets/controls.png');

        // Stage
		this.load.image('core', 'assets/core.png');
        this.load.image('fond_degrader', 'assets/fond_degrader.png');
        this.load.image('skin', 'assets/skin.png');
        this.load.image('platform', 'assets/platform.png');
        this.load.image('platform2', 'assets/platform2.png');
        this.load.image('grass', 'assets/grass.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('jungleground', 'assets/jungleground.png');

        // Turrets stuff
        this.load.image('turret', 'assets/turret.png');
        this.load.image('bullet', 'assets/bullet.png');
		this.load.image('boomerang', 'assets/boomerang.png');

        // Player
        this.load.spritesheet('player', 'assets/player.png', 50, 100);

        // Enemies
        this.load.spritesheet('enemy', 'assets/ennemies.png', 50, 100);
        
        // Audio
        this.add.audio('maintheme');
        this.load.audio('maintheme', 'assets/audio/maintheme.mp3');

        // Fonts
        this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

        // GUI
        this.load.image('heart', 'assets/heart.png');
        this.load.image('redstone', 'assets/redstone.png');
        this.load.image('bluestone', 'assets/bluestone.png');
        this.load.image('greenstone', 'assets/greenstone.png');
        this.load.image('gameover', 'assets/gameover.png');
    },

    create: function () {

        this.loadingBar.cropEnabled = true;

    },

    update: function () {

        if (this.cache.isSoundDecoded('maintheme') && !this.ready) {
            this.ready = true;
            this.state.start('menu');
        }

    }
};