/* Utils starts*/

function Utils() {}

// interface HTMLInputEvent extends Event {
//   target: HTMLInputElement & EventTarget;
//   which: HTMLInputElement & EventTarget;
//   keyCode: HTMLInputElement & EventTarget;
// }

/* method to check that provided value is number */
Utils.prototype.isNumber = function(num: string) {
  let regex = /^\d+$/;
  return regex.test(String(num.trim()));
};

/* method to check that typed event is number */
Utils.prototype.isNumberEvent = function(event: any) {
  event = event ? event : window.event;
  const charCode = event.which ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
  return true;
};

/* method to check email validity */
Utils.prototype.isValidEmail = function(email: string) {
  let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email.trim()));
};

/* method to check that provided value is not empty */
Utils.prototype.isEmpty = function(value: string) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
};

/* method to check PIN validity */
Utils.prototype.isValidPin = function(pin: string) {
  let regex = /^[\w!o!O!_]{7}$/;
  return regex.test(String(pin.trim()));
};

/* method to check amount validity */
Utils.prototype.isValidAmount = function(amount: string) {
  let regex = /^\d+(\.\d{1,2})?$/;
  return regex.test(String(amount.trim()));
};

/* method to check phone validity */
Utils.prototype.isValidPhone = function(phone: string) {
  let regex = /^^((\+994)|0)((12[3-5]\d{6})|(((99)|(5[015])|(7[07]))[1-9]\d{6}))$/;
  return regex.test(String(phone.trim()));
};

/* method to check password strength */
Utils.prototype.isStrongPassword = function(password: string) {
  let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  return regex.test(String(password.trim()));
};

/* method to check PAN validity without Luhn algorithm */
Utils.prototype.isValidPanBasic = function(pan: string) {
  let regex = /^(\d{16}|\d{19})?$/;
  return regex.test(String(pan.trim()));
};

/* method to check PAN validity ,Luhn algorithm */
Utils.prototype.isValidPan = function(pan: string) {
  if (/[^0-9-\s]+/.test(pan)) return false;

  let nCheck = 0,
    bEven = false;
  pan = pan.replace(/\D/g, '');

  for (let n = pan.length - 1; n >= 0; n--) {
    let cDigit = pan.charAt(n),
      nDigit = parseInt(cDigit, 10);

    if (bEven && (nDigit *= 2) > 9) nDigit -= 9;

    nCheck += nDigit;
    bEven = !bEven;
  }

  return nCheck % 10 == 0;
};

/* Utils ends*/

export default Object.create(Utils.prototype);
