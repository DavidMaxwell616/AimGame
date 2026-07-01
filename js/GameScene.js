import {
    W,
    H,
    MAX_PDROPS,
    NUM_ROUNDS,
    PEE_LIFESPAN,
    localStorageName
} from "./config.js";

export class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    preload() {
        this.load.image("start", "assets/images/startButton.png");
        this.load.image("crosshairs", "assets/images/crosshairs.png");
        this.load.image("background", "assets/images/urinal.jpg");
        this.load.image("maxxdaddy", "assets/images/maxxdaddy.gif");
        this.load.image("pee", "assets/images/pee.png");
        this.load.image("PDrop", "assets/images/PDrop.png");
        this.load.image("soundButton", "assets/images/soundButton.png");
        this.load.image("splash", "assets/images/FubarMissleLogo.jpg");
        this.load.image("target", "assets/images/target.png");

        this.load.spritesheet("particles", "assets/images/particles.png", {
            frameWidth: 2,
            frameHeight: 2
        });

        this.load.spritesheet("pint", "assets/images/pint.png", {
            frameWidth: 167,
            frameHeight: 300
        });

        this.load.spritesheet("peeStream", "assets/images/peesheet.png", {
            frameWidth: 477,
            frameHeight: 358
        });

        this.load.audio("boo", "assets/sounds/mp3/boo.mp3");
        this.load.audio("cheer", "assets/sounds/mp3/cheer.mp3");
        this.load.audio("flush", "assets/sounds/mp3/flush.mp3");
        this.load.audio("music1", "assets/sounds/mp3/music-1.mp3");
        this.load.audio("music2", "assets/sounds/mp3/music-2.mp3");
        this.load.audio("peeMetal", "assets/sounds/mp3/peeMetal.mp3");
        this.load.audio("peeSplash1", "assets/sounds/mp3/peeSplash-1.mp3");
        this.load.audio("peeSplash2", "assets/sounds/mp3/peeSplash-2.mp3");
        this.load.audio("peeWater", "assets/sounds/mp3/peeWater.mp3");
        this.load.audio("relief1", "assets/sounds/mp3/relief-1.mp3");
        this.load.audio("relief2", "assets/sounds/mp3/relief-2.mp3");
        this.load.audio("relief3", "assets/sounds/mp3/relief-3.mp3");
        this.load.audio("relief4", "assets/sounds/mp3/relief-4.mp3");
        this.load.audio("shoes1", "assets/sounds/mp3/shoes-1.mp3");
        this.load.audio("shoes2", "assets/sounds/mp3/shoes-2.mp3");
        this.load.audio("shoes3", "assets/sounds/mp3/shoes-3.mp3");
        this.load.audio("zip", "assets/sounds/mp3/zip.mp3");
    }

    create() {
        this.gameLost = false;
        this.gameWon = false;
        this.started = false;
        this.playing = false;
        this.drinkStarted = false;
        this.soundOn = true;

        this.count = 0;
        this.warnings = 0;
        this.warningLife = 100;
        this.score = 0;
        this.round = 0;
        this.highScore = Number(localStorage.getItem(localStorageName)) || 0;

        this.nextDropTime = 0;
        this.dropDelay = 35;

        this.pints = [];

        this.urinal = this.add.image(0, 0, "background");
        this.urinal.setOrigin(0);
        this.urinal.displayWidth = W;
        this.urinal.displayHeight = H;

        this.scoreText = this.add.text(8, 8, "SCORE: 0", {
            fill: "#ff0000",
            font: "16pt Impact"
        });

        this.highScoreText = this.add.text(W * 0.4, 8, "HIGH SCORE: " + this.highScore, {
            fill: "#ff0000",
            font: "16pt Impact"
        });

        this.roundText = this.add.text(W, 8, "ROUND: " + (this.round + 1), {
            fill: "#ff0000",
            font: "16pt Impact"
        });
        this.roundText.x = W - this.roundText.width * 1.5;

        this.warningText = this.add.text(W / 2, H / 2, "WARNING!!", {
            fill: "#ff0000",
            font: "16pt Impact"
        });
        this.warningText.setOrigin(0.5);
        this.warningText.visible = false;

        this.boo = this.sound.add("boo");
        this.cheer = this.sound.add("cheer");
        this.flush = this.sound.add("flush");
        this.music1 = this.sound.add("music1", { loop: true });
        this.music2 = this.sound.add("music2", { loop: true });
        this.peeMetal = this.sound.add("peeMetal");
        this.peeSplash1 = this.sound.add("peeSplash1");
        this.peeSplash2 = this.sound.add("peeSplash2");
        this.peeWater = this.sound.add("peeWater");
        this.relief1 = this.sound.add("relief1");
        this.relief2 = this.sound.add("relief2");
        this.relief3 = this.sound.add("relief3");
        this.relief4 = this.sound.add("relief4");
        this.shoes1 = this.sound.add("shoes1");
        this.shoes2 = this.sound.add("shoes2");
        this.shoes3 = this.sound.add("shoes3");
        this.zip = this.sound.add("zip");

        this.miss = this.peeMetal;
        this.splashSound = this.peeSplash1;
        this.relief = this.relief1;

        this.add.image(W * 0.85, H * 0.93, "maxxdaddy");

        this.soundButton = this.add.image(50, H - 40, "soundButton").setInteractive();
        this.soundButton.on("pointerdown", this.toggleSound, this);

        this.PDrops = this.physics.add.group({
            key: "PDrop",
            quantity: MAX_PDROPS,
            active: false,
            visible: false
        });

        this.PDrops.children.iterate((child) => {
            child.setOrigin(0.5, 1);
            child.setAlpha(0.5);
            child.setScale(0.5);
            child.lifespan = PEE_LIFESPAN;
            child.body.allowGravity = false;
            child.body.setEnable(false);
        });

        if (!this.anims.exists("drink")) {
            this.anims.create({
                key: "drink",
                frames: this.anims.generateFrameNumbers("pint", {
                    start: 0,
                    end: 12
                }),
                frameRate: 2,
                repeat: 0
            });
        }

        for (let i = 0; i < NUM_ROUNDS; i++) {
            const pint = this.add.sprite(W * 0.27 + i * 50, 70, "pint");
            pint.setOrigin(0.5);
            pint.setScale(0.25);
            pint.visible = false;

            pint.on("animationcomplete", () => {
                this.finishRound();
            });

            this.pints.push(pint);
        }

        this.crosshairs = this.add.sprite(W / 2, H / 2, "crosshairs");
        this.crosshairs.setOrigin(0.5);
        this.crosshairs.visible = false;

        this.peePool = this.add.sprite(W / 2 + 10, H / 2 + 30, "pee");
        this.peePool.setOrigin(0.5);
        this.peePool.alpha = 0.4;
        this.peePool.setScale(0);

        this.pSource = this.add.sprite(W / 2, H, "PDrop").setScale(.2);
        this.pSource.setVisible(false);

        this.target = this.add.image(W * 0.525, H * 0.74, "target");
        this.target.setOrigin(0.5);
        this.target.visible = true;

        this.blurinal = this.add.image(0, 0, "background");
        this.blurinal.setOrigin(0);
        this.blurinal.displayWidth = W;
        this.blurinal.displayHeight = H;
        this.blurinal.alpha = 0.5;
        this.blurinal.visible = false;

        this.start = this.add.image(W * 0.525, H * 0.74, "start");
        this.start.setInteractive();
        this.start.setOrigin(0.5);

        this.start.on("pointerdown", () => {
            this.started = true;
            this.playing = true;
            this.start.visible = false;
            this.playSound(this.zip);
        });
    }

    update(time) {
        if (!this.playing) {
            return;
        }

        if (this.soundOn && !this.music1.isPlaying) {
            this.music1.play();
        }

        this.scoreText.setText("SCORE: " + this.score);
        this.warningText.visible = false;

        if (this.round >= NUM_ROUNDS) {
            this.gameWon = true;
            this.playing = false;
            this.thisOver();
            return;
        }

        if (!this.started) {
            return;
        }

        this.target.visible = true;
        this.crosshairs.visible = true;

        for (let i = 0; i < NUM_ROUNDS; i++) {
            this.pints[i].visible = true;
        }

        if (!this.drinkStarted) {
            this.drinkStarted = true;
            this.pints[this.round].play("drink");
        }

        this.moveCrosshairs(
            this.input.activePointer.x,
            this.input.activePointer.y,
            this.crosshairs
        );

        if (this.round >= NUM_ROUNDS / 2) {
            this.blurinal.visible = true;
            this.moveBlurinal();
        }

        this.updatePDrops();

        if (time > this.nextDropTime) {
            this.fireNextPDrop();
            this.nextDropTime = time + this.dropDelay;
        }
    }

    updatePDrops() {
        this.PDrops.getChildren().forEach((pdrop) => {
            if (!pdrop.active) {
                return;
            }

            pdrop.lifespan--;

            const distance = Math.floor(
                Phaser.Math.Distance.Between(
                    pdrop.x,
                    pdrop.y,
                    this.target.x,
                    this.target.y
                )
            );

            const hitTargetCenter = distance < this.target.displayWidth * 0.2;
            const expired = pdrop.lifespan <= 0;

            if (expired || hitTargetCenter) {
                const isOnTarget = distance < this.target.displayWidth * 0.5;

                if (isOnTarget) {
                    this.score += Math.floor(
                        ((this.target.displayWidth - distance) / 200) * (this.round + 1)
                    );

                    if (this.peePool.scaleX < 1.5) {
                        this.peePool.setScale(this.peePool.scaleX + 0.0003);
                    }

                    this.miss.pause();
                    this.playSound(this.splashSound);
                    this.warningText.visible = false;
                } else {
                    const deadDrop = pdrop.x === 0 && pdrop.y === 0;

                    if (!deadDrop) {
                        this.warningText.visible = true;
                        this.warningLife--;

                        this.splashSound.stop();
                        this.playSound(this.miss);

                        if (this.warningLife <= 0) {
                            this.warningLife = 100;
                            this.warnings++;
                        }

                        if (this.warnings > 5) {
                            this.splashSound.pause();
                            this.miss.pause();

                            if (this.pints[this.round]) {
                                this.pints[this.round].anims.stop();
                            }

                            this.gameWon = false;
                            this.playing = false;
                            this.started = false;
                            this.thisOver();
                        }
                    }
                }

                this.resetPDrop(pdrop);
            }
        });
    }

    fireNextPDrop() {
        const pdrop = this.PDrops.getFirstDead(false);

        if (!pdrop) {
            return;
        }

        const radians = Phaser.Math.Angle.Between(
            this.pSource.x,
            this.pSource.y,
            this.crosshairs.x,
            this.crosshairs.y
        );

        const degrees = Phaser.Math.RadToDeg(radians);

        this.firePDrop(pdrop, degrees);
    }

    firePDrop(pdrop, degrees) {
        pdrop.setActive(true);
        pdrop.setVisible(true);
        pdrop.setPosition(W / 2, H);
        pdrop.setScale(.1);
        pdrop.lifespan = PEE_LIFESPAN;

        pdrop.body.setEnable(true);
        pdrop.body.allowGravity = false;

        this.physics.velocityFromAngle(
            degrees,
            300,
            pdrop.body.velocity
        );

        pdrop.rotation = Phaser.Math.DegToRad(degrees) + Math.PI / 2;
    }

    resetPDrop(pdrop) {
        pdrop.setActive(false);
        pdrop.setVisible(false);
        pdrop.setPosition(0, 0);

        if (pdrop.body) {
            pdrop.body.stop();
            pdrop.body.setEnable(false);
        }
    }

    finishRound() {
        this.started = false;
        this.drinkStarted = false;

        this.start.visible = true;
        this.blurinal.visible = false;

        this.round++;
        this.warnings = 0;
        this.warningLife = 100;

        this.peePool.setScale(0);

        this.splashSound.pause();
        this.playSound(this.relief);
        this.playSound(this.flush);

        this.roundText.setText("ROUND: " + (this.round + 1));
        this.roundText.x = W - this.roundText.width * 1.5;
    }

    playSound(sound) {
        if (this.soundOn && sound) {
            sound.play();
        }
    }

    toggleSound() {
        this.soundOn = !this.soundOn;

        if (!this.soundOn) {
            this.music1.pause();
            this.music2.pause();
        }
    }

    moveBlurinal() {
        const rand = 10 * this.round;

        const value1 = Phaser.Math.Between(-rand, rand);
        const value2 = Phaser.Math.Between(-rand, rand);

        this.blurinal.x = value1 * Math.sin(this.count / 10);
        this.blurinal.y = value2 * Math.cos(this.count / 20);

        this.blurinal.x = Phaser.Math.Clamp(this.blurinal.x, 0, W);
        this.blurinal.y = Phaser.Math.Clamp(this.blurinal.y, 0, H);
    }

    moveCrosshairs(px, py, cross) {
        const rand = 10 * this.round;
        this.count++;

        const value1 = Phaser.Math.Between(-rand, rand);
        const value2 = Phaser.Math.Between(-rand, rand);

        cross.x = value1 * Math.sin(this.count / 10) + px;
        cross.y = value2 * Math.cos(this.count / 20) + py;

        cross.x = Phaser.Math.Clamp(cross.x, 0, W);
        cross.y = Phaser.Math.Clamp(cross.y, 0, H);
    }

    thisOver() {
        this.blurinal.visible = false;
        this.crosshairs.visible = false;
        this.start.visible = false;

        this.music1.pause();
        this.music2.pause();

        const posX = W / 2;
        const posY = H / 2;

        const scoreText = this.add.text(posX, posY - 60, "SCORE: " + this.score, {
            fill: "#FF0000",
            font: "32pt Impact"
        });
        scoreText.setOrigin(0.5);

        if (this.gameWon) {
            this.playSound(this.cheer);

            const winText = this.add.text(posX, posY - 20, "GAME WON", {
                fill: "#FF0000",
                font: "32pt Impact"
            });
            winText.setOrigin(0.5);
        } else {
            this.playSound(this.boo);

            const loseText = this.add.text(posX, posY - 20, "YOU LOSE, SLOB!!", {
                fill: "#FF0000",
                font: "32pt Impact"
            });
            loseText.setOrigin(0.5);
        }

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem(localStorageName, String(this.highScore));
        }

        this.input.once("pointerdown", this.quitGame, this);
    }

    quitGame() {
        this.round = 0;
        this.started = false;
        this.playing = false;
        this.count = 0;
        this.warnings = 0;

        this.scene.start("SplashScene");
    }
}   