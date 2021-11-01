import Phaser from "phaser";
import Game from "./Game";
import GameOver from "./GameOver";

const config = {
  type: Phaser.AUTO,
  backgroundColor: "87ceeb",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: "game",
    width: 480,
    height: 640,
  },
  physics: {
    default: "arcade",
    arcade: {
      fps: 60,
      gravity: { y: 500 },
      debug: true,
    },
  },
  scene: [Game, GameOver],
};

const game = new Phaser.Game(config);
