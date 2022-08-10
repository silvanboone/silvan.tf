var body = document.querySelector("body");

let i = 0;
setTimeout(demo, 1000);


var directory = {};
var current_directory;

fetch("./directory.json")
    .then(response => response.json())
    .then(data => directory = data);

class Command {
    constructor(name, desc, func) {
        this.name = name;
        this.desc = desc;
        this.func = func;
    }
    run(args) {
        this.func(args);
    }
}

var commands = [
    new Command("cd", "Changes the current directory.", cd),
    new Command("cls", "Clears the screen.", cls),
    new Command("help", "Provides Help information for commands.", help),
    new Command("ls", "Displays a list of files and subdirectories in the directory.", ls),
];


function getPointer() {
    return document.querySelector(".active");
}

function makePointer(newlines = 2) {
    let active = getPointer();
    if (active) {
        active.innerHTML += "<br>".repeat(newlines);
        active.classList.remove("active");
    }

    let directory_style = current_directory ? current_directory : "root";

    let pointer = document.createElement("code");
    pointer.classList.add(`${directory_style}`, "active");

    body.appendChild(pointer);

    return;
}


function demo(text = "help") {
    let pointer = getPointer();

    if (i < text.length) {
        pointer.innerHTML += text.charAt(i);
        i++
        setTimeout(demo, 100);
        return;
    }

    setTimeout(enter, 500)
}


document.onkeydown = function (event) {
    if (!getPointer()) {
        return;
    }
    if (event.key === "Enter") {
        enter();
        return;
    }

    if (event.key === "Backspace") {
        backspace();
        return;
    }

    if (event.key.length !== 1) {
        return;
    }

    let pointer = getPointer();
    pointer.innerHTML += event.key;

    return;
}

function enter() {
    let pointer = getPointer();

    let input = pointer.innerHTML;

    pointer.innerHTML += "<br>";

    // empty input
    if (input.trim() === "") {
        makePointer(0);
        return;
    }

    for (let command of commands) {
        if (input.trim().toLowerCase().startsWith(command.name)) {
            args = input.trim().substring(command.name.length).trim();
            command.run(args);
            return;
        }
    }
    pointer.innerHTML += `'${input}' is not recognized as an internal or external command,<br>operable program or batch file.`;
    makePointer();
}

function backspace() {
    let pointer = getPointer();
    let input = pointer.innerHTML;
    pointer.innerHTML = input.substring(0, input.length - 1);

}



function help() {
    let pointer = getPointer();
    let pre = document.createElement("pre");

    for (let command of commands) {
        // capitalize command name

        pre.innerHTML += `${command.name.toUpperCase()} &#9; ${command.desc}<br>`;
    }

    pointer.appendChild(pre);

    makePointer(1);
}

function cls() {
    body.innerHTML = "<br>";
    makePointer();

}

function ls() {

    let pointer = getPointer();

    // if no directory is specified, display the current directory
    let directory_array = current_directory ? directory[current_directory] : directory;

    for (let key in directory_array) {
        // if the key is an index, grab its name instead
        item = directory_array[key].name ? directory_array[key].name : key;
        pointer.innerHTML += `${item}<br>`;
    }

    makePointer(1);

}

function cd(args) {

    let directory_array = current_directory ? directory[current_directory] : directory;
   
    if (args.length === 0) {
        current_directory = "";
        return makePointer(0);
    }

    if (args === "/" || args === "\\" || args === "..") {
        current_directory = "";
        return makePointer(1);
    }

    for (let key in directory_array) {
        if (key === args) {
            current_directory = key;
            return makePointer(1);
        }
        if (directory_array[key].name === args) {
            window.location.href = directory_array[key].url;
            return makePointer(1);
        }
    }

    console.table(directory_array);

    let pointer = getPointer();

    pointer.innerHTML += `'${args}' is not a valid location.`;

    makePointer();

}