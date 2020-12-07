
AimGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

AimGame.Preloader.prototype = {

	preload: function () {

		this.preloadBar = this.add.sprite(0, 100, 'preloaderBar');

		this.load.setPreloadSprite(this.preloadBar);
		var stamp = '?' + new Date().getTime();

		this.load.image('pee', 'assets/images/pee.png');
		this.load.image('target', 'assets/images/target.png');
		this.load.image('crosshairs', 'assets/images/crosshairs.png');
		this.load.image('bomb', 'assets/images/bomb.png');
		this.load.image('background', 'assets/images/urinal.jpg');
		this.load.image('maxxdaddy', 'assets/images/maxxdaddy.gif');
		this.load.image('PDrop', 'assets/images/PDrop.png');
		this.load.image('splash', 'assets/images/aimtitle.png');
		this.load.spritesheet('particles', 'assets/images/particles.png', 2, 2);
		this.load.spritesheet('pints', 'assets/images/pints.png', 33, 57, 13);
		this.load.image('start', 'assets/images/startbutton.png');
		this.load.image('soundButton', 'assets/images/soundButton.png');

		//this.load.audio('cheer', 'assets/sounds/cheer.wav');
		//this.load.audio('flush', 'assets/sounds/flush.wav');
		//this.load.audio('music', 'assets/sounds/music.mp3');
		//this.load.audio('peeMetal', 'assets/sounds/peeMetal.wav');
		//this.load.audio('peeSplash-1', 'assets/sounds/peeSplash-1.wav');
		//this.load.audio('peeSplash-2', 'assets/sounds/peeSplash-2.wav');
		//this.load.audio('peeWater', 'assets/sounds/peeWater.wav');
		//this.load.audio('relief-1', 'assets/sounds/relief-1.wav');
		//this.load.audio('relief-2', 'assets/sounds/relief-2.wav');
		//this.load.audio('relief-3', 'assets/sounds/relief-3.wav');
		//this.load.audio('relief-4', 'assets/sounds/relief-4.wav');
		//this.load.audio('shoes-1', 'assets/sounds/shoes-1.wav');
		//this.load.audio('shoes-2', 'assets/sounds/shoes-2.wav');
		//this.load.audio('shoes-3', 'assets/sounds/shoes-3.wav');
		//this.load.audio('zip', 'assets/sounds/zip.wav');
	},

	create: function () {

		this.preloadBar.cropEnabled = false;

		this.state.start('MainMenu');

	},

	update: function () {

		// if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		// {
			// this.ready = true;
			// this.state.start('MainMenu');
		// }

	}

};
