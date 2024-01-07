'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, num) => acc + num);
  labelBalance.textContent = `${account.balance} €`;
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = `${incomes}€`;

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  labelSumInterest.textContent = 0;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int);

  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUI = function (account) {
  displayMovements(account.movements);
  calcDisplayBalance(account);
  calcDisplaySummary(account);
};

//  Event Handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferTo.blur();
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputLoginUsername.value = inputLoginPin.value = '';
});

// State variable
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted ? true : false);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/////////////////////////////////////////////////
let arr = ['a', 'b', 'c', 'd', 'e'];

//? SLICE
// mdn documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice

arr.slice(2); // ['c', 'd', 'e']
arr.slice(2, 4); // ['c', 'd']
arr.slice(-2); // ['d', 'e']
arr.slice(-1); // ['e']
arr.slice(1, -2); // ['b', 'c']

// Create a shallow copy of an array
arr.slice(); // ['a', 'b', 'c', 'd', 'e']
[...arr]; // ['a', 'b', 'c', 'd', 'e']

//? SPLICE - Mutates original array
// mdn documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice

// used to delete elements from array
arr.splice(2); // ['c', 'd', 'e']
arr; // ['a', 'b']
arr.splice(-1); // ['b']
arr; // ['a']

//  Reverse
//? mutates original array
// mdn documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse
let arr1 = ['a', 'b', 'c', 'd', 'e'];
let arr2 = ['j', 'i', 'h', 'g', 'f'];

arr2.reverse(); // ['f', 'g', 'h', 'i', 'j']

//? CONCAT
// mdn documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat
const letters = arr1.concat(arr2); // ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
const letters2 = [...arr1, ...arr2]; // ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

//? JOIN
// mdn documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join
letters.join(' - '); // 'a - b - c - d - e - f - g - h - i - j'

//? at()
// mdn documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at
let arr3 = ['a', 'b', 'c', 'd', 'e'];
arr[3]; // 'd' - old way
arr3.at(2); // 'c' - new way
arr3.at(-1); // 'e' - new way
arr3; // ['a', 'b', 'c', 'd', 'e']

//? forEach()
// mdn documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const movement of movements) {
  if (movement > 0) {
    // console.log(`You deposited ${movement}`);
  } else {
    // console.log(`You withdrew ${Math.abs(movement)}`);
  }
}

movements.forEach(
  (movement, i) => movement > 0
  // ? console.log(`${i + 1}). You deposited ${movement} `)
  // : console.log(`${i + 1}). You withdrew ${Math.abs(movement)}`)
);

//? forEach() with Maps
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach((value, key, map) => {
  // console.log(`${key}: ${value}`);
  // console.log(map);
});

//? forEach() with Sets
const currenciesUnique = new Set(['USD', 'EUR', 'GBP']);
// console.log(currenciesUnique);

currenciesUnique.forEach((value, _, map) => {
  // console.log(`${_}: ${value} 123`);
});

//? Map() Method
const eurToUsd = 1.1;
const currency = [200, 450, -400, 3000, -650, -130, 70, 1300];

// Option 1 - using arrow function and implicit return
const movementsUSD = currency.map(mov => Math.trunc(mov * eurToUsd));

// Option 2 - using function declaration and explicit return
const movementsUSD2 = currency.map(function (mov, i) {
  return Number(`${Math.trunc(mov * eurToUsd)}`);
});

// ? filter()
const nums = currency
  .filter(num => num >= 300)
  .map(n => console.log(`The number is ${n}!`));

//? reduce()
const reduced = currency.reduce((acc, num) => acc + num, 0);
console.log(reduced);

// Maximum Value
const max = currency.reduce(
  (acc, curr) => (acc > curr ? acc : curr),
  currency[0]
);

console.log(max);

// Chaining Methods
const currUsd = currency
  .filter(mov => mov > 0)
  .map(mov => Math.floor(mov * 1.1))
  .reduce((acc, mov) => acc + mov, 0);
console.log(currUsd);

//? find()
// returns the fist element that meets the requiremnts
console.log(currency.find(mov => mov < 0));

// finding one account with the username === js
const jonas = accounts.find(acc => acc.username === 'js');

//? some() and every() methods
console.log(movements);
console.log(movements.includes(-130));

const anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits);

const anyDeposits2 = movements.every(mov => mov > 0);
console.log(anyDeposits2);

//? flat() and flatMap()
// mdn documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat

const arr4 = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr4.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

// chaining
const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

// flatMap() - only goes one level deep
// mdn documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap
const overallBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

// ? Sorting Arrays
// mdn documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
// accending
movements.sort((a, b) => a - b);
console.log(movements);
// decending
movements.sort((a, b) => b - a);
console.log(movements);

// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });

//? More ways of creating and filling arrays
// mdn documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from

const arr5 = Array.from({ length: 7 }, () => 1);
console.log(arr5);

const x = new Array(7).fill(1);
console.log(x);

x.fill(23, 2, 6);
console.log(x);
// building a array programatically
const y = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(y);

//? Array Methods Practice

// create a function that takes in an array and returns a new array with only the deposits
labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);

  const movementsUI2 = [...document.querySelectorAll('.movements__value')].map(
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI2);
});
