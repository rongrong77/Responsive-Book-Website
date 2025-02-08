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
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  console.log('Retrieved userId from localStorage:', userId);
  if (userId) {
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
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  console.log('Retrieved userId from localStorage:', userId);
  if (!userId) {
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
  localStorage.removeItem('userId'); // Clear login state
  localStorage.removeItem('username'); 
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
          localStorage.setItem('userId', data.user_id);
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
        loginContent = document.getElementById('login-content');

  function showLoginModal() {
    loginContent.classList.add('show-login');
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
  const featuredContainer = document.querySelector('.featured__swiper .swiper-wrapper');
  const modal = document.getElementById('book-details-modal');
  const closeModal = document.getElementById('close-modal');
  const bookTitle = document.getElementById('book-title');
  const bookAuthor = document.getElementById('book-author');
  const bookDescription = document.getElementById('book-summary');
  const bookGenre = document.getElementById('book-genre');
  const bookImage = document.getElementById('book-image');
  modal.classList.add('modal');
  document.body.appendChild(modal);

  // Function to toggle the like status of a book
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
        }
      });
    }
  }


  function removeBookFromLikedSection(bookId) {
    const likedBooksContainer = document.getElementById('liked-books-container');
    const likedBook = likedBooksContainer.querySelector(`.featured__card[data-book-id="${bookId}"]`);
    if (likedBook) {
        likedBooksContainer.removeChild(likedBook);
    }
  }

  function showModal(bookId) {
    fetch(`/book/${bookId}`)
        .then(response => response.json())
        .then(data => {
            bookTitle.textContent = data.Title;
            bookAuthor.textContent = data.Author;
            bookDescription.textContent = data.Summary;
            bookGenre.textContent = data.Genre;
            bookImage.src = data.Picture;
            modal.style.display = "block";
        })
        .catch(error => console.error('Error:', error));
  }

  function showModal2(imgSrc) {
    modal.innerHTML = `<img src="${imgSrc}" alt="Book Image" style="max-width:80%; max-height:80%; position: absolute; top: 15%; left: 35%; ">`;
    modal.style.display = 'block';
  }

  // Fetching the featured books
  fetch('/books')
    .then(response => response.json())
    .then(books => {
      books.forEach(book => {
        const bookHTML = `
          <article class="featured__card swiper-slide" data-book-id="${book.book_id}">
            <img src="${book.Picture}" alt="image" class="featured__img">
            <h2 class="featured__title">${book.Title}</h2>
            <div class="featured__prices">
              <span class="author_block">${book.Author}</span>
            </div>
            <button class="button see-more-button" data-book-id="${book.book_id}">See more</button>
            <div class="featured__actions">
              <button class="heart-button" data-book-id="${book.book_id}"><i class="ri-heart-line"></i></button>
              <button class="zoom-button" data-book-id="${book.book_id}"><i class="ri-eye-line"></i></button>
            </div>
          </article>
        `;
        featuredContainer.innerHTML += bookHTML;
      });

      // Event listeners for dynamic content
      featuredContainer.addEventListener('click', function(event) {
        const button = event.target.closest('button');
        if (button) {
          const bookId = button.getAttribute('data-book-id');
          if (button.classList.contains('heart-button')) {
            toggleLikeButton(button);
          } else if (button.classList.contains('see-more-button')) {
            showModal(bookId);
          } else if (button.classList.contains('zoom-button')) {
            const imgSrc = button.closest('.featured__card').querySelector('.featured__img').src;
              showModal2(imgSrc);
          }
        }
      });

      closeModal.addEventListener('click', function() {
          modal.style.display = "none";
      });

      window.addEventListener('click', function(event) {
          if (event.target === modal) {
              modal.style.display = "none";
          }
      });
    })
    .catch(error => console.error('Error loading the books:', error));
});

/*=============== NEW BOOKS ===============*/
document.addEventListener("DOMContentLoaded", function () {
  const newBooksContainer = document.querySelector('.new__swiper .swiper-wrapper');

  newBooksContainer.innerHTML = ''


  // Fetch new books
  fetch('/new-books')
    .then(response => response.json())
    .then(books => {
      books.forEach(book => {
        const formattedDate = new Date(book.Date).toLocaleDateString('en-US');
        const bookHTML = `
          <article class="new__card swiper-slide" data-book-id="${book.book_id}">
            <img src="${book.Picture}" alt="image" class="new__img">
            <h2 class="new__title">${book.Title}</h2>
            <div class="new__author">${book.Author}</div>
            <span class="new__date">Date: ${formattedDate}</span>
          </article>
        `;
        newBooksContainer.innerHTML += bookHTML;
      });
    })
    .catch(error => console.error('Error loading the new books:', error));
});

/*=============== LIKE BOOKS ===============*/
document.addEventListener("DOMContentLoaded", function () {
  const likedBooksContainer = document.querySelector('.like__swiper .swiper-wrapper');
  const userId = localStorage.getItem('userId');

  likedBooksContainer.innerHTML = ''

  fetch(`/liked-books/${userId}`)
    .then(response => response.json())
    .then(books => {
      books.forEach(book => {
        const bookHTML = `
          <article class="liked__card swiper-slide" data-book-id="${book.book_id}">
            <img src="${book.Picture}" alt="image" class="liked__img">
            <h2 class="liked__title">${book.Title}</h2>
            <div class="liked__author">${book.Author}</div>
          </article>
        `;
        likedBooksContainer.innerHTML += bookHTML;
      });
    })
  .catch(error => console.error('Error loading the liked books:', error));
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

/*=============== LIKE SWIPER ===============*/
let swiperLike = new Swiper('.like__swiper', {
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


