const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs');
const axios = require('axios');

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

app.post("/request", (req, res) => {
  console.log(req.body);

  const FILE_NAME = '12.txt';
  const MODEL_NAME = req.body.modelName;

  fs.writeFileSync(`./models/test/${FILE_NAME}`, req.body.essay, {flag: 'w+'}, err => {
    if (err) {
      console.error(err);
      return;
    }
  });

  console.log(`file ${FILE_NAME} written successfully`)
  console.log('sending post request to model.js');

  axios
    .post('http://localhost:5000/request/model', {
      modelName: MODEL_NAME,
      essay: req.body.essay,
    })
    .then(result => {
      console.log('model ran successfully');
      res.status(200).send(result);
    })
    .catch(error => {
      console.error(error.toJSON());
      res.status(500).send(error);
    });
});

app.listen(port, () => {
  console.log(`main server is running at ${port}`);
});
