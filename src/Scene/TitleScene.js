export default class TitleScene extends Phaser.Scene {
//=================================================================================================//
constructor(test) {
  super({key:'TitleScene'});
}

create() {
  this.sky = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'sky');
  this.logo = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'logo');
  this.cameras.main.fadeIn(200);
  this.load.off('progress', this.goToGame, this);

  this.tweens.add({
    targets: this.logo,
    scaleY: 1.2,
    scaleX: 1.2,
    duration: 1400,
    ease: 'EaseQuadOut',
    onComplete: ()=> {this.scene.switch('GameScene')},
    callbackScope: this,
  });
}
//=================================================================================================//
}
