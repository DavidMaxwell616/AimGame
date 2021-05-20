
function mainMenuCreate(scene) {
	splash = scene.add.image(0, 0, 'splash');
	splash.anchor.setTo(0, 0);
	splash.width = game.width;
	splash.height = game.height;
	maxxdaddy = game.add.image(0, game.height * 0.92, 'maxxdaddy');
	game.input.onDown.addOnce(StartGame, this);
	game.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
   
	game.input.keyboard.onUpCallback = function (e) {
	  if (e.keyCode == Phaser.Keyboard.SPACEBAR) 
		StartGame(scene);
	}
  }
  
  function StartGame(scene){
	if (startGame)
	return;
  splash.visible = false;
  startGame = true;
  gameCreate(scene);
  }
  
//   AimGame.MainMenu = function (game) {



// };

// AimGame.MainMenu.prototype = {

// 	create: function () {

// 		// this.music = this.add.audio('titleMusic');
// 		// this.music.play();

//         var background = this.add.image(0, 0, 'background');
//         background.width = this.game.width;
//         background.height = this.game.height;
//         this.add.image(360, 350, 'maxxdaddy');

// 	    var splash = this.add.image(50, 50, 'splash');
// 		splash.width = this.game.width*.75;
// 		splash.height = this.game.height*.75

// 		this.input.onDown.addOnce(this.startGame, this);

// 	},

// 	update: function () {

// 	},

// 	startGame: function (pointer) {

// 		// this.music.stop();

// 		//	And start the actual game
// 		this.state.start('Game');

// 	}

// };
