# FlatFilers/Examples — Agent Guide

Monorepo of three independent Flatfile demo applications. There is **no root
package.json, no shared build, and no CI** — each top-level directory is a
standalone app with its own dependencies, lockfile, and start command. Always
`cd` into the app directory before running anything.

## Stack

| App | Stack | Package manager | Port | External services |
|---|---|---|---|---|
| `S3-upload/` | Node.js, Express 4, EJS, aws-sdk v2 | npm (`package-lock.json`) | 9000 | AWS S3 (presign), Flatfile license |
| `mongodb-schema-importer/` | Node.js, Express 4, EJS, Mongoose 5, mongodb driver 3.0 | npm (`package-lock.json`; `yarn.lock` also present) | 9000 | MongoDB (local), Flatfile license |
| `vue-demo/` | Vue 2, Vue CLI 3 (webpack 4) | yarn classic 1.x (`yarn.lock`) | 8080 | Flatfile license |

- Runtime: Node.js 20 (verified). Plain JavaScript — no TypeScript, no test suites, no Docker/Compose.
- **`S3-upload` and `mongodb-schema-importer` both hardcode port 9000** (`app.listen(9000)` in each `index.js`). Run one at a time; stop the other first.
- Verified toolchain in the sandbox snapshot: Node 20.20.2, npm 10.8.2, yarn 1.22.22, mongod 4.4.29, Playwright Chromium (screenshots).

## Commands

### S3-upload (Express, port 9000)

```bash
cd S3-upload
npm install
AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=... AWS_REGION=us-east-1 npm start
# → http://localhost:9000
```

Credentials go in **env vars, not the `config` object in `index.js`**: the S3
client is constructed before `aws.config.update()` runs, so the in-code config
never takes effect and the page renders empty (`CredentialsError`). Dummy
AWS-shaped values are enough for local page rendering — SigV4 presigning is a
local computation — but real credentials are needed for actual uploads.

### mongodb-schema-importer (Express + MongoDB, port 9000)

```bash
cd mongodb-schema-importer
npm install
# create .env.js (gitignored) — see below
npm run mongod        # mongod --dbpath=data --port 28015 (needs mongod ≤ 4.x on PATH)
npm start             # → http://localhost:9000
curl http://localhost:9000/populate-defaults   # seeds 4 robots
```

`.env.js` (gitignored, must be created):

```js
module.exports = {
  URL: 'mongodb://localhost:28015',
  DBNAME: 'flatfile-demo',
  COLLECTION: 'robots',
  FF_LICENSE: '<flatfile-license>'
}
```

**MongoDB version constraint:** the pinned `mongodb@~3.0.8` driver speaks the
legacy OP_QUERY wire protocol. MongoDB ≥ 5.1 rejects it
(`UnsupportedOpQueryCommand`) and the app crashes on `/populate-defaults`.
Use **mongod 4.4.x** (installed at `/home/user/.local/bin/mongod`, symlinked
to `/usr/local/bin/mongod` in the snapshot; needs `libssl1.1` on Ubuntu 24.04).

### vue-demo (Vue 2 dev server, port 8080)

```bash
cd vue-demo
yarn install                     # yarn classic 1.x (yarn.lock v1)
cp env.example.js env.js         # gitignored; fill in license + fields
NODE_OPTIONS=--openssl-legacy-provider yarn serve   # → http://localhost:8080
```

`NODE_OPTIONS=--openssl-legacy-provider` is **required on Node ≥ 17** (webpack 4
MD4 hashing). Without it the dev server dies with
`error:0308010C:digital envelope routines::unsupported`.

### Lint / tests

- `cd vue-demo && yarn lint` — the only lint target in the repo; passes (`No lint errors found!`).
- No test suites or typechecks exist in any app; every `npm test` script is a stub that exits 1.

## Codebase map

See [codebase-map.md](codebase-map.md) for the folder-level overview.

## Local Verification Summary

Verified 2026-08-24 in sandbox `i517zqa9z31yfh4v3rhj1` (Node 20.20.2):

| Check | Result |
|---|---|
| `S3-upload` `npm start` + `GET /` | HTTP 200, page renders with presigned S3 URL (dummy env creds) |
| `mongodb-schema-importer` `npm run mongod` + `npm start` | mongod 4.4.29 up on 28015; app up on 9000 |
| `GET /populate-defaults` | HTTP 200, "Inserted 4 Robots" |
| `GET /` (DB-driven) | HTTP 200; DB_config fields `name, nick, helmet, color, id` derived from seeded collection; Mongoose Robot schema config (6 fields) rendered |
| `vue-demo` `yarn serve` | Compiled successfully; HTTP 200 on 8080; HMR active |
| `vue-demo` `yarn lint` | Pass — no lint errors |
| Browser screenshots | `s3-upload-home.png`, `mongo-importer-home.png`, `vue-demo-home.png` (Playwright Chromium, in `/home/user/evidence/`) |

Primary user flows exercised: (1) mongo app — seed collection then render the
importer page whose field list is generated from live DB documents; (2) S3-upload —
render page with a freshly presigned S3 upload URL; (3) vue-demo — SPA boots,
"Import robots" button + sample CSV link present, HMR connected.

## Sandbox snapshot

- Snapshot/template ID: `gap0pvit10wten6lqhs1:default` (sandbox `i517zqa9z31yfh4v3rhj1`)
- Captured: 2026-08-24T21:29:58.777Z
- State at capture: all three apps' `node_modules` installed; `.env.js` and `env.js` present (gitignored); mongod 4.4.29 running on 28015 with seeded `robots` collection; `mongodb-schema-importer` app on 9000; `vue-demo` dev server on 8080; git tree clean.

## Known limitations

- Flatfile license keys are local placeholders. The in-browser importer widget
  (external SaaS) cannot fully launch without a real license — the page, config
  generation, and server flows all work; the widget launch does not.
  TODO(confirm): obtain a Flatfile license key to exercise the full import flow.
- `S3-upload` needs real AWS credentials for actual S3 uploads (presigning works with dummies).
- EJS pages load Flatfile/PapaParse scripts from unpkg/cdnjs — browser needs network access.
- `mongodb-schema-importer` ships both `package-lock.json` and `yarn.lock`; running
  `npm install`/`npm ci` there rewrites `yarn.lock` — restore it with
  `git checkout -- mongodb-schema-importer/yarn.lock` before committing.
