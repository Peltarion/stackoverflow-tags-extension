import {
  addChildren,
  removeChildren,
  createContainer,
  createButton,
  createUnorderedList,
  createListItem
} from './dom.js';

export const run = () => {

  const url = 'https://a.gcp-eu-west-1.platform.peltarion.com/deployment/cca1630b-1737-4da8-9b4f-f12aef489f04/forward';
  const token = 'ca7ffe43-e7bc-48b7-b9be-e1d3b9016016'
  const inputParam = 'content';

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

    requestTags(title, content)
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

  async function requestTags(title, content) {

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rows: [ { [inputParam]: `${title}\n${content}` } ] })
    });

    if (!response.ok) {
      throw new Error('Opps!');
    }

    return await response.json();
  }

  function getTopKTags(tags = [], n = 1) {
    if (!Array.isArray(tags)) {
      tags = Object.entries(tags).map(([tag, score]) => ({ tag, score }));
    }

    tags.sort((a, b) => a.score < b.score ? 1 : -1);
    return tags.slice(0, n);
  }

  function selectTag({ tag, score }) {
    tagEditorInputElem.focus();
    tagEditorInputElem.value = tag;
    tagEditorElem.click();
  }


};

