import Phaser from "phaser";
import { playMusic, stopMusic } from "../objects/musicManager";
import { generateRandomBoard } from "../objects/generateBoard";
import { evaluate9x9Expression } from "../objects/evaluateExpression";
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

const globals = require("../objects/globalVars");

export default class Level3PlayScene extends Phaser.Scene {
    constructor() {
        super({ key: "Level3PlayScene" });

        // added multiples to adjust probability of each tile
        this.tileTypes = [
            "True",
            "True",
            "True",
            "False",
            "False",
            "False",
            "And",
            "And",
            "Or",
            "Or",
            "Not",
            "Not",
            "Equals",
            "Equals",
            "LParen",
            "LParen",
            "RParen",
            "RParen",
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
    private matchList: string[] = [];

    private hasMoved: boolean = false; // Track if any movement has happened
    private turnCount: number = 40; // Track the number of turns
    private turnText: Phaser.GameObjects.Text;
    private reqText: { [key: string]: Phaser.GameObjects.Text } = {};

    private matchReq: { [key: string]: number } = {
        "()": 5,
        "!, T, F": 5,
        "no &": 3,
        "no |": 3,
    };

    private reqCounts: { [key: string]: number } = {
        "()": 0,
        "!, T, F": 0,
        "no &": 0,
        "no |": 0,
    };

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

        this.add.image(125, 322, "ReqBg");
        this.add.image(400, 350, "Board 9x9");
        this.rowSelector = this.add.image(360, 220, "RS 9x9");
        this.colSelector = this.add.image(320, 300, "CS 9x9");

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

        this.add.text(50, 250, "Requirements:", {
            fontSize: "20px",
            color: "white",
        });
        let yPos = 280;
        for (const type in this.reqCounts) {
            this.reqText[type] = this.add.text(
                50,
                yPos,
                `${type}: 0/${this.reqCounts[type]}`,
                {
                    fontSize: "20px",
                }
            );
            yPos += 30;
        }
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
            this.matchList = gameState.matchList || [];

            this.scoreText.setText("Matches: " + this.score);
            this.recentMatchText.setText("Recent Match:\n" + this.recentMatch);
            this.turnText.setText("Turns: " + this.turnCount);
        } else {
            // If players are playing game for first time, initialize values
            this.board = generateRandomBoard(9, 9, this.tileTypes);
            this.score = 0;
            this.recentMatch = "";
            this.turnCount = 40;
            this.matchList = [];
            this.reqCounts = {
                "()": 0,
                "!, T, F": 0,
                "no &": 0,
                "no |": 0,
            };

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
            this.turnCount = 40;
            this.matchList = [];
            this.reqCounts = {
                "()": 0,
                "!, T, F": 0,
                "no &": 0,
                "no |": 0,
            };

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
            createArrowAnimation(
                this,
                this.arrows,
                605,
                this.selectedTile.y,
                430,
                "right"
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
            createArrowAnimation(
                this,
                this.arrows,
                195,
                this.selectedTile.y,
                430,
                "left"
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
            createArrowAnimation(
                this,
                this.arrows,
                this.selectedTile.x,
                555,
                430,
                "down"
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
            createArrowAnimation(
                this,
                this.arrows,
                this.selectedTile.x,
                145,
                430,
                "up"
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

        let allReqMet: boolean = true;
        for (const type in this.matchReq) {
            if (this.reqCounts[type] < this.matchReq[type]) {
                allReqMet = false;
                break;
            }
        }

        for (const type in this.reqCounts) {
            const requirementsMet: number = this.reqCounts[type];
            const requiredCount: number = this.matchReq[type];

            // Check if requiredCount is defined
            if (typeof requiredCount === "undefined") {
                continue; // Skip processing if requiredCount is undefined
            }

            // Check if the player has met the requirement for this type
            const requirementMet: boolean = requirementsMet >= requiredCount;

            // Update the corresponding text element
            const textElement = this.reqText[type];
            if (textElement instanceof Phaser.GameObjects.Text) {
                textElement.setText(
                    `${type}: ${requirementsMet}/${requiredCount}`
                );

                // Optionally, change text color based on completion status
                textElement.setColor(requirementMet ? "green" : "red");
            }
        }

        if (globals.level3Win) {
            this.scene.start("Level3WinScene");
        } else if (globals.level3Lose) {
            this.scene.start("Level3LoseScene");
        }

        if (this.turnCount >= 0 && allReqMet) {
            stopMusic("L3Song");
            globals.level3Win = true;
            this.scene.start("Level3WinScene");
        }

        if (this.turnCount === 0 && !allReqMet) {
            stopMusic("L3Song");
            globals.level3Lose = true;
            this.scene.start("Level3LoseScene");
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
            matchList: this.matchList,
        };
        localStorage.setItem("level3GameState", JSON.stringify(gameState));
    }

    // Function to reset game state
    resetGameState() {
        // Reset the values
        this.board = generateRandomBoard(9, 9, this.tileTypes);
        this.score = 0;
        this.recentMatch = "";
        this.turnCount = 40;
        this.matchList = [];
        this.reqCounts = {
            "()": 0,
            "!, T, F": 0,
            "no &": 0,
            "no |": 0,
        };

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

                let foundT: boolean = false;
                let foundF: boolean = false;
                let foundNot: boolean = false;
                let foundOr: boolean = false;
                let foundAnd: boolean = false;
                let foundLParen: boolean = false;
                let foundRParen: boolean = false;
                convertVals.forEach((value) => {
                    if (value === "T") {
                        foundT = true;
                    } else if (value === "F") {
                        foundF = true;
                    } else if (value === "!") {
                        foundNot = true;
                    } else if (value === "|") {
                        foundOr = true;
                    } else if (value === "&") {
                        foundAnd = true;
                    } else if (value === "(") {
                        foundLParen = true;
                    } else if (value === ")") {
                        foundRParen = true;
                    }
                });
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (foundLParen && foundRParen) {
                    this.reqCounts["()"]++;
                    console.log("Incremented Both Parens");
                }

                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (foundNot && foundT && foundF) {
                    this.reqCounts["!, T, F"]++;
                    console.log("Incremented Not, True, and False");
                }

                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (!foundAnd) {
                    this.reqCounts["no &"]++;
                    console.log("Incremented No And");
                }

                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (!foundOr) {
                    this.reqCounts["no |"]++;
                    console.log("Incremented No Or");
                }

                this.recentMatch = convertVals.join(" ");
                this.matchList.push(this.recentMatch);
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

                let foundT: boolean = false;
                let foundF: boolean = false;
                let foundNot: boolean = false;
                let foundOr: boolean = false;
                let foundAnd: boolean = false;
                let foundEquals: boolean = false;
                let foundLParen: boolean = false;
                let foundRParen: boolean = false;
                convertVals.forEach((value) => {
                    if (value === "T") {
                        foundT = true;
                    } else if (value === "F") {
                        foundF = true;
                    } else if (value === "!") {
                        foundNot = true;
                    } else if (value === "|") {
                        foundOr = true;
                    } else if (value === "&") {
                        foundAnd = true;
                    } else if (value === "=") {
                        foundEquals = true;
                    } else if (value === "(") {
                        foundLParen = true;
                    } else if (value === ")") {
                        foundRParen = true;
                    }
                });
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (foundLParen && foundRParen) {
                    this.reqCounts["()"]++;
                    console.log("Incremented Both Parens");
                }

                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (foundNot && foundT && foundF) {
                    this.reqCounts["!, T, F"]++;
                    console.log("Incremented Not, True, and False");
                }

                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    foundT &&
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    foundF &&
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    foundNot &&
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    foundOr &&
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    foundAnd &&
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    foundEquals &&
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    foundLParen &&
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    foundRParen
                ) {
                    this.reqCounts["(all)"]++;
                    console.log("Incremented all tiles");
                }

                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (!foundOr) {
                    this.reqCounts["no |"]++;
                    console.log("Incremented No Or");
                }

                this.recentMatch = convertVals.join(" ");
                this.matchList.push(this.recentMatch);
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
