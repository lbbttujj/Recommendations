const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema");
require("dotenv").config();
var cors = require("cors");
const root = require("./graphql/resolvers");

const PORT = process.env.SERVER_PORT;

console.log("PORT: ", PORT);

const app = express();
app.use(bodyParser.json({ limit: "3mb" }));

const corsOptions = {
  origin: "https://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
    rootValue: root,
  })
);

app.use(express.json());
async function start() {
  try {
    app.listen(PORT, () => {
      console.log("server work");
    });
  } catch (e) {
    console.log(e);
  }
}

start();
