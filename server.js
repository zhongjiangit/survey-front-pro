const { createServer } = require('http');
const { parse } = require('url');
const { Command, Option } = require('next/dist/compiled/commander');
const next = require('next');

const program = new Command();
program
  .addOption(
    new Option(
      '-p, --port <number>',
      'Specify a port number on which to start the application.'
    )
      .default(3000)
      .env('PORT')
  )
  .addOption(
    new Option(
      '-H, --hostname <hostname>',
      'Specify a hostname on which to start the application (default: 0.0.0.0).'
    ).default('localhost')
  )
  .parse();

const options = program.opts();
const hostname = options.hostname;
const port = options.port;

const dev = process.env.NODE_ENV !== 'production';
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', err => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
