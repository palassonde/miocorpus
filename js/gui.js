GUI = function (game, stage, player, music) {

	this.game = game;
	this.player = player;
	this.stage = stage;
	this.numberHeart = 10;
	this.music = music;

	forceaugmente = this.game.add.audio('forceaugmente');
	forceaugmente.volume = 2;
	capaciteaugmente = this.game.add.audio('capaciteaugmente');
	capaciteaugmente.volume = 2;
	vitessedepegase = this.game.add.audio('vitessedepegase');
	vitessedepegase.volume = 2;
	rayonbrutal = this.game.add.audio('rayonbrutal');
	rayonbrutal.volume = 2;
	peaudebelier = this.game.add.audio('peaudebelier');
	peaudebelier.volume = 2;
	murdeboules = this.game.add.audio('murdeboules');
	murdeboules.volume = 2;
	immunitedivine = this.game.add.audio('immunitedivine');
	mauvaisecombinaison = this.game.add.audio('mauvaisecombinaison');
	error = this.game.add.audio('error');
	gong = this.game.add.audio('gong');
	gong.volume = 0.5;
	vousetesunechec = this.game.add.audio('vousetesunechec');
	
	// CSS styles
	style = { font: "40px Arial", fill: "#000000", align: "left" };
	resourcesStyle = { font: "20px Arial", fill: "#000000", align: "left" };

	// Adding the GUI components
	this.redstone = this.game.add.text(this.game.camera.x, this.game.camera.y, "X", resourcesStyle);
	this.bluestone = this.game.add.text(this.game.camera.x, this.game.camera.y, "X", resourcesStyle);
	this.greenstone = this.game.add.text(this.game.camera.x, this.game.camera.y, "X", resourcesStyle);

	this.turretsCapacity = this.game.add.text(this.game.camera.x, this.game.camera.y, "X", resourcesStyle);
	
	// TOP LEFT
	this.hearts = this.game.add.group();
    for (var i = this.numberHeart - 1; i >= 0; i--) {
    	h = this.hearts.create((i*35) + 15, 34, 'heart');
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

    this.turretsCapacity.fixedToCamera = true;
    this.turretsCapacity.cameraOffset.setTo(800, 45);
    this.turret = this.game.add.sprite(770, 35, 'turret')
    this.turret.scale.setTo(0.1, 0.1);
    this.turret.fixedToCamera = true;

    this.stones = this.game.add.group();
    r = this.stones.create(900, 30, 'redstone');
    r.scale.setTo(0.5, 0.5);
    b = this.stones.create(900, 70, 'bluestone');
    b.scale.setTo(0.5, 0.5);
    g = this.stones.create(900, 120, 'greenstone');
    g.scale.setTo(0.5, 0.5);
    this.stones.setAll('fixedToCamera', true);
	
	//Machine de fusion	
	this.game.add.text(90, 120, "R : RESET", resourcesStyle);
	this.game.add.text(345, 120, "F : FUSION", resourcesStyle);
	
	var nbItem = 4;
	this.positionMilieu = (nbItem*90/2) - (3*90)/2; //Sert a centrer
	//var distance = 90; //Serte a faire une distance
	
	this.game.add.text(this.positionMilieu + 90 + 42, 300, "MACHINE À FUSION", resourcesStyle);
	
	//Group d'élémet de fusion
	this.graphics = this.game.add.graphics(90,150);
	this.elementFusion = this.game.add.group();
    this.elementFusion.enableBody = true;
	
	var elementF = ["redstone","bluestone", "greenstone","player"];

	this.createMachine(nbItem,elementF);
	
	this.positionDrag = new Phaser.Point();; //Garde la position de l'item
	this.tabFusion = []; //Garde les elements de la fusion
	
	//Bouton ou action pour fusion et reset
	var actionKey_R = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
	actionKey_R.onDown.add(this.initItemFusion, this);
	var actionKey_F = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
	actionKey_F.onDown.add(this.fusion, this);
	
	//Legende
	var x = (nbItem*90) + 40;
	
	this.legend(x);
}

//Player
GUI.prototype.setDisplayStone = function (){
	this.redstone.text = "X " + this.player.numberStoneRed;
	this.bluestone.text = "X " + this.player.numberStoneBlue;
	this.greenstone.text = "X " + this.player.numberStoneGreen;
}

GUI.prototype.setDisplayHealth = function (){

	var difHeart = this.numberHeart - Math.ceil(this.player.health);
	if(difHeart === 0 || this.player.health > 10) return;	
	//Ajouter de coeur
	if(difHeart < 0){
		while(difHeart !== 0){
			var health = this.hearts.getAt(9 - this.numberHeart);
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

GUI.prototype.setDisplayTurrets = function (){
	this.turretsCapacity.text = this.player.nbrTurrets + " / " + this.player.maxTurrets;
}

GUI.prototype.action = function(){

	this.setDisplayStone();
	this.setDisplayHealth();
	this.setDisplayTurrets();
}

GUI.prototype.displayWave = function(waveCount){

	waveInfos = this.game.add.text(this.game.camera.x, this.game.camera.y , "WAVE " + waveCount, style);
	waveInfos.fixedToCamera = true;
    waveInfos.cameraOffset.setTo(450, 300);
    waveInfos.alpha = 0;
	//tween = this.game.add.tween(waveInfos).to( { alpha: 1 }, 2000, "Linear", true)
	var tween = this.game.add.tween(waveInfos).to( { alpha: 1 }, 2000, "Linear", true, 0, -1).repeat(0);
	tween.yoyo(true, 3000);

	gong.play();
}

GUI.prototype.endGame = function(waveCount){

	vousetesunechec.play();
    this.player.kill();
    reset = this.game.add.button(530, 400, 'reset-button', this.back, this,2, 1, 0, 2)
    reset.scale.setTo(2,2);
    reset.anchor.setTo(0.5, 0.5);
    reset.fixedToCamera = true;
    end = this.game.add.sprite(350, 70, 'gameover');
   	end.fixedToCamera = true;
   	end.alpha = 0;
   	tween = this.game.add.tween(end).to( { alpha: 1 }, 1000, "Linear", true, 0, -1).repeat(0);

   	endInfo = this.game.add.text(this.game.camera.x + 100, this.game.camera.y + 65, "Wave: "+waveCount, style);
   	//endInfo.fixedToCamera = true;
   	endInfo.anchor.set(0.5);

}

//Pour la machine de fusion
GUI.prototype.legend = function(x){
	
	var resourcesStyleLegend = { font: "18px Arial", fill: "#000000", align: "left" };
	
	this.graphics.beginFill(0xbbbbbb, 1);
	this.graphics.drawRect(x - 10, -120, 410, 565);
	this.graphics.endFill();	
	
	//Titre
	this.game.add.text(x+45+200 , 35, "LEGENDE", resourcesStyleLegend);
	
	//Menu
	var menu = this.game.add.text(x+45+42, 205, "TURRET", resourcesStyleLegend);
	menu.angle = -90;
	
	this.graphics.lineStyle(2, 0xf26c4f, 1);
	this.graphics.moveTo(x+7,-20);
	this.graphics.lineTo(x+7,-90);
	this.graphics.lineTo(x+100,-90);
	
	this.graphics.lineStyle(2, 0xf26c4f, 1);
	this.graphics.moveTo(x+7,60);
	this.graphics.lineTo(x+7,130);
	this.graphics.lineTo(x+100,130);
	
	var menu = this.game.add.text(x+45+42, 500, "PERSONNAGE", resourcesStyleLegend);
	menu.angle = -90;
	
	this.graphics.lineStyle(2, 0xf26c4f, 1);
	this.graphics.moveTo(x+7,220);
	this.graphics.lineTo(x+7,140);
	this.graphics.lineTo(x+100,140);
	
	this.graphics.lineStyle(2, 0xf26c4f, 1);
	this.graphics.moveTo(x+7,355);
	this.graphics.lineTo(x+7,435);
	this.graphics.lineTo(x+100,435);
	
	var distance = 75;
	var ressourceNbStyle = { font: "10px Arial", fill: "#000000", align: "left" };
	
	var tabLeg = [["redstone","bluestone", "MUR"],["greenstone","redstone","CERCLE"],["bluestone","greenstone", "INVINCIBLE"],["player","redstone","FORCE"],["player","bluestone","DEFENCE"],["player","greenstone", "VITESSE"],["redstone","bluestone","greenstone", "TURRET"]]
	for(var i = 0; i < 7; i++){
		
		var separation = 0;
		if(i>= 3){
			separation = 10;
		}
		
		this.game.add.text(x + 90*1 + 85, 80 + separation + distance * i, "+", resourcesStyle);
		
		if(i < 6){
			this.game.add.text(x + 90*2 + 85, 88 + separation + distance * i, "=", resourcesStyle);
			this.game.add.text(x + 90*2 + 85 + 25, 88 + separation + distance * i, tabLeg[i][2], resourcesStyle);
		}else{
			this.game.add.text(x + 90*2 + 85, 80 + separation + distance * i, "+", resourcesStyle);
			this.game.add.text(x + 90*3 + 85, 88 + separation + distance * i, "=", resourcesStyle);
			this.game.add.text(x + 90*3 + 85 + 25, 88 + separation + distance * i, tabLeg[i][3], resourcesStyle);
		}


		if(tabLeg[i][0] == "player"){
			this.game.add.text(x + 90 + 40, 60 + separation + distance * i, "X1", ressourceNbStyle);
		}else{
			this.game.add.text(x + 90 + 35, 65 + separation + distance * i, "X10", ressourceNbStyle);
		}
		this.game.add.text(x + 90*2 + 35, 65 + separation + distance * i, "X10", ressourceNbStyle);
		
		this.graphics.lineStyle(2, 0xf26c4f, 1);
		this.graphics.moveTo(x+90-10,-45 + separation + distance * i);
		this.graphics.lineTo(x+90+10,-45 + separation + distance * i);
		this.graphics.lineTo(x+90+5,-50 + separation + distance * i);
		
		this.graphics.moveTo(x+90+10,-40 + separation + distance * i);
		this.graphics.lineTo(x+90-10,-40 + separation + distance * i);
		this.graphics.lineTo(x+90-5,-35 + separation + distance * i);
		
		var imageF1 = this.game.add.sprite(x + 90 + 45,100 + separation + distance * i, tabLeg[i][0]);
		imageF1.anchor.set(0.5);
		imageF1.scale.setTo(0.5,0.5);
	
		var imageF1 = this.game.add.sprite(x + 90*2 + 45,100 + separation + distance * i, tabLeg[i][1]);
		imageF1.anchor.set(0.5);
		imageF1.scale.setTo(0.5,0.5);
		
		if(i===6){
			var imageF1 = this.game.add.sprite(x + 90*3 + 45,100 + separation + distance * i, tabLeg[i][2]);
			imageF1.anchor.set(0.5);
			imageF1.scale.setTo(0.5,0.5);
			
			this.graphics.moveTo(x+90*2-10,-45 + separation + distance * i);
			this.graphics.lineTo(x+90*2+10,-45 + separation + distance * i);
			this.graphics.lineTo(x+90*2+5,-50 + separation + distance * i);
		
			this.graphics.moveTo(x+90*2+10,-40 + separation + distance * i);
			this.graphics.lineTo(x+90*2-10,-40 + separation + distance * i);
			this.graphics.lineTo(x+90*2-5,-35 + separation + distance * i);
			
			this.game.add.text(x + 90*3 + 35, 65 + separation + distance * i, "X10", ressourceNbStyle);
		}
	}
	
	//Resultat
	// this.game.add.text(x + 90*2 + 85 + 25, 88 + distance * 0, "MUR", resourcesStyle);
	// this.game.add.text(x + 90*2 + 85 + 25, 88 + distance * 1, "CERCLE", resourcesStyle);
	// this.game.add.text(x + 90*2 + 85 + 25, 88 + distance * 2, "INVINCIBLE", resourcesStyle);
	// this.game.add.text(x + 90*2 + 85 + 25, 88 + 10 + distance * 3, "FORCE", resourcesStyle);
	// this.game.add.text(x + 90*2 + 85 + 25, 88 + 10 + distance * 4, "DEFENSE", resourcesStyle);
	// this.game.add.text(x + 90*2 + 85 + 25, 88 + 10 + distance * 5, "VITESSE", resourcesStyle);
	// this.game.add.text(x + 90*3 + 85 + 25, 88 + 10 + distance * 6, "TURRET", resourcesStyle);
}
GUI.prototype.createMachine = function(nbItem, elementF){

	this.graphics.lineStyle(5, 0x666666,1);
	this.graphics.beginFill(0xbbbbbb, 0.7);
	for(var a = 0; a < nbItem; a++){
		this.graphics.drawRect(90*a, 0, 90, 90);
		var imageF = this.game.add.sprite(90*a + 135,150 + 45, elementF[a]);	
		imageF.anchor.set(0.5);
		imageF.scale.setTo(0.8,0.8);
		imageF.inputEnabled = true;
		imageF.input.enableDrag();
		imageF.events.onDragStart.add(this.dragStart,this);
		imageF.events.onDragStop.add(this.dragStop,this);
		this.elementFusion.add(imageF);	
	}
	this.graphics.endFill();
	
	this.graphics.lineStyle(5, 0x666666, 1);
	this.graphics.beginFill(0x666666, 1);
	
	var topFleche = (nbItem*90)/2;
	
	this.graphics.moveTo(topFleche,100);
	this.graphics.lineTo(topFleche,130);
	this.graphics.lineTo(topFleche-5,130);
	this.graphics.lineTo(topFleche,135);
	this.graphics.lineTo(topFleche+5,130);
	this.graphics.lineTo(topFleche,130);
	this.graphics.endFill();
	
	this.graphics.lineStyle(5, 0x666666,1);
	this.graphics.beginFill(0xbbbbbb, 0.7);
	for(var a = 0; a < 3; a++){
		this.graphics.drawRect(this.positionMilieu + 90*a, 180, 90, 90);
	}
	this.graphics.endFill();
}

GUI.prototype.initItemFusion = function(){
	for (var x in this.elementFusion.children){
		this.elementFusion.children[x].x = 90*x + 135;
		this.elementFusion.children[x].y = 150 + 45;
		this.elementFusion.children[x].inputEnabled = true;
	}
	this.tabFusion = [];
}

GUI.prototype.dragStart = function(sprite){
	this.positionDrag.x = sprite.position.x;
	this.positionDrag.y = sprite.position.y;
}

GUI.prototype.dragStop = function(sprite){
	if(sprite.y <= 240 || this.tabFusion.length >= 3){
		sprite.x = this.positionDrag.x;
		sprite.y = this.positionDrag.y;
	}else{
		var nb = this.tabFusion.length;
		sprite.x = this.positionMilieu + 90*nb + 135;
		sprite.y = 330 + 45;
		sprite.inputEnabled = false;
		this.tabFusion.push(sprite);
	}
}

GUI.prototype.fusion = function(sprite){
	if(this.tabFusion.length <= 1){
		return;
	}
	
	var tabObject = []; //Tableau boolean d'object

	for (var x in this.elementFusion.children){
		if(!this.elementFusion.children[x].inputEnabled){
			tabObject[x] = true;
		}else{
			tabObject[x] = false;
		}
	}
	
	var works = false;
	
	if(this.tabFusion.length ===3){
		if(tabObject[0] && tabObject[1] && tabObject[2]){
			if(this.player.numberStoneBlue >= 10 && this.player.numberStoneRed >= 10 && this.player.numberStoneGreen >= 10 && this.player.maxTurrets < 20){
				this.player.numberStoneBlue -= 10;
				this.player.numberStoneRed -= 10;
				this.player.numberStoneGreen -= 10;
				this.player.maxTurrets++;
				works = true;
				capaciteaugmente.play();
			}
		}
	}else{
		if (tabObject[0] && tabObject[1]){
			if(this.player.numberStoneBlue >= 10 && this.player.numberStoneRed >= 10){
				this.player.numberStoneBlue -= 10;
				this.player.numberStoneRed -= 10;
				this.player.bonus2 = true; //Active un power au prochain turret
				this.player.flash.visible = true;
				works = true;
				murdeboules.play();
			}
		}
		if (tabObject[0] && tabObject[2]){
			if(this.player.numberStoneGreen >= 10 && this.player.numberStoneRed >= 10){
				this.player.numberStoneGreen -= 10;
				this.player.numberStoneRed -= 10;
				this.player.bonus1 = true; //Active un power au prochain turret
				works = true;
				this.player.flash.visible = true;
				rayonbrutal.play();
			}
		}
		if (tabObject[1] && tabObject[2]){
			if(this.player.numberStoneGreen >= 10 && this.player.numberStoneBlue >= 10){
				this.player.numberStoneGreen -= 10;
				this.player.numberStoneBlue -= 10;
				this.player.bonus3 = true; //Active un power au prochain turret	
				works = true;
				this.player.flash.visible = true;
				immunitedivine.play();
			}
		}
		if (tabObject[3] && tabObject[0]){
			if(this.player.numberStoneRed >= 10){
				this.player.numberStoneRed -= 10;
				this.player.domage++;
				works = true;
				forceaugmente.play();
			}
		}
		if (tabObject[3] && tabObject[1]){
			if(this.player.numberStoneBlue >= 10){
				this.player.numberStoneBlue -= 10;
				this.player.def +=0.5;
				works = true;
				peaudebelier.play();
			}
		}
		if (tabObject[3] && tabObject[2]){
			if(this.player.numberStoneGreen >= 10){
				this.player.numberStoneGreen -= 10;
				this.player.MAX_SPEED +=50;
				vitessedepegase.play();
				works = true;
			}
		}
	}
	if(!works){
		mauvaisecombinaison.play();
		error.play();
	}
	this.initItemFusion();
}

GUI.prototype.back = function(){
	this.game.sound.stopAll();
	this.game.state.start('menu');
}
