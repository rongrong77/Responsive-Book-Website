/*=============== SEARCH ===============*/
const searchButton = document.getElementById('search-button'),
      searchClose = document.getElementById('search-close'),
      searchContent = document.getElementById('search-content')

/*===== SEARCH SHOW =====*/
/* Validate if constant exists */
if(searchButton){
  searchButton.addEventListener('click', () =>{
    searchContent.classList.add('show-search')
  })
}
  
/*===== SEARCH HIDDEN =====*/
/* Validate if constant exists */
if(searchClose){
  searchClose.addEventListener('click', () =>{
    searchContent.classList.remove('show-search')
  })
}

/*=============== LOGIN ===============*/
const loginButton = document.getElementById('login-button'),
      loginContent = document.getElementById('login-content'),
      logoutButton = document.getElementById('logout-button'),
      userGreeting = document.getElementById('user-greeting'); 
      

// Check if the user is already logged in when the page loads
document.addEventListener('DOMContentLoaded', function() {
  const username = localStorage.getItem('username');
  if (username) {
      userGreeting.textContent = `Hi, ${username}!`;
      loginButton.style.display = 'none';
      logoutButton.style.display = 'block';
  } else {
      loginButton.style.display = 'block';
      logoutAdaptor.style.display = 'none';
  }
});

// Handle login button click
loginButton.addEventListener('click', () => {
  // Only show login form if not already logged in
  const username = localStorage.getItem('username');
  if (!username) {
      loginContent.classList.add('show-login');
  }
});

// Hide the login modal on successful close
const loginClose = document.getElementById('login-close');
loginClose.addEventListener('click', () => {
  loginContent.classList.remove('show-login');
});

// Handle logout button click
logoutButton.addEventListener('click', function() {
  localStorage.removeItem('username'); // Clear login state
  userGreeting.textContent = ''; // Clear greeting
  logoutButton.style.display = 'none'; // Hide logout button
  loginButton.style.display = 'block'; // Show login button
  alert('Logout successful!');
  window.location.href = 'http://localhost:3000'; // Redirect to login or home page
});

// Handle login form submission
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-pass').value;

  fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          alert(data.message);
          localStorage.setItem('username', data.username);
          userGreeting.textContent = `Hi, ${data.username}!`;
          loginContent.classList.remove('show-login');
          logoutButton.style.display = 'block';
          loginButton.style.display = 'none';
          window.location.href = 'http://localhost:3000';
      } else {
          alert(data.message);
      }
  })
  .catch(error => {
      console.error('Request failed', error);
      alert('An error occurred during login');
  });
});

/*=============== LIKE ===============*/

