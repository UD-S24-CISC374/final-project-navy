import Phaser from "phaser";
import { Button } from "../objects/button";
import { playMusic, stopMusic } from "../objects/musicManager";

export default class SIntroScene extends Phaser.Scene {
    private storyText: Phaser.GameObjects.Text;
    private textContainer: Phaser.GameObjects.Container;
    private currentDialogue: string[] = [];
    private currentDialogueIndex: number = 0;
    private typingSpeed: number = 20;
    private isTyping: boolean = false;
    private timer: Phaser.Time.TimerEvent | null = null;

    constructor() {
        super({ key: "SIntroScene" });
    }

    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // stopMusic("MainSong");
        // playMusic(this, "IntroSong");
        //this.sound.pauseOnBlur = false;

        this.add.text(300, 100, "Intro Scene", {
            fontSize: "32px",
            color: "black",
        });

        new Button(
            this,
            700,
            30,
            "Skip",
            {
                fontSize: "25px",
                color: "black",
            },
            () => {
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.cameras.main.on(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    () => {
                        stopMusic("IntroSong");
                        playMusic(this, "MainSong");
                        this.scene.start("SelectScene");
                    }
                );
            }
        );

        this.add.image(400, 480, "Textbox");
        const arrowButton = this.add
            .image(650, 500, "textbox-arrow")
            .setTint(0x7b5e57);
        arrowButton.setInteractive();

        this.add.text(156, 418, "Greebus", {
            fontSize: "25px",
            color: "white",
            align: "center",
        });

        this.textContainer = this.add.container(140, 460);

        this.storyText = this.add.text(10, 10, "", {
            fontSize: "20px",
            color: "white",
        });
        this.storyText.setWordWrapWidth(480);

        const containerBackground = this.add.graphics();
        //containerBackground.fillStyle(0x00ff00, 0.5);
        containerBackground.fillRect(0, 0, 480, 80);
        this.textContainer.add(containerBackground);
        this.textContainer.add(this.storyText);

        arrowButton.on("pointerdown", () => {
            if (this.isTyping) {
                // If typing animation is in progress, stop the animation and display all the text
                if (this.timer) {
                    this.timer.destroy();
                }
                this.storyText.setText(
                    this.currentDialogue[this.currentDialogueIndex - 1]
                );
                this.isTyping = false;
            } else {
                // If not typing, show next dialogue segment or start typing animation
                if (this.currentDialogueIndex < this.currentDialogue.length) {
                    this.typeDialogue(
                        this.currentDialogue[this.currentDialogueIndex]
                    );
                    this.currentDialogueIndex++;
                } else {
                    // If there's no more dialogue left, reset variables and clear text
                    this.currentDialogue = [];
                    this.currentDialogueIndex = 0;
                    this.storyText.setText("");
                    this.cameras.main.fadeOut(500, 0, 0, 0);
                    this.cameras.main.on(
                        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                        () => {
                            stopMusic("IntroSong");
                            playMusic(this, "MainSong");
                            this.scene.start("SelectScene");
                        }
                    );
                }
            }
        });

        // this.dialogue(
        //     "humans think is impossible. Yellow, black. Yellow, black. Yellow, black. Yellow, black. Ooh, black and yellow!"
        // );
        this.dialogue("...");
        this.dialogue("...Oh! Sorry, didn't see ya there");
        this.dialogue("My name's Greebus, Greebus the green frog!");
        this.dialogue(
            "I haven't seen you around here before...you must be new!"
        );
        this.dialogue(
            "So newbie, do you think you can help me out with something? I've got a bit of a problem."
        );
        this.dialogue(
            "You see, the frogs here celebrate a special event known as the annual frog festival."
        );
        this.dialogue(
            "This is a big deal for us frog folk. A tradition passed down from the elders."
        );
        this.dialogue(
            "Each year after sunset, friends and family from distant lands gather together to celebrate our reunion."
        );
        this.dialogue(
            "This year was supposed to be the same, but we had a small accident when setting up for the event."
        );
        this.dialogue(
            "The frogs moving the lighting equipment lost their footing and dropped all the decorations."
        );
        this.dialogue(
            "Since the repair frog is out of town for the festival, we haven't been able to find anyone to fix the lights."
        );
        this.dialogue(
            "The repair frog left some notes in case anything went wrong, but we can't quite figure out what to do."
        );
        this.dialogue(
            "With your help though, I'm sure we can figure this out in no time! So, let's get to work!"
        );
    }

    update() {}

    dialogue(dialogue: string) {
        console.log("Adding dialogue:", dialogue);
        this.currentDialogue.push(dialogue);
        if (this.currentDialogue.length === 1) {
            console.log("Starting to show dialogue...");
            this.showNextDialogue();
        }
    }

    showNextDialogue() {
        console.log("Showing next dialogue...");
        if (this.currentDialogueIndex < this.currentDialogue.length) {
            this.typeDialogue(this.currentDialogue[this.currentDialogueIndex]);
            this.currentDialogueIndex++;
        } else {
            this.currentDialogue = [];
            this.currentDialogueIndex = 0;
            this.storyText.setText("");
        }
    }

    typeDialogue(dialogue: string) {
        console.log("Typing dialogue:", dialogue);
        this.isTyping = true;
        this.storyText.setText("");
        let index = 0;
        this.timer = this.time.addEvent({
            delay: this.typingSpeed,
            callback: () => {
                this.storyText.setText(dialogue.substr(0, index));
                index++;
                if (index > dialogue.length) {
                    if (this.timer) {
                        this.timer.destroy();
                    }
                    this.isTyping = false;
                }
            },
            loop: true,
        });
    }
}
