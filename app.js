const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
let cors = require('cors');

app.use(cors({origin: 'http://localhost:5500'}));

// Setting path for public directory
// const static_path = path.join(__dirname, "public");
// app.use(express.static(static_path));
// app.use(express.urlencoded({ extended: true }));

// app.use((req, res, next) => {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5500');

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// });

app.get("/", (req, res) => {
  res.send('this is the root page, lmao');
})

// Handling request
app.post("/request", (req, res) => {
  // const data = JSON.parse(req.body);

  console.log(`unparsed: ${req.body}`);

  res.status(200).send({
    essay: 'request ka essay',
    lead: ['lead?'],
    position: ['pos1', 'post2'],
    claim: ['claim 1', 'claim 2'],
    counterclaim: ['counterclaim 1'],
    rebuttal: ['rebuttal 1'],
    evidence: ['evidence 1', 'evidence 2', 'evidence 3'],
    conclusion: ['conclusion is hagga']
  });
})
.listen(port, () => {
  console.log(`server is running at ${port}`);
})
