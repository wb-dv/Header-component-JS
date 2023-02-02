import { RegionSelect } from './region-select.js';

export const TagsField = {
  fields: document.querySelectorAll('.region-select__tags-field'),
  showed: false,

  tag({ name, id, state_id, type }) {
    return `
        <li class="text__base region-select__tag" data-id="${id}" data-name="${name}"
        ${state_id === null ? '' : `data-stateid="${state_id}"`} 
        ${type === null ? '' : `data-type="${type}"`}
        >
            ${name}
            <button
            class="close-btn region-select__tag-remove"
            type="button"
            ></button>
        </li>`;
  },

  showField() {
    this.fields.forEach((field) => field.classList.add('containElems'));
    this.showed = true;
  },

  hideField() {
    this.fields.forEach((field) => field.classList.remove('containElems'));
    this.showed = false;
  },

  synchronizeFields() {
    this.fields[1].innerHTML = this.fields[0].innerHTML;
  },

  addTag(currentOption) {
    let data = {
      name: currentOption.getAttribute('data-name'),
      id: currentOption.getAttribute('data-id'),
      state_id: currentOption.getAttribute('data-stateid'),
      type: currentOption.getAttribute('data-type'),
    };

    this.fields[0].insertAdjacentHTML('beforeend', this.tag(data));
    this.synchronizeFields();
  },

  removeTag(currentTag) {
    currentTag.remove();
    this.synchronizeFields();
    if (!this.fields[0].children.length) {
      this.hideField();
    }
  },

  renderTags(data) {
    data.forEach((item) => {
      this.fields[0].insertAdjacentHTML('beforeend', this.tag(item));
    });
    this.synchronizeFields();
  },
};

TagsField.fields.forEach((field) => {
  field.addEventListener('click', (e) => {
    if (e.target.classList.contains('region-select__tag-remove')) {
      let currTag = TagsField.fields[0].querySelector(
        `[data-id="${e.target.parentNode.getAttribute('data-id')}"]`
      );

      let currOption = RegionSelect.selects[0].querySelector(
        `[data-id="${currTag.getAttribute('data-id')}"]`
      );

      if (
        RegionSelect.addedOptionsId.delete(currOption.getAttribute('data-id'))
      ) {
        currOption.classList.remove('added');
      }

      RegionSelect.synchronizeSelects();

      TagsField.removeTag(currTag);
      RegionSelect.toggleDisabledSaveBtn();
    }
  });
});
