import Phaser from "phaser";
import Game from "./game";
import { GameOver_Scene } from "./GameOver";

const config = {
  width: 480,
  height: 640,
  type: Phaser.AUTO,
  audio: {
    disableWebAudio: true,
  },
  scale: {
    parent: "game",
    mode: Phaser.Scale.FIT,
    center: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      fps: 60,
      gravity: { y: 500 },
      debug: false,
    },
  },
  scene: [Game, GameOver_Scene],
};

const game = new Phaser.Game(config);
