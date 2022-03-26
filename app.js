const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

// app.use(cors({origin: '*'}));

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', '*');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', '*');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

app.get("/", (req, res) => {
  res.send('this is the root page, lmao');
})

// Handling request
app.post("/request", (req, res) => {
  console.log(`client sent: ${Object.keys(req.body)}`);

  const response = {
    essay: req.body.essay,
    lead: ['lead?'],
    position: ['pos1', 'post2'],
    claim: ['claim 1', 'claim 2'],
    counterclaim: ['counterclaim 1'],
    rebuttal: ['rebuttal 1'],
    evidence: ['evidence 1', 'evidence 2', 'evidence 3'],
    conclusion: ['conclusion is hagga']
  };

  res.status(200).json(response);
})
.listen(port, () => {
  console.log(`server is running at ${port}`);
})
