import Phaser from "phaser";
import { Button } from "../objects/button";
import { playMusic, stopMusic } from "../objects/musicManager";
import { generateRandomBoard } from "../objects/generateBoard";
import { evaluateExpression } from "../objects/evaluateExpression";
import { shiftValues } from "../objects/shiftValues";
import { removeRow } from "../objects/removeRow";
import { removeCol } from "../objects/removeCol";
import { createHelpDisplay, toggleHelpDisplay } from "../objects/helpDisplay";

const globals = require("../objects/globalVars");

export default class Level2PlayScene extends Phaser.Scene {
    constructor() {
        super({ key: "Level2PlayScene" });
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
    private boardBg: Phaser.GameObjects.Image;
    private tileTypes: string[];

    private recentMatch: string = "";
    private score: number = 0;
    private recentMatchText: Phaser.GameObjects.Text;
    scoreText?: Phaser.GameObjects.Text;
    private match: Phaser.Sound.BaseSound;

    private hasMoved: boolean = false; // Track if any movement has happened
    private turnCount: number = 15; // Track the number of turns
    private turnText: Phaser.GameObjects.Text;

    create() {
        stopMusic();
        playMusic(this, "L2Song");
        this.sound.pauseOnBlur = false;

        // Create the help display
        const { helpDisplay, helpContainer } = createHelpDisplay(this);
        this.helpDisplay = helpDisplay;
        this.helpContainer = helpContainer;

        // Create the help button
        new Button(
            this,
            550,
            35,
            "Help",
            {
                fontSize: "25px",
                color: "red",
            },
            () => {
                toggleHelpDisplay(this, this.helpDisplay, this.helpContainer);
            }
        );

        this.scoreText = this.add.text(50, 90, "Matches: " + this.score, {
            fontSize: "25px",
            color: "black",
        });
        this.recentMatchText = this.add.text(
            50,
            120,
            "Most Recent Match: " + this.recentMatch,
            {
                fontSize: "25px",
                color: "black",
            }
        );
        this.turnText = this.add.text(
            50,
            150,
            "Turns: " + (this.turnCount || 0),
            {
                fontSize: "25px",
                color: "black",
            }
        );

        const savedState = localStorage.getItem("level2GameState");
        if (savedState) {
            const gameState = JSON.parse(savedState);
            this.board = gameState.board;
            this.score = gameState.score;
            this.recentMatch = gameState.recentMatch;
            this.turnCount = gameState.turnCount || 0;

            this.scoreText.setText("Matches: " + this.score);
            this.recentMatchText.setText(
                "Most Recent Match: " + this.recentMatch
            );
            this.turnText.setText("Turns: " + this.turnCount);
        } else {
            this.board = generateRandomBoard(7, 7, this.tileTypes);
            this.score = 0;
            this.recentMatch = "";
            this.turnCount = 15;

            // Update UI elements
            this.scoreText.setText("Matches: " + this.score);
            this.recentMatchText.setText(
                "Most Recent Match: " + this.recentMatch
            );
            this.turnText.setText("Turns: " + this.turnCount);
            this.saveGameState();
        }

        if (globals.level2Reset) {
            globals.level2Reset = false;
            this.board = generateRandomBoard(7, 7, this.tileTypes);
            this.score = 0;
            this.recentMatch = "";
            this.turnCount = 15;

            // Update UI elements
            this.scoreText.setText("Matches: " + this.score);
            this.recentMatchText.setText(
                "Most Recent Match: " + this.recentMatch
            );
            this.turnText.setText("Turns: " + this.turnCount);
            globals.level2Lose = false;
            this.saveGameState();
        }

        this.match = this.sound.add("match", { loop: false });

        this.boardBg = this.add.image(400, 340, "Board 7x7");
        this.boardBg.setVisible(true);
        this.rowSelector = this.add.image(400, 220, "RS 7x7");
        this.colSelector = this.add.image(320, 340, "CS 7x7");
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
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.cameras.main.on(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    () => {
                        stopMusic("L2Song");
                        playMusic(this, "MainSong");
                        this.scene.start("SelectScene");
                    }
                );
            }
        );

        new Button(
            this,
            675,
            35,
            "Reset",
            {
                fontSize: "25px",
                color: "red",
            },
            () => {
                this.resetGameState(); // Save state before leaving
            }
        );

        this.add.text(330, 90, "Level 2", {
            fontSize: "35px",
            color: "black",
        });

