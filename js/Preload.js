
function preload() {
  game.load.onLoadStart.add(loadStart, this);
  game.load.onFileComplete.add(fileComplete, this);
  game.load.onLoadComplete.add(loadComplete, this);
  loadText = game.add.text(32, 32, '', {
    fill: '#ffffff',
  });
  //2862 x 2506
  //6 x 5
  //477 x 358
  this.load.image('startButton', 'assets/images/click-here-button.png');
  this.load.image('crosshairs', 'assets/images/crosshairs.png');
  this.load.image('bomb', 'assets/images/bomb.png');
  this.load.image('background', 'assets/images/urinal.jpg');
  this.load.image('maxxdaddy', 'assets/images/maxxdaddy.gif');
  this.load.spritesheet('particles', 'assets/images/particles.png', 2, 2);
  this.load.image('pee', 'assets/images/pee.png');
  this.load.image('PDrop', 'assets/images/PDrop2.png');
  this.load.spritesheet('pints', 'assets/images/pints.png', 33, 57, 13);
  this.load.spritesheet('peeStream', 'assets/images/peesheet.png', 477, 358);
  this.load.image('soundButton', 'assets/images/soundButton.png');
  this.load.image('splash', 'assets/images/FubarMissleLogo.jpg');
  this.load.image('title', 'assets/images/title.png');
  this.load.image('start', 'assets/images/startbutton.png');
  this.load.image('target', 'assets/images/target.png');
 
  this.load.audio('boo', 'assets/sounds/mp3/boo.mp3');
  this.load.audio('cheer', 'assets/sounds/mp3/cheer.mp3');
  this.load.audio('flush', 'assets/sounds/mp3/flush.mp3');
  this.load.audio('music1', 'assets/sounds/mp3/music-1.mp3');
  this.load.audio('music2', 'assets/sounds/mp3/music-2.mp3');
  this.load.audio('peeMetal', 'assets/sounds/mp3/peeMetal.mp3');
  this.load.audio('peeSplash1', 'assets/sounds/mp3/peeSplash-1.mp3');
  this.load.audio('peeSplash2', 'assets/sounds/mp3/peeSplash-2.mp3');
  this.load.audio('peeWater', 'assets/sounds/mp3/peeWater.mp3');
  this.load.audio('relief1', 'assets/sounds/mp3/relief-1.mp3');
  this.load.audio('relief2', 'assets/sounds/mp3/relief-2.mp3');
  this.load.audio('relief3', 'assets/sounds/mp3/relief-3.mp3');
  this.load.audio('relief4', 'assets/sounds/mp3/relief-4.mp3');
  this.load.audio('shoes1', 'assets/sounds/mp3/shoes-1.mp3');
  this.load.audio('shoes2', 'assets/sounds/mp3/shoes-2.mp3');
  this.load.audio('shoes3', 'assets/sounds/mp3/shoes-3.mp3');
  this.load.audio('zip', 'assets/sounds/mp3/zip.mp3');
 
}

function loadStart() {
  loadText.setText('Loading ...');
}

function loadComplete() {
  loadText.setText('Load Complete');
  loadText.destroy();
}
//	This callback is sent the following parameters:
function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {

  loadText.setText("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);


}