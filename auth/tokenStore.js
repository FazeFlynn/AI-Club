let tokenData = null;

function saveTokens(tokens) {
  tokenData = tokens;
}

function getTokens() {
  return tokenData;
}

module.exports = { saveTokens, getTokens };
