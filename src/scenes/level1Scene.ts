import Phaser from "phaser";

export default class Level1Scene extends Phaser.Scene {
    constructor() {
        super({ key: "Level1Scene" });
    }

    create() {
        this.add
            .text(75, 100, "Level 1", {
                fontSize: "35px",
                color: "black",
            })
            .setOrigin(-1.7, 0);

        //NOTE: Each block is 32x32px
        //The padding between each block should be at least 26px (works for 9x9 board)
        //For smaller boards the space between can be larger (28px for 7x7, 30px for 5x5)
        // The center of the screen is 400px, so in 5x5 the middle block should have x coord 400px
        //If you count the 26px padding and 16px from the center of each block, the next block in a row would be curr block width + 58
        //It can be assumed that the game board also has 26px padding between the square board and the blocks

        const numRows = 5;
        const numCols = 5;
        const tileSize = 64;
        const tileTypes = [
            "And",
            "Or",
            "Not",
            "True",
            "False",
            "True",
            "False", // add another true and false for now to give these two blocks higher chances of appearing
        ];

        function generateRandomBoard(
            numRows: number,
            numCols: number,
            tileTypes: string[]
        ) {
            //TODO?: create board class
            const board = [];
            for (let row = 0; row < numRows; row++) {
                const newRow = [];
                for (let col = 0; col < numCols; col++) {
                    const randomIndex = Math.floor(
                        Math.random() * tileTypes.length
                    );
                    newRow.push(tileTypes[randomIndex]);
                }
                board.push(newRow);
            }
            return board;
        }

        const board = generateRandomBoard(numRows, numCols, tileTypes);

        // Loop through the board and create sprites for each tile
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                const tileType = board[row][col];
                const xPos = col * tileSize;
                const yPos = row * tileSize;

                const tileSprite = this.add.sprite(xPos, yPos, tileType);
                tileSprite.setOrigin(-8, -6); // not sure if this is the best way to do this yet (just did trial and error to center the board)
                tileSprite.setData("tileType", tileType);
            }
        }
    }

    update() {}
}
