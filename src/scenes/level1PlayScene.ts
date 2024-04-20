import Phaser from "phaser";
import { Button } from "../objects/button";
import { playMusic, stopMusic } from "../objects/musicManager";
import { generateRandomBoard } from "../objects/generateBoard";
import { evaluateExpression } from "../objects/evaluateExpression";
import { shiftValues } from "../objects/shiftValues";
import { removeRow } from "../objects/removeRow";
import { removeCol } from "../objects/removeCol";

export default class Level1PlayScene extends Phaser.Scene {
    constructor() {
        super({ key: "Level1PlayScene" });
    }

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

    private recentMatch: string = "";
    private score: number = 0;
    private recentMatchText: Phaser.GameObjects.Text;
    scoreText?: Phaser.GameObjects.Text;
    private match: Phaser.Sound.BaseSound;

    create() {
        stopMusic("MainSong");
        playMusic(this, "L1Song");
        this.sound.pauseOnBlur = false;

        this.match = this.sound.add("match", { loop: false });
        this.scoreText = this.add.text(50, 100, "Matches: " + this.score, {
            fontSize: "25px",
            color: "black",
        });
        this.recentMatchText = this.add.text(
            50,
            130,
            "Most Recent Match: " + this.recentMatch,
            {
                fontSize: "25px",
                color: "black",
            }
        );

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
            () => {
                stopMusic("L1Song");
                playMusic(this, "MainSong");
                this.score = 0;
                this.recentMatch = "";
                this.scene.start("SelectScene");
            }
        );

        this.add.text(330, 100, "Level 1", {
            fontSize: "35px",
            color: "black",
        });

        // Creating Randomized Board
        //-----------------------------------------------------------------------------
        const numRows = 5;
        const numCols = 5;
        /* added multiples 
        true, false are weight .25 
        and, or are weight .1875 
        not is weight .125 */
        this.tileTypes = [
            "True",
            "True",
            "True",
            "True",
            "False",
            "False",
            "False",
            "False",
            "And",
            "And",
            "And",
            "Or",
            "Or",
            "Or",
            "Not",
            "Not",
        ];

        this.board = generateRandomBoard(numRows, numCols, this.tileTypes);
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

        // Deals with highlighting currently selected block and placing selectors
        //-----------------------------------------------------------------------------
        //Selected tile (initially the one at row 0 col 0)
        this.selectedTileIndex = 0;

        this.selectedTile =
            this.tilesGroup.getChildren()[0] as Phaser.GameObjects.Sprite;

        // Highlights selected tile
        this.selectedTile.setTint(0xa9a9a9);
        this.rowSelector.setPosition(400, this.selectedTile.y);
        this.colSelector.setPosition(this.selectedTile.x, 300);
        this.rowSelector.setVisible(true);
        this.colSelector.setVisible(true);

        // Key/WASD commands
        //-----------------------------------------------------------------------------
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
        this.evaluateRowsAndColumns(5, 5);
    }

    update() {
        // Board movement
        //-----------------------------------------------------------------------------
        // Had to check key state otherwise clicking once would make it move like 3 or 5 blocks
        // Has to do with update being called so many times per second, need a workaround
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

        // Block Movement
        //-----------------------------------------------------------------------------
        if (this.cursors?.right.isDown && !this.prevKeyState["right"]) {
            shiftValues(
                -1,
                0,
                5,
                5,
                this.board,
                this.selectedTileIndex,
                this.tilesGroup.getChildren() as Phaser.GameObjects.Sprite[]
            );
            this.evaluateRowsAndColumns(5, 5);
        } else if (this.cursors?.left.isDown && !this.prevKeyState["left"]) {
            shiftValues(
                1,
                0,
                5,
                5,
                this.board,
                this.selectedTileIndex,
                this.tilesGroup.getChildren() as Phaser.GameObjects.Sprite[]
            );
            this.evaluateRowsAndColumns(5, 5);
        } else if (this.cursors?.down.isDown && !this.prevKeyState["down"]) {
            shiftValues(
                0,
                -1,
                5,
                5,
                this.board,
                this.selectedTileIndex,
                this.tilesGroup.getChildren() as Phaser.GameObjects.Sprite[]
            );
            this.evaluateRowsAndColumns(5, 5);
        } else if (this.cursors?.up.isDown && !this.prevKeyState["up"]) {
            shiftValues(
                0,
                1,
                5,
                5,
                this.board,
                this.selectedTileIndex,
                this.tilesGroup.getChildren() as Phaser.GameObjects.Sprite[]
            );
            this.evaluateRowsAndColumns(5, 5);
        }

        this.prevKeyState["right"] = this.cursors?.right.isDown || false;
        this.prevKeyState["left"] = this.cursors?.left.isDown || false;
        this.prevKeyState["down"] = this.cursors?.down.isDown || false;
        this.prevKeyState["up"] = this.cursors?.up.isDown || false;
    }

    // FUNCTIONS THAT CAN BE PUT INTO SEPARATE FILES
    //-----------------------------------------------------------------------------
    evaluateRowsAndColumns(numRows: number, numCols: number) {
        // Evaluate all rows
        for (let row = 0; row < numRows; row++) {
            if (evaluateExpression(this.board[row])) {
                console.log("Found a match in row", row);
                this.recentMatch = this.board[row].join(" ");
                removeRow(
                    row,
                    numCols,
                    this.board,
                    this.tilesGroup.getChildren() as Phaser.GameObjects.Sprite[],
                    this.tileTypes
                );
                this.score += 1;
                this.scoreText?.setText("Matches: " + this.score);
                this.recentMatchText.setText(
                    "Most Recent Match: " + this.recentMatch
                );
                this.match.play();
                //this.moveBlocksDown(row); Maybe use a diff function for moving blocks down?
            }
        }

        // Evaluate all columns
        for (let col = 0; col < numCols; col++) {
            const column = this.board.map((row) => row[col]);
            if (evaluateExpression(column)) {
                console.log("Found a match in column", col);
                this.recentMatch = column.join(" ");
                removeCol(
                    col,
                    numRows,
                    numCols,
                    this.board,
                    this.tilesGroup.getChildren() as Phaser.GameObjects.Sprite[],
                    this.tileTypes
                );
                this.score += 1;
                this.scoreText?.setText("Matches: " + this.score);
                this.recentMatchText.setText(
                    "Most Recent Match: " + this.recentMatch
                );
                this.match.play();
            }
        }
    }
    //---------------------------------------------------------------------

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
        this.selectedTile.setTint(0xa9a9a9);
        this.rowSelector.setPosition(400, this.selectedTile.y);
        this.colSelector.setPosition(this.selectedTile.x, 300);
        this.rowSelector.setVisible(true);
        this.colSelector.setVisible(true);
    }
}
