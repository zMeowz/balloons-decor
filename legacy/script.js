const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealItems.forEach(item => revealObserver.observe(item));

const cursor = document.querySelector('.cursor-balloons');
window.addEventListener('mousemove', (e) => {
  if (!cursor) return;
  const x = e.clientX + 10;
  const y = e.clientY - 10;
  cursor.style.transform = `translate(${x}px, ${y}px)`;
});

const parallaxItems = document.querySelectorAll('.parallax');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  parallaxItems.forEach(item => {
    const speed = Number(item.dataset.speed || 0.08);
    item.style.setProperty('--shift', `${scrollY * speed}px`);
  });
}, { passive: true });
