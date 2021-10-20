import platformUrl from "./public/sprites/ground_grass.png";
import playerStandUrl from "./public/sprites/player/bunny1_stand.png";
import playerJumpUrl from "./public/sprites/player/bunny1_jump.png";
import leftArrowUrl from "./public/sprites/red_sliderLeft.png";
import rightArrowUrl from "./public/sprites/red_sliderRight.png";
import carrotUrl from "./public/sprites/carrot.png";
import Carrot from "./Carrot";

export default class Game extends Phaser.Scene {
  constructor() {
    super("game"); // scene key, every scene should have a unique key

    this.player = null;
    this.platforms = null;
    this.cursors;
    this.carrots;
    this.carrotsCollected = 0;
    this.carrotsCollectedText = null;
    this.pressedLeft = false;
    this.pressedRight = false;
  }

  init() {
    console.log("init-game");

    // 4 arrow keys
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  preload() {
    console.log("preload");

    this.load.image("leftArrow", leftArrowUrl);
    this.load.image("rightArrow", rightArrowUrl);
    this.load.image("platform", platformUrl);
    this.load.image("bunny-stand", playerStandUrl);
    this.load.image("bunny-jump", playerJumpUrl);
    this.load.image("carrot", carrotUrl);
  }

  create() {
    console.log("create");

    //movement for mobile
    if (!this.sys.game.device.os.desktop) {
      this.onClickMovement();
    }
    //! can only be initiated by user gesture
    //this.scale.startFullscreen();

    this.platforms = this.physics.add.staticGroup();

    for (let i = 0; i < 5; i++) {
      let _x = Phaser.Math.Between(80, 400);
      let _y = 150 * i;

      /**@type {Phaser.Physics.Arcade.Sprite} */
      let _platform = this.platforms.create(_x, _y, "platform");
      _platform.scale = 0.5;
      let _body = _platform.body;
      _body.updateFromGameObject(); // refresh
    }

    this.player = this.physics.add.image(240, 320, "bunny-stand").setScale(0.5);
    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.left = false;
    this.player.body.checkCollision.right = false;

    this.carrots = this.physics.add.group({
      classType: Carrot,
    });

    // collision between object1 and object2
    this.physics.add.collider(this.platforms, this.player);
    this.physics.add.collider(this.platforms, this.carrots);

    this.physics.add.overlap(
      this.player,
      this.carrots,
      this.onOverlapCarrot, //callback on overlap
      undefined,
      this
    );

    //camera follow and other settings
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setDeadzone(this.scale.width * 1.5);

    //HUD
    const style = { color: "#000", fontSize: 24 };
    this.carrotsCollectedText = this.add
      .text(240, 10, "Carrots: 0", style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0);
  } // end

  onClickMovement() {
    let leftArrow = this.add
      .image(50, this.cameras.main.height - 50, "leftArrow")
      .setOrigin(0.5)
      .setDepth(10)
      .setScale(1.5)
      .setInteractive()
      .setScrollFactor(0);

    let rightArrow = this.add
      .image(
        this.cameras.main.width - 50,
        this.cameras.main.height - 50,
        "rightArrow"
      )
      .setOrigin(0.5)
      .setDepth(10)
      .setScale(1.5)
      .setInteractive()
      .setScrollFactor(0);

    leftArrow.on(
      "pointerdown",
      () => {
        this.pressedLeft = true;
        //console.log("left arrow");
      },
      this
    );

    rightArrow.on(
      "pointerdown",
      () => {
        this.pressedRight = true;
        //console.log("right arrow");
      },
      this
    );

    this.input.on(
      "pointerup",
      () => {
        //console.log("released");
        this.pressedLeft = false;
        this.pressedRight = false;
      },
      this
    );
  }

  //time and deltaTime
  update(t, dt) {
    let _touchingDown = this.player.body.touching.down;
    if (_touchingDown) {
      //this.player.setTexture("bunny-stand");
      this.player.setVelocityY(-500);
    } else {
      //this.player.setTexture("bunny-jump");
    }

    //movement
    if (this.cursors.left.isDown || (this.pressedLeft && !_touchingDown)) {
      this.player.setVelocityX(-200);
    } else if (
      this.cursors.right.isDown ||
      (this.pressedRight && !_touchingDown)
    ) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }

    //console.log(this.cameras.main.scrollY);

    this.platforms.children.iterate((child) => {
      const platform = child;
      const scrollY = this.cameras.main.scrollY;
      if (platform.y >= scrollY + 700) {
        platform.y = scrollY - Phaser.Math.Between(100, 100);
        platform.body.updateFromGameObject();
        //console.log(platform.y);
        //create a carrod above the platform
        this.addCarrotAbove(platform);
      }
    });

    this.horinzontalWrap(this.player);

    const bottomPlatform = this.findBottomMostPlatform();
    if (this.player.y > bottomPlatform.y + 200) {
      console.log("game over");
      this.scene.start("gameover");
    }
  } //end

  /**@type {Phaser.GameObjects.Sprite} */

  horinzontalWrap(sprite) {
    let halfWidth = sprite.displayWidth * 0.5;
    let gameWidth = this.scale.width;

    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth;
    } else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth;
    }
  }

  /**@type {Phaser.GameObjects.Sprite} sprite*/
  addCarrotAbove(sprite) {
    //console.log('add carrot on above');

    const y = sprite.y - sprite.displayHeight;
    // get an object from group
    const carrot = this.carrots.get(sprite.x, y, "carrot");
    carrot.setActive(true);
    carrot.setVisible(true);

    // instantiate carrot on scene
    this.add.existing(carrot);
    //update physics body size
    carrot.body.setSize(carrot.width, carrot.height);
    this.physics.world.enable(carrot);

    return carrot;
  }

  onOverlapCarrot(_player, _carrot) {
    console.log("overlap carrot");
    //hide and kill
    this.carrots.killAndHide(_carrot);
    //disable from physics simulation
    this.physics.world.disableBody(_carrot.body);

    this.carrotsCollected += 1;
    let value = `Carrots : ${this.carrotsCollected}`;
    this.carrotsCollectedText.text = value;
  }

  findBottomMostPlatform() {
    //get all children
    const platforms = this.platforms.getChildren();
    let bottomPlatform = platforms[0];

    for (let i = 0; i < platforms.length; i++) {
      const platform = platforms[i];

      //discard any platfroms that are above current
      if (platform.y < bottomPlatform.y) continue;

      bottomPlatform = platform;
    }

    //console.log(platforms[0].y)
    return bottomPlatform;
  }
}
