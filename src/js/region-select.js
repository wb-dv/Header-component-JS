import { Loader } from './loader.js';
import { Search } from './search.js';
import { TagsField } from './tags-field.js';
import { Coockie } from './coockie.js';

export const RegionSelect = {
  openBtns: document.querySelectorAll('.pick-region__open-btn'),
  saveBtns: document.querySelectorAll('.region-select__save-btn'),
  mobCloseBtns: document.querySelectorAll('.region-select__close-btn'),
  clearInputBtn: document.querySelectorAll('.region-select__clear-input'),

  parent: document.querySelector('.pick-region__outer'),
  parentMob: document.querySelector('.mob-pick-region__outer'),

  popup: document.querySelector('.pick-region__outer .region-select'),
  popupMob: document.querySelector('.mob-pick-region__outer .region-select'),

  selects: document.querySelectorAll('.region-select__select'),
  searchInputs: document.querySelectorAll('.region-select__input'),

  regions: null,
  addedOptionsId: new Set(),
  savedOptionsId: new Set(),

  open() {
    this.popup.classList.add('_open');
    this.popupMob.classList.add('_open');
  },

  close() {
    this.popup.classList.remove('_open');
    this.popupMob.classList.remove('_open');
  },

  toggle(currentParent) {
    if (currentParent == this.parent) {
      this.popup.classList.toggle('_open');
    } else if (currentParent == this.parentMob) {
      this.popupMob.classList.toggle('_open');
    }
  },

  getRegions(callback = null) {
    let ajax = new XMLHttpRequest();
    ajax.open('POST', 'https://studika.ru/api/areas');

    ajax.onreadystatechange = function () {
      if (this.readyState === 2) {
        Loader.open();
      }

      if (this.readyState === 4 && this.status === 200) {
        RegionSelect.regions = JSON.parse(this.responseText);
        Loader.close();

        if (callback !== null) {
          callback();
        }
      }
    };

    ajax.send();
  },

  option({ id, type = null, regionName, sityName = null, state_id = null }) {
    return `<li class="region-select__option text__base 
      ${this.addedOptionsId.has(`${id}`) ? 'added' : ''}"
      data-id="${id}" 
      data-name="${(sityName || regionName).replace(/<|>|\/|strong/g, '')}"
      ${state_id === null ? '' : `data-stateid="${state_id}"`} 
      ${type === null ? '' : `data-type="${type}"`}
      >
         ${sityName || regionName}
         ${
           sityName === null
             ? ''
             : `<div class="text__descriptor">${regionName.replace(
                 /<|>|\/|strong/g,
                 ''
               )}</div>`
         }
      </li>`;
  },

  renderOptions(regions = RegionSelect.regions) {
    if (regions === null) {
      this.selects[0].insertAdjacentHTML(
        'beforeend',
        `<div class="region-select__not-result">Результатов нет<div>`
      );
      this.synchronizeSelects();
      return;
    }

    regions.forEach((region) => {
      if (!region.notInclude) {
        let data = {
          id: region.id,
          type: region.type,
          regionName: region.name,
        };

        this.selects[0].insertAdjacentHTML('beforeend', this.option(data));
      }

      if (Array.isArray(region.cities)) {
        region.cities.forEach((sity) => {
          let data = {
            id: sity.id,
            state_id: sity.state_id,
            sityName: sity.name,
            regionName: region.name,
          };

          this.selects[0].insertAdjacentHTML('beforeend', this.option(data));
        });
      }
    });

    this.synchronizeSelects();
  },

  synchronizeSelects() {
    this.selects[1].innerHTML = this.selects[0].innerHTML;
  },

  clearSelects() {
    this.selects[0].innerHTML = '';
    this.synchronizeSelects();
  },

  displayClearBtn(inputValue, inputParent) {
    if (inputValue !== '') {
      inputParent.classList.add('searching');
    } else {
      inputParent.classList.remove('searching');
    }
  },

  clearInput(currentInput) {
    currentInput.value = '';
  },

  toggleDisabledSaveBtn() {
    if (this.selectIsChanged()) {
      this.saveBtns.forEach((btn) => btn.removeAttribute('disabled'));
    } else {
      this.saveBtns.forEach((btn) => btn.setAttribute('disabled', ''));
    }
  },

  serialize() {
    let data = [];

    if (TagsField.fields[0].children.length === 0) return 'Any regions';

    for (let tag of TagsField.fields[0].children) {
      data.push({
        id: tag.getAttribute('data-id'),
        name: tag.getAttribute('data-name'),
        state_id: tag.getAttribute('data-stateid'),
        type: tag.getAttribute('data-type'),
      });
    }
    return data;
  },

  sendRegions(data, callback = null) {
    if (data === 'Any regions') {
      Coockie.delete('regions');

      data = {
        id: data,
      };
    } else {
      Coockie.set('regions', JSON.stringify(data));
    }

    let ajax = new XMLHttpRequest();

    ajax.open('POST', '/');

    ajax.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        if (callback !== null) {
          callback(); //что-нибудь сделать при успешном завершении запроса
        }
      }
    };

    ajax.send(JSON.stringify(data));
  },

  openBtnTmp(data, currBtn) {
    if (data === 'Any regions') {
      data = [{ name: 'Любой регион' }];
    }

    if (currBtn.classList.contains('mob-pick-region')) {
      let res = `<div class="mob-pick-region__text">
                    <div class="mob-pick-region__descritpor text__descriptor">
                      Город или регион
                    </div>
                    <span class="pick-region__current-region text__base">`;

      data.forEach((item) => {
        res += `${item.name}, `;
      });

      return (res =
        res.slice(0, -2) + `</span></div><div class="pick-region__img"></div>`);
    }

    let res = `<div class="pick-region__img"></div><span class="text__base pick-region__current-region">`;

    data.forEach((item) => {
      res += `${item.name}, `;
    });

    return (res = res.slice(0, -2) + `</span>`);
  },

  updateOpenBtnsText(data) {
    this.openBtns.forEach((btn) => {
      btn.innerHTML = '';
      btn.insertAdjacentHTML('beforeend', this.openBtnTmp(data, btn));
    });
  },

  selectIsChanged() {
    let copySavedSet = new Set(this.savedOptionsId.keys());

    if (copySavedSet.size < this.addedOptionsId.size) return true;

    this.addedOptionsId.forEach((option) => {
      copySavedSet.delete(option);
    });

    return copySavedSet.size !== 0;
  },
};

