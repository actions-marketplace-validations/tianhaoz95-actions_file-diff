import * as core from '@actions/core';
import differ from 'diff';
import fs from 'fs';

const getColoredLog = (diffResult: differ.Change): string => {
    let diffContent = diffResult.value;
    // See https://en.wikipedia.org/wiki/ANSI_escape_code
    // for all the color codes.
    let diffPrefix = '\u001b[37m'; // White
    if (diffResult.added) {
        return '\u001b[92m'; // Bright Green
    }
    if (diffResult.removed) {
        return '\u001b[35m'; // Magenta
    }
    return diffPrefix + diffContent;
}

const main = (): void => {
    const lhs = core.getInput('lhs');
    const rhs = core.getInput('rhs');
    // TODO(tianhaoz95): change this to getBooleanInput once
    // it becomes available.
    const fail = core.getInput('fail') === 'true';
    const lhsContent = fs.readFileSync(lhs).toString();
    const rhsContent = fs.readFileSync(rhs).toString();
    const diffResult = differ.diffChars(lhsContent, rhsContent);
    if (diffResult.length === 0) {

    } else {
        let loggingContent: string = '';
        diffResult.forEach((part: differ.Change): void => {
            loggingContent += getColoredLog(part);
        });
        core.info(loggingContent);
        if (fail) {
            core.setFailed(
                `There are ${diffResult.length} differences 
                in content of ${lhs} and ${rhs}`);
        }
    }
}

main();