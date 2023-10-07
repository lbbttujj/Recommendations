import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./graphql/schema";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { root } from "./graphql/resolvers";

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
