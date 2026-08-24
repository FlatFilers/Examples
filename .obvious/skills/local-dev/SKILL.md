---
name: local-dev
description: Bring up the three Flatfile demo apps in FlatFilers/Examples locally (Express apps, local mongod 4.4, Vue dev server) and verify the primary flows
---

# Local Dev — FlatFilers/Examples

Durable record of the onboarding run (2026-08-24, sandbox `i517zqa9z31yfh4v3rhj1`,
Node 20.20.2). Restoring the snapshot `gap0pvit10wten6lqhs1:default` gives you
this state pre-built: deps installed, configs created, mongod seeded, two apps running.

## Prerequisites (baked into the snapshot)

- Node 20 + npm; yarn classic 1.22.x (`npm i -g yarn@1.22.22`) — vue-demo needs yarn, not npm.
- **mongod 4.4.29** at `/home/user/.local/bin/mongod`, symlinked to `/usr/local/bin/mongod`.
  On a fresh Ubuntu 24.04 box: install `libssl1.1` (bionic deb from security.ubuntu.com),
  then the `mongodb-linux-x86_64-ubuntu2004-4.4.29` tarball. **Do not use mongod ≥ 5.1** —
  the pinned `mongodb@~3.0.8` driver uses OP_QUERY and MongoDB 8.x rejects it.
- Playwright + Chromium (global, `/home/user/.npm-global`) for screenshots; system deps
  via `sudo playwright install-deps chromium`.

## Bring-up sequence

```bash
cd /home/user/work/Examples

# 1. MongoDB (dbpath is gitignored, port 28015 — matches .env.js)
cd mongodb-schema-importer && mkdir -p data && nohup mongod --dbpath=data --port 28015 --bind_ip 127.0.0.1 > /tmp/mongod.log 2>&1 & cd ..

# 2. mongodb-schema-importer app (port 9000)
cd mongodb-schema-importer && nohup npm start > /tmp/mongo-app.log 2>&1 & cd ..
curl -s http://localhost:9000/populate-defaults   # seed 4 robots → "Inserted 4 Robots"

# 3. vue-demo dev server (port 8080) — legacy OpenSSL flag is mandatory on Node ≥ 17
cd vue-demo && NODE_OPTIONS=--openssl-legacy-provider nohup yarn serve > /tmp/vue-demo.log 2>&1 & cd ..

# 4. S3-upload (port 9000 — conflicts with step 2; stop it first: kill the node PID from `ss -ltnp | grep :9000`)
cd S3-upload && AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY AWS_REGION=us-east-1 nohup npm start > /tmp/s3-upload.log 2>&1 & cd ..
```

## Required local files (all gitignored)

- `mongodb-schema-importer/.env.js` → `{ URL: 'mongodb://localhost:28015', DBNAME: 'flatfile-demo', COLLECTION: 'robots', FF_LICENSE: '<placeholder ok>' }`
- `vue-demo/env.js` → copy of `env.example.js` with placeholder license + fields

## Verification checklist (all passed 2026-08-24)

1. `curl -w '%{http_code}' http://localhost:9000/` → 200; app log shows
   `Connected successfully to server` and `Found the following robots traits: ['name','nick','helmet','color','id']`.
2. `curl http://localhost:9000/populate-defaults` → `Inserted 4 Robots`.
3. `curl -w '%{http_code}' http://localhost:8080/` → 200; vue log shows `Compiled successfully`.
4. `cd vue-demo && yarn lint` → `No lint errors found!`.
5. S3-upload `GET /` → 200 with `var signedRequest = "https://s3.amazonaws.com/..."` in the HTML.
6. Screenshots via `NODE_PATH=/home/user/.npm-global/lib/node_modules node /home/user/evidence/shot.js <url> <out.png>`.

## Gotchas learned the hard way

- **S3-upload credentials**: set `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY`/`AWS_REGION`
  env vars. The inline `config` object in `index.js` is applied *after* `new aws.S3()`,
  so it never reaches the client — with no env vars the page renders empty (HTTP 200, 0 bytes).
- **Port 9000 is hardcoded** in both Express apps. Check for a listener before starting
  (`ss -ltnp | grep :9000`); kill by PID — never `pkill -f "node index.js"` (it matches your own shell).
- **vue-demo on Node ≥ 17**: `NODE_OPTIONS=--openssl-legacy-provider` or webpack 4 dies with
  `digital envelope routines::unsupported`.
- **npm in mongodb-schema-importer rewrites `yarn.lock`** (npm syncs it when present).
  Run `git checkout -- mongodb-schema-importer/yarn.lock` before committing anything.
- **mongod 8.x breaks the app**: `Unsupported OP_QUERY command: insert` → assertion crash
  on `/populate-defaults`. If `data/` was created by a newer mongod, wipe it before
  starting 4.4 (`rm -rf mongodb-schema-importer/data && mkdir -p mongodb-schema-importer/data`).
- Long-running shell commands cap at ~300s — start each service in its own short command.
- The Flatfile importer widget itself needs a real license key (external SaaS); everything
  server-side works with placeholders.
