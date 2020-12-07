
AimGame.Game = function (game) {
    this.playing = true;
    this.score;
    this.scoreText;
    this.roundText;
    this.warningText;
    this.PDrops;
    this.emitter;
    this.gameLost;
    this.gameWon;
    this.crosshairs;
    this.MAX_PDROPS = 1000;
    this.round = 0;
    this.pint = [];
    this.started = false;
    this.start;
    this.pSource;
    this.count = 0;
    this.target;
    this.pee;
    this.PEE_LIFESPAN = 750;
    this.NUM_ROUNDS = 8;
    this.warninglife = 100;
    this.warnings = 1;
    this.soundButton;
    this.soundOn = true;
    this.blurinal;

    //SOUNDS
    this.music;
    this.zip;
    this.splash;
    this.cheer;
    this.shoes;
    this.relief;
    this.flush;
    this.miss;
};


AimGame.Game.prototype = {
    create: function() {
        this.gameLost = false;
        this.gameWon = false;
 
        this.stage.smoothed = false;

        this.physics.startSystem(Phaser.Physics.ARCADE);

        var urinal = this.add.image(0, 0, 'background');
        urinal.width = this.game.width;
        urinal.height = this.game.height;

        this.score = 0;
        this.scoreText = this.add.text(8, 360, 'SCORE: 0', { fill: '#ff0000', font: '16pt Impact' });
        var posX = this.game.width / 2;
        this.warningText = this.add.text(posX,
            this.game.height / 2,
            'WARNING!!',
            { fill: '#ff0000', font: '16pt Impact' });
        this.warningText.updateText();
        this.warningText.x = posX - (this.warningText.width * 0.5);
        this.warningText.visible = false;

        this.roundText = this.add.text(posX,
            this.game.height / 2,
            'ROUND: ' + Math.floor(this.round+1),
            { fill: '#ff0000', font: '16pt Impact' });
        this.roundText.updateText();
        this.roundText.x = posX - (this.roundText.width * 0.5);
        this.roundText.visible = false;


        this.add.image(360, 350, 'maxxdaddy');
        this.soundButton = this.add.button(400,
            5,
            'soundButton',
            this.toggleSound,
            this,
            'buttonOver',
            'buttonOut',
            'buttonOver');

        PDrops = this.game.add.group();
        PDrops.enableBody = true;
        PDrops.physicsBodyType = Phaser.Physics.ARCADE;
        PDrops.createMultiple(this.MAX_PDROPS, 'PDrop');
        PDrops.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.resetPDrop);
        PDrops.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
        PDrops.setAll('checkWorldBounds', true);
        PDrops.setAll('alpha', .5);
        PDrops.setAll('scale.x', .5);
        PDrops.setAll('scale.y', .5);
        PDrops.setAll('lifespan', this.PEE_LIFESPAN);

        for (var i = 0; i < this.NUM_ROUNDS; i++) {
            this.pint[i] = this.game.add.sprite((i * 40) + 50, 30, 'pints');
            this.pint[i].anchor.setTo(0.5, 0.5);
            this.pint[i].animations.add('drink');
            this.pint[i].frame = 0;
            this.pint[i].events.onAnimationComplete.add(function() {
                    this.started = false;
                    start.visible = true;
                    this.blurinal.visible = false;
                    this.roundText.visible = true;
                    this.round++;
                    this.warnings = 0;
                    this.pee.scale.x = 0;
                    this.pee.scale.y = 0;
                    this.crosshairs.visible = false;
                    this.splash.pause();
                    this.playSound(this.relief);
                    this.playSound(this.flush);
                    this.roundText.text = 'ROUND:' + Math.floor(this.round + 1);
                },
                this);
            this.pint[i].visible = false;
        }

        this.crosshairs = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'crosshairs');

        this.crosshairs.anchor.setTo(0.5, 0.5);
        this.crosshairs.visible = false;

        this.pee = this.game.add.sprite(this.game.width / 2 + 10, this.game.width / 2 + 30, 'pee');

        this.pee.anchor.setTo(0.5, 0.5);
        this.pee.alpha = .4;
        this.pee.scale.x = 0;
        this.pee.scale.y = 0;

        this.pSource = this.game.add.sprite(this.game.width / 2, this.game.height, 'pDrop');

        this.target = this.game.add.image(this.game.width / 2 + 10, this.game.width / 2 + 30, 'target');
        this.target.anchor.set(0.5);

        //this.input.onDown.add(this.dropBomb, this);
        start = this.add.image(this.game.width / 2, this.game.height - 100, 'start');
        start.anchor.set(0.5);
        start.inputEnabled = true;
        start.events.onInputDown.add(this.listener, this);
        this.roundText.visible = true;

        this.zip = new Audio('assets/sounds/zip.wav');
        this.music = new Audio('assets/sounds/music.mp3');
        this.music.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);
        this.splash = new Audio('assets/sounds/peeWater.wav');
        this.splash.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);
        this.cheer = new Audio('assets/sounds/cheer.wav');
        this.boo = new Audio('assets/sounds/boo.wav');
        this.flush = new Audio('assets/sounds/flush.wav');
        this.relief = new Audio('assets/sounds/relief-1.wav');
        this.shoes = new Audio('assets/sounds/shoes-1.wav');
        this.miss = new Audio('assets/sounds/peeMetal.wav');
        this.miss.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);


        this.playSound(this.zip);

        this.blurinal = this.add.image(0, 0, 'background');
        this.blurinal.width = this.game.width;
        this.blurinal.height = this.game.height;
        this.blurinal.alpha = .5;
        this.blurinal.visible = false;
    },

    listener: function() {
        this.started = true;
        start.visible = false;
        this.roundText.visible = false;
    },

    resetPDrop: function(pdrop) {
// Destroy the pdrop
        pdrop.kill();
    },


    playSound: function(sound)
    {
        if(this.soundOn)
        {
            sound.play();
        }
    },

    update: function() {
        if (this.playing) {
            this.playSound(this.music);
            this.scoreText.text = 'SCORE:' + this.score;
            this.warningText.visible = false;
            if (this.round == this.NUM_ROUNDS) {
                this.playing = false;
                this.gameWon = true;
            }
            if (this.started) {
                this.crosshairs.visible = true;

                for (var i = 0; i < this.NUM_ROUNDS; i++) {
                    if (!this.pint[i].visible) {
                        this.pint[i].visible = true;
                    }
                }
                this.pint[this.round].animations.play('drink', 1, false);
                this.moveCrosshairs(this.game.input.activePointer.x, this.game.input.activePointer.y, this.crosshairs);
                if (this.round >= this.NUM_ROUNDS / 2) {
                    this.blurinal.visible = true;
                    this.moveBlurinal();
                }
                PDrops.forEach(function (pdrop) {
                        //console.log(pdrop.lifespan);
                    pdrop.lifespan--;
                        var distance = Math.floor(Phaser.Math
                            .distance(pdrop.x, pdrop.y, this.crosshairs.x, this.crosshairs.y));
                        if (pdrop.lifespan == 0 || distance < this.crosshairs.width * .2) {
                            //console.log(pdrop.y + " " + this.game.height/2);
                            var isOnTarget = Math.floor(Phaser.Math
                                .distance(pdrop.x, pdrop.y, this.target.x, this.target.y) <
                                this.target.width * .5);
                            
                            if (isOnTarget) {
                                this.score += Math.floor(((this.crosshairs.width - distance) / 200)*(this.round+1));
                                if (this.pee.scale.x < 1.5) {
                                    this.pee.scale.x += .0003;
                                    this.pee.scale.y += .0003;
                                    this.miss.pause();
                                    this.playSound(this.splash);
                                 }
                                this.warningText.visible = false;
                            } else {
                                var deadDrop = (pdrop.x == 0 && pdrop.y == 0);
                                if (!deadDrop) {
                                    this.warningText.visible = true;
                                    this.warninglife--;
                                    this.splash.pause();
                                    this.playSound(this.miss);
                                    if (this.warninglife == 0) {
                                        this.warninglife = 100;
                                        this.warnings++;
                                    }
                                    if (this.warnings > 5) {
                                            this.splash.pause();
                                            this.miss.pause();
                                            this.pint[this.round].animations.stop();
                                            this.gameWon = false;
                                            this.playing = false;
                                            this.started = false;
                                        }
                                }
                            }
                            this.resetPDrop(pdrop);
                        }
                    },
                    this);
                var radians = this.game.physics.arcade.angleBetween(this.pSource, this.crosshairs);
                var degrees = radians * (180 / Math.PI);
                this.firePDrop(degrees);
            }
        } else {
            this.gameOver();
        }
    },

 

 	toggleSound: function()
 	{
 	    this.music.pause();
 	    this.soundOn = !this.soundOn;
 	},

 	firePDrop: function(degrees) {
 	    // Get the first pdrop that's inactive, by passing 'false' as a parameter
 	    var pdrop = PDrops.getFirstExists(false);
 	    if (pdrop) {
 	        // If we have a pdrop, set it to the starting position
 	        pdrop.reset(this.game.width / 2, this.game.height);
 	        pdrop.lifespan = this.PEE_LIFESPAN;
 	        this.game.physics.arcade.velocityFromAngle(degrees, 300, pdrop.body.velocity);
 	        //console.log("pdrop x: " + pdrop.body.velocity);
 	        pdrop.rotation = this.game.physics.arcade.angleToPointer(pdrop) + 90;
 	        //game.physics.arcade.moveToPointer(pdrop, 300);
 	    }
 	},
            
 	moveBlurinal: function () {
 	    var value1 = 0;
 	    var value2 = 0;
 	    var rand = 10 * this.round;
 	    value1 = (Math.random(2 * rand + 1) - rand);//ramp("ramp1", 0, 50, 0.500000, 0);
 	    value2 = (Math.random(2 * rand + 1) - rand);// ramp("ramp2", 0, 50, 0.500000, 0);
 	    this.blurinal.x = value1 * Math.sin(this.count / 10);
 	    this.blurinal.y = value2 * Math.cos(this.count / 20) ;

 	    if (this.blurinal.x < 0) {
 	        this.blurinal.x = 0;
 	    }
 	    if (game.width < this.blurinal.x) {
 	        this.blurinal.x = game.width;
 	    }
 	    if (this.blurinal.y < 0) {
 	        this.blurinal.y = 0;
 	    }
 	    if (game.height < this.blurinal.y) {
 	        this.blurinal.y = game.height;
 	    }
 	},

 	moveCrosshairs: function(px, py, cross) {
 	 var value1 = 0;
     var value2 = 0;
     var rand = 10 * this.round;
     this.count++;
     value1 = (Math.random(2 * rand + 1) - rand);//ramp("ramp1", 0, 50, 0.500000, 0);
     value2 = (Math.random(2 * rand + 1) - rand);// ramp("ramp2", 0, 50, 0.500000, 0);
     cross.x = value1 * Math.sin(this.count / 10) + px;
     cross.y = value2 * Math.cos(this.count / 20) + py;
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
 },

 	gameOver: function () {
 	    this.blurinal.visible = false;
        var posX = this.game.width / 2;
        var posY = (this.game.height / 2);
        var t2 = this.add.text(posX, posY -60, 'SCORE: ' + this.score, { fill: '#FF0000', font: '32pt Impact' });
        t2.updateText();
        t2.x = posX - (t2.width * 0.5);
        if (this.gameWon)
        {
            this.playSound(this.cheer);
            var t = this.add.text(posX, posY-20, 'GAME WON', { fill: '#FF0000', font: '32pt Impact' });
            t.updateText();
            t.x = posX - (t.width * 0.5);
        }
        else
        {
            this.playSound(this.boo);
            var t = this.add.text(posX, posY-20, 'YOU LOSE, SLOB!!', { fill: '#FF0000', font: '32pt Impact' });
            t.updateText();
            t.x = posX - (t.width * 0.5);
        }

        //t.x = 256 - (t.textWidth / 2);

        this.input.onDown.add(this.quitGame, this);

    },

	quitGame: function () {
	    this.round = 0;
	    this.started = false;
	    this.playing = true;
	    this.count = 0;
	    this.warnings = 1;
	    this.state.start('MainMenu');
	}

};
