class Luhn {
  static validate(value) {
    value = value.replace(/[\s-]+/g, '');
    return /^\d{15}$/.test(value) && this.validateChecksum(value);
  }

  static validateChecksum(value) {
    const chars = [...'0123456789'];
    const values = [...value];
    const lastChar = values.pop();
    const sum = values
      .reverse()
      .map((char, index) => {
        const digit = parseInt(char, 10);
        return index % 2 !== 0 ? digit * 2 - (digit > 4 ? 9 : 0) : digit;
      })
      .reduce((prev, current) => prev + current);
    const checksum = (10 - (sum % 10)) % 10;
    return parseInt(lastChar, 10) === checksum;
  }
}

class Verhoeff {
  static validate(inputNumber) {
    const mult = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
      [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
      [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
      [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
      [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
      [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
      [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
      [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
      [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ];

    const perm = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
      [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
      [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
      [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
      [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
      [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
      [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
    ];

    let i = inputNumber.length;
    let j = 0;
    let x = 0;

    while (i > 0) {
      i -= 1;
      x = mult[x][perm[j % 8][parseInt(inputNumber[i])]];
      j += 1;
    }
    return x === 0;
  }
}



class Validator {
  static mobile(value) {
    return /^[6789]\d{9}$/.test(value);
  }

  static pincode(value) {
    return /^[1-9]\d{5}$/.test(value.toString());
  }


  static validateIMEI(imei) {
    imei = imei.replace(/[\s-]+/g, '');

    const validationDigit = Number(imei.slice(-1));
    const imeiWithoutLastDigit = imei.slice(0, -1);

    let sum = 0;
    for (let i = imeiWithoutLastDigit.length - 1; i >= 0; i -= 2) {
      let digit = Number(imeiWithoutLastDigit.charAt(i)) * 2;
      sum += digit < 10 ? digit : digit - 9; // Split and sum digits of doubled numbers
    }

    for (let i = imeiWithoutLastDigit.length - 2; i >= 0; i -= 2) {
      sum += Number(imeiWithoutLastDigit.charAt(i));
    }

    const roundedUpSum = Math.ceil(sum / 10) * 10;

    const difference = roundedUpSum - sum;
    return difference === validationDigit;
  }
  
  

  static aadhaar(value) {
    value = value.replace(/[\s-]+/g, '');
    return /^[2-9]\d{11}$/.test(value) && Verhoeff.validate(value);
  }

  static aadhaarVID(value) {
    value = value.replace(/[\s-]+/g, '');
    return /^\d{16}$/.test(value) && Verhoeff.validate(value);
  }

  static pan(value) {
    return /^[A-Z]{3}[PCHABGJLFTE][A-Z]\d{4}[A-Z]$/i.test(value);
  }

  static gst(value) {
    const regex = /^[0-9]{2}[A-Z]{4}[A-Z0-9]{5}[A-Z]{1}[Z]{1}[0-9A-Z]{1}$/i;
    return regex.test(value) && Validator.gstChecksum(value);
  }

  static gstChecksum(value) {
    if (!/^[0-9A-Z]{15}$/i.test(value)) {
      return false;
    }
    const chars = [...'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    const values = [...value.toUpperCase()];
    const lastChar = values.pop();
    const sum = values
      .map((char, index) => {
        const product = chars.indexOf(char) * (index % 2 !== 0 ? 2 : 1);
        return Math.floor(product / chars.length) + (product % chars.length);
      })
      .reduce((prev, current) => {
        return prev + current;
      });
    const checksum = (chars.length - (sum % chars.length)) % chars.length;
    return chars[checksum] === lastChar;
  }

  static tan(value) {
    const regex = /^[A-Z]{4}\d{5}[A-Z]$/i; 
    return regex.test(value);
  }
  
  

}

function validateMobile() {
  const mobileNum = document.getElementById("mobileNumber").value;
  const resultElement = document.getElementById("mobileResult");

  if (Validator.mobile(mobileNum)) {
    resultElement.textContent = 'Valid Mobile Number';
  } else {
    resultElement.textContent = 'Invalid Mobile Number';
  }
}

function validateAadhaar() {
  const aadhaarNum = document.getElementById("aadhaarNumber").value;
  const resultElement = document.getElementById("aadhaarResult");

  if (Validator.aadhaar(aadhaarNum)) {
    resultElement.textContent = 'Valid Aadhaar Number';
  } else {
    resultElement.textContent = 'Invalid Aadhaar Number';
  }
}

function validateAadhaarVID() {
  const aadhaarVID = document.getElementById("aadhaarVID").value;
  const resultElement = document.getElementById("aadhaarVIDResult");

  if (Validator.aadhaarVID(aadhaarVID)) {
    resultElement.textContent = 'Valid Aadhaar VID';
  } else {
    resultElement.textContent = 'Invalid Aadhaar VID';
  }
}


function validateMobile() {
  const mobileNum = document.getElementById("mobileNumber").value;
  const resultElement = document.getElementById("mobileResult");

  if (Validator.mobile(mobileNum)) {
    resultElement.textContent = 'Valid Mobile Number';
  } else {
    resultElement.textContent = 'Invalid Mobile Number';
  }
}


function validatePAN() {
  const panNum = document.getElementById("panNumber").value;
  const resultElement = document.getElementById("panResult");

  if (Validator.pan(panNum)) {
    resultElement.textContent = 'Valid PAN Card';
  } else {
    resultElement.textContent = 'Invalid PAN Card';
  }
}


function validateTAN() {
  const tanNum = document.getElementById("tanNumber").value;
  const resultElement = document.getElementById("tanResult");

  if (Validator.tan(tanNum)) {
    resultElement.textContent = 'Valid TAN';
  } else {
    resultElement.textContent = 'Invalid TAN';
  }
}

function validateIMEI() {
  const imeiNum = document.getElementById("imeiNumber").value;
  const resultElement = document.getElementById("imeiResult");

  const isValidIMEI = Validator.validateIMEI(imeiNum);

  if (isValidIMEI) {
    resultElement.textContent = `IMEI ${imeiNum} is valid.`;
  } else {
    resultElement.textContent = `IMEI ${imeiNum} is invalid.`;
}
}


function validatePIN() {
  const pinCode = document.getElementById("pinCode").value;
  const resultElement = document.getElementById("pinResult");

  if (Validator.pincode(pinCode)) {
    resultElement.textContent = 'Valid PIN Code';
  } else {
    resultElement.textContent = 'Invalid PIN Code';
  }
}

function validateGST() {
  const gstNum = document.getElementById("gstNumber").value;
  const resultElement = document.getElementById("gstResult");

  if (Validator.gst(gstNum)) {
    resultElement.textContent = 'Valid GST Number';
  } else {
    resultElement.textContent = 'Invalid GST Number';
  }
}


function performValidation() {
  const validationType = document.getElementById("validationType").value;
  const inputValue = document.getElementById("inputValue").value;
  const validationResult = document.getElementById("validationResult");

  let isValid = false;

  switch (validationType) {
    case "mobile":
      isValid = Validator.mobile(inputValue);
      break;
    case "aadhaar":
      isValid = Validator.aadhaar(inputValue);
      break;
    case "aadhaarVID":
      isValid = Validator.aadhaarVID(inputValue);
      break;
    case "pan":
      isValid = Validator.pan(inputValue);
      break;
    case "gst":
      isValid = Validator.gst(inputValue);
      break;
    case "pincode":
      isValid = Validator.pincode(inputValue);
      break;
    case "imei":
      isValid = Validator.imei(inputValue);
      break;
    case "tan":
      isValid = Validator.tan(inputValue);
      break;

    default:
      break;
  }

  if (isValid==true) {
    validationResult.style.display = "block"; // Show the validation result
    validStatus.textContent = 'Valid';
    validStatus.style.display = "block"; // Show the valid status
  } else {
     validationResult.style.display = "block"; // Show the validation result
  validStatus.textContent = 'Invalid';
  validStatus.classList.add('invalid-status'); // Add class for invalid status
  validStatus.style.display = "block";
  }
}
