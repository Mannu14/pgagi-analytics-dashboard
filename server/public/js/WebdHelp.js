// for---- header--from mainProfile--

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
   if (profile.classList.contains('active')) {
      document.querySelector('#user-btn').style.background = '#c5cae9';
      document.querySelector('#user-btn').style.color = '#333';
   }else{
      document.querySelector('#user-btn').style.background = '';
      document.querySelector('#user-btn').style.color = '';
   }
}

let search = document.querySelector('.header .flex .search-form');

document.querySelector('#search-btn').onclick = () =>{
   search.classList.toggle('active');
   profile.classList.remove('active');
}

let sideBar = document.querySelector('.side-bar');

document.querySelector('#menu-btn').onclick = () => {
   sideBar.classList.toggle('active');
   body.classList.toggle('active');
   if (sideBar.classList.contains('active')) {
      document.querySelector('#menu-btn').style.background = '#c5cae9';
      document.querySelector('#menu-btn').style.color = '#333';
      document.querySelector('.right-container').style.width = '100%';
      document.querySelector('.about-wrapper').style.gridTemplateColumns = 'repeat(auto-fill, minmax(50%, 1fr))';
      let aboutNotes = document.querySelectorAll('.about-note');
      aboutNotes.forEach(note => {
         note.style.width = '96%';
      });
   } else {
      document.querySelector('.about-wrapper').style.gridTemplateColumns = 'repeat(auto-fill, minmax(100%, 1fr))';
      document.querySelector('.right-container').style.width = '';
      document.querySelector('#menu-btn').style.background = '';
      document.querySelector('#menu-btn').style.color = '';
      let aboutNotes = document.querySelectorAll('.about-note');
      aboutNotes.forEach(note => {
         note.style.width = '';
      });
   }
}


document.querySelector('#close-btn').onclick = () =>{
   sideBar.classList.add('active');
   body.classList.add('active');
}

window.onscroll = () =>{
   profile.classList.remove('active');
   search.classList.remove('active');
}

// for---- header--from mainProfile end --


const aboutaddBox = document.querySelector(".about-wrapper-add-box"),
addBox = document.querySelector(".about-add-box"),
popupBox = document.querySelector(".about-popup-box"),
closeIcon = popupBox.querySelector(".about-header i"),
popupTitle = popupBox.querySelector(".about-header p"),
titleTag = popupBox.querySelector("input"),
descTag = popupBox.querySelector("textarea"),
addBtn = popupBox.querySelector(".post-note-btn");

let isUpdate = false;

aboutaddBox.addEventListener("click", () => {
    titleTag.focus();
    popupBox.classList.toggle("about-show");
});

closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = "",
    descTag.value = "";
    addBtn.innerText = "Post Note";
    popupTitle.innerText = "Post a new Note";
    popupBox.classList.remove("about-show");
});

function showMenu(elem) {
    elem.parentElement.classList.toggle("about-show");
    document.addEventListener("click", e =>{
        // removing show class from the setting menu on document click
        if(e.target.tagName != "I" || e.target != elem){
            elem.parentElement.classList.remove("about-show");
        }
    });
};
// ----------- for mkcoding code--

function showtext() {
    var i = 1;
    while (document.getElementById(`editor-${i}`)) {
      var editor = Mkcoding.fromTextArea(document.getElementById(`editor-${i}`), {
        mode: 'python',
        theme: 'dracula',
        lineNumbers: true,
        autofocus: true,
        tabSize: 4,
        autoCloseBrackets: true,
      });
      i++;
    }
  }
  
  showtext();


  function formatDate(dateString) {
   const date = new Date(dateString);
   const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
   
   const weekday = weekdays[date.getDay()];
   const month = months[date.getMonth()];
   const day = date.getDate().toString().padStart(2, '0');
   const year = date.getFullYear();
   const hours = date.getHours().toString().padStart(2, '0');
   const minutes = date.getMinutes().toString().padStart(2, '0');
   const seconds = date.getSeconds().toString().padStart(2, '0');

   return `${weekday}, ${month}-${day}-${year}, ${hours}:${minutes}:${seconds}`;
}
const hiddendateCreatedAt = document.querySelectorAll('.hiddendateCreatedAt');
hiddendateCreatedAt.forEach(onebyOne =>{
    const dateCreatedAthedden = onebyOne.querySelector('.dateCreatedAthedden');
    const dateCreatedAt = onebyOne.querySelector('.dateCreatedAt');
    const realOneByOneDate = formatDate(dateCreatedAthedden.innerHTML)
    dateCreatedAt.innerHTML = realOneByOneDate;
});

function calculateTimeDifference(postCreatedAt) {
  const postDate = new Date(postCreatedAt);
  const currentDate = new Date();
  const timeDifferenceMs = currentDate.getTime() - postDate.getTime();
  // Convert milliseconds to seconds, minutes, hours, days, months, years
  const secondsDifference = Math.floor(timeDifferenceMs / 1000);
  const minutesDifference = Math.floor(secondsDifference / 60);
  const hoursDifference = Math.floor(minutesDifference / 60);
  const daysDifference = Math.floor(hoursDifference / 24);
  const monthsDifference = Math.floor(daysDifference / 30); // Approximate calculation
  const yearsDifference = currentDate.getFullYear() - postDate.getFullYear();
  // Format the calculated difference (optional)
  let formattedDifference;
  if (yearsDifference > 0) {
    formattedDifference = `${yearsDifference} years`;
  } else if (monthsDifference > 0) {
    formattedDifference = `${monthsDifference} months`;
  } else if (daysDifference > 0) {
    formattedDifference = `${daysDifference+1} days`;
  } else if (hoursDifference > 0) {
    formattedDifference = `${hoursDifference} hours`;
  } else if (minutesDifference > 0) {
    formattedDifference = `${minutesDifference} minutes`;
  } else {
    formattedDifference = `${secondsDifference} seconds`;
  }

  return formattedDifference;
}


const hiddendateCreatedAtUser = document.querySelectorAll('.hiddendateCreatedAt-user');
hiddendateCreatedAtUser.forEach(onebyOne =>{
    const dateCreatedAtheddenUser = onebyOne.querySelector('.dateCreatedAthedden-user');
    const dateCreatedAtUser = onebyOne.querySelector('.dateCreatedAt-user');
    const realOneByOneDateUser = calculateTimeDifference(dateCreatedAtheddenUser.innerHTML)
    dateCreatedAtUser.innerHTML = `${realOneByOneDateUser} ago`;
});
