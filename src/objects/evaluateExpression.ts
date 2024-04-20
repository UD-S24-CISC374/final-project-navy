function safeEval(expression: string): boolean {
    try {
        return eval(expression) as boolean;
    } catch (error) {
        // Handle the error here, or simply return null if you want to ignore it
        //console.error("Error evaluating expression:", error);
        return false;
    }
}

// Specifically for cases where "true || is the first part of an expression"
function orEval(expression: string): boolean | null {
    try {
        return eval(expression) as boolean;
    } catch (error) {
        // Handle the error here, or simply return null if you want to ignore it
        //console.error("Error evaluating expression:", error);
        return null;
    }
}

const logicalOperators: { [key: string]: string } = {
    And: "&&",
    Or: "||",
    Not: "!",
    True: "true",
    False: "false",
};

export function evaluateExpression(expression: string[]): boolean {
    // Check if the expression starts or ends with invalid operators
    // Construct the expression string
    let result = "";
    if (expression[0] === "True" && expression[1] === "Or") {
        for (let i = 2; i < expression.length; i++) {
            const tileType = expression[i];
            result += logicalOperators[tileType];
        }
        let calc = orEval(result) as boolean | null;
        console.log(
            "result is: " +
                logicalOperators[expression[0]] +
                logicalOperators[expression[1]] +
                result
        );
        if (calc === null) {
            return false;
        } else {
            return true;
        }
    } else if (
        expression[0] === "Not" &&
        expression[1] === "False" &&
        expression[2] === "Or"
    ) {
        for (let i = 3; i < expression.length; i++) {
            const tileType = expression[i];
            result += logicalOperators[tileType];
        }
        let calc = orEval(result) as boolean | null;
        console.log(
            "result is: " +
                logicalOperators[expression[0]] +
                logicalOperators[expression[1]] +
                logicalOperators[expression[2]] +
                result
        );
        if (calc === null) {
            return false;
        } else {
            return true;
        }
    } else {
        for (let i = 0; i < expression.length; i++) {
            const tileType = expression[i];
            result += logicalOperators[tileType];
        }
        console.log("result is: " + result);
        // Evaluate the expression using eval() and return the result
        return safeEval(result) as boolean;
    }
}
