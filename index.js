const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (const file of files){
                let startPos = -1;
                while ((startPos = file.indexOf('// TODO ', startPos + 1)) != -1) {
                    const endPos = file.indexOf('\n',startPos + 1);
                    console.log(file.slice(startPos,endPos));
                }
            }
            break;
        case 'important':
            for (const file of files){
                let startPos = -1;
                while ((startPos = file.indexOf('// TODO ', startPos + 1)) != -1) {
                    const v = file.indexOf('!', startPos + 1);
                    const endPos = file.indexOf('\n',startPos + 1);
                    if (v !== -1 && v < endPos) {
                        console.log(file.slice(startPos, endPos));
                    }
                }
            }
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
