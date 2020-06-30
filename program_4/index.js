// COMPONENT STATE -----------------------------------------------------------------------------------------------------

let showModal = false;
let form = {
    cardNumber: '',
    expDate: '',
    securityCode: '',
    name: ''
};

// COMPONENTS ----------------------------------------------------------------------------------------------------------

const Overlay = children => {
    const div = document.createElement('div');
    div.className = "overlay";
    div.onclick = e => {
        if (e.target === e.currentTarget) {
            showModal = false;
            main();
        }
    };
    div.appendChild(Modal(children));
    return div;
};

const Modal = children => {
    const div = document.createElement('div');
    div.className = "modal";
    div.appendChild(children);
    return div;
};

// METHODS -------------------------------------------------------------------------------------------------------------

const main = () => {
    if (showModal) {
        const body = document.querySelector('body');
        const div = document.createElement('div');
        div.className = "modal-text";
        div.innerHTML = `
                <div class="row">
                    <div class="label">Card Number:</div>
                    <div class="input">${form.cardNumber}</div>
                </div>
                <div class="row">
                    <div class="label">Expiration Date:</div>
                    <div class="input">${form.expDate}</div>
                </div>
                <div class="row">
                    <div class="label">Security Code:</div>
                    <div class="input">${form.securityCode}</div>
                </div>
                   <div class="row">
                    <div class="label">Name:</div>
                    <div class="input">${form.name}</div>
                </div>
         `;
        body.appendChild(Overlay(div));
    } else {
        const body = document.querySelector('body');
        const overlay = document.querySelector('.overlay');
        overlay && body.removeChild(overlay);
    }
};

const addHandlers = () => {
    const btn = document.querySelector('#is');
    btn.onclick = e => {
        form.cardNumber = document.querySelector("#i1").value;
        form.expDate = document.querySelector("#i2").value;
        form.securityCode = document.querySelector("#i3").value;
        form.name = document.querySelector("#i4").value;
        showModal = true;
        main();
        e.preventDefault();
    };
};

// SETUP ---------------------------------------------------------------------------------------------------------------

main();
addHandlers();