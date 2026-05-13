// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.style.background = 'rgba(10,15,30,0.98)';
  } else {
    header.style.background = 'rgba(10,15,30,0.85)';
  }
});

// ===== SMOOTH ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + current ? '#63b3ed' : '#a0aec0';
  });
});

// ===== SKILL BAR ANIMATION ON SCROLL =====
const fills = document.querySelectorAll('.fill');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.style.width; // trigger CSS animation
    }
  });
}, { threshold: 0.3 });

fills.forEach(fill => observer.observe(fill));

// ===== TYPING EFFECT FOR SUBTITLE =====
const subtitle = document.querySelector('.subtitle');
if (subtitle) {
  const text = subtitle.textContent;
  subtitle.textContent = '';
  let i = 0;
  const type = () => {
    if (i < text.length) {
      subtitle.textContent += text[i++];
      setTimeout(type, 50);
    }
  };
  setTimeout(type, 800);
}

// ===== FADE-IN ON SCROLL =====
const fadeEls = document.querySelectorAll('.about-card, .project-card, .skill-item, .contact-box');
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.15 });

fadeEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  fadeObserver.observe(el);
});

// ===== DYNAMIC SERVER INFO IN FOOTER =====
const footer = document.querySelector('footer');
if (footer) {
  const now = new Date();
  footer.innerHTML += `<br/><small style="color:#2d3748">Page loaded: ${now.toLocaleString()}</small>`;
}
