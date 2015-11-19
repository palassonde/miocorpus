GUI = function (game, stage, player) {

	this.game = game;
	this.player = player;
	this.stage = stage;

	// CSS styles
	style = { font: "40px Arial", fill: "#f26c4f", align: "left" };
	resourcesStyle = { font: "20px Arial", fill: "#f26c4f", align: "left" };
	gameOverStyle = { font: "60px Arial", fill: "#f26c4f", align: "left" };

	// Adding the GUI components
	redstone = this.game.add.text(this.game.camera.x, this.game.camera.y, "X", resourcesStyle);
	bluestone = this.game.add.text(this.game.camera.x, this.game.camera.y, "X", resourcesStyle);
	greenstone = this.game.add.text(this.game.camera.x, this.game.camera.y, "X", resourcesStyle);

	// TOP LEFT
	hearts = this.game.add.group();
    for (var i = 0; i < 10; i++) {
    	h = hearts.create((i*35) + 15, 10, 'heart');
    	h.scale.setTo(0.3, 0.3);
    }
    hearts.setAll('fixedToCamera', true);

    // TOP RIGHT
    redstone.fixedToCamera = true;
    redstone.cameraOffset.setTo(960, 45);
    bluestone.fixedToCamera = true;
    bluestone.cameraOffset.setTo(960, 85);
    greenstone.fixedToCamera = true;
    greenstone.cameraOffset.setTo(960, 130);

    stones = this.game.add.group();
    r = stones.create(900, 30, 'redstone');
    r.scale.setTo(0.5, 0.5);
    b = stones.create(900, 70, 'bluestone');
    b.scale.setTo(0.5, 0.5);
    g = stones.create(900, 120, 'greenstone');
    g.scale.setTo(0.5, 0.5);
    stones.setAll('fixedToCamera', true);

}

GUI.prototype.action = function(){

	this.updatePlayerInfos();
	this.updateResourcesInfos();
	if (this.stage.gameOver === true){
		this.endGame();
	}
}

GUI.prototype.displayWave = function(waveCount){

	waveInfos = this.game.add.text(this.game.camera.x, this.game.camera.y , "WAVE " + waveCount, style);
	waveInfos.fixedToCamera = true;
    waveInfos.cameraOffset.setTo(450, 300);
    waveInfos.alpha = 0;
	//tween = this.game.add.tween(waveInfos).to( { alpha: 1 }, 2000, "Linear", true)
	var tween = this.game.add.tween(waveInfos).to( { alpha: 1 }, 2000, "Linear", true, 0, -1).repeat(0);
	tween.yoyo(true, 3000);
}

GUI.prototype.updatePlayerInfos = function(){



}

GUI.prototype.updateResourcesInfos = function(){

}

GUI.prototype.endGame = function(){

    end = this.game.add.text(this.game.camera.x, this.game.camera.y, "GAME-O", gameOverStyle);
    end.fixedToCamera = true;
    end.cameraOffset.setTo(400, 300);
}