import { project } from './config.js';

document.documentElement.classList.add('js');
document.querySelectorAll('[data-link]').forEach(link => { link.href = project[link.dataset.link]; });

const intro = document.querySelector('#intro');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let introTimer;
function playIntro() {
  if (reducedMotion.matches) return;
  clearTimeout(introTimer);
  intro.classList.remove('active');
  // Restart the CSS animation when the visitor asks to replay it.
  void intro.offsetWidth;
  intro.classList.add('active');
  introTimer = setTimeout(() => intro.classList.remove('active'), 2900);
}
if (!location.hash) playIntro();
document.querySelector('#replay-intro').addEventListener('click', playIntro);
reducedMotion.addEventListener('change', event => { if (event.matches) intro.classList.remove('active'); });

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

const menuToggle = document.querySelector('#menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function setDisclosure(toggle, panel, expanded) {
  toggle.setAttribute('aria-expanded', String(expanded));
  panel.classList.toggle('is-collapsed', !expanded);
  panel.inert = !expanded;
}
setDisclosure(menuToggle, mobileNav, false);
mobileNav.hidden = false;
function closeMenu() {
  setDisclosure(menuToggle, mobileNav, false);
  menuToggle.setAttribute('aria-label', 'Open navigation');
}
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  setDisclosure(menuToggle, mobileNav, !expanded);
  menuToggle.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') { closeMenu(); menuToggle.focus(); }
});
matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const previewToggle = document.querySelector('#preview-toggle');
const preview = document.querySelector('#drive-preview');
previewToggle.addEventListener('click', () => {
  const expanded = previewToggle.getAttribute('aria-expanded') === 'true';
  setDisclosure(previewToggle, preview, !expanded);
  previewToggle.innerHTML = expanded ? 'Preview archive <span>+</span>' : 'Close preview <span>−</span>';
});

const copyStatus = document.querySelector('#copy-status');
document.querySelector('#copy-link').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(project.drive);
    copyStatus.textContent = 'Drive link copied.';
  } catch {
    copyStatus.textContent = 'Copy is unavailable. Use “Save link as .txt” or open Google Drive.';
  }
});
