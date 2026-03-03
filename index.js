const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTodos(files){
    const todos = [];
    for (const file of files){
        let startPos = -1;
        while ((startPos = file.indexOf('// TODO ', startPos + 1)) != -1) {
            const ob = {};
            todos.push(ob);
            const endPos = file.indexOf('\n',startPos + 1);
            const str = file.slice(startPos + 8, endPos);
            ob.text = str;

            const splittedCom = str.split(";");
            if (splittedCom.length === 3) {
                const userName = splittedCom[0].trim();
                const dateString = splittedCom[1].trim();

                ob.user = userName;

                const parsedDate = new Date(dateString);

                if (!isNaN(parsedDate.getTime())) {
                    ob.date = parsedDate;
                }
                ob.text = splittedCom[2];
            }
            const importance = str.split('!').length - 1;
            ob.importance = importance;
            
        }
    }
    return todos
}

function parseCoolDate(dateString){
    if (!dateString) return null;

    const parts = dateString.trim().split('-');

    const year = Number(parts[0]);
    const month = parts.length > 1 ? Number(parts[1]) - 1 : 0;
    const day = parts.length > 2 ? Number(parts[2]) : 1;

    if (
        isNaN(year) ||
        (parts.length > 1 && isNaN(month)) ||
        (parts.length > 2 && isNaN(day))
    ) {
        return null;
    }

    const date = new Date(year, month, day);

    return isNaN(date.getTime()) ? null : date;
}

function formatTodo(todo) {
    const widths = {
        importance: 1,
        user: 10,
        date: 10,
        text: 50
    };

    function formatValue(value, maxWidth) {
        if (value === undefined || value === null) value = '';
        value = String(value);
        
        if (value.length > maxWidth) {
            return value.slice(0, maxWidth - 3) + '...';
        }
        return value.padEnd(maxWidth, ' ');
    }
    
    function formatDate(date) {
        if (!date) return '';
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    const importance = todo.importance > 0 ? '!' : '';
    const user = todo.user || '';
    const date = todo.date ? formatDate(todo.date) : '';
    const text = todo.text || '';

    return `${formatValue(importance, widths.importance)}  |  ${formatValue(user, widths.user)}  |  ${formatValue(date, widths.date)}  |  ${formatValue(text, widths.text)}`;
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
            for(const todo of getTodos(files)){
                console.log(formatTodo(todo));
            }
            break;
        case 'important':
            for(const todo of getTodos(files)){
                if(todo.importance >0){
                    console.log(formatTodo(todo));
                }
            }
            break;
        case "user":
            if(args.length!=1) break;
            const userToFind = args[0];
            for(const todo of getTodos(files)){
                if(todo.user === userToFind){
                    console.log(formatTodo(todo));
                }
            }
            break;
        case 'sort':
            if(args.length!=1) break;
            const variant = args[0];
            
            const todos = getTodos(files);
            const sorted = [];

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
            for (const todo of sorted) {
                console.log(formatTodo(todo));
            }
            break;
        case 'date':
            if(args.length!=1) break;
            const date = parseCoolDate(args[0]);
            for(const todo of getTodos(files)){
                if(todo.date && todo.date>date){
                    console.log(formatTodo(todo));
                }
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
