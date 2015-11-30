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
        this.load.image('cursor', 'assets/cursor.png');
        this.load.image('options', 'assets/options.png');
        this.load.image('back-button', 'assets/back-button.png');
        this.load.image('controls', 'assets/controls.png');
        this.load.image('reset-button', 'assets/reset-button.png');

        // Stage
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
		this.load.image('missile', 'assets/missile.png'); 

        // Player
        this.load.spritesheet('player', 'assets/player.png', 50, 100);

        // Enemies
        this.load.spritesheet('enemy', 'assets/ennemies.png', 50, 100);
        this.load.spritesheet('birds', 'assets/birds.png', 600, 300);
        this.load.spritesheet('zombie', 'assets/zombie.png', 500, 1000);
        this.load.spritesheet('puker', 'assets/puker.png', 500, 1000);
        this.load.spritesheet('fatass', 'assets/fatass.png', 500, 1000);
		this.load.image('kamikaze', 'assets/kamikaze.png');
        
        // Audio
        this.add.audio('maintheme');
        this.load.audio('maintheme', 'assets/audio/themesong.mp3');
        this.load.audio('level', 'assets/audio/level1.mp3');
        this.load.audio('forceaugmente', 'assets/audio/forceaugmente.mp3');
        this.load.audio('clic', 'assets/audio/clic.mp3');
        this.load.audio('birds', 'assets/audio/birds.mp3');
        this.load.audio('boomerang', 'assets/audio/boomerang.mp3');
        this.load.audio('capaciteaugmente', 'assets/audio/capaciteaugmente.mp3');
        this.load.audio('construction', 'assets/audio/construction.mp3');
        this.load.audio('drum1', 'assets/audio/drum1.mp3');
        this.load.audio('drum2', 'assets/audio/drum2.mp3');
        this.load.audio('enemyhurt', 'assets/audio/enemyhurt.mp3');
        this.load.audio('ennemibouffecore', 'assets/audio/ennemibouffecore.mp3');
        this.load.audio('error', 'assets/audio/error.mp3');
        this.load.audio('fusion', 'assets/audio/fusion.mp3');
        this.load.audio('gong', 'assets/audio/gong.mp3');
        this.load.audio('homingmissile', 'assets/audio/homingmissile.mp3');
        this.load.audio('immunitedivine', 'assets/audio/immunitedivine.mp3');
        this.load.audio('laser', 'assets/audio/laser.mp3');
        this.load.audio('mauvaisecombinaison', 'assets/audio/mauvaisecombinaison.mp3');
        this.load.audio('turretneutretir', 'assets/audio/turretneutretir.mp3');
        this.load.audio('murdeboules', 'assets/audio/murdeboules.mp3');
        this.load.audio('vitessedepegase', 'assets/audio/vitessedepegase.mp3');
        this.load.audio('peaudebelier', 'assets/audio/peaudebelier.mp3');
        this.load.audio('vousetesunechec', 'assets/audio/vousetesunechec.mp3');
        this.load.audio('pickup', 'assets/audio/pickup.mp3');
        this.load.audio('playerhurt', 'assets/audio/playerhurt.mp3');
        this.load.audio('playerjump', 'assets/audio/playerjump.mp3');
        this.load.audio('playertire', 'assets/audio/playertire.mp3');
        this.load.audio('puker', 'assets/audio/puker.mp3');
        this.load.audio('rayonbrutal', 'assets/audio/rayonbrutal.mp3');
        this.load.audio('transitiondown', 'assets/audio/transitiondown.mp3');
        this.load.audio('transitionup', 'assets/audio/transitionup.mp3');
        this.load.audio('turretfeed', 'assets/audio/turretfeed.mp3');
        this.load.audio('destroyturret', 'assets/audio/destroyturret.mp3');

        // Fonts
        //this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

        // GUI
        this.load.image('heart', 'assets/heart.png');
        this.load.image('redstone', 'assets/redstone.png');
        this.load.image('bluestone', 'assets/bluestone.png');
        this.load.image('greenstone', 'assets/greenstone.png');
        this.load.image('gameover', 'assets/gameover.png');
		this.load.image('fond_etoile', 'assets/fond_etoile.png');
		
		this.load.image('wave', 'assets/wave.png'); //a ajouter
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