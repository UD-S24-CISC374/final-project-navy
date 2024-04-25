import Phaser from "phaser";
import { Button } from "../objects/button";
import { playMusic, stopMusic } from "../objects/musicManager";
import { generateRandomBoard } from "../objects/generateBoard";
import { evaluateExpression } from "../objects/evaluateExpression";
import { shiftValues } from "../objects/shiftValues";
import { removeRow } from "../objects/removeRow";
import { removeCol } from "../objects/removeCol";

export default class Level3PlayScene extends Phaser.Scene {
    constructor() {
        super({ key: "Level3PlayScene" });
        this.tileTypes = [
            "True",
            "False",
            "And",
            "Or",
            "Not",
            "Equals",
            "LParen",
            "RParen",
            "True",
            "False",
        ];
    }

    saveGameState() {
        const gameState = {
            board: this.board,
            score: this.score,
            recentMatch: this.recentMatch,
        };
        localStorage.setItem("level3GameState", JSON.stringify(gameState));
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
        stopMusic();
        playMusic(this, "L3Song");

        const savedState = localStorage.getItem("level3GameState");
        if (savedState) {
            const gameState = JSON.parse(savedState);
            this.board = gameState.board;
            this.score = gameState.score;
            this.recentMatch = gameState.recentMatch;
        } else {
            this.board = generateRandomBoard(9, 9, this.tileTypes);
            this.score = 0;
            this.recentMatch = "";
        }

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

        this.rowSelector = this.add.image(360, 220, "RS 9x9");
        this.colSelector = this.add.image(320, 300, "CS 9x9");
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
                this.saveGameState(); // Save state before leaving
                stopMusic("L2Song");
                playMusic(this, "MainSong");
                this.scene.start("SelectScene");
            }
        );

        this.add.text(330, 100, "Level 3", {
            fontSize: "35px",
            color: "black",
        });

        // These coordinates are for 9x9 board to ensure it's centered
        let startx = 200;
        let starty = 150;

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
        //TODO: adjust row and coloum selectors for bigger board
        this.selectedTile.setTint(0xff0000);
        this.rowSelector.setPosition(400, this.selectedTile.y);
        this.colSelector.setPosition(this.selectedTile.x, 350);
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
        this.evaluateRowsAndColumns(9, 9);
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
            shiftValues(
                -1,
                0,
                9,
                9,
                this.board,
                this.selectedTileIndex,
                this.tilesGroup.getChildren() as Phaser.GameObjects.Sprite[]
            );
            this.evaluateRowsAndColumns(9, 9);
        } else if (this.cursors?.left.isDown && !this.prevKeyState["left"]) {
            shiftValues(
                1,
                0,
                9,
                9,
                this.board,
                this.selectedTileIndex,
                this.tilesGroup.getChildren() as Phaser.GameObjects.Sprite[]
            );
            this.evaluateRowsAndColumns(9, 9);
        } else if (this.cursors?.down.isDown && !this.prevKeyState["down"]) {
            shiftValues(
                0,
                -1,
                9,
                9,
                this.board,
                this.selectedTileIndex,
                this.tilesGroup.getChildren() as Phaser.GameObjects.Sprite[]
            );
            this.evaluateRowsAndColumns(9, 9);
        } else if (this.cursors?.up.isDown && !this.prevKeyState["up"]) {
            shiftValues(
                0,
                1,
                9,
                9,
                this.board,
                this.selectedTileIndex,
                this.tilesGroup.getChildren() as Phaser.GameObjects.Sprite[]
            );
            this.evaluateRowsAndColumns(9, 9);
        }

        this.prevKeyState["right"] = this.cursors?.right.isDown || false;
        this.prevKeyState["left"] = this.cursors?.left.isDown || false;
        this.prevKeyState["down"] = this.cursors?.down.isDown || false;
        this.prevKeyState["up"] = this.cursors?.up.isDown || false;
    }

    //TODO: Make moveSelection its own file that can be called for diff levels
    moveSelection(deltaX: number, deltaY: number) {
        const numRows = 9;
        const numCols = 9;
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
        this.colSelector.setPosition(this.selectedTile.x, 350);
        this.rowSelector.setVisible(true);
        this.colSelector.setVisible(true);
    }

    logicalOperators: { [key: string]: string } = {
        And: "&&",
        Or: "||",
        Not: "!",
        True: "true",
        False: "false",
        Equals: "===",
        LParen: "(",
        RParen: ")",
    };

    evaluateRowsAndColumns(numRows: number, numCols: number) {
        // Evaluate all rows
        for (let row = 0; row < numRows; row++) {
            if (evaluateExpression(this.board[row], this.logicalOperators)) {
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
            if (evaluateExpression(column, this.logicalOperators)) {
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
}
