let toggleBtn = document.getElementById('toggle-btn');
let body = document.body;
let darkMode = localStorage.getItem('dark-mode');

const enableDarkMode = () =>{
   toggleBtn.classList.replace('fa-sun', 'fa-moon');
   body.classList.add('dark');
   body.classList.remove('light');
   localStorage.setItem('dark-mode', 'enabled');
}

const disableDarkMode = () =>{
   toggleBtn.classList.replace('fa-moon', 'fa-sun');
   body.classList.remove('dark');
   body.classList.add('light');
   localStorage.setItem('dark-mode', 'disabled');
}

if(darkMode === 'enabled'){
   enableDarkMode();
}
else{
   disableDarkMode()
}

toggleBtn.onclick = (e) =>{
   darkMode = localStorage.getItem('dark-mode');
   if(darkMode === 'disabled'){
      enableDarkMode();
   }else{
      disableDarkMode();
   }
}

let profile = document.querySelector('.header .flex .profile');

document.querySelector('#user-btn').onclick = () =>{
   profile.classList.toggle('active');
   search.classList.remove('active');
}

let search = document.querySelector('.header .flex .search-form');

document.querySelector('#search-btn').onclick = () =>{
   search.classList.toggle('active');
   profile.classList.remove('active');
}

let sideBar = document.querySelector('.side-bar');

document.querySelector('#menu-btn').onclick = () =>{
   sideBar.classList.toggle('active');
   body.classList.toggle('active');
}

document.querySelector('#close-btn').onclick = () =>{
   sideBar.classList.add('active');
   body.classList.add('active');
}

window.onscroll = () =>{
   profile.classList.remove('active');
   search.classList.remove('active');
}



// Get the "Next" and "Previous" 
const nextButton = document.getElementById("nextButton");
const prevButton = document.getElementById("prevButton");
const middleRow = document.querySelector(".middle-row");

// Calculate the total number of items
const totalItems = middleRow.children.length;
const itemsPerPage = 24;
let currentPage = 0;

// Function to show the items for a specific page
function showPage(page) {
  const start = page * itemsPerPage;
  const end = start + itemsPerPage;

  // Hide all items first
  for (let i = 0; i < totalItems; i++) {
    middleRow.children[i].classList.remove("show-item");
  }

  // Show items for the current page
  for (let i = start; i < Math.min(end, totalItems); i++) {
    middleRow.children[i].classList.add("show-item");
  }
}

// Show the initial page
showPage(currentPage);

nextButton.addEventListener("click", () => {
   if (currentPage < Math.ceil(totalItems / itemsPerPage) - 1) {
     currentPage++;
     showPage(currentPage);
   }
});
  
prevButton.addEventListener("click", () => {
   if (currentPage > 0) {
    currentPage--;
    showPage(currentPage);
  }
});

// ---------------------- database connection ---
const encodedData = document.getElementById('backenddata').innerText;
let decodedData;
if(encodedData === 'W10='){
    decodedData = [{}];
}
else{
    decodedData = JSON.parse(atob(encodedData));

}


function formatDate(dateString) {
   const date = new Date(dateString);
   const month = (date.getMonth() + 1).toString().padStart(2, '0');
   const day = date.getDate().toString().padStart(2, '0');
   const year = date.getFullYear();
   const formattedDate = `${year}-${month}-${day}`;
   return formattedDate;
}


let DateWise_Data = {};
decodedData.forEach(item => {
    const formattedDate = formatDate(item.createdAt);
    if (!DateWise_Data[formattedDate]) {
        DateWise_Data[formattedDate] = [];
    }
    DateWise_Data[formattedDate].push(item);
});
// let targetDate = "2024-03-09";
let targetDate = formatDate(decodedData[decodedData.length-1].createdAt);
document.getElementById("userDatename").value = formatDate(targetDate);

// ---------------------- database connection End ---

// --- for big circle --
let Overall_u_attempt_Questions_in_Quizs_Circle=0;
let Overall_u_attempt_Right_Questions_Circle=0;
// --- for big circle see scroll--

