MyGame.Menu = function (game) {
    this.music = null;
    this.playButton = null;
};

MyGame.Menu.prototype = {
    create: function () {
        // On démarre la musique
        this.music = this.add.audio('maintheme');
        this.music.play();

        // Title
        this.titleSprite = this.add.sprite(this.world.centerX, this.world.centerY -170, "title");
        this.titleSprite.anchor.setTo(0.5, 0.5);
        this.titleSprite.scale.setTo(1.5,2);

        // Les boutons
        this.playButton = this.add.button(this.world.centerX, this.world.centerY,'play-button', this.startGame, this,2, 1, 0, 2);
        this.playButton.anchor.setTo(0.5, 0.5);
        this.playButton.scale.setTo(4,2);
        this.playButton.onInputOver.add(over, this);
        this.playButton.onInputOut.add(out, this);

        this.optionsButton = this.add.button(this.world.centerX, this.world.centerY + 110,'options-button', this.showOptions, this,2, 1, 0, 2);
        this.optionsButton.scale.setTo(4,2);
        this.optionsButton.anchor.setTo(0.5, 0.5);
        this.optionsButton.onInputOver.add(over, this);
        this.optionsButton.onInputOut.add(out, this);

        this.controlsButton = this.add.button(this.world.centerX, this.world.centerY + 220,'controls-button', this.showControls, this,2, 1, 0, 2);
        this.controlsButton.scale.setTo(4,2);
        this.controlsButton.anchor.setTo(0.5, 0.5);
        this.controlsButton.onInputOver.add(over, this);
        this.controlsButton.onInputOut.add(out, this);

        this.backButton = this.add.button(1600, this.world.centerY + 220,'back-button', this.back, this,2, 1, 0, 2);
        this.backButton.scale.setTo(4,2);
        this.backButton.anchor.setTo(0.5, 0.5);
        this.backButton.onInputOver.add(over, this);
        this.backButton.onInputOut.add(out, this);

        // Options
        this.optionsList = this.add.sprite(1000, 0, "options");
        this.optionFullScreen = this.add.button(1600, this.world.centerY - 93, "cursor", this.fullscreen, this,2, 1, 0, 2)
        this.optionFullScreen.scale.setTo(0.5,0.5);
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.optionMusic = this.add.button(1600, this.world.centerY - 13, "cursor", this.noMusic, this,2, 1, 0, 2)
        this.optionMusic.scale.setTo(0.5,0.5);
        this.optionSound = this.add.button(1600, this.world.centerY + 63, "cursor", this.mute, this,2, 1, 0, 2)
        this.optionSound.scale.setTo(0.5,0.5);

        // Controls
        this.controlsList = this.add.sprite(1000, 0, "controls");

    },

    update: function () {
        // Normalement, il y a quelque chose ici
    },

    startGame: function (pointer) {

        this.music.stop();
        this.state.start('game');
    },

    showOptions: function (pointer) {

        this.removeTitle();

        this.add.tween(this.optionsList).to({x: 0}, 500, "Linear", true);
        this.add.tween(this.backButton).to({x: this.world.centerX }, 500, "Linear", true);
        this.add.tween(this.optionFullScreen).to({x: this.world.centerX + 160}, 500, "Linear", true);
        this.add.tween(this.optionMusic).to({x: this.world.centerX + 160}, 500, "Linear", true);
        this.add.tween(this.optionSound).to({x: this.world.centerX + 160}, 500, "Linear", true);


    },

    back: function (pointer) {

        this.add.tween(this.titleSprite).to({x: 500}, 500, "Linear", true);
        this.add.tween(this.playButton).to({x: 500}, 500, "Linear", true);
        this.add.tween(this.optionsButton).to({x: 500}, 500, "Linear", true);
        this.add.tween(this.controlsButton).to({x: 500}, 500, "Linear", true);

        this.add.tween(this.optionsList).to({x: 1000}, 500, "Linear", true);
        this.add.tween(this.backButton).to({x: 1600}, 500, "Linear", true);
        this.add.tween(this.optionFullScreen).to({x: 1600}, 500, "Linear", true);
        this.add.tween(this.optionMusic).to({x: 1600}, 500, "Linear", true);
        this.add.tween(this.optionSound).to({x: 1600}, 500, "Linear", true);
        this.add.tween(this.controlsList).to({x: 1000}, 500, "Linear", true);

        //this.add.tween(this.playButton).to({x: this.world.centerX}, 300, "Linear", true);
        //this.add.tween(this.playButton).to({x: this.world.centerX}, 300, "Linear", true);
    },

    showControls: function (pointer) {

        this.removeTitle();

        this.add.tween(this.controlsList).to({x: 0}, 500, "Linear", true);
        this.add.tween(this.backButton).to({x: this.world.centerX }, 500, "Linear", true);

    },

    removeTitle: function(){

        this.add.tween(this.titleSprite).to({x: -500}, 500, "Linear", true);
        this.add.tween(this.playButton).to({x: -500}, 500, "Linear", true);
        this.add.tween(this.optionsButton).to({x: -500}, 500, "Linear", true);
        this.add.tween(this.controlsButton).to({x: -500}, 500, "Linear", true);
    },

    fullscreen: function(pointer){


        if (this.scale.isFullScreen)
            {
                this.scale.stopFullScreen();
            }
        else
            {
                this.scale.startFullScreen(false);
            }
    },

    mute: function(pointer){


        if (this.sound.mute)
            {
                this.sound.mute = false;
            }
        else
            {
                this.sound.mute = true;
            }
    },

    noMusic: function(pointer){


        if (this.music.mute)
            {
                this.music.mute = false;
            }
        else
            {
                this.music.mute = true;
            }
    }
};

function over(button) {

    this.tween = this.add.tween(button.scale).to({x: 4.5, y: 2.5}, 300, "Linear", true);
}

function out(button) {

    this.tweens = this.add.tween(button.scale).to({x: 4, y: 2}, 300, "Linear", true);
}