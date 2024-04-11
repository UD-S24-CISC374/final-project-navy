import Phaser from "phaser";
import { Button } from "../objects/button";

export default class Level1PlayScene extends Phaser.Scene {
    constructor() {
        super({ key: "Level1PlayScene" });
    }

    //MATCHCODE
    private board: string[][];

    private tilesGroup: Phaser.GameObjects.Group;
    private selectedTile: Phaser.GameObjects.Sprite;
    private selectedTileIndex: number;
    private keyW?: Phaser.Input.Keyboard.Key;
    private keyA?: Phaser.Input.Keyboard.Key;
    private keyS?: Phaser.Input.Keyboard.Key;
    private keyD?: Phaser.Input.Keyboard.Key;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private prevKeyState: { [key: string]: boolean } = {};

    private rowSelector: Phaser.GameObjects.Image;
    private colSelector: Phaser.GameObjects.Image;
    private tileTypes: string[];

    create() {
        this.rowSelector = this.add.image(400, 220, "Row Selector");
        this.colSelector = this.add.image(320, 300, "Col Selector");
        this.rowSelector.setVisible(false);
        this.colSelector.setVisible(false);

        // back to levels button
        new Button(
            this,
            50,
            35,
            "Back to Levels",
            {
                fontSize: "25px",
                color: "red",
            },
            () => this.scene.start("SelectScene")
        );

        this.add.text(330, 100, "Level 1", {
            fontSize: "35px",
            color: "black",
        });

        const numRows = 5;
        const numCols = 5;
        this.tileTypes = ["And", "Or", "Not", "True", "False", "True", "False"];

        function generateRandomBoard(
            numRows: number,
            numCols: number,
            tileTypes: string[]
        ) {
            //TODO?: create board class and make smarter generations
            // Also TODO: make it so same board remains when exiting level
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

        //MATCHCODE
        this.board = generateRandomBoard(numRows, numCols, this.tileTypes);
        //this would replace line 90 and places using "board" would need to then be "this.board"

        //const board = generateRandomBoard(numRows, numCols, tileTypes);
        // These coordinates are for 5x5 board to ensre it's centered
        let startx = 280;
        let starty = 180;

        // These values will be updated in loop
        let newx = startx;
        let newy = starty;

        this.tilesGroup = this.add.group();

        // Loops through board and creates sprites for each tile
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                const tileType = this.board[row][col];
                // the value being added to newx/y depends on board size
                const xPos = newx + 40;
                const yPos = newy + 40;

                const tileSprite = this.add.sprite(xPos, yPos, tileType);
                tileSprite.setOrigin(0.5);
                tileSprite.setData("tileType", tileType);

                this.tilesGroup.add(tileSprite);
                newx += 40;
            }
            // Have to reset newx so row below is at same x coordinate as one above
            newx = startx;
            newy += 40;
        }

        //Selected tile (initially the one at row 0 col 0)
        this.selectedTileIndex = 0;

        this.selectedTile =
            this.tilesGroup.getChildren()[0] as Phaser.GameObjects.Sprite;

        // Highlights selected tile
        this.selectedTile.setTint(0xff0000);
        this.rowSelector.setPosition(400, this.selectedTile.y);
        this.colSelector.setPosition(this.selectedTile.x, 300);
        this.rowSelector.setVisible(true);
        this.colSelector.setVisible(true);

