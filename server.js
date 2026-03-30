import http from "http";

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/callback")) {
    const url = new URL(req.url, "http://127.0.0.1");
    const code = url.searchParams.get("code");

    res.end("You can close this window now.");

    server.close();

    exchangeCodeForToken(code);
  }
});

server.listen(0, "127.0.0.1", () => {
  const port = server.address().port;

  const authUrl = `https://provider.com/oauth/authorize?
    response_type=code
    &client_id=YOUR_CLIENT_ID
    &redirect_uri=http://127.0.0.1:${port}/callback
    &code_challenge=${codeChallenge}
    &code_challenge_method=S256`;

  shell.openExternal(authUrl);
});
