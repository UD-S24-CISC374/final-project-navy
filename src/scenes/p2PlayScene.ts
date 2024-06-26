import Phaser from "phaser";
import { playMusic, stopMusic } from "../objects/musicManager";
import { generateRandomBoard } from "../objects/generateBoard";
import { evaluateExpression } from "../objects/evaluateExpression";
import { shiftValues } from "../objects/shiftValues";
import { removeRow } from "../objects/removeRow";
import { removeCol } from "../objects/removeCol";
import { moveSelection } from "../objects/moveSelection";
import { createHelpDisplay, toggleHelpDisplay } from "../objects/helpDisplay";
import {
    createControlDisplay,
    toggleControlDisplay,
} from "../objects/controlsDisplay";
import { createArrowAnimation } from "../objects/arrowAnimation";

export default class P2PlayScene extends Phaser.Scene {
    constructor() {
        super({ key: "P2PlayScene" });
        this.tileTypes = [
            "True",
            "False",
            "And",
            "Or",
            "Not",
            "Equals",
            "True",
            "False",
        ];
    }

    private helpDisplay: Phaser.GameObjects.Image;
    private helpContainer: Phaser.GameObjects.Container;

    private controlDisplay: Phaser.GameObjects.Image;
    private controlContainer: Phaser.GameObjects.Container;

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

    private arrows: { [key: string]: Phaser.GameObjects.Image[] } = {
        up: [],
        down: [],
        left: [],
        right: [],
    };

    private tileTypes: string[];

    private recentMatch: string = "";
    private score: number = 0;
    private recentMatchText: Phaser.GameObjects.Text;
    private scoreText: Phaser.GameObjects.Text;
    private match: Phaser.Sound.BaseSound;

