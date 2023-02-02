export const Loader = {
  elems: document.querySelectorAll('.loader'),
  waitingElems: document.querySelectorAll('.region-select__select'),

  open() {
    this.waitingElems.forEach((item) => {
      item.classList.add('_waiting');
    });

    this.elems.forEach((item) => {
      item.classList.add('open');
    });
  },

  close() {
    this.waitingElems.forEach((item) => {
      item.classList.remove('_waiting');
    });

    this.elems.forEach((item) => {
      item.classList.remove('open');
    });
  },

  toggle() {
    this.waitingElems.forEach((item) => {
      item.classList.toggle('_waiting');
    });

    this.elems.forEach((item) => {
      item.classList.toggle('open');
    });
  },
};
