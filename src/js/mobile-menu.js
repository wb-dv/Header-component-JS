const MobileMenu = {
  burgerButtons: document.querySelectorAll('.burger'),
  mobileMenuCard: document.querySelector('.mobile-menu__card'),
  mobileMenu: document.querySelector('.mobile-menu'),
  closeButton: document.querySelector('.mobile-menu__close-btn'),

  controlMobileMenu() {
    this.burgerButtons.forEach(function (item) {
      item.classList.toggle('_open');
    });
    this.mobileMenu.classList.toggle('_open');
    this.closeButton.classList.toggle('_open');
  },
};

MobileMenu.mobileMenuCard.addEventListener('click', (e) => e.stopPropagation());

MobileMenu.burgerButtons.forEach(function (item) {
  item.addEventListener('click', () => MobileMenu.controlMobileMenu());
});

MobileMenu.mobileMenu.addEventListener('click', (e) => {
  if (e.target.classList.contains('_open')) {
    MobileMenu.controlMobileMenu();
  }
});
