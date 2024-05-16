let storyTriggered: boolean = false;
let level1Reset: boolean = false;
let level1Win: boolean = false;
let level1Lose: boolean = false;

let level2Reset: boolean = false;
let level2Win: boolean = false;
let level2Lose: boolean = false;

let level3Reset: boolean = false;
let level3Win: boolean = false;
let level3Lose: boolean = false;

// Define the function to display match history
function displayMatchHistory(matchList: string[]) {
    console.log("Match History:");
    matchList.forEach((match, index) => {
        console.log(`${index + 1}: ${match}`);
    });
}

module.exports = {
    storyTriggered: storyTriggered,
    level1Reset: level1Reset,
    level1Win: level1Win,
    level1Lose: level1Lose,
    level2Reset: level2Reset,
    level2Win: level2Win,
    level2Lose: level2Lose,
    level3Reset: level3Reset,
    level3Win: level3Win,
    level3Lose: level3Lose,
    displayMatchHistory: displayMatchHistory, // Export the function
};
