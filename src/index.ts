import { Hono } from 'hono';
import { StatusCode } from 'hono/utils/http-status';

const app = new Hono();

app.get('*', async (c) => {
  console.log(`Request: ${c.req.path}`);

  const req = c.req.raw;
  const url = new URL(req.url);
  url.hostname = 'www.ocw.titech.ac.jp';
  url.host = 'www.ocw.titech.ac.jp';
  url.port = '';
  url.protocol = 'https:';

  console.log(url.toString());

  const res = await fetch(url.toString(), {
    method: req.method,
    headers: req.headers,
    body: req.body,
  });
  c.header('Content-Type', res.headers.get('Content-Type') ?? undefined);
  c.header(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=86400'
  );
  c.status(res.status as StatusCode);
  return c.body(await res.text());
});

export default app;
