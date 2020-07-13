
const propsToEventhandlers = (props = {}) => Object.entries(props).reduce((obj, [key, value]) => {
  if (key.startsWith('on')) {
    const ev = key.slice(2).toLowerCase();
    obj[ev] = value;
  }
  return obj;
}, {});

export const addChildren = (node, children = []) => {
  children.forEach(c => node.appendChild(c));
};

export const removeChildren = (node) => {
  while(node.firstChild) {
    node.lastChild.remove();
  }
};

export const createElement = (nodeName = 'div', props = {}) => {
  const { label = '', children = [], classes = [] } = props;

  const node = document.createElement(nodeName);
  node.className = classes.join(' ');
  node.innerText = label;
  addChildren(node, children);

  const evHandlers = propsToEventhandlers(props);
  Object.entries(evHandlers).forEach(([ev, handler]) => node.addEventListener(ev, handler));

  return node;
}

export const createButton = (props = {}) => {
  const btn = createElement('button', props);
  return btn;
};

export const  createUnorderedList = (props = {}) => {
  return createElement('ul', props);
}

export const createListItem = (props = {}) => {
  return createElement('li', props);
}

export const createContainer = (props = {}) => {
  return createElement('div', props);
}
