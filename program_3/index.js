// GLOBAL VARIABLES ----------------------------------------------------------------------------------------------------

const DATA = [
    ['Client A',1001,110,91,20100,19010,121,101,10100,9510],
    ['Client B',1002,120,92,20200,19020,122,102,10200,9520],
    ['Client C',1003,130,93,20300,19030,123,103,10300,9530],
    ['Client D',1005,150,95,20500,19050,125,105,10500,9550],
    ['Client E',1006,160,96,20600,19060,126,106,10600,9560],
    ['Client F',1007,170,97,20700,19070,127,107,10700,9570],
    ['Client G',1008,180,98,20800,19080,128,108,10800,9580]
];

class Client {

    constructor(arr) {
        arr.forEach((value,i) => this[Client.Properties[i]] = value);
    }

    static Properties = Object.freeze([
        'Name',
        'Client Id',
        'Pull Total',
        'Pull Successful Count',
        'Pull Amount',
        'Pull Successful Amount',
        'Push Total',
        'Push Successful Count',
        'Push Amount',
        'Push Successful Amount'
    ]);
}

const CLIENTS = DATA.map(clientArr => new Client(clientArr));

// COMPONENT STATE -----------------------------------------------------------------------------------------------------

let sortBy = Client.Properties[0];
let isAsc = true;

// HANDLERS ------------------------------------------------------------------------------------------------------------

const setSortBy = property => () => {
    if (property === sortBy) {
        isAsc = !isAsc;
    } else {
        sortBy = property;
        isAsc = true;
    }
    main(); // updates html
};

// COMPONENTS ----------------------------------------------------------------------------------------------------------

const Table = () => {
    const table = document.createElement('table');

    // create table header
    const header = document.createElement('tr');
    header.className = 'header';
    Client.Properties.forEach(property => {
        const th = document.createElement('th');
        th.innerHTML = `${property} <div class="arrow-btn">${sortBy === property ? (isAsc ? '&#9660;' : '&#9650;') : ''}</div>`;
        th.onclick = setSortBy(property);
        header.appendChild(th)
    });

    // attach header
    table.appendChild(header);

    // create table rows
    CLIENTS.sort((a,b) => isAsc ? cmp(a[sortBy],b[sortBy]) : cmp(b[sortBy],a[sortBy]));
    const body = CLIENTS.map(client => {
        const tr = document.createElement('tr');
        Client.Properties.forEach(property => {
            const td = document.createElement('td');
            if (property !== 'Client Id') {
                td.innerText = client[property].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            } else {
                td.innerText = `#${client[property]}`;
            }
            td.className = property;
            tr.appendChild(td);
        });
        return tr;
    });

    // attach body
    body.forEach(child => table.appendChild(child));

    return table;
};

// METHODS -------------------------------------------------------------------------------------------------------------

const main = () => {
    const root = document.querySelector("#root");
    removeChildren(root);
    root.appendChild(Table());
};

const addEventListeners = () => {
    window.addEventListener("keydown", e => {
        switch(e.key) {
            case "ArrowUp":
                isAsc = false;
                main();
                break;
            case "ArrowDown":
                isAsc = true;
                main();
                break;
            case "ArrowLeft":
                const a = Client.Properties.findIndex(item => item === sortBy);
                const b = mod(a - 1, Client.Properties.length);
                sortBy = Client.Properties[b];
                main();
                break;
            case "ArrowRight":
                console.log("right");
                const c = Client.Properties.findIndex(item => item === sortBy);
                const d = mod(c + 1, Client.Properties.length);
                sortBy = Client.Properties[d];
                main();
                break;
            default:
                break;
        }
    });
};

// UTIL ----------------------------------------------------------------------------------------------------------------

/**
 * @param node ${Node}
 */
const removeChildren = node => {
    Array.from(node.children).forEach(child => node.removeChild(child));
};

const cmp = (a,b) => {
    if (typeof a === 'string' && typeof b === 'string') {
        return lexicographic(a,b)
    } else if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
    }
};

const lexicographic = (a,b) => {
    const MIN_LENGTH = Math.min(a.length, b.length);
    for (let i = 0; i < MIN_LENGTH; i++) {
        if (a[i] !== b[i]) {
            return a.charCodeAt(i) - b.charCodeAt(i);
        }
    }
    return a.length - b.length;
};

/**
 * @param a {int}
 * @param n {int}
 */
const mod = (a,n) => ((a % n) + n) % n;

// SETUP ---------------------------------------------------------------------------------------------------------------

main();
addEventListeners();