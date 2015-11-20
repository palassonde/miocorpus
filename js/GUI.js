GUI = function (game, stage, player) {

	this.game = game;
	this.player = player;
	this.stage = stage;
	this.numberHeart = 10;
	
	// CSS styles
	style = { font: "40px Arial", fill: "#f26c4f", align: "left" };
	resourcesStyle = { font: "20px Arial", fill: "#f26c4f", align: "left" };
	gameOverStyle = { font: "60px Arial", fill: "#f26c4f", align: "left" };

	// Adding the GUI components
	this.redstone = this.game.add.text(this.game.camera.x, this.game.camera.y, "X", resourcesStyle);
	this.bluestone = this.game.add.text(this.game.camera.x, this.game.camera.y, "X", resourcesStyle);
	this.greenstone = this.game.add.text(this.game.camera.x, this.game.camera.y, "X", resourcesStyle);

	//number = this.game.add.text(this.game.camera.x, this.game.camera.y, "1", resourcesStyle);
	
	// TOP LEFT
	this.hearts = this.game.add.group();
    for (var i = this.numberHeart - 1; i >= 0; i--) {
    	h = this.hearts.create((i*35) + 15, 10, 'heart');
    	h.scale.setTo(0.3, 0.3);
    }
    this.hearts.setAll('fixedToCamera', true);

    // TOP RIGHT
    this.redstone.fixedToCamera = true;
    this.redstone.cameraOffset.setTo(960, 45);
    this.bluestone.fixedToCamera = true;
    this.bluestone.cameraOffset.setTo(960, 85);
    this.greenstone.fixedToCamera = true;
    this.greenstone.cameraOffset.setTo(960, 130);

    this.stones = this.game.add.group();
    r = this.stones.create(900, 30, 'redstone');
    r.scale.setTo(0.5, 0.5);
    b = this.stones.create(900, 70, 'bluestone');
    b.scale.setTo(0.5, 0.5);
    g = this.stones.create(900, 120, 'greenstone');
    g.scale.setTo(0.5, 0.5);
    this.stones.setAll('fixedToCamera', true);

}

//Player
GUI.prototype.setDisplayStone = function (){
	this.redstone.text = "X " + this.player.numberStoneRed;
	this.bluestone.text = "X " + this.player.numberStoneBlue;
	this.greenstone.text = "X " + this.player.numberStoneGreen;
}

GUI.prototype.setDisplayHealth = function (){
	
	var difHeart = this.numberHeart - this.player.health;
	if(difHeart === 0 || this.player.health > 10) return;	
	//Ajouter de coeur
	if(difHeart < 0){
		while(difHeart !== 0){
			var health = this.hearts.getFirstDead();
			if(health == null) break;
			health.alive = true;
			health.visible = true;
			difHeart++;
			this.numberHeart++;
		}
	}
	//Enlever des coeur
	else{
		while(difHeart !== 0){
			var health = this.hearts.getFirstAlive();
			if(health == null) break;
			
			health.alive = false;
			health.visible = false;
			difHeart--;
			this.numberHeart--;
		}
	}
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
	this.setDisplayStone();
	this.setDisplayHealth();

}

GUI.prototype.updateResourcesInfos = function(){

}

GUI.prototype.endGame = function(){

    end = this.game.add.text(this.game.camera.x, this.game.camera.y, "GAME-O", gameOverStyle);
    end.fixedToCamera = true;
    end.cameraOffset.setTo(400, 300);
}