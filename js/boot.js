var MyGame = {};

MyGame.Boot = function (game) {

};

MyGame.Boot.prototype = {
    
    init: function () {

        // Arrière-plan
        this.stage.backgroundColor = '#000000';

        if (this.game.device.desktop) {
            // Éléments spécifiques aux applications sur 'Desktop'
            //this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.scale.pageAlignVertically = true;
            this.scale.pageAlignHorizontally = true;

        } else {
            // Éléments spécifiques aux applications sur 'mobiles'
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