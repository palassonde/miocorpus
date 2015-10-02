MyGame.Preloader = function(game) {
    this.preloadBar = null;
    this.ready = false;
};

MyGame.Preloader.prototype = {
    preload: function () {

        this.load.image('core', server+'assets/core.png');
        this.load.image('fond', server+'assets/fond.png');
        this.load.image('turret', server+'assets/turret.png');
        this.load.image('skin', server+'assets/skin.png');
        this.load.image('platform', server+'assets/platform.png');
        this.load.spritesheet('player', server+'assets/player.png', 50, 100);
        this.load.spritesheet('ennemies', server+'assets/ennemies.png', 50, 100);
        this.load.image('bullet', server+'assets/bullet.png');
        this.load.audio('maintheme', 'assets/audio/maintheme.mp3');
       
    },

    create: function () {

    },

    update: function () {

    }
};