        // Enables WASD key input
        this.keyW = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.W
        );
        this.keyA = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.A
        );
        this.keyS = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.S
        );
        this.keyD = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.D
        );

        this.cursors = this.input.keyboard?.createCursorKeys();
        this.evaluateRowsAndColumns();
    }

    update() {
        // Had to check key state otherwise clicking once would make it move like 3 or 5 blocks
        // Has to do with update being called so many times per second, need a workaround

        //TODO: Make it so holding down a key moves you multiple times instead of pressing each time
        if (this.keyW?.isDown && !this.prevKeyState["W"]) {
            this.moveSelection(0, -1);
        } else if (this.keyS?.isDown && !this.prevKeyState["S"]) {
            this.moveSelection(0, 1);
        } else if (this.keyA?.isDown && !this.prevKeyState["A"]) {
            this.moveSelection(-1, 0);
        } else if (this.keyD?.isDown && !this.prevKeyState["D"]) {
            this.moveSelection(1, 0);
        }

        // Update previous key state so it resets
        this.prevKeyState["W"] = this.keyW?.isDown || false;
        this.prevKeyState["S"] = this.keyS?.isDown || false;
        this.prevKeyState["A"] = this.keyA?.isDown || false;
        this.prevKeyState["D"] = this.keyD?.isDown || false;

        if (this.cursors?.right.isDown && !this.prevKeyState["right"]) {
            this.shiftValues(-1, 0);
            this.evaluateRowsAndColumns();
        } else if (this.cursors?.left.isDown && !this.prevKeyState["left"]) {
            this.shiftValues(1, 0);
            this.evaluateRowsAndColumns();
        } else if (this.cursors?.down.isDown && !this.prevKeyState["down"]) {
            this.shiftValues(0, -1);
            this.evaluateRowsAndColumns();
        } else if (this.cursors?.up.isDown && !this.prevKeyState["up"]) {
            this.shiftValues(0, 1);
            this.evaluateRowsAndColumns();
        }

        this.prevKeyState["right"] = this.cursors?.right.isDown || false;
        this.prevKeyState["left"] = this.cursors?.left.isDown || false;
        this.prevKeyState["down"] = this.cursors?.down.isDown || false;
        this.prevKeyState["up"] = this.cursors?.up.isDown || false;
    }

    evaluateRowsAndColumns() {
        // Evaluate all rows
        const numRows = 5;
        for (let row = 0; row < numRows; row++) {
            if (this.evaluateExpression(this.board[row])) {
                console.log("Found a match in row", row);
                this.removeRow(row);
                //this.moveBlocksDown(row); Maybe use a diff function for moving blocks down?
            }
        }

        // Evaluate all columns
        const numCols = 5;
        for (let col = 0; col < numCols; col++) {
            const column = this.board.map((row) => row[col]);
            if (this.evaluateExpression(column)) {
                console.log("Found a match in column", col);
                this.removeColumn(col);
            }
        }
    }
    //---------------------------------------------------------------------
    // THIS CODE SEGMENT DEALS WITH SHIFTING BLOCKS WHEN MATCHES ARE MADE
    removeRow(row: number) {
        const numCols = this.board[0].length;
        const tiles =
            this.tilesGroup.getChildren() as Phaser.GameObjects.Sprite[];

        // Shift the rows down in the data and update their corresponding sprites.
        for (let i = row; i > 0; i--) {
            this.board[i] = this.board[i - 1].slice(); // Getting row above
            for (let col = 0; col < numCols; col++) {
                const currentSpriteIndex = i * numCols + col;
                const aboveSpriteIndex = (i - 1) * numCols + col;
                tiles[currentSpriteIndex].setData(
                    "tileType",
                    tiles[aboveSpriteIndex].getData("tileType")
                );
                tiles[currentSpriteIndex].setTexture(
                    tiles[aboveSpriteIndex].getData("tileType")
                );
            }
        }

        // Generate a new random top row for the board data
        this.board[0] = [];
        for (let col = 0; col < numCols; col++) {
            const randomIndex = Math.floor(
                Math.random() * this.tileTypes.length
            );
            this.board[0][col] = this.tileTypes[randomIndex];

            // Update the data and texture for the new top row
            const tileSprite = tiles[col];
            tileSprite.setData("tileType", this.tileTypes[randomIndex]);
            tileSprite.setTexture(this.tileTypes[randomIndex]);
        }
    }

    removeColumn(col: number) {
        const numCols = this.board[0].length;

        // Remove the column from the board data
        for (let row = 0; row < this.board.length; row++) {
            this.board[row].splice(col, 1);
        }

        // Update the data and textures of the sprites in the matched column
        const tiles =
            this.tilesGroup.getChildren() as Phaser.GameObjects.Sprite[];
        for (let row = 0; row < this.board.length; row++) {
            const spriteIndex = row * numCols + col;
            const tileSprite = tiles[spriteIndex];

            const randomIndex = Math.floor(
                Math.random() * this.tileTypes.length
            );
            const newTileType = this.tileTypes[randomIndex];

            tileSprite.setData("tileType", newTileType);
            tileSprite.setTexture(newTileType);
        }
    }

    // ----------------------------------------------------------------
    shiftValues(deltaX: number, deltaY: number) {
        const numRows = 5;
        const numCols = 5;
        const totalTiles = numRows * numCols;

        const tiles =
            this.tilesGroup.getChildren() as Phaser.GameObjects.Sprite[];

        const currentIndex = this.selectedTileIndex;
        const selectedRow = Math.floor(currentIndex / numCols);
        const selectedCol = currentIndex % numCols;

        const newTileTypes = [];

        // Shift values in the row
        if (deltaX !== 0) {
            for (let col = 0; col < numCols; col++) {
                const tileIndex = selectedRow * numCols + col;
                const shiftedIndex =
                    ((tileIndex + deltaX + numCols) % numCols) +
                    selectedRow * numCols;
                const tileType = tiles[shiftedIndex].getData("tileType");
                newTileTypes.push(tileType);
            }
            // Update tiles in the row with new values
            for (let col = 0; col < numCols; col++) {
                const tileIndex = selectedRow * numCols + col;
                tiles[tileIndex].setData("tileType", newTileTypes[col]);
                tiles[tileIndex].setTexture(newTileTypes[col]);
            }
            // Update the board with new tile types
            this.board[selectedRow] = newTileTypes;
        }

        // Shift values in the column
        if (deltaY !== 0) {
            for (let row = 0; row < numRows; row++) {
                const tileIndex = row * numCols + selectedCol;
                const shiftedIndex =
                    (tileIndex + deltaY * numCols + totalTiles) % totalTiles;
                const tileType = tiles[shiftedIndex].getData("tileType");
                newTileTypes.push(tileType);
            }
            // Update tiles in the column with new values
            for (let row = 0; row < numRows; row++) {
                const tileIndex = row * numCols + selectedCol;
                tiles[tileIndex].setData("tileType", newTileTypes[row]);
                tiles[tileIndex].setTexture(newTileTypes[row]);
            }
            // Update the board with new tile types
            for (let row = 0; row < numRows; row++) {
                this.board[row][selectedCol] = newTileTypes[row];
            }
        }
    }

    //TODO: Make moveSelection its own file that can be called for diff levels
    moveSelection(deltaX: number, deltaY: number) {
        const numRows = 5;
        const numCols = 5;
        const totalTiles = numRows * numCols;

        const currentIndex = this.selectedTileIndex;
        let newIndex = currentIndex + deltaX + deltaY * numCols;

        // Wrap horizontally
        if (deltaX !== 0) {
            newIndex =
                ((currentIndex + deltaX + numCols) % numCols) +
                Math.floor(currentIndex / numCols) * numCols;
        }

        // Wrap vertically
        if (deltaY !== 0) {
            newIndex =
                (currentIndex + totalTiles + deltaY * numCols) % totalTiles;
        }

        // make sure newIndex doesn't go out of range
        // clamp function is pretty cool haven't used it till now
        newIndex = Phaser.Math.Clamp(newIndex, 0, totalTiles - 1);

        // Remove tint from previously selected tile
        this.selectedTile.clearTint();

        // Update selected tile index, cast GameObject to Sprite
        this.selectedTileIndex = newIndex;
        this.selectedTile = this.tilesGroup.getChildren()[
            newIndex
        ] as Phaser.GameObjects.Sprite;

        // Highlight newly selected tile (red tint)
        this.selectedTile.setTint(0xff0000);
        this.rowSelector.setPosition(400, this.selectedTile.y);
        this.colSelector.setPosition(this.selectedTile.x, 300);
        this.rowSelector.setVisible(true);
        this.colSelector.setVisible(true);
    }

    //MATCHCODE

    logicalOperators: { [key: string]: string } = {
        And: "&&",
        Or: "||",
        Not: "!",
        True: "true",
        False: "false",
    };

    evaluateExpression(expression: string[]): boolean {
        // Check if the expression starts or ends with invalid operators
        const firstElement = expression[0];
        const lastElement = expression[expression.length - 1];

        if (
            !(
                firstElement === "True" ||
                firstElement === "False" ||
                firstElement === "Not"
            )
        ) {
            //console.error("Invalid expression: Starts with invalid operator");
            return false;
        }

        if (
            lastElement === "Not" ||
            lastElement === "And" ||
            lastElement === "Or"
        ) {
            //console.error("Invalid expression: Ends with invalid operator");
            return false;
        }

        // Check for consecutive operands and operators
        for (let i = 0; i < expression.length - 1; i++) {
            const currentElement = expression[i];
            const nextElement = expression[i + 1];

            // Check for consecutive operands
            if (
                (currentElement === "True" || currentElement === "False") &&
                (nextElement === "True" || nextElement === "False")
            ) {
                //console.error("Invalid expression: Consecutive operands");
                return false;
            }

            // Check for consecutive operators
            if (
                (currentElement === "And" || currentElement === "Or") &&
                (nextElement === "And" || nextElement === "Or")
            ) {
                //console.error("Invalid expression: Consecutive operators");
                return false;
            }

            // Check consecutive operators
            if (currentElement === "Not" && nextElement === "Not") {
                return false;
            }

            // Check if &/| comes after T/F
            if (
                (currentElement === "True" || currentElement === "False") &&
                nextElement !== "And" &&
                nextElement !== "Or"
            ) {
                //console.error("Invalid expression: Consecutive operands");
                return false;
            }

            // Check if T/F comes after !
            if (
                currentElement === "Not" &&
                nextElement !== "True" &&
                nextElement !== "False"
            ) {
                return false;
            }
        }

        // Construct the expression string
        let result = "";
        for (let i = 0; i < expression.length; i++) {
            const tileType = expression[i];
            result += this.logicalOperators[tileType];
        }
        console.log("result is: " + result);
        // Evaluate the expression using eval() and return the result
        return eval(result) as boolean;
    }

    /*
    MORE COMPLEX VERSION OF GENERATE RANDOM BOARD
    NOTE: DOES NOT WORK AT THE MOMENT
        function generateRandomBoard(
            numRows: number,
            numCols: number,
            tileTypes: string[]
        ) {
            const board = [];

            const tileWeight: { [key: string]: number } = {
                And: 0.1,
                Or: 0.1,
                Not: 0.1,
                True: 0.35,
                False: 0.35,
            };

            for (let row = 0; row < numRows; row++) {
                const newRow = [];
                for (let col = 0; col < numCols; col++) {
                    //Use instead of random index?
                    const randomBlock = Math.random();

                    const randomIndex = Math.floor(
                        Math.random() * tileTypes.length
                    );
                    newRow.push(tileTypes[randomIndex]);
                }
                board.push(newRow);
            }
            return board;
        }
        */
}
