export default class Player extends Phaser.Physics.Arcade.Sprite  {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        //this.scene.physics.add.sprite(x, y, texture);
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);

        this.setBounce(0.2);
        this.setCollideWorldBounds(true);
        this.body.setGravityY(300);
    }
}