// -- overall score ------
const OverallScore =()=>{
   const DateArray = [];
   let Overall_totalMarks_InQuizs=0;
   let Overall_totalMarks_U_Obtaied_InQuizs=0;
   let Overall_Total_Questions_in_Quizs=0;
   let Overall_u_attempt_Questions_in_Quizs=0;
   let Overall_u_attempt_Right_Questions=0;
   for (const date in DateWise_Data) {
    if (DateWise_Data.hasOwnProperty(date)) {
        if (!DateArray.includes(date)) {
            DateArray.push(date);
            Overall_totalMarks_InQuizs += parseInt(DateWise_Data[date][0].Quiz_Total_Marks);
            Overall_Total_Questions_in_Quizs += parseInt(DateWise_Data[date][0].Total_Question_in_Quiz);
            Overall_u_attempt_Questions_in_Quizs += parseInt(DateWise_Data[date].length);
            Overall_u_attempt_Questions_in_Quizs_Circle += parseInt(DateWise_Data[date].length);
        }
    }
    if (DateWise_Data.hasOwnProperty(date)) {
       DateWise_Data[date].forEach(question => {
          if(question.user_answer === question.correct_Ans){
             Overall_totalMarks_U_Obtaied_InQuizs += parseInt(question.questionMarks);
             Overall_u_attempt_Right_Questions+=1;
             Overall_u_attempt_Right_Questions_Circle+=1;
          }
      });
    }
  };
  let OverallScoreHtml;
        if(encodedData === 'W10='){
            OverallScoreHtml = `<h2 style="display: flex; font-size:13px;">To improve your scores, please take your first quiz.</h2>`;
        }
        else{
            OverallScoreHtml = `<h1>Your Overall Score</h1>
                           <table>
                            <thead>
                                <tr><th>Overall Score</th><th>Total</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>Overall Quiz Score</td><td>${Overall_totalMarks_InQuizs}</td></tr>
                                <tr><td>Total Problems</td><td> ${Overall_Total_Questions_in_Quizs} </td></tr>
                                <tr><td>Total Problems Solved</td><td> ${Overall_u_attempt_Questions_in_Quizs} </td></tr>
                                <tr><td>Total Problems Solved right</td><td> ${Overall_u_attempt_Right_Questions} </td></tr>
                                <tr><td>Total Problems Solved wrong</td><td> ${Overall_u_attempt_Questions_in_Quizs-Overall_u_attempt_Right_Questions} </td></tr>
                                <tr><td class="td-border">Overall, Your Score</td><td class="td-border">${Overall_totalMarks_U_Obtaied_InQuizs}</td></tr>
                            </tbody>
                            </table>`;
        }  
  document.querySelector('.row-2-overAllScore').innerHTML = OverallScoreHtml;
 };
 OverallScore();
 // -- overall score End ------
 
 // for circle--
 let CurrentMonthsPOTD = 0;
 // for circle End use in circle--
 
 // -- Current Month score ------
 const CurrentMonthsScore =()=> {
    const DateArray = [];
    let Overall_totalMarks_InQuizs = 0;
    let Overall_totalMarks_U_Obtaied_InQuizs = 0;
    let Overall_Total_Questions_in_Quizs = 0;
    let Overall_u_attempt_Questions_in_Quizs = 0;
    let Overall_u_attempt_Right_Questions = 0;
 
    for (const date in DateWise_Data) {
        if (DateWise_Data.hasOwnProperty(date)) {
            const currentDate = new Date(date);
            const currentMonth = new Date().getMonth();
            const currentyear = new Date().getFullYear();
            if (currentDate.getMonth() === currentMonth && currentDate.getFullYear() === currentyear) {
                if (!DateArray.includes(date)) {
                    DateArray.push(date);
                    Overall_totalMarks_InQuizs += parseInt(DateWise_Data[date][0].Quiz_Total_Marks);
                    Overall_Total_Questions_in_Quizs += parseInt(DateWise_Data[date][0].Total_Question_in_Quiz);
                    Overall_u_attempt_Questions_in_Quizs += parseInt(DateWise_Data[date].length);
                    CurrentMonthsPOTD+=1;
                }
                DateWise_Data[date].forEach(question => {
                    if (question.user_answer === question.correct_Ans) {
                        Overall_totalMarks_U_Obtaied_InQuizs += parseInt(question.questionMarks);
                        Overall_u_attempt_Right_Questions += 1;
                    }
                });
         }   
     }   
  };
  let OverallScoreHtml;
    if(encodedData === 'W10='){
        OverallScoreHtml = `<h2 style="display: flex;">Ready to start racking up points? Take your first quiz this month!</h2>`;
    }
    else{
     OverallScoreHtml = `<h1>Your Current Month's Score</h1>
                           <table>
                            <thead>
                                <tr><th>Monthly Score</th><th>Total</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>Monthly Quiz Score</td><td>${Overall_totalMarks_InQuizs}</td></tr>
                                <tr><td>Total Problems</td><td> ${Overall_Total_Questions_in_Quizs} </td></tr>
                                <tr><td>Total Problems Solved</td><td> ${Overall_u_attempt_Questions_in_Quizs} </td></tr>
                                <tr><td>Total Problems Solved right</td><td> ${Overall_u_attempt_Right_Questions} </td></tr>
                                <tr><td>Total Problems Solved wrong</td><td> ${Overall_u_attempt_Questions_in_Quizs-Overall_u_attempt_Right_Questions} </td></tr>
                                <tr><td class="td-border">Monthly, Your Score</td><td class="td-border">${Overall_totalMarks_U_Obtaied_InQuizs}</td></tr>
                            </tbody>
                            </table>`;
    }
  document.querySelector('.row-2-CurrentMonthsScoreCard').innerHTML = OverallScoreHtml;
 
 };
 CurrentMonthsScore();
 
 // -- Current Month score End ------