        // These coordinates are for 7x7 board to ensure it's centered
        const startx = 240;
        const starty = 180;

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
        this.selectedTile.setTint(0xa9a9a9);
        this.rowSelector.setPosition(400, this.selectedTile.y);
        this.colSelector.setPosition(this.selectedTile.x, 340);
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
        this.evaluateRowsAndColumns(7, 7);
    }

    update() {
        let selectionChanged = false;

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
            this.hasMoved = true;
            this.evaluateRowsAndColumns(7, 7);
            this.saveGameState();
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
            this.hasMoved = true;
            this.evaluateRowsAndColumns(7, 7);
            this.saveGameState();
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
            this.hasMoved = true;
            this.evaluateRowsAndColumns(7, 7);
            this.saveGameState();
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
            this.hasMoved = true;
            this.evaluateRowsAndColumns(7, 7);
            this.saveGameState();
        }

        // Board movement
        //-----------------------------------------------------------------------------
        // Had to check key state otherwise clicking once would make it move like 3 or 5 blocks
        // Has to do with update being called so many times per second, need a workaround
        if (this.keyW?.isDown && !this.prevKeyState["W"]) {
            this.moveSelection(0, -1);
            selectionChanged = true;
        } else if (this.keyS?.isDown && !this.prevKeyState["S"]) {
            this.moveSelection(0, 1);
            selectionChanged = true;
        } else if (this.keyA?.isDown && !this.prevKeyState["A"]) {
            this.moveSelection(-1, 0);
            selectionChanged = true;
        } else if (this.keyD?.isDown && !this.prevKeyState["D"]) {
            this.moveSelection(1, 0);
            selectionChanged = true;
        }

        if (this.hasMoved && selectionChanged) {
            this.turnCount = this.turnCount - 1;
            this.hasMoved = false;
            console.log("Turn " + this.turnCount + " completed.");
            this.turnText.setText("Turns: " + this.turnCount);
        }

        let matchReq = 2;
        if (this.turnCount >= 0 && this.score == matchReq) {
            stopMusic("L2Song");
            // add new music here?
            //playMusic(this, "MainSong");
            globals.level2Win = true;
            this.scene.start("Level2WinScene");
        }

        if (this.turnCount === 0 && this.score < matchReq) {
            stopMusic("L2Song");
            // add new music here?
            //playMusic(this, "MainSong");
            globals.level2Lose = true;
            this.scene.start("Level2LoseScene");
            this.resetGameState();
        }

        // Update previous key state so it resets
        this.prevKeyState["W"] = this.keyW?.isDown || false;
        this.prevKeyState["S"] = this.keyS?.isDown || false;
        this.prevKeyState["A"] = this.keyA?.isDown || false;
        this.prevKeyState["D"] = this.keyD?.isDown || false;
        this.prevKeyState["right"] = this.cursors?.right.isDown || false;
        this.prevKeyState["left"] = this.cursors?.left.isDown || false;
        this.prevKeyState["down"] = this.cursors?.down.isDown || false;
        this.prevKeyState["up"] = this.cursors?.up.isDown || false;
    }

    logicalOperators: { [key: string]: string } = {
        And: "&&",
        Or: "||",
        Not: "!",
        True: "true",
        False: "false",
        Equals: "===",
    };

    matchOperators: { [key: string]: string } = {
        And: "&",
        Or: "|",
        Not: "!",
        True: "T",
        False: "F",
        Equals: "=",
    };

    // FUNCTIONS THAT CAN BE PUT INTO SEPARATE FILES
    //-----------------------------------------------------------------------------
    saveGameState() {
        const gameState = {
            board: this.board,
            score: this.score,
            recentMatch: this.recentMatch,
            turnCount: this.turnCount, // Save the turn count
        };
        localStorage.setItem("level2GameState", JSON.stringify(gameState));
    }

    resetGameState() {
        // Reset the game state variables
        this.board = generateRandomBoard(7, 7, this.tileTypes);
        this.score = 0;
        this.recentMatch = "";
        this.turnCount = 15;

        // Update UI elements
        this.scoreText?.setText("Matches: " + this.score);
        this.recentMatchText.setText("Most Recent Match: " + this.recentMatch);
        this.turnText.setText("Turns: " + this.turnCount);

        this.tilesGroup.getChildren().forEach((tile, index) => {
            const tileType = this.board[Math.floor(index / 7)][index % 7];
            tile.setData("tileType", tileType);
            if (tile instanceof Phaser.GameObjects.Sprite) {
                // Cast tile to Phaser.GameObjects.Sprite
                tile.setTexture(tileType);
            }
        });

        // Save the reset game state
        this.saveGameState();
    }

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
        const numRows = 7;
        const numCols = 7;
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
        this.colSelector.setPosition(this.selectedTile.x, 340);
        this.rowSelector.setVisible(true);
        this.colSelector.setVisible(true);
    }
}
