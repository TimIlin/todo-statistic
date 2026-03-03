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
    const splitted = command.split(" ");
    const com = splitted[0];
    const args = splitted.slice(1);
    switch (com) {
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
            break;
        case "user":
            if(args.length!=1) break;
            const userToFind = args[0];
            for (const file of files){
                let startPos = -1;
                while ((startPos = file.indexOf('// TODO ', startPos + 1)) != -1) {
                    const endPos = file.indexOf('\n',startPos + 1);
                    const str = file.slice(startPos + 8, endPos);
                    const splittedCom = str.split(";");
                    if(splittedCom.length != 3) break;
                    const userName = splittedCom[0].trim();
                    if(userName == userToFind){
                        console.log(file.slice(startPos, endPos));
                    }
                }
            }
            break;
        case 'sort':
            if(args.length!=1) break;
            const variant = args[0];
            const todos = [];
            for (const file of files){
                let startPos = -1;
                while ((startPos = file.indexOf('// TODO ', startPos + 1)) != -1) {
                    const ob = {};
                    todos.push(ob);
                    const endPos = file.indexOf('\n',startPos + 1);
                    const str = file.slice(startPos + 8, endPos);
                    const splittedCom = str.split(";");
                    if (splittedCom.length === 3) {
                        const userName = splittedCom[0].trim();
                        const dateString = splittedCom[1].trim();

                        ob.user = userName;

                        const parsedDate = new Date(dateString);

                        if (!isNaN(parsedDate.getTime())) {
                            ob.date = parsedDate;
                        }
                    }
                    const importance = str.split('!').length - 1;
                    ob.importance = importance;
                    ob.text = file.slice(startPos, endPos);
                }
            }
            let sorted = [];

            switch(variant) {
                case 'importance':
                    sorted = todos.sort((a, b) => {
                            if (a.importance !== b.importance) {
                                return b.importance - a.importance;
                            }
                            return 0;
                        }
                    );
                    break;
                case 'user':
                    sorted = todos.sort((a, b) => {
                        if (a.user && !b.user) return -1;
                        if (!a.user && b.user) return 1;
                        if (a.user && b.user) {
                            return a.user.localeCompare(b.user);
                        }
                        return 0;
                    });
                    break;
                case 'date':
                    sorted = todos.sort((a, b) => {
                        if (a.date && b.date) {
                            return b.date - a.date;
                        }
                        if (a.date && !b.date) return -1;
                        if (!a.date && b.date) return 1;
                        return 0;
                    });
                    break;
                }
            for (let element of sorted) {
                console.log(`${element.text}${element.importance}`);
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
