import {
    W,
    H,
    NUM_ROUNDS,
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
        this.nextStreamHitTime = 0;
        this.streamHitDelay = 35;

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
        this.peeWater = this.sound.add("peeWater", { loop: true, volume: 0.45 });
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
        this.splashSounds = [this.peeSplash1, this.peeSplash2];
        this.reliefSounds = [this.relief1, this.relief2, this.relief3, this.relief4];
        this.shoeSounds = [this.shoes1, this.shoes2, this.shoes3];
        this.streamWasOnTarget = null;

        this.add.image(W * 0.85, H * 0.93, "maxxdaddy");

        this.soundButton = this.add.image(50, H - 40, "soundButton").setInteractive();
        this.soundButton.on("pointerdown", this.toggleSound, this);

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

        this.peePool = this.add.sprite(W * 0.525, H * 0.74, "pee");
        this.peePool.setOrigin(0.5);
        this.peePool.alpha = 0.4;
        this.peePool.setScale(0);

        this.pSource = { x: W / 2, y: H };

        if (!this.anims.exists("peeStreamFlow")) {
            this.anims.create({
                key: "peeStreamFlow",
                frames: this.anims.generateFrameNumbers("peeStream", {
                    start: 0,
                    end: 41
                }),
                frameRate: 20,
                repeat: -1
            });
        }

        // The source is anchored to the bottom of the stream artwork. Scaling the
        // sprite vertically lets it continuously reach the moving crosshairs.
        this.peeStream = this.add.sprite(this.pSource.x, this.pSource.y, "peeStream");
        this.peeStream.setOrigin(0.5, 1);
        this.peeStream.setAlpha(0.65);
        this.peeStream.setVisible(false);
        this.peeStream.setDepth(1);
        this.peeStream.play("peeStreamFlow");
        this.crosshairs.setDepth(2);

        this.target = this.add.image(W * 0.525, H * 0.74, "target");
        this.target.setOrigin(0.5);
        this.target.visible = true;

        this.blurinal = this.add.image(0, 0, "background");
        this.blurinal.setOrigin(0);
        this.blurinalMargin = 30;
        this.blurinal.displayWidth = W + this.blurinalMargin * 2;
        this.blurinal.displayHeight = H + this.blurinalMargin * 2;
        this.blurinal.setPosition(-this.blurinalMargin, -this.blurinalMargin);
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
            this.playSound(this.peeWater);
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

        this.updatePeeStream();

        if (time > this.nextStreamHitTime) {
            this.updateStreamHit();
            this.nextStreamHitTime = time + this.streamHitDelay;
        }
    }

    updatePeeStream() {
        const dx = this.crosshairs.x - this.pSource.x;
        const dy = this.crosshairs.y - this.pSource.y;
        const distance = Math.hypot(dx, dy);

        this.peeStream.setPosition(this.pSource.x, this.pSource.y);
        this.peeStream.setRotation(Math.atan2(dy, dx) + Math.PI / 2);
        this.peeStream.setScale(0.22, distance / this.peeStream.height);
        this.peeStream.setVisible(true);
    }

    updateStreamHit() {
        const distance = Phaser.Math.Distance.Between(
            this.crosshairs.x,
            this.crosshairs.y,
            this.target.x,
            this.target.y
        );
        const isOnTarget = distance < this.target.displayWidth * 0.5;

        if (isOnTarget) {
            this.score += Math.max(
                1,
                Math.floor(
                    ((this.target.displayWidth - distance) / 200) * (this.round + 1)
                )
            );

            if (this.peePool.scaleX < 1.5) {
                this.peePool.setScale(Math.min(1.5, this.peePool.scaleX + 0.01));
            }

            this.miss.stop();
            if (this.streamWasOnTarget !== true) {
                this.splashSound = Phaser.Math.RND.pick(this.splashSounds);
                this.playSound(this.splashSound);
            }
            this.streamWasOnTarget = true;
            this.warningText.visible = false;
            this.burstPeeParticles(this.crosshairs.x, this.crosshairs.y);
            return;
        }

        this.warningText.visible = true;
        this.warningLife--;

        if (this.streamWasOnTarget !== false) {
            this.splashSounds.forEach((sound) => sound.stop());
            this.playSound(this.miss);
        }
        this.streamWasOnTarget = false;

        if (this.warningLife <= 0) {
            this.warningLife = 100;
            this.warnings++;
            this.playSound(Phaser.Math.RND.pick(this.shoeSounds));

            if (this.warnings > 5) {
                this.splashSound.pause();
                this.miss.pause();
                this.pints[this.round]?.anims.stop();
                this.gameWon = false;
                this.playing = false;
                this.started = false;
                this.thisOver();
            }
        }
    }

    burstPeeParticles(x, y) {
        for (let i = 0; i < 10; i++) {
            const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
            const distance = Phaser.Math.Between(28, 75);
            const dot = this.add.circle(
                x,
                y,
                Phaser.Math.Between(2, 4),
                Phaser.Math.RND.pick([0xffd000, 0xffea36, 0xffff8a]),
                1
            );
            dot.setDepth(3);
            dot.setBlendMode(Phaser.BlendModes.ADD);

            this.tweens.add({
                targets: dot,
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance + Phaser.Math.Between(4, 16),
                alpha: 0,
                scale: 0.35,
                duration: Phaser.Math.Between(380, 650),
                ease: "Quad.easeOut",
                onComplete: () => dot.destroy()
            });
        }
    }

    finishRound() {
        this.started = false;
        this.drinkStarted = false;

        this.start.visible = true;
        this.blurinal.visible = false;
        this.warningText.visible = false;

        this.round++;
        this.warnings = 0;
        this.warningLife = 100;
        this.streamWasOnTarget = null;

        this.peePool.setScale(0);
        this.peeStream.setVisible(false);

        this.peeWater.stop();
        this.splashSounds.forEach((sound) => sound.stop());
        this.relief = Phaser.Math.RND.pick(this.reliefSounds);
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
        this.sound.mute = !this.soundOn;

        if (this.soundOn && this.started && !this.peeWater.isPlaying) {
            this.peeWater.play();
        }
    }

    moveBlurinal() {
        const amplitude = 3 + this.round * 1.5;
        const offsetX =
            Math.sin(this.count * 1.1) * amplitude +
            Math.sin(this.count * 0.41 + 0.8) * amplitude * 0.35;
        const offsetY =
            Math.cos(this.count * 0.9) * amplitude +
            Math.sin(this.count * 0.53 + 1.7) * amplitude * 0.4;

        this.blurinal.x = -this.blurinalMargin + offsetX;
        this.blurinal.y = -this.blurinalMargin + offsetY;
    }

    moveCrosshairs(px, py, cross) {
        // Layered sine waves produce a broad, natural sway without choosing a
        // new random direction every frame. Later rounds increase the drift.
        const amplitude = 18 + this.round * 7;
        this.count += 0.045;

        const offsetX =
            Math.sin(this.count * 1.35) * amplitude +
            Math.sin(this.count * 0.47 + 1.2) * amplitude * 0.35;
        const offsetY =
            Math.cos(this.count * 1.05) * amplitude +
            Math.sin(this.count * 0.61 + 2.4) * amplitude * 0.4;

        cross.x = px + offsetX;
        cross.y = py + offsetY;

        cross.x = Phaser.Math.Clamp(cross.x, 0, W);
        cross.y = Phaser.Math.Clamp(cross.y, 0, H);
    }

    thisOver() {
        this.blurinal.visible = false;
        this.crosshairs.visible = false;
        this.start.visible = false;
        this.peeStream.setVisible(false);
        this.peeWater.stop();
        this.splashSounds.forEach((sound) => sound.stop());
        this.miss.stop();

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
