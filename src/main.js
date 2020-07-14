import ApiClient from './api.js';

import {
  addChildren,
  removeChildren,
  createContainer,
  createButton,
  createUnorderedList,
  createListItem
} from './dom.js';

import { getTopKTags } from './utils.js';

export const run = () => {

  const apiClient = ApiClient.getInstance();

  const postTitleInputElem = document.querySelector('.js-post-title-field');
  const postContentPreviwElem = document.querySelector('#wmd-preview');

  const tagsContainer = document.querySelector('.js-tag-editor-container');
  const tagEditorElem = document.querySelector('.js-tag-editor');
  const tagEditorInputElem = document.querySelector('#tageditor-replacing-tagnames--input');

  const suggestButton = createButton({
    label: 'Suggest tags',
    classes: ['pelt-suggest-btn'],
    onClick: handleSuggestClick
  });
  const suggestTagList = createUnorderedList({
    classes: ['pelt-suggest-list']
  });

  const suggestContainer = createContainer({
    classes: ['pelt-suggest', 'grid', 'gsx', 'gs4', 'ai-center', 'mt8'],
    children: [suggestButton, suggestTagList]
  });

  tagsContainer.appendChild(suggestContainer);

  function handleSuggestClick(ev) {
    ev.preventDefault();
    ev.stopImmediatePropagation();

    removeChildren(suggestTagList);

    const title = postTitleInputElem.value;
    const content = postContentPreviwElem.innerHTML;

    apiClient.requestTags(title, content)
      .then(json => {
        const tags = json?.rows[0]?.tag;
        const tagsAsListItems = getTopKTags(tags, 3)
          .map(tag => {
            return createListItem({
              label: `${tag.tag} - ${tag.score.toFixed(2)}`,
              onClick: (ev) => {
                ev.preventDefault();
                selectTag(tag);
              }
            });
          });

        addChildren(suggestTagList, tagsAsListItems);
      });
  }

  function selectTag({ tag, score }) {
    tagEditorInputElem.focus();
    tagEditorInputElem.value = tag;
    tagEditorElem.click();
  }


};