function renderCircleProgress(element, options) {
   // curent month's last day
   let currentDate = new Date();
   let lastDateOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
   let lastDate = lastDateOfMonth.getDate();
   // curent month's last day--- end
   let percentage = Math.round(options.value * 100);
   let spanElement = element.querySelector(".circle-box span");
   let currentPercentage = 0;
   let gradientAngle = Math.round((100 / lastDate) * options.value * 360);
   let anothercolor=0;

   let interval = setInterval(function() {
      if (currentPercentage <= percentage) {
            spanElement.textContent = Math.floor(currentPercentage) + "/" + lastDate;
            element.querySelector(".circle-bar").style.background = `conic-gradient(#a02cdb ${anothercolor}deg, #aaa ${gradientAngle}deg)`;
            anothercolor = anothercolor + (gradientAngle / percentage);
            currentPercentage++;
      } else {
            clearInterval(interval);
      }
   }, 20);
};

let options = {
   value: parseInt(CurrentMonthsPOTD) / 100
};

let element = document.querySelector(".circle-wrapper");
renderCircleProgress(element, options);


function renderCircleProgressRow3(element, optionsRow3) {
   let SumValue = optionsRow3.RightQuestion + optionsRow3.WrongQuestion;
   let percentage = Math.round(optionsRow3.RightQuestion);
   let spanElement = element.querySelector(".row-3-circle-box span");
   let currentPercentage = 0;
   let gradientAngle = Math.round(optionsRow3.RightQuestion/SumValue * 360);
   let anothercolor=0;

   let interval = setInterval(function() {
      if (currentPercentage <= percentage) {
            spanElement.textContent = optionsRow3.WrongQuestion + "/" + Math.floor(currentPercentage);
            element.querySelector(".row-3-circle-bar").style.background = `conic-gradient(#5ff572 ${anothercolor}deg, #ef5b5b ${gradientAngle}deg)`;
            anothercolor = anothercolor + (gradientAngle / percentage);
            currentPercentage++;
      } else {
            clearInterval(interval);
      }
   }, 20);
}

let optionsRow3 = {
   RightQuestion:parseInt(Overall_u_attempt_Right_Questions_Circle),
   WrongQuestion:parseInt(Overall_u_attempt_Questions_in_Quizs_Circle-Overall_u_attempt_Right_Questions_Circle)
};

let elementRow3 = document.querySelector(".row-3");
renderCircleProgressRow3(elementRow3, optionsRow3);


// --calendra--
const currentDate = document.querySelector(".calendar-current-date"),
daysTag = document.querySelector(".calendar-days"),
prevNextIcon = document.querySelectorAll(".calendar-icons i");

// getting new date, current year and month
let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();

// ------- submition---

let Right_Wrong_Submission = 0;
let isMouseEnterHandled = false;
// ------- submition---End ---

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const renderCalendar =()=>{
    let fristDayofMonth = new Date(currYear,currMonth, 1).getDay(), 
    lastDateofMonth = new Date(currYear,currMonth + 1, 0).getDate(), 
    lastDayofMonth = new Date(currYear,currMonth, lastDateofMonth).getDay(), 
    lastDateofLastMonth = new Date(currYear,currMonth, 0).getDate();  
    let liTag = "";
    let HoverTag = "";

    for (let i = fristDayofMonth; i > 0; i--) {  
        liTag += `<li class="calendar-inactive"><p>${lastDateofLastMonth - i+1}</p></li>`;
    }

    for(let i=1; i<=lastDateofMonth;i++){   
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? "calendar-active" :"";
        liTag += `<li class="${isToday}"><p>${i}</p> <h4 style="display:none;">${currYear}-${currMonth+1}-${i}</h4> <h3 class="hidden_p">${Right_Wrong_Submission} submition on ${months[currMonth]} ${i},${currYear} </h3></li>`;
    }
    for (let i = lastDayofMonth; i < 6; i++) {  
        liTag += `<li class="calendar-inactive"><p>${i - lastDayofMonth +1}</p></li>`;
    }

   currentDate.innerText = `${months[currMonth]} ${currYear}`;
   daysTag.innerHTML = liTag;
}