    create() {
        this.add.image(400, 300, "Valley");
        this.cameras.main.fadeIn(300, 0, 0, 0);
        // Adding in audio and images into level
        //-----------------------------------------------------------------------------
        // Change music at beginning of level
        stopMusic();
        playMusic(this, "L2Song");
        this.sound.pauseOnBlur = false;

        // Add sound effects and images
        this.match = this.sound.add("match", { loop: false });

        this.add.image(400, 340, "Board 7x7");
        this.rowSelector = this.add.image(400, 220, "RS 7x7");
        this.colSelector = this.add.image(320, 340, "CS 7x7");

        // Create control display
        const { controlDisplay, controlContainer } = createControlDisplay(this);
        this.controlDisplay = controlDisplay;
        this.controlContainer = controlContainer;
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Adding in buttons players can click in the level
        //-----------------------------------------------------------------------------
        // control button to toggle control display
        const controlButton = this.add
            .image(610, 50, "ControlsIcon")
            .setInteractive()
            .on("pointerdown", () => {
                toggleControlDisplay(
                    this,
                    this.controlDisplay,
                    this.controlContainer
                );
            });

        controlButton.on("pointerover", () => {
            controlButton.setTint(0xaaaaaa); // Tint on hover
        });

        controlButton.on("pointerout", () => {
            controlButton.clearTint(); // Clear tint on hover out
        });

        // Create the help display
        const { helpDisplay, helpContainer } = createHelpDisplay(this);
        this.helpDisplay = helpDisplay;
        this.helpContainer = helpContainer;
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Adding in buttons players can click in the level
        //-----------------------------------------------------------------------------
        // Help button to toggle help display
        const helpButton = this.add
            .image(675, 50, "Help")
            .setInteractive()
            .on("pointerdown", () => {
                toggleHelpDisplay(this, this.helpDisplay, this.helpContainer);
            });

        helpButton.on("pointerover", () => {
            helpButton.setTint(0xaaaaaa); // Tint on hover
        });

        helpButton.on("pointerout", () => {
            helpButton.clearTint(); // Clear tint on hover out
        });

        // Back to levels button to return to level select screen
        const homeButton = this.add
            .image(60, 50, "Home")
            .setInteractive()
            .on("pointerdown", () => {
                this.cameras.main.fadeOut(300, 0, 0, 0);
                this.cameras.main.on(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    () => {
                        stopMusic("L2Song");
                        playMusic(this, "MainSong");
                        this.resetGameState();
                        this.scene.start("SelectScene");
                    }
                );
            });

        homeButton.on("pointerover", () => {
            homeButton.setTint(0xaaaaaa); // Tint on hover
        });

        homeButton.on("pointerout", () => {
            homeButton.clearTint(); // Clear tint on hover out
        });

        // Reset button to get new gameboard and reset progress
        const resetButton = this.add
            .image(740, 50, "Restart")
            .setInteractive()
            .on("pointerdown", () => {
                this.resetGameState();
            });

        resetButton.on("pointerover", () => {
            resetButton.setTint(0xaaaaaa); // Tint on hover
        });

        resetButton.on("pointerout", () => {
            resetButton.clearTint(); // Clear tint on hover out
        });
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Create text displaying level, score, recent match
        //-----------------------------------------------------------------------------
        this.add.image(400, 60, "PTitle");

        this.scoreText = this.add.text(50, 100, "Matches: " + this.score, {
            fontSize: "25px",
            color: "white",
        });

        this.recentMatchText = this.add.text(
            50,
            130,
            "Recent Match:\n" + this.recentMatch,
            {
                fontSize: "25px",
                color: "white",
            }
        );
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Create random game board and add tiles to screen
        //-----------------------------------------------------------------------------
        this.board = generateRandomBoard(7, 7, this.tileTypes);

        const startx = 240;
        const starty = 180;
        let newx = startx;
        let newy = starty;

        this.tilesGroup = this.add.group();
        // Loop through board and create sprites for each tile
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                const tileType = this.board[row][col];
                const xPos = newx + 40;
                const yPos = newy + 40;

                const tileSprite = this.add.sprite(xPos, yPos, tileType);
                tileSprite.setOrigin(0.5);
                tileSprite.setData("tileType", tileType);

                this.tilesGroup.add(tileSprite);
                newx += 40;
            }
            // Reset newx so row below is at same x coordinate as one above
            newx = startx;
            newy += 40; // 40 = block image (32 px) + space between next block (8 px)
        }

        //Selected tile (initially the one at row 0 col 0)
        this.selectedTileIndex = 0;
        this.selectedTile =
            this.tilesGroup.getChildren()[0] as Phaser.GameObjects.Sprite;

        this.selectedTile.setTint(0xa9a9a9); // Add tint so players know what block they're on
        // Selectors indicate which row/column selected block is in
        this.rowSelector.setPosition(400, this.selectedTile.y);
        this.colSelector.setPosition(this.selectedTile.x, 340);
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Enabling input for WASD & arrow keys
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
        this.evaluateRowsAndColumns(7, 7);
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    }

    update() {
        // Movement for shifting locations of blocks (arrow keys)
        //-----------------------------------------------------------------------------
        // Must check key state otherwise clicking once moves 3/5 blocks
        // Has to do with update being called so many times per second
        if (this.cursors?.right.isDown && !this.prevKeyState["right"]) {
            shiftValues(
                this,
                -1,
                0,
                7,
                7,
                this.board,
                this.selectedTileIndex,
                this.tilesGroup.getChildren() as Phaser.GameObjects.Sprite[]
            );
            createArrowAnimation(
                this,
                this.arrows,
                565,
                this.selectedTile.y,
                345,
                "right"
            );
            this.evaluateRowsAndColumns(7, 7); // Check if there's a match
        } else if (this.cursors?.left.isDown && !this.prevKeyState["left"]) {
            shiftValues(
                this,
                1,
                0,
                7,
                7,
                this.board,
                this.selectedTileIndex,
                this.tilesGroup.getChildren() as Phaser.GameObjects.Sprite[]
            );
            createArrowAnimation(
                this,
                this.arrows,
                235,
                this.selectedTile.y,
                345,
                "left"
            );
            this.evaluateRowsAndColumns(7, 7);
        } else if (this.cursors?.down.isDown && !this.prevKeyState["down"]) {
            shiftValues(
                this,
                0,
                -1,
                7,
                7,
                this.board,
                this.selectedTileIndex,
                this.tilesGroup.getChildren() as Phaser.GameObjects.Sprite[]
            );
            createArrowAnimation(
                this,
                this.arrows,
                this.selectedTile.x,
                505,
                345,
                "down"
            );
            this.evaluateRowsAndColumns(7, 7);
        } else if (this.cursors?.up.isDown && !this.prevKeyState["up"]) {
            shiftValues(
                this,
                0,
                1,
                7,
                7,
                this.board,
                this.selectedTileIndex,
                this.tilesGroup.getChildren() as Phaser.GameObjects.Sprite[]
            );
            createArrowAnimation(
                this,
                this.arrows,
                this.selectedTile.x,
                175,
                345,
                "up"
            );
            this.evaluateRowsAndColumns(7, 7);
        }
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Movement around board (WASD keys)
        //-----------------------------------------------------------------------------
        if (this.keyW?.isDown && !this.prevKeyState["W"]) {
            const { newIndex, selectedTile } = moveSelection(
                this.selectedTileIndex,
                0,
                -1,
                7,
                7,
                this.tilesGroup
            );
            this.updateSelection(newIndex, selectedTile);
        } else if (this.keyS?.isDown && !this.prevKeyState["S"]) {
            const { newIndex, selectedTile } = moveSelection(
                this.selectedTileIndex,
                0,
                1,
                7,
                7,
                this.tilesGroup
            );
            this.updateSelection(newIndex, selectedTile);
        } else if (this.keyA?.isDown && !this.prevKeyState["A"]) {
            const { newIndex, selectedTile } = moveSelection(
                this.selectedTileIndex,
                -1,
                0,
                7,
                7,
                this.tilesGroup
            );
            this.updateSelection(newIndex, selectedTile);
        } else if (this.keyD?.isDown && !this.prevKeyState["D"]) {
            const { newIndex, selectedTile } = moveSelection(
                this.selectedTileIndex,
                1,
                0,
                7,
                7,
                this.tilesGroup
            );
            this.updateSelection(newIndex, selectedTile);
        }
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Update previously pressed key state so it resets
        //-----------------------------------------------------------------------------
        this.prevKeyState["W"] = this.keyW?.isDown || false;
        this.prevKeyState["S"] = this.keyS?.isDown || false;
        this.prevKeyState["A"] = this.keyA?.isDown || false;
        this.prevKeyState["D"] = this.keyD?.isDown || false;
        this.prevKeyState["right"] = this.cursors?.right.isDown || false;
        this.prevKeyState["left"] = this.cursors?.left.isDown || false;
        this.prevKeyState["down"] = this.cursors?.down.isDown || false;
        this.prevKeyState["up"] = this.cursors?.up.isDown || false;
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    }
    //-----------------------------------------------------------------------------
    // Used to evaluate logical expressions in rows/columns
    logicalOperators: { [key: string]: string } = {
        And: "&&",
        Or: "||",
        Not: "!",
        True: "true",
        False: "false",
        Equals: "===",
    };

    // Used to display recent match
    matchOperators: { [key: string]: string } = {
        And: "&",
        Or: "|",
        Not: "!",
        True: "T",
        False: "F",
        Equals: "=",
    };
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // Function to reset game state
    //-----------------------------------------------------------------------------
    resetGameState() {
        // Reset the game state variables
        this.board = generateRandomBoard(7, 7, this.tileTypes);
        this.score = 0;
        this.recentMatch = "";

        // Update text
        this.scoreText.setText("Matches: " + this.score);
        this.recentMatchText.setText("Recent Match:\n" + this.recentMatch);

        this.tilesGroup.getChildren().forEach((tile, index) => {
            const tileType = this.board[Math.floor(index / 7)][index % 7];
            tile.setData("tileType", tileType);
            if (tile instanceof Phaser.GameObjects.Sprite) {
                // Cast tile to Phaser.GameObjects.Sprite
                tile.setTexture(tileType);
            }
        });
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // Function to check if there is a match after every block shift
    //-----------------------------------------------------------------------------
    evaluateRowsAndColumns(numRows: number, numCols: number) {
        // Evaluate all rows
        for (let row = 0; row < numRows; row++) {
            if (evaluateExpression(this.board[row], this.logicalOperators, 7)) {
                console.log("Found a match in row", row);
                const convertVals = this.board[row].map(
                    (value) => this.matchOperators[value]
                );
                this.recentMatch = convertVals.join(" ");
                removeRow(
                    // Get rid of the row & add new blocks
                    row,
                    numCols,
                    this.board,
                    this.tilesGroup.getChildren() as Phaser.GameObjects.Sprite[],
                    this.tileTypes
                );
                this.score += 1; // Increase score
                // Modify text values to display changes
                this.scoreText.setText("Matches: " + this.score);
                this.recentMatchText.setText(
                    "Recent Match:\n" + this.recentMatch
                );
                // Play sound when a match is made
                this.match.play();
            }
        }

        // Evaluate all columns
        for (let col = 0; col < numCols; col++) {
            const column = this.board.map((row) => row[col]);
            if (evaluateExpression(column, this.logicalOperators, 7)) {
                console.log("Found a match in column", col);
                const convertVals = column.map(
                    (value) => this.matchOperators[value]
                );
                this.recentMatch = convertVals.join(" ");
                removeCol(
                    col,
                    numRows,
                    numCols,
                    this.board,
                    this.tilesGroup.getChildren() as Phaser.GameObjects.Sprite[],
                    this.tileTypes
                );
                this.score += 1;
                this.scoreText.setText("Matches: " + this.score);
                this.recentMatchText.setText(
                    "Recent Match:\n" + this.recentMatch
                );
                this.match.play();
            }
        }
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // Function to change currently selected block every time player moves
    //-----------------------------------------------------------------------------
    updateSelection(newIndex: number, selectedTile: Phaser.GameObjects.Sprite) {
        // Clear tint from previously selected tile
        this.selectedTile.clearTint();

        // Update selected tile index and the tile itself
        this.selectedTileIndex = newIndex;
        this.selectedTile = selectedTile;

        // Add new tint to selected tile and update selectors' position
        this.selectedTile.setTint(0xa9a9a9);
        this.rowSelector.setPosition(400, this.selectedTile.y);
        this.colSelector.setPosition(this.selectedTile.x, 340);
    }
}
