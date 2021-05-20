let playing = true;
let score;
let scoreText;
let roundText;
let warningText;
let PDrops;
let emitter;
let gameLost;
let gameWon;
let crosshairs;
const MAX_PDROPS = 1000;
let round = 0;
let pint = [];
let started = false;
let start;
let pSource;
let count = 0;
let target;
let pee;
const PEE_LIFESPAN = 750;
const NUM_ROUNDS = 8;
let warninglife = 100;
let warnings = 1;
let soundButton;
let soundOn = true;
let blurinal;
let startGame = false;

//SOUNDS
var boo;
var cheer;
var flush
var music1;
var music2;
var peeMetal;
var peeSplash1;
var peeSplash2;
var peeWater;
var relief1;
var relief2;
var relief3;
var relief4;
var shoes1;
var shoes2;
var zip;


// AimGame = {

//     /* Here we've just got some global level vars that persist regardless of State swaps */
//     score: 0,

//     /* If the music in your game needs to play through-out a few State swaps, then you could reference it here */
//     music: null,

//     /* Your game can check AimGame.orientated in internal loops to know if it should pause or not */
//     orientated: false

// };

// AimGame.Boot = function (game) {
// };

// AimGame.Boot.prototype = {

//     preload: function () {

//         let load.image('preloaderBar', 'assets/images/preload.png');

//     },

//     create: function () {

//         let input.maxPointers = 1;
//         // let stage.disableVisibilityChange = true;

//         if (let game.device.desktop)
//         {
//             let scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
//             let scale.minWidth = 256;
//             let scale.minHeight = 196;
//             let scale.maxWidth = 512;
//             let scale.maxHeight = 384;
//             let scale.pageAlignHorizontally = true;
//             let scale.pageAlignVertically = true;
//             let scale.setScreenSize(true);
//         }
//         else
//         {
//             let scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
//             let scale.minWidth = 480;
//             let scale.minHeight = 260;
//             let scale.maxWidth = 1024;
//             let scale.maxHeight = 768;
//             let scale.pageAlignHorizontally = true;
//             let scale.pageAlignVertically = true;
//             let scale.forceOrientation(true, false);
//             let scale.setResizeCallback(let gameResized, this);
//             let scale.enterIncorrectOrientation.add(let enterIncorrectOrientation, this);
//             let scale.leaveIncorrectOrientation.add(let leaveIncorrectOrientation, this);
//             let scale.setScreenSize(true);
//         }

//         let state.start('Preload');

//     },

//     gameResized: function (width, height) {
//     },

//     enterIncorrectOrientation: function () {

//         AimGame.orientated = false;

//         document.getElementById('orientation').style.display = 'block';

//     },

//     leaveIncorrectOrientation: function () {

//         AimGame.orientated = true;

//         document.getElementById('orientation').style.display = 'none';

//     }

// };
