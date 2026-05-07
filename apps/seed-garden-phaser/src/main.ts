import * as Phaser from "phaser";
import "./styles.css";

class BoundaryScene extends Phaser.Scene {
  constructor() {
    super("BoundaryScene");
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor("#dce8c0");

    this.add
      .text(width / 2, height / 2 - 34, "Phaser 신규 정원", {
        color: "#203b2f",
        fontFamily: "system-ui, sans-serif",
        fontSize: "28px",
        fontStyle: "700"
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 8, "#433 Stage 1 구현 대기 중", {
        color: "#45664f",
        fontFamily: "system-ui, sans-serif",
        fontSize: "16px"
      })
      .setOrigin(0.5);
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game-root",
  backgroundColor: "#dce8c0",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 393,
    height: 852
  },
  scene: BoundaryScene
});
