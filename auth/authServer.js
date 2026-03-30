const http = require("http");

function startAuthServer(callback) {
  const server = http.createServer((req, res) => {
    if (req.url.startsWith("/callback")) {
      const url = new URL(req.url, "http://127.0.0.1");
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");

      res.end("Authentication successful. You can close this tab.");

      server.close();
      callback(code, state);
    }
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      resolve(server.address().port);
    });
  });
}

module.exports = { startAuthServer };
