var MyGame = {};

MyGame.Boot = function (game) {

};

MyGame.Boot.prototype = {
    
    init: function () {

        this.stage.backgroundColor = '#000000';

        if (this.game.device.desktop) {
            this.scale.pageAlignVertically = true;
            this.scale.pageAlignHorizontally = true;

        } else {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(400, 300, 800, 600);
            this.scale.forceLandscape = true;
            this.scale.pageAlignHorizontally = true;
        }
    },

    preload: function () {
    	this.game.load.image("loading","assets/loading.png"); 
    },

    create: function () {
        this.state.start('preloader');
    }
};