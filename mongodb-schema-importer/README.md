# Flatfile Node Demo that Generates Importer Config from MongoDB and/or Mongoose Schemas

## Prerequisites
    
- [Node.js](http://es6-features.org)

## Start Dev Server

1. `git clone https://github.com/FlatFilers/Examples.git`
2. `cd Examples/mongodb-schema-importer`
3. Run `npm install`
4. Update `.env.js` with details for your mongoDB database and your Flatfile license key
5. Update `schemas.js` with your Mongoose schema
6. Run `npm run mongod`
7. Run `npm start`
8. Open [http://localhost:9000](http://localhost:9000)