const LevelTabs = {
  tabsBtns: document.querySelectorAll('.level-tabs__btn'),
  tabs: document.querySelectorAll('.level-tabs__tab'),
  parentTabsBtns: document.querySelector('.level-tabs__btns'),

  tabsClasses: ['_higher', '_secondary'],

  toggleLevelTabs(activeClass, unActiveClass) {
    this.parentTabsBtns.classList.remove(this.tabsClasses[unActiveClass]);
    this.parentTabsBtns.classList.add(this.tabsClasses[activeClass]);

    this.tabsBtns.forEach((item) => {
      if (
        item.classList.contains(
          'level-tabs__btn' + this.tabsClasses[activeClass]
        )
      ) {
        item.classList.remove('unactive');
      } else {
        item.classList.add('unactive');
      }
    });

    this.tabs.forEach((item) => {
      if (
        item.classList.contains(
          'level-tabs__tab' + this.tabsClasses[activeClass]
        )
      ) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  },
};

LevelTabs.tabsBtns.forEach((item) => {
  item.addEventListener('click', (e) => {
    LevelTabs.toggleLevelTabs(
      e.target.getAttribute('data-active'),
      e.target.getAttribute('data-unactive')
    );
  });
});
