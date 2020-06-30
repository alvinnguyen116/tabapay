// GLOBAL VARIABLES ----------------------------------------------------------------------------------------------------

const TODAY = new Date();
const MONTHS = Object.freeze([
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]);

// COMPONENT STATE -----------------------------------------------------------------------------------------------------

let currYear = TODAY.getFullYear();
let currMonth = TODAY.getMonth();
let selectedDate = null;
let showModal = false;

// HANDLERS ------------------------------------------------------------------------------------------------------------

const changeMonth = amount => {
    currMonth = mod(currMonth + amount, 12);
    if (amount === -1 && currMonth === 11) currYear--;
    if (amount === 1 && currMonth === 0) currYear++;
    main();
};

const selectDate = day => () => {
    selectedDate = new Date(currYear, currMonth, day);
    showModal = true;
    main();
};

// COMPONENTS ----------------------------------------------------------------------------------------------------------

/**
 * @param dayNum {int}
 * @desc Displays a single day.
 *  - Only dates within 90 days of today are clickable
 *
 * @return {HTMLDivElement}
 */
const Day = dayNum => {
    const div = document.createElement('div');
    let className = 'day-btn button';
    if (dayNum) {
        const isToday = TODAY.getMonth() === currMonth && TODAY.getFullYear() === currYear && TODAY.getDate() === dayNum;
        const displayDate = new Date(currYear, currMonth, dayNum);
        if (isToday) className += " today";
        if ((Math.abs(TODAY - displayDate)/(1000*60*60*24)) <= 90) className += " clickable";
        if (displayDate - selectedDate === 0) className += " selected";
        div.innerHTML = dayNum.toString();
        div.onclick = selectDate(dayNum);
    }
    div.className = className;
    return div;
};

/**
 * @param days {int[]} - an integer arr representing the days of a week
 * @desc Displays a week. Fills in the gap for beginning and end of the week.
 * @return {HTMLDivElement}
 */
const Week = days => {
    const div = document.createElement('div');
    div.className = 'week row';

    let dayElements = days.map(Day);
    const emptyDays = 7 - days.length;
    if (emptyDays > 0) {
        const emptyDayElements = [...Array(emptyDays).fill('')].map(Day);
        if (days[days.length - 1] < 7) {
            dayElements = [...emptyDayElements, ...dayElements];
        } else {
            dayElements = [...dayElements, ...emptyDayElements];
        }
    }

    dayElements.forEach(dayElement => {
        div.appendChild(dayElement);
    });

    return div;
};

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

const generateDays = () => {
    const weekElements = [];
    let currDay = 1;
    let daysInAWeek = [];
    while ((new Date(currYear,currMonth,currDay)).getMonth() === currMonth) {
        if (daysInAWeek.length && (new Date(currYear,currMonth,currDay)).getDay() === 0) { // new week
            weekElements.push(Week(daysInAWeek));
            daysInAWeek = [];
        }
        daysInAWeek.push(currDay);
        currDay++;
    }
    if (daysInAWeek.length) {
        weekElements.push(Week(daysInAWeek));
    }
    return weekElements;
};

const main = () => {
  const currentMonthAndYear = document.querySelector('.current-month-and-year');
  currentMonthAndYear.innerHTML = `${MONTHS[currMonth]} ${currYear}`;

  const day = document.querySelector('.day');
  removeChildren(day);
  const newChildren = generateDays();
  newChildren.forEach(child => day.appendChild(child));

  if (showModal) {
      const body = document.querySelector('body');
      const div = document.createElement('div');
      div.className = "modal-text";
      div.innerHTML = `Selected date is <strong>${selectedDate.toDateString()}</strong>`;
      body.appendChild(Overlay(div));
  } else {
      const body = document.querySelector('body');
      const overlay = document.querySelector('.overlay');
      overlay && body.removeChild(overlay);
  }
};

const addEventListeners = () => {
    window.addEventListener('keydown', e => {
        switch (e.key) {
            case 'ArrowUp':
            case 'ArrowRight':
                changeMonth(1);
                break;
            case 'ArrowDown':
            case 'ArrowLeft':
                changeMonth(-1);
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

/**
 * @param a {int}
 * @param n {int}
 */
const mod = (a,n) => ((a % n) + n) % n;

// SET UP --------------------------------------------------------------------------------------------------------------

main();
addEventListeners();