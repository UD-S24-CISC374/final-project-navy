import Phaser from "phaser";
import { Button } from "../objects/button";
import { playMusic, stopMusic } from "../objects/musicManager";
import { generateRandomBoard } from "../objects/generateBoard";
import { evaluate9x9Expression } from "../objects/evaluateExpression";
import { shiftValues } from "../objects/shiftValues";
import { removeRow } from "../objects/removeRow";
import { removeCol } from "../objects/removeCol";
import { moveSelection } from "../objects/moveSelection";
import { createHelpDisplay, toggleHelpDisplay } from "../objects/helpDisplay";

const globals = require("../objects/globalVars");

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

    private helpDisplay: Phaser.GameObjects.Image;
    private helpContainer: Phaser.GameObjects.Container;

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
    private scoreText: Phaser.GameObjects.Text;
    private match: Phaser.Sound.BaseSound;

    private hasMoved: boolean = false; // Track if any movement has happened
    private turnCount: number = 20; // Track the number of turns
    private turnText: Phaser.GameObjects.Text;

    create() {
        this.add.image(400, 300, "Valley");
        this.cameras.main.fadeIn(300, 0, 0, 0);
        // Adding in audio and images into level
        //-----------------------------------------------------------------------------
        // Change music at beginning of level
        stopMusic();
        playMusic(this, "L3Song");
        this.sound.pauseOnBlur = false;

        // Add sound effects and images
        this.match = this.sound.add("match", { loop: false });

        this.add.image(400, 350, "Board 9x9");
        this.rowSelector = this.add.image(360, 220, "RS 9x9");
        this.colSelector = this.add.image(320, 300, "CS 9x9");

        // Create the help display
        const { helpDisplay, helpContainer } = createHelpDisplay(this);
        this.helpDisplay = helpDisplay;
        this.helpContainer = helpContainer;
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Adding in buttons players can click in the level
        //-----------------------------------------------------------------------------
        // Help button to toggle help display
        new Button(
            this,
            550,
            35,
            "Help",
            {
                fontSize: "25px",
                color: "white",
            },
            () => {
                toggleHelpDisplay(this, this.helpDisplay, this.helpContainer);
            }
        );

        // Back to levels button to return to level select screen
        new Button(
            this,
            50,
            35,
            "Back to Levels",
            {
                fontSize: "25px",
                color: "white",
            },
            () => {
                this.saveGameState(); // Save state before leaving
                this.cameras.main.fadeOut(300, 0, 0, 0);
                this.cameras.main.on(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    () => {
                        stopMusic("L3Song");
                        playMusic(this, "MainSong");
                        this.scene.start("SelectScene");
                    }
                );
            }
        );

        // Reset button to get new gameboard and reset progress
        new Button(
            this,
            675,
            35,
            "Reset",
            {
                fontSize: "25px",
                color: "white",
            },
            () => {
                this.resetGameState();
            }
        );
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Create text displaying level, score, recent match, number of moves left
        //-----------------------------------------------------------------------------
        this.add.image(400, 60, "L3Title");

        this.scoreText = this.add.text(50, 90, "Matches: " + this.score, {
            fontSize: "25px",
            color: "white",
        });
        this.recentMatchText = this.add.text(
            50,
            120,
            "Recent Match:\n" + this.recentMatch,
            {
                fontSize: "25px",
                color: "white",
            }
        );
        this.turnText = this.add.text(
            50,
            175,
            "Turns: " + (this.turnCount || 0),
            {
                fontSize: "25px",
                color: "white",
            }
        );
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Create save progress so players can resume game on different days
        //-----------------------------------------------------------------------------
        const savedState = localStorage.getItem("level3GameState");
        if (savedState) {
            // If players already have previously saved data, load it
            const gameState = JSON.parse(savedState);
            this.board = gameState.board;
            this.score = gameState.score;
            this.recentMatch = gameState.recentMatch;
            this.turnCount = gameState.turnCount || 0;

            this.scoreText.setText("Matches: " + this.score);
            this.recentMatchText.setText("Recent Match:\n" + this.recentMatch);
            this.turnText.setText("Turns: " + this.turnCount);
        } else {
            // If players are playing game for first time, initialize values
            this.board = generateRandomBoard(9, 9, this.tileTypes);
            this.score = 0;
            this.recentMatch = "";
            this.turnCount = 20;

            // Initialize text for score values
            this.scoreText.setText("Matches: " + this.score);
            this.recentMatchText.setText("Recent Match:\n" + this.recentMatch);
            this.turnText.setText("Turns: " + this.turnCount);
            this.saveGameState();
        }
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Reset saved data if players reach ending screen of level (win or lose)
        //-----------------------------------------------------------------------------
        if (globals.level3Reset) {
            globals.level3Reset = false;
            this.board = generateRandomBoard(9, 9, this.tileTypes);
            this.score = 0;
            this.recentMatch = "";
            this.turnCount = 20;

            // Update text
            this.scoreText.setText("Matches: " + this.score);
            this.recentMatchText.setText("Recent Match:\n" + this.recentMatch);
            this.turnText.setText("Turns: " + this.turnCount);
            globals.level3Lose = false;
            this.saveGameState();
        }
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Creating the tiles for the game board and putting them on the screen
        //-----------------------------------------------------------------------------
        let startx = 200; // Starting positions change based off of grid size
        let starty = 150;
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
            newx = startx; // Reset newx so row below is at same x coordinate as one above
            newy += 40; // 40 = block image (32 px) + space between next block (8 px)
        }

        //Selected tile (initially the one at row 0 col 0)
        this.selectedTileIndex = 0;

        this.selectedTile =
            this.tilesGroup.getChildren()[0] as Phaser.GameObjects.Sprite;

        this.selectedTile.setTint(0xa9a9a9); // Add tint so players know what block they're on
        // Selectors indicate which row/column selected block is in
        this.rowSelector.setPosition(400, this.selectedTile.y);
        this.colSelector.setPosition(this.selectedTile.x, 350);
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
        this.evaluateRowsAndColumns(9, 9);
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    }

    update() {
        let selectionChanged = false; // Determines if current block player is on has changed

        // Movement for shifting locations of blocks (arrow keys)
        //-----------------------------------------------------------------------------
        // Must check key state otherwise clicking once moves 3/5 blocks
        // Has to do with update being called so many times per second
        if (this.cursors?.right.isDown && !this.prevKeyState["right"]) {
            shiftValues(
                this,
                -1,
                0,
                9,
                9,
                this.board,
                this.selectedTileIndex,
                this.tilesGroup.getChildren() as Phaser.GameObjects.Sprite[]
            );
            this.hasMoved = true;
            this.evaluateRowsAndColumns(9, 9); // Check if there's a match
            this.saveGameState(); // Same game state after each block shift
        } else if (this.cursors?.left.isDown && !this.prevKeyState["left"]) {
            shiftValues(
                this,
                1,
                0,
                9,
                9,
                this.board,
                this.selectedTileIndex,
                this.tilesGroup.getChildren() as Phaser.GameObjects.Sprite[]
            );
            this.hasMoved = true;
            this.evaluateRowsAndColumns(9, 9);
            this.saveGameState();
        } else if (this.cursors?.down.isDown && !this.prevKeyState["down"]) {
            shiftValues(
                this,
                0,
                -1,
                9,
                9,
                this.board,
                this.selectedTileIndex,
                this.tilesGroup.getChildren() as Phaser.GameObjects.Sprite[]
            );
            this.hasMoved = true;
            this.evaluateRowsAndColumns(9, 9);
            this.saveGameState();
        } else if (this.cursors?.up.isDown && !this.prevKeyState["up"]) {
            shiftValues(
                this,
                0,
                1,
                9,
                9,
                this.board,
                this.selectedTileIndex,
                this.tilesGroup.getChildren() as Phaser.GameObjects.Sprite[]
            );
            this.hasMoved = true;
            this.evaluateRowsAndColumns(9, 9);
            this.saveGameState();
        }
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Movement around board (WASD keys)
        //-----------------------------------------------------------------------------
        if (this.keyW?.isDown && !this.prevKeyState["W"]) {
            selectionChanged = true;
            const { newIndex, selectedTile } = moveSelection(
                this.selectedTileIndex,
                0,
                -1,
                9,
                9,
                this.tilesGroup
            );
            this.updateSelection(newIndex, selectedTile);
        } else if (this.keyS?.isDown && !this.prevKeyState["S"]) {
            selectionChanged = true;
            const { newIndex, selectedTile } = moveSelection(
                this.selectedTileIndex,
                0,
                1,
                9,
                9,
                this.tilesGroup
            );
            this.updateSelection(newIndex, selectedTile);
        } else if (this.keyA?.isDown && !this.prevKeyState["A"]) {
            selectionChanged = true;
            const { newIndex, selectedTile } = moveSelection(
                this.selectedTileIndex,
                -1,
                0,
                9,
                9,
                this.tilesGroup
            );
            this.updateSelection(newIndex, selectedTile);
        } else if (this.keyD?.isDown && !this.prevKeyState["D"]) {
            selectionChanged = true;
            const { newIndex, selectedTile } = moveSelection(
                this.selectedTileIndex,
                1,
                0,
                9,
                9,
                this.tilesGroup
            );
            this.updateSelection(newIndex, selectedTile);
        }
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Update number of moves once block is shifted and moved away
        //-----------------------------------------------------------------------------
        if (this.hasMoved && selectionChanged) {
            this.turnCount = this.turnCount - 1;
            this.hasMoved = false;
            console.log("Turn " + this.turnCount + " completed.");
            this.turnText.setText("Turns: " + this.turnCount);
        }
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Check if level has ended yet (based off num moves & level requirements)
        //-----------------------------------------------------------------------------
        let matchReq = 3;
        if (this.turnCount >= 0 && this.score == matchReq) {
            stopMusic("L3Song");
            // add new music here?
            //playMusic(this, "MainSong");
            globals.level3Win = true;
            this.scene.start("Level3WinScene");
        }

        if (this.turnCount === 0 && this.score < matchReq) {
            stopMusic("L3Song");
            // add new music here?
            //playMusic(this, "MainSong");
            globals.level3Lose = true;
            this.scene.start("Level3LoseScene");
            this.resetGameState();
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
        LParen: "(",
        RParen: ")",
    };

    // Used to display recent match
    matchOperators: { [key: string]: string } = {
        And: "&",
        Or: "|",
        Not: "!",
        True: "T",
        False: "F",
        Equals: "=",
        LParen: "(",
        RParen: ")",
    };

    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // Functions involving the game state
    //-----------------------------------------------------------------------------
    saveGameState() {
        const gameState = {
            board: this.board,
            score: this.score,
            recentMatch: this.recentMatch,
            turnCount: this.turnCount, // Save the turn count
        };
        localStorage.setItem("level3GameState", JSON.stringify(gameState));
    }

    // Function to reset game state
    resetGameState() {
        // Reset the values
        this.board = generateRandomBoard(9, 9, this.tileTypes);
        this.score = 0;
        this.recentMatch = "";
        this.turnCount = 20;

        // Update text
        this.scoreText.setText("Matches: " + this.score);
        this.recentMatchText.setText("Recent Match:\n" + this.recentMatch);
        this.turnText.setText("Turns: " + this.turnCount);

        // Set the tiles to have new values
        this.tilesGroup.getChildren().forEach((tile, index) => {
            const tileType = this.board[Math.floor(index / 9)][index % 9];
            tile.setData("tileType", tileType);
            if (tile instanceof Phaser.GameObjects.Sprite) {
                // Cast tile to Phaser.GameObjects.Sprite
                tile.setTexture(tileType);
            }
        });

        // Save the game state
        this.saveGameState();
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // Function to check if there is a match after every block shift
    //-----------------------------------------------------------------------------
    evaluateRowsAndColumns(numRows: number, numCols: number) {
        // Evaluate all rows
        for (let row = 0; row < numRows; row++) {
            if (evaluate9x9Expression(this.board[row], this.logicalOperators)) {
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
            if (evaluate9x9Expression(column, this.logicalOperators)) {
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
        this.colSelector.setPosition(this.selectedTile.x, 350);
    }
}
