import { html } from 'common-tags'

export default ({
  app,
  files,
  ssrData = {}
}) => html`
  <!DOCTYPE html>
  <html class="no-js" ${app.head.htmlAttributes}>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      ${app.head.title}
      ${app.head.meta}
      ${app.head.link}
      ${files.css.map(file => html`<link rel="stylesheet" href="${file}" />`)}
      <style>${app.css}</style>
      <script>
        (function(html) {
          html.classList.remove('no-js')
        })(document.documentElement);
      </script>
    </head>
    <body ${app.head.bodyAttributes}>
      <div id="app">${app.html}</div>
      <script>
        (function () {
          window._ssr = ${JSON.stringify(ssrData)};
        })();
      </script>
      ${files.js.map(file => html`<script src="${file}"></script>`)}
    </body>
  </html>
`
