// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => observer.observe(el));

// Nav active state
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--gold-hi)' : '';
  });
});

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinksList = document.querySelector('.nav-links');
if (navToggle && navLinksList) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinksList.classList.toggle('open');
  });
  navLinksList.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinksList.classList.remove('open');
    });
  });
}

// Quick booking widget (WhatsApp / Email)
const bookingSubmitBtn = document.getElementById('booking-submit-btn');
if (bookingSubmitBtn) {
  const waPhoneNumber = '31681984444';
  const bookingEmail = 'booking@dlstudija.com';

  const bookingTabs = document.querySelectorAll('.booking-tab');
  const contactFieldsRow = document.querySelector('.booking-contact-fields');
  const nameInput = document.getElementById('booking-name');
  const emailInput = document.getElementById('booking-email');
  const dateInput = document.getElementById('wa-date');
  const serviceSelect = document.getElementById('wa-service');

  dateInput.min = new Date().toISOString().split('T')[0];

  const dateDisplay = document.getElementById('wa-date-display');
  if (dateDisplay) {
    const updateDateDisplay = () => {
      if (dateInput.value) {
        const formatted = new Date(dateInput.value + 'T00:00:00').toLocaleDateString('en-GB', {
          day: 'numeric', month: 'short', year: 'numeric'
        });
        dateDisplay.textContent = formatted;
        dateDisplay.classList.add('set');
      } else {
        dateDisplay.textContent = 'Select date';
        dateDisplay.classList.remove('set');
      }
    };
    dateInput.addEventListener('input', updateDateDisplay);
    dateInput.addEventListener('click', () => dateInput.showPicker?.());
    updateDateDisplay();
  }

  let bookingMode = 'whatsapp';

  function updateBookingUI() {
    const isEmail = bookingMode === 'email';
    contactFieldsRow.hidden = !isEmail;
    bookingSubmitBtn.innerHTML = isEmail
      ? '<span class="wa-icon">&#9993;</span> Book via Email'
      : '<span class="wa-icon">&#9742;</span> Book on WhatsApp';
  }

  bookingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      bookingTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      bookingMode = tab.dataset.mode;
      updateBookingUI();
    });
  });

  updateBookingUI();

  bookingSubmitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (!dateInput.value) {
      dateInput.focus();
      dateInput.reportValidity?.();
      return;
    }
    if (bookingMode === 'email' && (!nameInput.value || !emailInput.value)) {
      (nameInput.value ? emailInput : nameInput).focus();
      (nameInput.value ? emailInput : nameInput).reportValidity?.();
      return;
    }

    const formattedDate = new Date(dateInput.value + 'T00:00:00').toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    const service = serviceSelect.value;

    if (bookingMode === 'email') {
      const subject = `Booking request: ${service}`;
      const body = `Hi, I would like to book a ${service} on ${formattedDate}.\n\nName: ${nameInput.value}\nEmail: ${emailInput.value}`;
      window.location.href = `mailto:${bookingEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else {
      const message = `Hi, I would like to book a ${service} on ${formattedDate}.`;
      const waUrl = `https://wa.me/${waPhoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank', 'noopener');
    }
  });
}

// Form submit placeholder
document.querySelector('button.btn-primary').addEventListener('click', () => {
  alert('Booking request sent! We\'ll be in touch within 24 hours.');
});
