# React-graphql-chat
Simple chat application using React, Node and Graphql.

## All Libraries that are used:
1. Server:
-  Get real-time updates from your GraphQL server through `Subscription` type.`
- `Mongoose` integrated to model my application data.
- `graphql-yoga` library too create a graphql server.
- `Data-loader` integrated for avoiding unnecessary multiple requests to MongoDb.
- `bcrypt` integrated to hash the password before write it to the db.
- `jsonwebtoken` integrated for token operations.
- `cuursor-based pagination` added (https://graphql.org/learn/pagination/#pagination-and-edges)
2. Client:
- `Webpack` set up
- `Babel` set up
- `React-router-dom` for routing operations
- `@apollo/client` for state management that manages both local and remote data with GraphQL.
- `material-ui`
- `draftjs` and `react-draft-wysiwyg` for rich text editor
- `react-toastify` to show error and info messages.
- `flow`
- `eslint` and `prettier`
- `infinite scroll` added to load the previous messages

## Demo:
![alt tag](demo.gif)

### Setting up MongoDB

Note: You need MongoDB install and set up. [Installation instructions](https://docs.mongodb.org/manual/installation/)
If you don't want to install it, there is a hosted MongoDB service option in the cloud which requires no installation overhead and offers a free tier to get started.[https://www.mongodb.com/cloud/atlas?tck=docs_server]

Once you've installed MongoDB or registered MongoDB Atlas, you need to get host and port for the db that you created.
Change the host and port in .env file with yours.

## How to run this project:
1. Make sure to set up MongoDB
2. Clone the repository
- `cd graphql-chat`
3. install npm dependencies:
```
npm install;
or
yarn install;
```
4. start the server side:
```
npm server
or
yarn server
```

5. start the client side:
```
npm start
or
yarn start
```
6. navigates your browser to `localhost:8000` for client side
7. navigates your browser to `localhost:4000` for server side