renderCalendar();

prevNextIcon.forEach(icon =>{
    icon.addEventListener("click",()=>{ 
        currMonth = icon.id === "calendar-prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0 || currMonth>11) { 
            date = new Date(currYear,currMonth);
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        }
        else{ 
            date = new Date();
        }
        renderCalendar();
        updateEventListeners();
    })
});

updateEventListeners();
// ----- database submission---- 
function updateEventListeners() {
   const daysTags_lis = document.querySelectorAll(".calendar-days li");

   daysTags_lis.forEach(lis => {
       const lis_p = lis.querySelector('p');
       const lis_h3 = lis.querySelector('.hidden_p');
       const lis_h4_Date = lis.querySelector('h4');
       if (lis_h4_Date) {
           lis.addEventListener("mouseenter", function() {
               const selectedDate_h4 = formatDate(lis_h4_Date.innerHTML);
               if (DateWise_Data[selectedDate_h4] && DateWise_Data[selectedDate_h4].length > 0) {
                   Right_Wrong_Submission = DateWise_Data[selectedDate_h4].length;
                   lis_h3.innerText = `${Right_Wrong_Submission} submission on ${months[currMonth]} ${lis_p.textContent},${currYear}`;
               }
           });

           lis.addEventListener("mouseleave", function() {
               Right_Wrong_Submission = 0;
               lis_h3.innerText = `${Right_Wrong_Submission} submission on ${months[currMonth]} ${lis_p.textContent},${currYear}`;
           });
       }
   });
}

// ------- submition---End ---


// --calendra end--

function generateUniqueColors(count) {
   let colors = [];
   for (let i = 0; i < count; i++) {
       let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
       colors.push(color);
   }
   return colors;
}

// Generate 10 unique colors
let uniqueColors = generateUniqueColors(10);
document.querySelector('.information').style.background = `linear-gradient(45deg, ${uniqueColors[0]}, ${uniqueColors[1]}, ${uniqueColors[2]}, ${uniqueColors[3]}, ${uniqueColors[4]})`;

let h1Elements = document.querySelectorAll('.information h1');
h1Elements.forEach(function(element, index) {
    element.style.color = uniqueColors[index % uniqueColors.length];
});

const share_btn = document.querySelector('.share-btn');
const fab_icons = share_btn.querySelectorAll('.fab');

share_btn.addEventListener("click", () => {
    fab_icons.forEach((icon) => {
        if (icon.style.pointerEvents === '') {
            icon.style.opacity = 1;
            icon.style.pointerEvents = 'all';
            icon.style.transform = 'translateY(0%)';
        } else {
            icon.style.opacity = 0;
            icon.style.pointerEvents = '';
            icon.style.transform = 'translateY(50%)';
        }
    });
});



// --- db--

// ------------------------frontend + backend--------
const ShowResultBox = document.querySelector('.row-question-count-date .row-question-count');

