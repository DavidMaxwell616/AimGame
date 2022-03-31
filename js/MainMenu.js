function mainMenuCreate(scene) {
	splash = scene.add.image(0, 0, 'splash');
	splash.anchor.setTo(0, 0);
	splash.width = game.width;
	splash.height = game.height;
	for (let index = -200; index < 1000; index+=100) {
		createStream(scene,index);
		}	title = scene.add.image(0, 0, 'title');
	title.anchor.setTo(0, 0);
	title.width = game.width;
	title.height = game.height*.7;

	startButton = scene.add.image(200, 450, 'startButton');
	startButton.anchor.setTo(0, 0);
	
	maxxdaddy = game.add.image(0, game.height * 0.92, 'maxxdaddy');
	game.input.onDown.addOnce(StartGame, this);
	game.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
   
	game.input.keyboard.onUpCallback = function (e) {
	  if (e.keyCode == Phaser.Keyboard.SPACEBAR) 
		StartGame(scene);
	}


  }
  
  function createStream(scene,x){
	var stream = scene.add.sprite(x, 0, 'peeStream');
	stream.scale.y =2;
	stream.animations.add('pee');
	stream.animations.play('pee',10,true); 
  }

  function StartGame(scene){
	if (startGame)
	return;
  splash.visible = false;
  startGame = true;
  gameCreate(scene);
  }