RegionSelect.openBtns.forEach((item) => {
  item.addEventListener('click', (e) => {
    RegionSelect.toggle(e.currentTarget.parentNode);

    if (RegionSelect.regions === null) {
      if (Coockie.get('regions')) {
        let data = JSON.parse(Coockie.get('regions'));

        data.forEach((region) => {
          RegionSelect.addedOptionsId.add(region.id);
          RegionSelect.savedOptionsId.add(region.id);
        });

        TagsField.showField();
        TagsField.renderTags(data);
      }

      RegionSelect.getRegions(RegionSelect.renderOptions.bind(RegionSelect));
    }

    RegionSelect.toggleDisabledSaveBtn();
  });
});

RegionSelect.saveBtns.forEach((item) => {
  item.addEventListener('click', () => {
    let data = RegionSelect.serialize();

    RegionSelect.savedOptionsId = new Set(RegionSelect.addedOptionsId.keys());

    RegionSelect.sendRegions(data, RegionSelect.updateOpenBtnsText(data));

    RegionSelect.close();
  });
});

RegionSelect.mobCloseBtns[1].addEventListener('click', () => {
  RegionSelect.close();
});

document.addEventListener('click', () => RegionSelect.close());
window.addEventListener('DOMContentLoaded', () => {
  if (Coockie.get('regions')) {
    RegionSelect.updateOpenBtnsText(JSON.parse(Coockie.get('regions')));
  }
});

RegionSelect.parent.addEventListener('click', (e) => {
  e.stopPropagation();
});

RegionSelect.parentMob.addEventListener('click', (e) => {
  e.stopPropagation();
});

RegionSelect.searchInputs.forEach((input) => {
  input.addEventListener('input', (e) => {
    RegionSelect.displayClearBtn(
      e.currentTarget.value,
      e.currentTarget.parentNode
    );

    let searchResult = Search.searchRegions(
      e.currentTarget.value,
      RegionSelect.regions
    );

    RegionSelect.clearSelects();
    RegionSelect.renderOptions(searchResult);
  });
});

RegionSelect.clearInputBtn.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    RegionSelect.clearInput(e.currentTarget.previousElementSibling);
    e.currentTarget.previousElementSibling.dispatchEvent(
      new Event('input', { bubbles: true })
    );
  });
});

RegionSelect.selects.forEach((select) => {
  select.addEventListener('click', (e) => {
    if (!TagsField.showed) {
      TagsField.showField();
    }

    let currentOption = null;

    if (e.target.classList.contains('region-select__option')) {
      currentOption = e.target;
    } else {
      currentOption = e.target.parentNode;
    }

    let reallyOption = RegionSelect.selects[0].querySelector(
      `[data-id="${currentOption.getAttribute('data-id')}"]`
    );

    if (reallyOption.classList.contains('added')) {
      let currentTag = TagsField.fields[0].querySelector(
        `[data-id="${reallyOption.getAttribute('data-id')}"]`
      );
      TagsField.removeTag(currentTag);
    } else {
      TagsField.addTag(reallyOption);
    }

    if (
      RegionSelect.addedOptionsId.delete(reallyOption.getAttribute('data-id'))
    ) {
      reallyOption.classList.remove('added');
    } else {
      reallyOption.classList.add('added');
      RegionSelect.addedOptionsId.add(reallyOption.getAttribute('data-id'));
    }

    RegionSelect.synchronizeSelects();
    RegionSelect.toggleDisabledSaveBtn();
  });
});