function updateResultForDate(targetDate) {
    ShowResultBox.innerHTML = '';

    let Obtained_Marks = 0;
    let Wrong_Marks = 0;
    let Right_Questions=0;
    let Wrong_Questions=0;
    let Total_questions=0;
    let  Total_Marks=0;
    let Precentage = 0;
    // Result Box
    if (DateWise_Data[targetDate] && DateWise_Data[targetDate].length > 0) {
        DateWise_Data[targetDate].forEach(question => {
            if(question.user_answer === question.correct_Ans){
                Obtained_Marks += parseInt(question.questionMarks);
                Right_Questions+=1;
            }
            else{
                Wrong_Marks += parseInt(question.questionMarks);
                Wrong_Questions+=1
            }
        });
        Total_questions = DateWise_Data[targetDate][0].Total_Question_in_Quiz
        Total_Marks = DateWise_Data[targetDate][0].Quiz_Total_Marks
        Precentage = ((Obtained_Marks * 100) / Total_Marks).toFixed(2) + "%";
    };
    let html;

    if(encodedData === 'W10='){
        html = `<h2>Quiz Not Given</h2>
                <h2>Please take your first quiz.</h2>`;
    }
    else if (DateWise_Data[targetDate] && DateWise_Data[targetDate].length > 0) {
        html = `<table class="result-table">
                 <thead>
                    <tr>
                       <th>Result</th>
                       <th>Marks</th>
                    </tr>
                 </thead>
                 <tbody>
                    <tr><td>Total Marks:</td><td>${Total_Marks}</td></tr>
                    <tr><td>Total Questions:</td><td>${Total_questions}</td></tr>
                    <tr><td>Total Marks Obtained:</td><td>${Obtained_Marks}</td></tr>
                    <tr><td>Right Answers:</td><td>${Right_Questions}</td></tr>
                    <tr><td>Wrong Answers:</td><td>${Wrong_Questions}</td></tr>
                    <tr><td>Avoided Questions:</td><td>${Total_questions - (Right_Questions + Wrong_Questions)}</td></tr>
                    <tr><td>Attempt Questions:</td><td>${Right_Questions + Wrong_Questions}</td></tr>
                    <tr><td class="precentage-label">Percentage:</td><td class="precentage-value">${Precentage}</td></tr>
                 </tbody>
               </table>`;

    } else {
    // Handle case when no data exists for the given date
        html = `<h2>Quiz Not Given</h2>
                <h2>No quiz scheduled for ${targetDate}</h2>`;
    }
    
    ShowResultBox.insertAdjacentHTML('beforeend', html);
    if(encodedData === 'W10='){
        html = `<h2>Quiz Not Given</h2>
                <h2>Please take your first quiz.</h2>`;
    }
    else if (DateWise_Data[targetDate] && DateWise_Data[targetDate].length > 0) {
        const precentage_label = document.querySelector('.precentage-label');
        const precentage_value = document.querySelector('.precentage-value');
        const percentageNumber = parseFloat(precentage_value.innerText.replace('%', ''));
        if (percentageNumber <= 40.00) {
            precentage_label.style.color = 'red';
            precentage_value.style.color = 'red';
        }
        else if (percentageNumber > 80.00) {
            precentage_label.style.color = 'green';
            precentage_value.style.color = 'green';
        }
    }
}

const rowQuestionsShow = document.querySelector('.row-questions-show');


function updateQuestionsForDate(targetDate) {
    // Clear previous content
    rowQuestionsShow.innerHTML = '';
    if(encodedData === 'W10=') {
        const questionHtml = `<h2 style="text-align: center;" >Quiz Not Given</h2>
                              <h2 style="text-align: center;" >Please take your first quiz.</h2>`;
        rowQuestionsShow.insertAdjacentHTML('beforeend', questionHtml);
    }
    else if (DateWise_Data[targetDate] && DateWise_Data[targetDate].length > 0 ) {
        DateWise_Data[targetDate].forEach(question => {
            const Answer_Quiz = (question.user_answer === question.correct_Ans) ? "correct" : "wrong";
    
            const questionHtml = `
                <div class="question-1">
                    <div class="question-1-hidden-span">
                        <span class="hidden-span question-${Answer_Quiz}">${Answer_Quiz}</span>
                        <h1 class="question-${Answer_Quiz}">${question.questionnum}. ${question.Question}</h1>
                        <h2 class="answersofQuiz">  
                            <p class="userAns">&nbsp;&nbsp; &nbsp; Your Answer : <span class="question-${Answer_Quiz}">${question.user_answer}</span></p>  
                            <p class="currectAns">&nbsp;&nbsp; &nbsp; Correct Answer : <span class="question-correct">${question.correct_Ans}</span></p>
                        </h2>
                    </div>
                    <p class="question-marks">Marks : <span>${question.questionMarks}</span></p>
                </div>
            `;
            rowQuestionsShow.insertAdjacentHTML('beforeend', questionHtml);
        });
    }
    else{
        const questionHtml = `<h2 style="text-align: center;" >Quiz Not Given</h2>
                              <h2 style="text-align: center;" >No quiz scheduled for ${targetDate}</h2>`;
        rowQuestionsShow.insertAdjacentHTML('beforeend', questionHtml);
    }
};

// -----------------------------

