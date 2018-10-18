import Player from "../Objects/Player";

var bombs;
var score = 0;
var scoreText;
var gameOver = false;
var restart;

export default class GameScene extends Phaser.Scene {
    //=================================================================================================//
    constructor(test) {
      super({key:'GameScene'});
    }
    
    create() {
        // map
        this.sky = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'sky');
        // platforms (ground)
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        // player
        this.player = new Player(this, this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'dude');
        // player animations
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        // stars
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.05, 0.1));
        });

        // bombs
        bombs = this.physics.add.group();

        // score
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        // controller
        this.cursors = this.input.keyboard.createCursorKeys();

        // collisions
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(bombs, this.platforms);

        // Checks if the player overlaps with any of the stars/bombs, if he does call the function
        this.physics.add.overlap(this.player, this.stars, collectStar, null, this);
        this.physics.add.collider(this.player, bombs, hitBomb, null, this);
    }
    
    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-490);
        }
    }
    //=================================================================================================//
}

function collectStar (player, star) {
    star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    if (this.stars.countActive(true) === 0) {
        //  A new batch of stars to collect
        this.stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });
    }

    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    var bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;

}

function hitBomb (player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
    
    // button
    restart = this.add.text(400, 300, 'Restart', { fill: '#000' });
    restart.setInteractive();
    restart.on('pointerup', () => { gameOver = false; this.scene.restart(); });

}