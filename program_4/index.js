// ENUMS ---------------------------------------------------------------------------------------------------------------

const FORM_TYPE = Object.freeze({
   CARD_NUMBER: "0",
   EXP_DATE: "1",
   SECURITY_CODE: "2",
   NAME: "3"
});

const FORM_INITIAL_STATE = Object.freeze({
    cardNumber: '',
    expDate: '',
    securityCode: '',
    name: ''
});

// COMPONENT STATE -----------------------------------------------------------------------------------------------------

let showModal = false;
let form = {...FORM_INITIAL_STATE};

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

const renderModal = () => {
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

// HANDLERS ------------------------------------------------------------------------------------------------------------

const onChange = formType => e => {
    try {
        let {value} = e.target;
        const alphaRegex = new RegExp(/[a-z]+/, 'gi');
        switch(formType) {
            case FORM_TYPE.CARD_NUMBER:
                const onlyNums = value.split(" ").join("");
                if (onlyNums && onlyNums.length % 4 === 0) value += " ";
                if (!alphaRegex.test(value) && value.length < 25) {
                    form.cardNumber = value;
                }
                break;
            case FORM_TYPE.EXP_DATE:
                if (value.length === 2) value += "/";
                if (value.length <= 5) {
                    form.expDate = value;
                }
                break;
            case FORM_TYPE.SECURITY_CODE:
                if (value.length <= 4) form.securityCode = value;
                break;
            case FORM_TYPE.NAME:
                form.name = value;
                break;
            default:
                break;
        }
        main();
    } catch (e) {
        console.log("error: ", JSON.stringify(e));
    }
};

const clearForm = () => {
    form = {...FORM_INITIAL_STATE};
    main();
};

const onSubmit = () => {
    showModal = true;
    main();
};

const onFocus = () => {
    const flipContainer = document.querySelector(".flip-container");
    flipContainer.className = "flip-container active";
};

const onBlur = () => {
    const flipContainer = document.querySelector(".flip-container");
    flipContainer.className = "flip-container";
};

// METHODS -------------------------------------------------------------------------------------------------------------

const main = () => {
    renderModal();
    updateForm();
    updateSubmitBtn();
    updateDisplayCard();
};

const addHandlers = () => {
    const classToType = [
        ['name', FORM_TYPE.NAME],
        ['exp-date', FORM_TYPE.EXP_DATE],
        ['security-code', FORM_TYPE.SECURITY_CODE],
        ['card-number', FORM_TYPE.CARD_NUMBER]
    ];

    classToType.forEach(([className, formType]) => {
        const node = document.querySelector(`.${className}`);
        node.onkeyup = onChange(formType);
        node.autocomplete = "off";
        if (formType === FORM_TYPE.SECURITY_CODE) {
            node.onfocus = onFocus;
            node.onblur = onBlur;
        }
    });

    const clearBtn = document.querySelector("button[type='reset']");
    clearBtn.onclick = clearForm;

    const submitBtn = document.querySelector("button[type='submit']");
    submitBtn.onclick = onSubmit;
};

const updateForm = () => {
    const classToFormValue = [
        ['name', 'name'],
        ['exp-date', 'expDate'],
        ['security-code', 'securityCode'],
        ['card-number', 'cardNumber']
    ];

    classToFormValue.forEach(([className, formValue]) => {
        const node = document.querySelector(`.${className}`);
        node.value = form[formValue];
    });
};

const isFormComplete = () => {
    if (form.cardNumber.split(" ").join("").length < 13) return false;
    if (form.securityCode.length < 3) return false;
    if (form.expDate.length < 5) return false;
    return form.name;
};

const updateSubmitBtn = () => {
    const submitBtn = document.querySelector("button[type='submit']");
    submitBtn.disabled = !isFormComplete();
};

const updateDisplayCard = () => {
    const DOT = `&#9679;`;
    const DOT2 = DOT.repeat(2);
    const DOT4 = DOT.repeat(4);
    const DEFAULT = Object.freeze({
        cardNumber: `${DOT4} ${DOT4} ${DOT4} ${DOT4}`,
        expDate: `${DOT2}/${DOT2}`,
        name: 'Customer',
        securityCode: `${DOT.repeat(3)}`
    });

    const displayCardNumber = document.querySelector(".display-card-number");
    if (form.cardNumber) {
        displayCardNumber.innerHTML = form.cardNumber;
    } else {
        displayCardNumber.innerHTML = DEFAULT.cardNumber;
    }


    const displayExpDate = document.querySelector('.display-exp-date');
    if (form.expDate) {
        displayExpDate.innerHTML = form.expDate;
    } else {
        displayExpDate.innerHTML = DEFAULT.expDate;
    }


    const displayName = document.querySelector('.display-name');
    if (form.name) {
        displayName.innerHTML = form.name;
    } else {
        displayName.innerHTML = DEFAULT.name;
    }

    const displaySecurityCode = document.querySelector('.display-security-code');
    if (form.securityCode) {
        displaySecurityCode.innerHTML = form.securityCode;
    } else {
        displaySecurityCode.innerHTML = DEFAULT.securityCode;
    }
};

// SETUP ---------------------------------------------------------------------------------------------------------------

main();
addHandlers();
