import { W, H } from "./config.js";
export class SplashScene extends Phaser.Scene {
    constructor() {
        super("SplashScene");

    }
    preload() {
        this.load.image('splash', 'assets/images/FubarMissleLogo.jpg');
        this.load.image('title', 'assets/images/title.png');
        this.load.image('startButton', 'assets/images/startbutton2.png');

    }
    create() {
        this.splash = this.add.image(0, 0, 'splash');
        this.splash.setOrigin(0);
        this.splash.displayWidth = W;
        this.splash.displayHeight = H;


        this.title = this.add.image(W / 2, H / 2, 'title');
        this.title.setOrigin(0.5);
        this.title.displayWidth = W * .8;
        this.title.displayHeight = H * .8;

        this.startButton = this.add.image(W * .85, H * .95, 'startButton')
            .setInteractive()
            .setOrigin(0.5)
            .setScale(.5);
        this.startButton.on('pointerdown', () => {
            this.scene.start("GameScene");
        });
        this.maxxdaddy = this.add.image(0, this.height * 0.92, 'maxxdaddy');
        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.start("GameScene");
        });


    }

}