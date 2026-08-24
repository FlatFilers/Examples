# Codebase Map — FlatFilers/Examples

Three independent demo apps, no shared code. Depth cap 2.

| Path | What it is |
|---|---|
| `S3-upload/` | Express demo: Flatfile CSV importer that uploads to Amazon S3 via presigned URLs |
| `S3-upload/index.js` | Server; `GET /` presigns an S3 `putObject` URL and renders it with the license into the view. Config block (AWS creds, license) lives inline here — but see obvious.md: env vars are what actually work |
| `S3-upload/views/index.ejs` | Importer page; loads Flatfile + PapaParse from CDNs |
| `S3-upload/public/` | Static assets: `importer.js` (client launch logic), `index.css`, `robots-clean.csv` sample data |
| `mongodb-schema-importer/` | Express demo: generates a Flatfile importer config from MongoDB documents and/or Mongoose schemas |
| `mongodb-schema-importer/index.js` | Server; `GET /` merges DB-derived field keys with Mongoose schema config, `GET /populate-defaults` seeds 4 robot documents. Reads gitignored `.env.js` |
| `mongodb-schema-importer/schemas.js` | Mongoose `Robot` schema — edit this to change the generated importer fields |
| `mongodb-schema-importer/configFromSchema.js` | Mongoose schema → Flatfile field/validator config (required, enum→select, regex, numeric, boolean→checkbox) |
| `mongodb-schema-importer/views/`, `public/` | EJS importer page + static client assets (`importer.js`, `index.css`) |
| `vue-demo/` | Vue 2 SPA demo of the Flatfile importer |
| `vue-demo/src/` | `main.js` bootstrap, `App.vue` shell, `components/Welcome.vue` (launch button, raw-output pane, reads gitignored `env.js`) |
| `vue-demo/env.example.js` | Template for gitignored `env.js` (license + importer fields) |
| `vue-demo/public/` | `index.html` shell, `robots-clean.csv` sample data |
| `.obvious/` | Agent contract: this map, `obvious.md`, `config.yml`, `skills/local-dev/SKILL.md` |

Gitignored local files you must create before running: `mongodb-schema-importer/.env.js`, `vue-demo/env.js`, `mongodb-schema-importer/data/` (mongod dbpath).
