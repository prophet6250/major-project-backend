const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs');
const {exec} = require('child_process');
const {chdir} = require("process");
const { FILE, TIMEOUT } = require("dns");

// remember this thing. this adds CORS headers to all incoming requests (ig)
app.use((req, res, next) => {

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

// convert incoming data into json using express's body-parser thingy
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send('this is the root page, lmao');
});

app.post("/request", (req, res) => {
  console.dir(req.body, {depth: null});

  const FILENAME = 'file.temp';
  const SCRIPTNAME = 'swapcase.py';

  // replace filename with hh-mm-ss-YYYY-MM-DD
  fs.writeFile(`./temp-files/${FILENAME}`, req.body.essay, {flag: 'w+'}, err => {
    if (err) {
      console.error(err);
      return;
    }
  });

  exec(`python python-scripts/${SCRIPTNAME} ${FILENAME}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`ERROR: ${err.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`)

    /*
      DESIGN NOTE:
      The output of the python script was coming after sending the response. So
      I decided to send the response inside the exec's callback. This is intentional.
    */
    res.status(200).json({
      essay: stdout,
      lead: ['lead?'],
      position: ['pos1', 'post2'],
      claim: ['claim 1', 'claim 2'],
      counterclaim: ['counterclaim 1'],
      rebuttal: ['rebuttal 1'],
      evidence: ['evidence 1', 'evidence 2', 'evidence 3'],
      conclusion: ['conclusion is hagga'],
    });
  });
});

app.listen(port, () => {
  console.log(`server is running at ${port}`);
});
