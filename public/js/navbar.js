 const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const userBtn = document.getElementById('userBtn');
  const profileDropdown = document.getElementById('profileDropdown');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    // close profile dropdown if open
    profileDropdown.classList.remove('open');
    userBtn.classList.remove('open');
  });

  // Profile dropdown toggle
  userBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = profileDropdown.classList.toggle('open');
    userBtn.classList.toggle('open', isOpen);
    userBtn.setAttribute('aria-expanded', isOpen);
    // close mobile menu if open
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
  });

  // Close menu when a mobile link is tapped
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);

      // Active state
      mobileMenu.querySelectorAll('a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    }
    if (!userBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
      profileDropdown.classList.remove('open');
      userBtn.classList.remove('open');
      userBtn.setAttribute('aria-expanded', false);
    }
  });