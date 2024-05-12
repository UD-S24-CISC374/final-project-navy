import Phaser from "phaser";
import { Button } from "../objects/button";
import { playMusic, stopMusic } from "../objects/musicManager";
import { generateRandomBoard } from "../objects/generateBoard";
import { evaluateExpression } from "../objects/evaluateExpression";
import { shiftValues } from "../objects/shiftValues";
import { removeRow } from "../objects/removeRow";
import { removeCol } from "../objects/removeCol";
import { moveSelection } from "../objects/moveSelection";

const globals = require("../objects/globalVars");

export default class Level1PlayScene extends Phaser.Scene {
    constructor() {
        super({ key: "Level1PlayScene" });
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
    }

    private helpDisplay: Phaser.GameObjects.Image;
    private helpText: Phaser.GameObjects.Text;
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
    private scoreText: Phaser.GameObjects.Text;
    private match: Phaser.Sound.BaseSound;

    private hasMoved: boolean = false; // Track if any movement has happened
    private turnCount: number = 10; // Track the number of turns
    private turnText: Phaser.GameObjects.Text;

    create() {
        // Check if player wanted to restart round

        // Create the help display
        this.createHelpDisplay();

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
                this.toggleHelpDisplay();
            }
        );

        stopMusic("MainSong");
        playMusic(this, "L1Song");
        this.sound.pauseOnBlur = false;

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

        const savedState = localStorage.getItem("level1GameState");
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
            this.board = generateRandomBoard(5, 5, this.tileTypes);
            this.score = 0;
            this.recentMatch = "";
            this.turnCount = 10;

            // Update UI elements
            this.scoreText.setText("Matches: " + this.score);
            this.recentMatchText.setText(
                "Most Recent Match: " + this.recentMatch
            );
            this.turnText.setText("Turns: " + this.turnCount);
            this.saveGameState();
        }

        if (globals.level1Reset) {
            globals.level1Reset = false;
            this.board = generateRandomBoard(5, 5, this.tileTypes);
            this.score = 0;
            this.recentMatch = "";
            this.turnCount = 10;

            // Update UI elements
            this.scoreText.setText("Matches: " + this.score);
            this.recentMatchText.setText(
                "Most Recent Match: " + this.recentMatch
            );
            this.turnText.setText("Turns: " + this.turnCount);
            globals.level1Lose = false;
            this.saveGameState();
        }

        this.match = this.sound.add("match", { loop: false });

        this.boardBg = this.add.image(400, 300, "Board");
        this.boardBg.setVisible(true);
        this.rowSelector = this.add.image(400, 220, "Row Selector");
        this.colSelector = this.add.image(320, 300, "Col Selector");
        this.rowSelector.setVisible(false);
        this.colSelector.setVisible(false);

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
                stopMusic("L1Song");
                playMusic(this, "MainSong");
                this.scene.start("SelectScene");
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

        this.add.text(330, 90, "Level 1", {
            fontSize: "35px",
            color: "black",
        });

        // Creating tiles for the board
        const startx = 280;
        const starty = 180;
        let newx = startx;
        let newy = starty;

        this.tilesGroup = this.add.group();
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
            newx = startx;
            newy += 40;
        }

        this.selectedTileIndex = 0;
        this.selectedTile =
            this.tilesGroup.getChildren()[0] as Phaser.GameObjects.Sprite;
        this.selectedTile.setTint(0xa9a9a9);
        this.rowSelector.setPosition(400, this.selectedTile.y);
        this.colSelector.setPosition(this.selectedTile.x, 300);
        this.rowSelector.setVisible(true);
        this.colSelector.setVisible(true);

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
        let selectionChanged = false;

        // Block Movement
        //-----------------------------------------------------------------------------
        if (this.cursors?.right.isDown && !this.prevKeyState["right"]) {
            shiftValues(
                this,
                -1,
                0,
                5,
                5,
                this.board,
                this.selectedTileIndex,
                this.tilesGroup.getChildren() as Phaser.GameObjects.Sprite[]
            );
            this.hasMoved = true;
            this.evaluateRowsAndColumns(5, 5);
            this.saveGameState();
        } else if (this.cursors?.left.isDown && !this.prevKeyState["left"]) {
            shiftValues(
                this,
                1,
                0,
                5,
                5,
                this.board,
                this.selectedTileIndex,
                this.tilesGroup.getChildren() as Phaser.GameObjects.Sprite[]
            );
            this.hasMoved = true;
            this.evaluateRowsAndColumns(5, 5);
            this.saveGameState();
        } else if (this.cursors?.down.isDown && !this.prevKeyState["down"]) {
            shiftValues(
                this,
                0,
                -1,
                5,
                5,
                this.board,
                this.selectedTileIndex,
                this.tilesGroup.getChildren() as Phaser.GameObjects.Sprite[]
            );
            this.hasMoved = true;
            this.evaluateRowsAndColumns(5, 5);
            this.saveGameState();
        } else if (this.cursors?.up.isDown && !this.prevKeyState["up"]) {
            shiftValues(
                this,
                0,
                1,
                5,
                5,
                this.board,
                this.selectedTileIndex,
                this.tilesGroup.getChildren() as Phaser.GameObjects.Sprite[]
            );
            this.hasMoved = true;
            this.evaluateRowsAndColumns(5, 5);
            this.saveGameState();
        }

        // Board movement
        //-----------------------------------------------------------------------------
        // Had to check key state otherwise clicking once would make it move like 3 or 5 blocks
        // Has to do with update being called so many times per second, need a workaround
        if (this.keyW?.isDown && !this.prevKeyState["W"]) {
            selectionChanged = true;
            const { newIndex, selectedTile } = moveSelection(
                this.selectedTileIndex,
                0,
                -1,
                5,
                5,
                this.tilesGroup
            );
            this.updateSelection(newIndex, selectedTile);
        } else if (this.keyS?.isDown && !this.prevKeyState["S"]) {
            selectionChanged = true;
            const { newIndex, selectedTile } = moveSelection(
                this.selectedTileIndex,
                0,
                1,
                5,
                5,
                this.tilesGroup
            );
            this.updateSelection(newIndex, selectedTile);
        } else if (this.keyA?.isDown && !this.prevKeyState["A"]) {
            selectionChanged = true;
            const { newIndex, selectedTile } = moveSelection(
                this.selectedTileIndex,
                -1,
                0,
                5,
                5,
                this.tilesGroup
            );
            this.updateSelection(newIndex, selectedTile);
        } else if (this.keyD?.isDown && !this.prevKeyState["D"]) {
            selectionChanged = true;
            const { newIndex, selectedTile } = moveSelection(
                this.selectedTileIndex,
                1,
                0,
                5,
                5,
                this.tilesGroup
            );
            this.updateSelection(newIndex, selectedTile);
        }

        if (this.hasMoved && selectionChanged) {
            this.turnCount = this.turnCount - 1;
            this.hasMoved = false;
            console.log("Turn " + this.turnCount + " completed.");
            this.turnText.setText("Turns: " + this.turnCount);
        }

        let matchReq = 1;
        if (this.turnCount >= 0 && this.score == matchReq) {
            stopMusic("L1Song");
            // add new music here?
            //playMusic(this, "MainSong");
            globals.level1Win = true;
            this.scene.start("Level1WinScene");
        }

        if (this.turnCount === 0 && this.score < matchReq) {
            stopMusic("L3Song");
            // add new music here?
            //playMusic(this, "MainSong");
            globals.level1Lose = true;
            this.scene.start("Level1LoseScene");
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
    };

    matchOperators: { [key: string]: string } = {
        And: "&",
        Or: "|",
        Not: "!",
        True: "T",
        False: "F",
    };

    //-----------------------------------------------------------------------------
    saveGameState() {
        const gameState = {
            board: this.board,
            score: this.score,
            recentMatch: this.recentMatch,
            turnCount: this.turnCount, // Save the turn count
        };
        localStorage.setItem("level1GameState", JSON.stringify(gameState));
    }

    resetGameState() {
        // Reset the game state variables
        this.board = generateRandomBoard(5, 5, this.tileTypes);
        this.score = 0;
        this.recentMatch = "";
        this.turnCount = 10;

        // Update UI elements
        this.scoreText.setText("Matches: " + this.score);
        this.recentMatchText.setText("Most Recent Match: " + this.recentMatch);
        this.turnText.setText("Turns: " + this.turnCount);

        this.tilesGroup.getChildren().forEach((tile, index) => {
            const tileType = this.board[Math.floor(index / 5)][index % 5];
            tile.setData("tileType", tileType);
            if (tile instanceof Phaser.GameObjects.Sprite) {
                // Cast tile to Phaser.GameObjects.Sprite
                tile.setTexture(tileType);
            }
        });

        // Save the reset game state
        this.saveGameState();
    }

    createHelpDisplay() {
        // Create background for the help display
        this.helpDisplay = this.add.image(800, 75, "HelpBox");
        this.helpDisplay.setOrigin(0, 0);

        this.helpContainer = this.add.container(825, 100);

        // Add help text
        this.helpText = this.add.text(
            15,
            30,
            "Text in the help section\nmore text\nmore text\neeyup more text\nText in the help section\nmore text\nmore text\neeyup more text",
            {
                fontSize: "15px",
                color: "white",
            }
        );
        this.helpText.setWordWrapWidth(260); // Adjust width for wrapping
        //this.helpContainer.setInteractive(); // Enable input for scrolling

        // Add background color to the container for visualization
        const containerBackground = this.add.graphics();
        containerBackground.fillStyle(0x00ff00, 0.5); // Green color with 50% opacity
        containerBackground.fillRect(15, 30, 265, 450); // Adjust size as needed
        this.helpContainer.add(containerBackground); // Add background to the container

        this.helpContainer.add(this.helpText);

        // Hide help display initially
        this.helpDisplay.visible = false;
        this.helpContainer.visible = false;
    }

    toggleHelpDisplay() {
        // Check if help display is currently visible
        const isHelpVisible = this.helpDisplay.visible;

        // Define the final x-coordinate for the display
        const finalX = isHelpVisible ? 800 : 500;

        if (!isHelpVisible) {
            // If help display is not visible, slide in
            this.helpDisplay.visible = true; // Make help display visible
            this.helpContainer.visible = true; // Make help container visible

            this.tweens.add({
                targets: [this.helpDisplay, this.helpContainer],
                x: finalX, // Slide to the final x-coordinate
                ease: "Power1",
                duration: 400, // Animation duration in milliseconds
            });
        } else {
            // If help display is visible, slide out
            this.tweens.add({
                targets: [this.helpDisplay, this.helpContainer],
                x: finalX, // Slide to the final x-coordinate
                ease: "Power1",
                duration: 400, // Animation duration in milliseconds
                onComplete: () => {
                    this.helpDisplay.visible = false; // Hide help display after sliding out
                    this.helpContainer.visible = false; // Hide help container after sliding out
                },
            });
        }
    }

    evaluateRowsAndColumns(numRows: number, numCols: number) {
        // Evaluate all rows
        for (let row = 0; row < numRows; row++) {
            if (evaluateExpression(this.board[row], this.logicalOperators, 5)) {
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
                this.scoreText.setText("Matches: " + this.score);
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
            if (evaluateExpression(column, this.logicalOperators, 5)) {
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
                    "Most Recent Match: " + this.recentMatch
                );
                this.match.play();
            }
        }
    }

    updateSelection(newIndex: number, selectedTile: Phaser.GameObjects.Sprite) {
        // Clear tint from previously selected tile
        this.selectedTile.clearTint();

        // Update selected tile index and the tile itself
        this.selectedTileIndex = newIndex;
        this.selectedTile = selectedTile;

        // Add new tint to selected tile and update selectors' position
        this.selectedTile.setTint(0xa9a9a9);
        this.rowSelector.setPosition(400, this.selectedTile.y);
        this.colSelector.setPosition(this.selectedTile.x, 300);
        this.rowSelector.setVisible(true);
        this.colSelector.setVisible(true);
    }
}
