// ENUMS ---------------------------------------------------------------------------------------------------------------

const TYPE = Object.freeze({
    FILE: 'File',
    FOLDER: 'Folder'
});

// COMPONENTS ----------------------------------------------------------------------------------------------------------

class FileSystemUnit {

    constructor(type, label) {
        this.type = type;
        this.label = label;
    }

    addParent(parent) {this.parent = parent;}

    update() {
        if (this.parent instanceof HTMLElement) {
            removeChildren(this.parent);
            this.parent.appendChild(this.render());
        } else {
            this.parent.update();
        }
    }

    render() {} // Should Override in extension
}

class File extends FileSystemUnit {

    constructor(label) {
        super(TYPE.FILE, label);
    }

    render() {
        const div = document.createElement('div');
        div.innerHTML = `&#9673; ${this.label}`;
        return div;
    }
}

class Folder extends FileSystemUnit {

    constructor(label, children) {
        super(TYPE.FOLDER, label);
        this.isOpen = false;
        children.sort((a,b) => { // put folders in front of files
            const typeA = a.type;
            const typeB = b.type;
            if (typeA === TYPE.FOLDER && typeB === TYPE.FILE) return -1;
            if (typeA === TYPE.FILE && typeB === TYPE.FOLDER) return 1;
            return 0;
        });
        this.children = children;
        this.parent = null;
        this.max_children = 30;
    }

    toggle() {
        this.isOpen = !this.isOpen;
        if (this.parent && this.parent.type === TYPE.FOLDER && this.parent.children.length) {
            this.parent.children.forEach(child => { // close other children
                if (child !== this) child.isOpen = false;
            });
        }
        this.update();
    }

    updateMax() {
        this.max_children += 30;
        this.update();
    }

    /**
     * @desc Renders the element according to its properties.
     * @returns {HTMLDivElement}
     */
    render() {
        const root = document.createElement('div');
        const label = document.createElement('div');
        label.className = 'label';
        label.onclick = this.toggle.bind(this);

        if (this.isOpen) {
            label.innerHTML = `&#9660; ${this.label}`;
            root.appendChild(label);

            const childrenElement = document.createElement('div'); // add children
            childrenElement.className = 'children';
            if (this.children.length > this.max_children) {

                // append the non-observed children
                this.children.slice(0,this.max_children).map(child => childrenElement.appendChild(child.render()));

                let observer = new IntersectionObserver(createObserverCB(this.updateMax.bind(this)),{threshold: 1});
                const lastChild = this.children[this.max_children].render();
                lastChild.className = `${lastChild.className} observer`;
                observer.observe(lastChild);

                // append observed last child
                childrenElement.appendChild(lastChild);
            } else {
                this.children.slice(0,this.max_children).map(child => childrenElement.appendChild(child.render()));
            }
            root.appendChild(childrenElement);
        } else {
            label.innerHTML = `&#9658; ${this.label}`;
            root.appendChild(label);
        }
        return root;
    }
}

// FILE SYSTEM ---------------------------------------------------------------------------------------------------------

/**
 * @desc Mock API call to backend.
 */
const fetchFileSystem = () => {
    // const {data} = fetch(url)
    return {
        label: 'Root',
        type: TYPE.FOLDER,
        children: [
            {
                label: 'Parent A',
                type: TYPE.FOLDER,
                children: [
                    {label: 'Child A1', type: TYPE.FILE},
                    {
                        label: 'ChildParentA2',
                        type: TYPE.FOLDER,
                        children: [{label: 'Child A21', type: TYPE.FILE}, {label: 'Child A22', type: TYPE.FILE}]
                    }
                ]
            },
            {
                label: 'Parent B',
                type: TYPE.FOLDER,
                children: [
                    ...[...Array(1000).keys()].map(i => ({label: `Child B${i + 1}`, type: TYPE.FILE})),
                    {
                        label: 'Child Parent B1001',
                        type: TYPE.FOLDER,
                        children: []
                    }
                ]
            }
        ]
    }
};

// UTIL ----------------------------------------------------------------------------------------------------------------

/**
 * @param node ${Node}
 */
const removeChildren = node => {
    Array.from(node.children).forEach(child => node.removeChild(child));
};

/**
 * @param fileSystem
 * @desc Given some file system, generate a tree using DFS.
 */
const generateTree = fileSystem => {
    if (fileSystem.type === TYPE.FILE) {
        return new File(fileSystem.label);
    }
    const children = fileSystem.children.map(generateTree);
    const parentFolder = new Folder(fileSystem.label, children);
    children.forEach(child => child.addParent(parentFolder));
    return parentFolder;
};

/**
 * @desc HOF for an intersection observer callback.
 */
const createObserverCB = callback => (entries, observer) => {
    entries.forEach(entry => {
        if (entry.intersectionRatio === 1){
            debounce(callback, 3000)(); // debounced for explaining
        }
    });
};

/**
 * @param callback
 * @param ms
 * @desc A generic debounce HOF.
 */
const debounce = (callback,ms) => {
    let id;
    return () => {
        const later = () => {
            id = null;
            callback();
        };
        clearTimeout(id);
        id = setTimeout(later, ms);
    }
};

// METHODS -------------------------------------------------------------------------------------------------------------

const main = () => {
    const rootElement = document.querySelector("#root");
    const root = generateTree(fetchFileSystem());
    root.addParent(rootElement);
    root.update();
};

// SET UP --------------------------------------------------------------------------------------------------------------

main();

