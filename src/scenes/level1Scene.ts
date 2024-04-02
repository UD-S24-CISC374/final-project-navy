import Phaser from "phaser";
import FpsText from "../objects/fpsText";

export default class Level1Scene extends Phaser.Scene {
    fpsText: FpsText;

    constructor() {
        super({ key: "Level1Scene" });
    }

    create() {
        this.fpsText = new FpsText(this);

        const message = `Phaser v${Phaser.VERSION}`;
        this.add
            .text(this.cameras.main.width - 15, 15, message, {
                color: "#000000",
                fontSize: "24px",
            })
            .setOrigin(1, 0);

        this.add
            .text(75, 100, "Level 1", {
                fontSize: "32px",
                color: "black",
            })
            .setOrigin(0.5);

        //NOTE: Each block is 32x32px
        //The padding between each block should be at least 26px (works for 9x9 board)
        //For smaller boards the space between can be larger (28px for 7x7, 30px for 5x5)
        // The center of the screen is 400px, so in 5x5 the middle block should have x coord 400px
        //If you count the 26px padding and 16px from the center of each block, the next block in a row would be curr block width + 58
        //It can be assumed that the game board also has 26px padding between the square board and the blocks
        //My code below shows an example of how the board would be set up but with I's insetad of tiles

        //xCoord is calculated by ensuring that the middle tile is exactly at 400px
        let xCoord = 226;
        //yCoord is changeable based on size of board. For 5x5, it can be = 100 or some other value
        let yCoord = 150;
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                this.add
                    .text(xCoord + 58, yCoord + 58, "I", {
                        fontSize: "32px",
                        color: "black",
                    })
                    //ensres that all spacing/coordinate stuff is done from the center of the item
                    .setOrigin(0.5);
                xCoord += 58;
            }
            yCoord += 58;
            xCoord = 226;
        }
    }

    update() {
        this.fpsText.update();
    }
}