document.addEventListener('DOMContentLoaded', function() {
  const headerLikeButton = document.getElementById('like-button'),
        likedBooksSection = document.getElementById('liked-books'),
        featuredHeartButtons = document.querySelectorAll('.featured .heart-button'),
        likedBooksContainer = document.querySelector('.liked__container'),
        loginContent = document.getElementById('login-content');

  function showLoginModal() {
    loginContent.classList.add('show-login');
  }

  function toggleLikeButton(button) {
    const bookId = button.getAttribute('data-book-id');
    const heartIcon = button.querySelector('i');
    const isLiked = heartIcon.classList.contains('ri-heart-fill'); // Corrected condition
    const userId = localStorage.getItem('userId');
  
    if (isLiked) {
      fetch(`/unlike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, bookId })
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          document.querySelectorAll(`.heart-button[data-book-id="${bookId}"] i`).forEach(icon => {
            icon.classList.remove('ri-heart-fill');
            icon.classList.add('ri-heart-line');
          });
          removeBookFromLikedSection(bookId);
        }
      });
    } else {
      fetch('/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, bookId })
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          document.querySelectorAll(`.heart-button[data-book-id="${bookId}"] i`).forEach(icon => {
            icon.classList.remove('ri-heart-line');
            icon.classList.add('ri-heart-fill');
          });
          addBookToLikedSection(bookId);
        }
      });
    }
  }
  
  function addBookToLikedSection(bookId) {
    const existingLikedBook = likedBooksContainer.querySelector(`.featured__card[data-book-id="${bookId}"]`);
    if (!existingLikedBook) {
        const book = document.querySelector(`.featured__card[data-book-id="${bookId}"]`);
        if (book) {
            const likedBook = book.cloneNode(true);
            likedBooksContainer.appendChild(likedBook);
        }
    }
  }

  
  function removeBookFromLikedSection(bookId) {
    const likedBook = likedBooksContainer.querySelector(`.liked__container .featured__card[data-book-id="${bookId}"]`);
    if (likedBook) {
        likedBooksContainer.removeChild(likedBook);
    }
    document.querySelectorAll(`.heart-button[data-book-id="${bookId}"] i`).forEach(icon => {
        if (icon.classList.contains('ri-heart-fill')) {
            icon.classList.remove('ri-heart-fill');
            icon.classList.add('ri-heart-line');
        }
    });
  }

  headerLikeButton.addEventListener('click', () => {
    if (logoutButton.style.display !== 'none') {
          likedBooksSection.scrollIntoView({ behavior: 'smooth' });
      } else {
          showLoginModal();
      }
  });

  featuredHeartButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (logoutButton.style.display !== 'none') {
            toggleLikeButton(button);
        } else {
            showLoginModal();
        }
    });
  });

  if (isLoggedIn()) {
      const userId = localStorage.getItem('userId');
      fetch(`/liked-books/${userId}`)
      .then(response => response.json())
      .then(data => {
          data.forEach(book => addBookToLikedSection(book.id));
      });
  }
});

/*=============== FEATURED BOOK ===============*/
document.addEventListener("DOMContentLoaded", function() {
  // Fetching the featured books
  fetch('/books')
      .then(response => response.json())
      .then(books => {
          const featuredContainer = document.querySelector('.featured__swiper .swiper-wrapper');
          featuredContainer.addEventListener('click',function(event)){
            const heartButton 
          books.forEach(book => {
              const bookHTML = `
                  <article class="featured__card swiper-slide" data-book-id="${book.Book_id}">
                      <img src="${book.Picture}" alt="image" class="featured__img">

                      <h2 class="featured__title">${book.Title}</h2>
                      <div class="featured__prices">
                          <span class="author_block">${book.Author}</span>
                      </div>

                      <button class="button" id="seeMoreButton" data-book-id="${book.Book_id}">See more</button>

                      <div class="featured__actions">
                          <button class="heart-button" data-book-id="${book.Book_id}"><i class="ri-heart-line"></i></button>
                          <button class="zoom-button"><i class="ri-eye-line"></i></button>
                      </div>
                  </article>
              `;
              featuredContainer.innerHTML += bookHTML;
          });
      })
      .catch(error => console.error('Error loading the books:', error));
});

/*=============== SEE MORE ===============*/
document.getElementById('seeMoreButton').addEventListener('click', function() {
  var bookId = this.getAttribute('data-book-id');
  window.location.href = 'page-book-details.html?id=' + bookId;
});
document.addEventListener('DOMContentLoaded', function() {
  var urlParams = new URLSearchParams(window.location.search);
  var bookId = urlParams.get('id');

  if (bookId) {
      fetch('http://localhost:3000/book/' + bookId)
          .then(response => response.json())
          .then(data => {
              if (data.message) {
                  console.error(data.message);
              } else {
                  document.getElementById('bookTitle').innerText = data.title;
                  document.getElementById('bookAuthor').innerText = 'Author: ' + data.author;
                  document.getElementById('bookDescription').innerText = data.description;
                  document.getElementById('bookImage').src = data.image;
              }
          })
          .catch(error => console.error('Error fetching book details:', error));
  } else {
      console.error('No book ID provided in URL');
  }
});

/*=============== SEE MORE ===============*/
 // Eye button zoom
 const zoom-button = document.querySelectorAll('.zoom-button');
 const modal = document.createElement('div');
 modal.classList.add('modal');
 document.body.appendChild(modal);

 zoomButtons.forEach(button => {
     button.addEventListener('click', function () {
         const imgSrc = this.closest('.featured__card').querySelector('.featured__img').src;
         const modalImg = document.createElement('img');
         modalImg.src = imgSrc;
         modal.innerHTML = ''; // 清空之前的内容
         modal.appendChild(modalImg);
         modal.classList.add('active');
     });
 });

 // Close modal on click outside the image
 modal.addEventListener('click', function (e) {
     if (e.target === modal) {
         modal.classList.remove('active');
     }
 });


/*=============== ADD SHADOW HEADER ===============*/
const shadowHeader = () =>{
  const header = document.getElementById('header')
  // When the scroll is greater than 50 viewport height, add the shadow-header class to the header tag
  this.scrollY >= 50 ? header.classList.add('shadow-header') 
                     : header.classList.remove('shadow-header')
}
window.addEventListener('scroll', shadowHeader)

/*=============== HOME SWIPER ===============*/
let swiperHome = new Swiper('.home__swiper', {
  loop: true,
  spaceBetween: -24,
  grabCursor: true,
  slidesPerView: 'auto',
  centeredSlides: 'auto',

  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },

  breakpoints:{
    1220: {
      spaceBetween: -32,
    },
  },
})

/*=============== FEATURED SWIPER ===============*/
let swiperFeatured = new Swiper('.featured__swiper', {
  loop: true,
  spaceBetween: 16,
  grabCursor: true,
  slidesPerView: 'auto',
  centeredSlides: 'auto',

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  
  breakpoints:{
    1150: {
      slidesPerView: 4,
      centeredSlides: false,
    },
  },
})

/*=============== NEW SWIPER ===============*/
let swiperNew = new Swiper('.new__swiper', {
  loop: true,
  spaceBetween: 16,
  slidesPerView: 'auto',

  breakpoints:{
    1150: {
      slidesPerView: 3,
    },
  },
})

/*=============== TESTIMONIAL SWIPER ===============*/
let swiperTestimonial = new Swiper('.testimonial__swiper', {
  loop: true,
  spaceBetween: 16,
  grabCursor: true,
  slidesPerView: 'auto',
  centeredSlides: 'auto',

  breakpoints:{
    1150: {
      slidesPerView: 3,
      centeredSlides: false,
    },
  },
})

/*=============== SHOW SCROLL UP ===============*/ 
const scrollUp = () =>{
	const scrollUp = document.getElementById('scroll-up')
    // When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scrollup class
	this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
						: scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')
    
const scrollActive = () =>{
  const scrollDown = window.scrollY

	sections.forEach(current =>{
		const sectionHeight = current.offsetHeight,
			  sectionTop = current.offsetTop - 58,
			  sectionId = current.getAttribute('id'),
			  sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

		if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
			sectionsClass.classList.add('active-link')
		}else{
			sectionsClass.classList.remove('active-link')
		}                                                    
	})
}
window.addEventListener('scroll', scrollActive)

/*=============== DARK LIGHT THEME ===============*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'ri-sun-line'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
  origin: 'top',
  distance: '60px',
  duration: 2500,
  delay: 400,
  // reset: true, // Animations repeat
})

sr.reveal(`.home__data, .featured__container, .new__container, 
           .join__data, .testimonial__container, .footer`)
sr.reveal(`.home__images`, {delay: 600})
sr.reveal(`.services__card`, {interval: 100})
sr.reveal(`.discount__data`, {origin: 'left'})
sr.reveal(`.discount__images`, {origin: 'right'})

// /*=============== event listener for heart button ===============*/

// document.addEventListener('DOMContentLoaded', function () {
//   // Heart button toggle
//   const heartButtons = document.querySelectorAll('.heart-button');

//   heartButtons.forEach(button => {
//       button.addEventListener('click', function () {
//           const icon = this.querySelector('i');
//           if (icon.classList.contains('ri-heart-3-line')) {
//               icon.classList.remove('ri-heart-3-line');
//               icon.classList.add('ri-heart-fill');
//           } else {
//               icon.classList.remove('ri-heart-fill');
//               icon.classList.add('ri-heart-3-line');
//           }
//       });
//   });

  // Eye button zoom
  const zoomButtons = document.querySelectorAll('.zoom-button');
  const modal = document.createElement('div');
  modal.classList.add('modal');
  document.body.appendChild(modal);

  zoomButtons.forEach(button => {
      button.addEventListener('click', function () {
          const imgSrc = this.closest('.featured__card').querySelector('.featured__img').src;
          const modalImg = document.createElement('img');
          modalImg.src = imgSrc;
          modal.innerHTML = ''; // 清空之前的内容
          modal.appendChild(modalImg);
          modal.classList.add('active');
      });
  });

  // Close modal on click outside the image
  modal.addEventListener('click', function (e) {
      if (e.target === modal) {
          modal.classList.remove('active');
      }
  });
// });