updateQuestionsForDate(targetDate);
updateResultForDate(targetDate);
document.getElementById("userDatename").addEventListener("change", function() {
    const selectedDate = new Date(this.value);
    targetDate = formatDate(selectedDate);
    updateQuestionsForDate(targetDate);
    updateResultForDate(targetDate);
});

const fileUpload = document.getElementById('file-upload');

fileUpload.addEventListener('change', async (event) => {
    const selectedFile = event.target.files[0];
    const userEmailElement = document.getElementById('user_id');
    const _id = userEmailElement.getAttribute('data-id');

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('_id', _id);
    
    try {
        const response = await fetch('/update-user-profile-image', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to upload image');
        }
        alert('Image uploaded successfully');
        const responseData = await response.json();
        const imagePath = responseData.user.image;

        if (imagePath) {
            document.querySelector('#image-preview').src = imagePath;
            document.querySelector('#profile-img-preview').src = imagePath;
            document.querySelector('#profile-img-preview-header').src = imagePath;
        } else {
            console.error('User image not found');
        }

    } catch (error) {
        console.error('Error:', error);
    }
});
// ---- update profile ---
const addBox = document.querySelector("#Edit-profile-btn"),
popupBox = document.querySelector(".popup-box"),
closeIcon = popupBox.querySelector("header i"),
popupTitle = popupBox.querySelector("header p"),
addBtn = popupBox.querySelector("button"),
updated_user_firstname = popupBox.querySelector(".updated-user-firstname"),
updated_user_lastname = popupBox.querySelector(".updated-user-lastname"),
updated_user_language = popupBox.querySelector(".updated-user-language"),
updated_user_Address = popupBox.querySelector(".updated-user-Address"),
updated_user_img = popupBox.querySelector(".updated-user-img");

const AddNotePost = document.getElementById('Add-Note-post');

AddNotePost.addEventListener('click', async (event) => {
    event.preventDefault();
    
    var updated_user_firstnames = updated_user_firstname.value;
    var updated_user_lastnames = updated_user_lastname.value;
    var updated_user_languages = updated_user_language.value;
    var updated_user_AddressS = updated_user_Address.value;
    var updated_user_imgs = updated_user_img.files[0];

    const userEmailElement = document.getElementById('user_id');
    const _id = userEmailElement.getAttribute('data-id');

    const formData = new FormData();
    formData.append('firstname', updated_user_firstnames);
    formData.append('lastname', updated_user_lastnames);
    formData.append('language', updated_user_languages);
    formData.append('address', updated_user_AddressS);
    formData.append('image', updated_user_imgs);

    formData.append('_id', _id);
    
    try {
        const response = await fetch('/update-profile-names', {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            throw new Error('Failed to upload image');
        }
        alert('Image uploaded successfully');
        closeIconThePopBox();
        const responseData = await response.json();
        const imagePath = responseData.user.image;

        if (imagePath) {
            document.querySelector('#image-preview').src = imagePath;
            document.querySelector('#profile-img-preview').src = imagePath;
            document.querySelector('#profile-img-preview-header').src = imagePath;
            document.querySelector('.user-name').innerHTML = responseData.user.firstname + responseData.user.lastname;
            document.querySelector('.name').innerHTML = responseData.user.firstname + responseData.user.lastname;
            document.querySelector('.user-address').innerHTML = responseData.user.address;
            document.querySelector('.user-language').innerHTML = responseData.user.language;
        } else {
            alert('Please select an image file to upload.');
        }

    } catch (error) {
        alert('Please select an image file to upload.');
    }
});


addBox.addEventListener("click", () => {
    updated_user_firstname.focus();
    popupBox.classList.add("show");
});

closeIcon.addEventListener("click", () => {
    closeIconThePopBox();
});

function closeIconThePopBox(){
    isUpdate = false;
    updated_user_firstname.value = "",
    updated_user_lastname.value = "",
    updated_user_Address.value = "",
    updated_user_language.value = "",
    addBtn.innerText = "Add a Code";
    popupTitle.innerText = "Add a new Code";
    popupBox.classList.remove("show");
};

// ---- update profile End ---

    // Assuming you're using vanilla JavaScript
    document.addEventListener('DOMContentLoaded', () => {
        const displayNameLinks = document.querySelectorAll('.display-name-link');
    
        displayNameLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const displayName = link.getAttribute('href').substring(1); // Remove the '#' from the href
                window.location.href = `http://localhost:5000/UserProfile/${displayName}`;
            });
        });
    });
    