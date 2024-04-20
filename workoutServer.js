var express = require("express");
var { createHandler } = require("graphql-http/lib/use/express");
var { buildSchema } = require("graphql");
var { ruruHTML } = require("ruru/server");

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`

  type Muscle {
    name: String
    type: String
    muscle: String
    equipment: String
    difficulty: String
    instructions: String
 }

  type Query {
    getExercise(muscle: String, name: String, type: String, equipment: String, difficulty: String): [Muscle]
  }
`);

const getWorkoutData = (exerciseQueryKind) => {
  console.log("exerciseQueryKind: ", exerciseQueryKind);
  const entries = Object.entries(exerciseQueryKind)[0];
  return fetch(
    `https://api.api-ninjas.com/v1/exercises?${entries[0]}=${entries[1]}`,
    {
      method: "GET",
      headers: {
        "X-API-Key": "TLbhnW8fvrPBAGgburIb6w==Ct16TvdxfldJFl2f",
      },
      contentType: "application/json",
    }
  )
    .then((r) => r.json())
    .then((data) => {
      return data;
    });
};

// The root provides a resolver function for each API endpoint
var root = {
  async getExercise(exerciseQueryKind) {
    console.log("here: ", exerciseQueryKind);
    return await getWorkoutData(exerciseQueryKind);
  },
};

var app = express();

// Create and use the GraphQL handler.
app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
);

// Serve the GraphiQL IDE.
app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

// Start the server at port
app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
