const game = new Phaser.Game(800, 600, Phaser.ARCADE, 'game', {
    preload,
    create,
    update,
   });
  
  function create() {
    if (!startGame) mainMenuCreate(this);
    else gameCreate();
  }
  
  function gameCreate() {
        gameLost = false;
        gameWon = false;
 
        stage.smoothed = false;

        physics.startSystem(Phaser.Physics.ARCADE);

        var urinal = add.image(0, 0, 'background');
        urinal.width = game.width;
        urinal.height = game.height;

        score = 0;
        scoreText = add.text(8, 360, 'SCORE: 0', { fill: '#ff0000', font: '16pt Impact' });
        var posX = game.width / 2;
        warningText = add.text(posX,
            game.height / 2,
            'WARNING!!',
            { fill: '#ff0000', font: '16pt Impact' });
        warningText.updateText();
        warningText.x = posX - (warningText.width * 0.5);
        warningText.visible = false;

        roundText = add.text(posX,
            game.height / 2,
            'ROUND: ' + Math.floor(round+1),
            { fill: '#ff0000', font: '16pt Impact' });
        roundText.updateText();
        roundText.x = posX - (roundText.width * 0.5);
        roundText.visible = false;

        boo = game.add.audio('boo');
        cheer = game.add.audio('cheer');
        music1 = game.add.audio('music-1');
        music2 = game.add.audio('music-2');
        peeMetal = game.add.audio('peeMetal');
        peeSplash = game.add.audio('peeSplash');
        peeWater = game.add.audio('peeWater');
        relief1 = game.add.audio('relief-1');
        relief2 = game.add.audio('relief-2');

        add.image(360, 350, 'maxxdaddy');
        soundButton = add.button(400,
            5,
            'soundButton',
            toggleSound,
            this,
            'buttonOver',
            'buttonOut',
            'buttonOver');

        PDrops = game.add.group();
        PDrops.enableBody = true;
        PDrops.physicsBodyType = Phaser.Physics.ARCADE;
        PDrops.createMultiple(MAX_PDROPS, 'PDrop');
        PDrops.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetPDrop);
        PDrops.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
        PDrops.setAll('checkWorldBounds', true);
        PDrops.setAll('alpha', .5);
        PDrops.setAll('scale.x', .5);
        PDrops.setAll('scale.y', .5);
        PDrops.setAll('lifespan', PEE_LIFESPAN);

        for (var i = 0; i < NUM_ROUNDS; i++) {
            pint[i] = game.add.sprite((i * 40) + 50, 30, 'pints');
            pint[i].anchor.setTo(0.5, 0.5);
            pint[i].animations.add('drink');
            pint[i].frame = 0;
            pint[i].events.onAnimationComplete.add(function() {
                    started = false;
                    start.visible = true;
                    blurinal.visible = false;
                    roundText.visible = true;
                    round++;
                    warnings = 0;
                    pee.scale.x = 0;
                    pee.scale.y = 0;
                    crosshairs.visible = false;
                    splash.pause();
                    playSound(relief);
                    playSound(flush);
                    roundText.text = 'ROUND:' + Math.floor(round + 1);
                },
                this);
            pint[i].visible = false;
        }

        crosshairs = game.add.sprite(game.width / 2, game.height / 2, 'crosshairs');

        crosshairs.anchor.setTo(0.5, 0.5);
        crosshairs.visible = false;

        pee = game.add.sprite(game.width / 2 + 10, game.width / 2 + 30, 'pee');

        pee.anchor.setTo(0.5, 0.5);
        pee.alpha = .4;
        pee.scale.x = 0;
        pee.scale.y = 0;

        pSource = game.add.sprite(game.width / 2, game.height, 'pDrop');

        target = game.add.image(game.width / 2 + 10, game.width / 2 + 30, 'target');
        target.anchor.set(0.5);

        //input.onDown.add(dropBomb, this);
        start = add.image(game.width / 2, game.height - 100, 'start');
        start.anchor.set(0.5);
        start.inputEnabled = true;
        start.events.onInputDown.add(listener, this);
        roundText.visible = true;

        music1.addEventListener('ended', function () {
            currentTime = 0;
            play();
        }, false);
        splash1.addEventListener('ended', function () {
            currentTime = 0;
            play();
        }, false);
      peeMetal.addEventListener('ended', function () {
            currentTime = 0;
            play();
        }, false);


        playSound(zip);

        blurinal = add.image(0, 0, 'background');
        blurinal.width = game.width;
        blurinal.height = game.height;
        blurinal.alpha = .5;
        blurinal.visible = false;
    };

    function listener() {
        started = true;
        start.visible = false;
        roundText.visible = false;
    };

    function resetPDrop(pdrop) {
// Destroy the pdrop
        pdrop.kill();
    };

   function playSound(sound)
    {
        if(soundOn)
        {
            sound.play();
        }
    };

  function update() {
        if (playing) {
            playSound(music);
            scoreText.text = 'SCORE:' + score;
            warningText.visible = false;
            if (round == NUM_ROUNDS) {
                playing = false;
                gameWon = true;
            }
            if (started) {
                crosshairs.visible = true;

                for (var i = 0; i < NUM_ROUNDS; i++) {
                    if (!pint[i].visible) {
                        pint[i].visible = true;
                    }
                }
                pint[round].animations.play('drink', 1, false);
                moveCrosshairs(game.input.activePointer.x, game.input.activePointer.y, crosshairs);
                if (round >= NUM_ROUNDS / 2) {
                    blurinal.visible = true;
                    moveBlurinal();
                }
                PDrops.forEach(function (pdrop) {
                        //console.log(pdrop.lifespan);
                    pdrop.lifespan--;
                        var distance = Math.floor(Phaser.Math
                            .distance(pdrop.x, pdrop.y, crosshairs.x, crosshairs.y));
                        if (pdrop.lifespan == 0 || distance < crosshairs.width * .2) {
                            //console.log(pdrop.y + " " + game.height/2);
                            var isOnTarget = Math.floor(Phaser.Math
                                .distance(pdrop.x, pdrop.y, target.x, target.y) <
                                target.width * .5);
                            
                            if (isOnTarget) {
                                score += Math.floor(((crosshairs.width - distance) / 200)*(round+1));
                                if (pee.scale.x < 1.5) {
                                    pee.scale.x += .0003;
                                    pee.scale.y += .0003;
                                    miss.pause();
                                    playSound(splash);
                                 }
                                warningText.visible = false;
                            } else {
                                var deadDrop = (pdrop.x == 0 && pdrop.y == 0);
                                if (!deadDrop) {
                                    warningText.visible = true;
                                    warninglife--;
                                    splash.pause();
                                    playSound(miss);
                                    if (warninglife == 0) {
                                        warninglife = 100;
                                        warnings++;
                                    }
                                    if (warnings > 5) {
                                            splash.pause();
                                            miss.pause();
                                            pint[round].animations.stop();
                                            gameWon = false;
                                            playing = false;
                                            started = false;
                                        }
                                }
                            }
                            resetPDrop(pdrop);
                        }
                    },
                    this);
                var radians = game.physics.arcade.angleBetween(pSource, crosshairs);
                var degrees = radians * (180 / Math.PI);
                firePDrop(degrees);
            }
        } else {
            gameOver();
        }
    };
    
    function toggleSound()
 	{
 	    music.pause();
 	    soundOn = !soundOn;
 	};

 	function firePDrop(degrees) {
 	    // Get the first pdrop that's inactive, by passing 'false' as a parameter
 	    var pdrop = PDrops.getFirstExists(false);
 	    if (pdrop) {
 	        // If we have a pdrop, set it to the starting position
 	        pdrop.reset(game.width / 2, game.height);
 	        pdrop.lifespan = PEE_LIFESPAN;
 	        game.physics.arcade.velocityFromAngle(degrees, 300, pdrop.body.velocity);
 	        //console.log("pdrop x: " + pdrop.body.velocity);
 	        pdrop.rotation = game.physics.arcade.angleToPointer(pdrop) + 90;
 	        //game.physics.arcade.moveToPointer(pdrop, 300);
 	    }
 	};
            
 	function moveBlurinal() {
 	    var value1 = 0;
 	    var value2 = 0;
 	    var rand = 10 * round;
 	    value1 = (Math.random(2 * rand + 1) - rand);//ramp("ramp1", 0, 50, 0.500000, 0);
 	    value2 = (Math.random(2 * rand + 1) - rand);// ramp("ramp2", 0, 50, 0.500000, 0);
 	    blurinal.x = value1 * Math.sin(count / 10);
 	    blurinal.y = value2 * Math.cos(count / 20) ;

 	    if (blurinal.x < 0) {
 	        blurinal.x = 0;
 	    }
 	    if (game.width < blurinal.x) {
 	        blurinal.x = game.width;
 	    }
 	    if (blurinal.y < 0) {
 	        blurinal.y = 0;
 	    }
 	    if (game.height < blurinal.y) {
 	        blurinal.y = game.height;
 	    }
 	};

 	function moveCrosshairs(px, py, cross) {
 	 var value1 = 0;
     var value2 = 0;
     var rand = 10 * round;
     count++;
     value1 = (Math.random(2 * rand + 1) - rand);//ramp("ramp1", 0, 50, 0.500000, 0);
     value2 = (Math.random(2 * rand + 1) - rand);// ramp("ramp2", 0, 50, 0.500000, 0);
     cross.x = value1 * Math.sin(count / 10) + px;
     cross.y = value2 * Math.cos(count / 20) + py;
     //console.log("cross.x:" + cross.x + " pointer x:" + px);
     //cross.x = px;
     //cross.y = py;

     if (cross.x < 0) {
         cross.x = 0;
     }
     if (game.width < cross.x) {
         cross.x = game.width;
     }
     if (cross.y < 0) {
         cross.y = 0;
     }
     if (game.height < cross.y) {
         cross.y = game.height;
     }
 };

 	function gameOver() {
 	    blurinal.visible = false;
        var posX = game.width / 2;
        var posY = (game.height / 2);
        var t2 = add.text(posX, posY -60, 'SCORE: ' + score, { fill: '#FF0000', font: '32pt Impact' });
        t2.updateText();
        t2.x = posX - (t2.width * 0.5);
        if (gameWon)
        {
            playSound(cheer);
            var t = add.text(posX, posY-20, 'GAME WON', { fill: '#FF0000', font: '32pt Impact' });
            t.updateText();
            t.x = posX - (t.width * 0.5);
        }
        else
        {
            playSound(boo);
            var t = add.text(posX, posY-20, 'YOU LOSE, SLOB!!', { fill: '#FF0000', font: '32pt Impact' });
            t.updateText();
            t.x = posX - (t.width * 0.5);
        }

        //t.x = 256 - (t.textWidth / 2);

        input.onDown.add(quitGame, this);

    };

	function quitGame() {
	    round = 0;
	    started = false;
	    playing = true;
	    count = 0;
	    warnings = 1;
	    state.start('MainMenu');
	};


