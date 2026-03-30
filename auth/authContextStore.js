const contexts = new Map();

function saveContext(state, data) {
  contexts.set(state, data);
}

function getContext(state) {
  return contexts.get(state);
}

function removeContext(state) {
  contexts.delete(state);
}

module.exports = {
  saveContext,
  getContext,
  removeContext
};
