const inputSlider = document.querySelector("[data-lengthSlider]");//feching custom attribute
const lengthDisplay = document.querySelector("[data-lengthNumber");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]"); //describe all checkboxes..list of allCheckbox
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//initially
let password = ""; //initial password is empty
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set strength color to grey
setIndicator("#ccc");


// handleSlider() set password length to UI .It update UI basis on password length value
//set passwordLength according to slider and  
//update slider value and length which is displayed on display
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength; //Length display i.e number coming on UI ...inner Text set to 10 initially
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength -min)*100/(max-min)) + "% 100%"; //slider width and height
}

//setting indicator--its task is to set color acc to input parameter of color and set strength of indicator
function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

//it finds random integer in range of min and max
function getRndInteger(min,max){
    return Math.floor(Math.random() * (max - min)) + min; //ans between 0 to max-min //for rounding off use Math.floor//we want ans between max to min so +min we got min-max ke bech mai result
}

function generateRandomNumber(){
    return getRndInteger(0,9); //0-9 range mai gives random integer
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123)); //97-128  ASCII values ke range mai character lakar deta hai
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91)); //65-91
}

function generateSymbol(){
    //we had Symbol String --we had String length usme ek random index generate kar liya ,then us random index par jakar symbol return kar diya
    const randomNumber = getRndInteger(0,symbols.length);
    return symbols.charAt(randomNumber);  //charAt tells uss index par kaunsa character present hai//generated symbol
}

function calcStrength() {
    //checking status
    //initially checkbox ki value ko false mann liya
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true; //if checked then make it true ,we used checked property 
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

//writeText is async function returns promise
//any content inside input password display field mai availabe hai usko clipboard par copy karta hai using clipboard.writeContext method
async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value); //copying
        //only if promise is resolved then only show text copied otherwise await
        copyMsg.innerText = "copied"; //copied array on UI
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    //after 2 sec make it invisible using setTimeout
    setTimeout( () =>{
        copyMsg.classList.remove("active");  //remove active class after 2 sec
    },2000);

}

//shuffle password sent in array form
function shufflePassword(array){
    //Fisher Yates Method - apply this algo on Array and shuffle it
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

//using for each loop we applied event listener on every checkbox (whenver changed then function handleCheckBoxChange() called)
function handleCheckBoxChange(){
    checkCount = 0;
    //if any of the 4 checkbox is being ticked or untiked then in both cases counting restarts to find how many checkbox are ticked checked 
    allCheckBox.forEach((checkbox) =>{
        if(checkbox.checked){
            checkCount++;
        }
    });
    //special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        //if password length change call to handleSlide function to have same effect on UI
        handleSlider();
    }
}

//EventListener on checkBox
allCheckBox.forEach( (checkBox)=>{
    checkBox.addEventListener('change',handleCheckBoxChange);
})

//eventListener on Slider
//after changing slider we want to change the length of password
//e is slider element
inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value; //slider value copied to password length
    handleSlider(); //goes to handleSlider method to make change in UI as passwordLength is updated
});

//eventListener on Copy button
//copied only when value exist
copyBtn.addEventListener('click',() => {
    if(passwordDisplay.value){
        copyContent();
    }
});

//Event Listener on Generate Password
//conditions
//checkboxs count needed .atleast one checkbox should be checked to generate password,so apply eventListeners on checkBoxes to track how much checkboxes are checked
generateBtn.addEventListener('click',()=>{
    //none of the checkbox are selected
    if(checkCount == 0){
        return;
    }
    if(passwordLength < checkCount){
        passwordLength = checkCount; //password length updated with checkCount
        handleSlider(); //as update is done call handleSlider function
    }

    //lets start the journey to find new Password
    console.log("Starting the Journey");

    password = "";  //remove old password
    
    //lets put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];

    //checking which all checkboxes are checked
    //in funArr we put all the functions that have checked checkbox
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }

    //if checked then store its function inside funcArr[];
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }

    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }

    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    //for compulsory length addition--all ticked checkbox added
    for(let i=0; i<funcArr.length;i++){
        password += funcArr[i]();
    }
    console.log("Compulsory adddition done");

    //for remaining length addition using RndIndex used earlier
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    } //password created
    console.log("Remaining adddition done");

    //shuffle the password
    password = shufflePassword(Array.from(password)); //password taken in Array form
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");
    //calculate password strength
    calcStrength();

});