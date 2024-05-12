import Phaser from "phaser";

export function createHelpDisplay(scene: Phaser.Scene) {
    // Create background for the help display
    const helpDisplay = scene.add.image(800, 75, "HelpBox");
    helpDisplay.setOrigin(0, 0);
    helpDisplay.setDepth(1); // Set depth to overlay other elements

    const helpContainer = scene.add.container(825, 100);

    // Add help text
    const helpText = scene.add.text(
        15,
        30,
        "Text in the help section\nmore text\nmore text\neeyup more text\nText in the help section\nmore text\nmore text\neeyup more text",
        {
            fontSize: "15px",
            color: "white",
        }
    );
    helpText.setWordWrapWidth(260); // Adjust width for wrapping
    //this.helpContainer.setInteractive(); // Enable input for scrolling

    // Add background color to the container for visualization
    const containerBackground = scene.add.graphics();
    containerBackground.fillStyle(0x00ff00, 0.5); // Green color with 50% opacity
    containerBackground.fillRect(15, 30, 265, 450); // Adjust size as needed
    helpContainer.add(containerBackground); // Add background to the container
    helpContainer.setDepth(2); // Set depth to overlay other elements

    helpContainer.add(helpText);
    helpContainer.add(
        scene.add.text(120, -18, "Help", {
            fontSize: "25px",
            color: "white",
        })
    );

    // Hide help display initially
    helpDisplay.visible = false;
    helpContainer.visible = false;

    return { helpDisplay, helpContainer };
}

export function toggleHelpDisplay(
    scene: Phaser.Scene,
    helpDisplay: Phaser.GameObjects.Image,
    helpContainer: Phaser.GameObjects.Container
) {
    // Check if help display is currently visible
    const isHelpVisible = helpDisplay.visible;

    // Define the final x-coordinate for the display
    const finalX = isHelpVisible ? 800 : 500;

    if (!isHelpVisible) {
        // If help display is not visible, slide in
        helpDisplay.visible = true; // Make help display visible
        helpContainer.visible = true; // Make help container visible

        scene.tweens.add({
            targets: [helpDisplay, helpContainer],
            x: finalX, // Slide to the final x-coordinate
            ease: "Power1",
            duration: 400, // Animation duration in milliseconds
        });
    } else {
        // If help display is visible, slide out
        scene.tweens.add({
            targets: [helpDisplay, helpContainer],
            x: finalX, // Slide to the final x-coordinate
            ease: "Power1",
            duration: 400, // Animation duration in milliseconds
            onComplete: () => {
                helpDisplay.visible = false; // Hide help display after sliding out
                helpContainer.visible = false; // Hide help container after sliding out
            },
        });
    }
}
