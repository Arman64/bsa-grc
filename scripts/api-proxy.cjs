// Raw TCP proxy: forwards pod port 8001 -> Next.js on 127.0.0.1:3000
// Needed because the K8s ingress routes "/api/*" to :8001 while pages go to :3000.
// Next.js serves BOTH pages and /api on :3000, so we bridge 8001 back to 3000.
const net = require("net");

const LISTEN_PORT = 8001;
const TARGET_PORT = 3000;
const TARGET_HOST = "127.0.0.1";

const server = net.createServer((client) => {
  const upstream = net.connect(TARGET_PORT, TARGET_HOST);
  client.pipe(upstream);
  upstream.pipe(client);
  const cleanup = () => {
    client.destroy();
    upstream.destroy();
  };
  client.on("error", cleanup);
  upstream.on("error", cleanup);
  client.on("close", () => upstream.destroy());
  upstream.on("close", () => client.destroy());
});

server.listen(LISTEN_PORT, "0.0.0.0", () => {
  console.log(`API proxy listening on 0.0.0.0:${LISTEN_PORT} -> ${TARGET_HOST}:${TARGET_PORT}`);
});
