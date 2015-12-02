SoundManager = function(game){

	// TIRS
	this.boomerang = game.add.audio('boomerang');
	this.boomerang.addMarker('boomerangSec', 0, 3);
	this.boomerang.allowMultiple = true;
	// this.lasers = game.add.audio('laser');
	// this.lasers.allowMultiple = true;
	this.turretneutretir = game.add.audio('turretneutretir');
	this.turretneutretir.volume = 0.5;
	this.turretneutretir.allowMultiple = true;
	this.playertire = game.add.audio('playertire');
	// this.homingmissile = game.add.audio('homingmissile');
	// this.homingmissile.allowMultiple = true;
	
	// ENNEMIES
	this.enemyhurt = game.add.audio('enemyhurt');
	this.ennemibouffecore = game.add.audio('ennemibouffecore');
	this.ennemibouffecore.volume = 4;
    this.warcry = game.add.audio('birds');
	this.warcry.volume = 0.3;
	this.puke = game.add.audio('puker');
	this.puke.volume = 6;
	this.puke.allowMultiple = true;

	// DRUMS
	this.drum1 = game.add.audio('drum1');
	this.drum2 = game.add.audio('drum2');

	// MACHINE FUSION
	this.forceaugmente = game.add.audio('forceaugmente');
	this.forceaugmente.volume = 2;
	this.capaciteaugmente = game.add.audio('capaciteaugmente');
	this.capaciteaugmente.volume = 2;
	this.vitessedepegase = game.add.audio('vitessedepegase');
	this.vitessedepegase.volume = 2;
	this.rayonbrutal = game.add.audio('rayonbrutal');
	this.rayonbrutal.volume = 2;
	this.peaudebelier = game.add.audio('peaudebelier');
	this.peaudebelier.volume = 2;
	this.murdeboules = game.add.audio('murdeboules');
	this.murdeboules.volume = 2;
	this.immunitedivine = game.add.audio('immunitedivine');
	this.mauvaisecombinaison = game.add.audio('mauvaisecombinaison');
	this.error = game.add.audio('error');

	// STAGE
	this.vousetesunechec = game.add.audio('vousetesunechec');
	this.gong = game.add.audio('gong');
	this.gong.volume = 0.5;
	this.transitionup = game.add.audio('transitionup');
    this.transitiondown = game.add.audio('transitiondown');

	// player
	this.pickup = game.add.audio('pickup');
	this.pickup.allowMultiple = true;
	this.construction = game.add.audio('construction');
	this.construction.allowMultiple = true;
	this.playerhurt = game.add.audio('playerhurt');
	this.playerjump = game.add.audio('playerjump');
	this.turretfeed = game.add.audio('turretfeed');

	// turret
	this.destroyturret = game.add.audio('destroyturret');

}