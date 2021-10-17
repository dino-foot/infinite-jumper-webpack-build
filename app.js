import Phaser from "phaser";
import Game from "./Game";
import GameOver from "./GameOver";

const config = {
  width: 480,
  height: 640,
  type: Phaser.AUTO,
  backgroundColor: "87ceeb",
  audio: {
    disableWebAudio: true,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: "game",
  },
  physics: {
    default: "arcade",
    arcade: {
      fps: 60,
      gravity: { y: 500 },
      debug: false,
    },
  },
  scene: [Game, GameOver],
};

const game = new Phaser.Game(config);
