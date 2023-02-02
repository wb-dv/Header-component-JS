const Nav = {
  navItems: document.querySelectorAll('.nav__item'),

  changeActiveItem(currentItem) {
    this.navItems.forEach((item) => {
      item.classList.remove('active');
    });
    currentItem.classList.add('active');
  },
};

Nav.navItems.forEach((item) => {
  item.addEventListener('click', (e) => Nav.changeActiveItem(e.currentTarget));
});
