const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

// remember this thing. this adds CORS headers to all incoming requests
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

app.post('/request/model_1', (req, res) => {
  console.log(req.body);
  
  const MODEL_NAME = `${req.body.modelName}`;
  const { readFileSync, watch } = require('fs');
  const { spawnSync } = require('child_process');
  
  /*
  DESIGN NOTE: I am not sanitising NODLE_NAME, because... laziness. This is a security flaw. 
  Any input containing shell metacharacters may be used to trigger arbitrary command execution
  */
  const modelProcess = spawnSync('bash', ['query.sh', `${MODEL_NAME}`], { stdio: 'ignore', cwd: './models', timeout: 120000 })
  
  if (modelProcess.status === 0) {
    let dt = new Date();
    let hh = dt.getHours();
    let mm = dt.getMinutes();
    console.log(`${hh}:${mm} - ${MODEL_NAME} ran successfully`);
  }
  
  watch('./models/', (event, filename) => {
    if (filename == 'output.json') {
      let dt = new Date();
      let hh = dt.getHours();
      let mm = dt.getMinutes();
      console.log(`${hh}:${mm} - output.json created successfully`);

      const data = readFileSync('./models/output.json', { encoding: 'utf8' });
      res.send(data);
    }
  });
});

app.post('/request/model_2', (req, res) => {
  console.log(req.body);
  
  /* 
  DESIGN NOTE: I am never rejecting the promise. I don't think this is the right approach
  and more of a duct-tape solution for this problem. Feel free to fix this issue. 
  */
  let runModel = new Promise((resolve, reject) => {
    const MODEL_NAME = `${req.body.modelName}`;
    const { readFileSync, watch } = require('fs');
    const { spawnSync } = require('child_process');
    
    /*
    DESIGN NOTE: I am not sanitising NODLE_NAME, because... laziness. This is a security flaw. 
    Any input containing shell metacharacters may be used to trigger arbitrary command execution
    */
    const {status: exitCode} = spawnSync('bash', ['query.sh', `${MODEL_NAME}`], {stdio: 'ignore', cwd: './models', timeout: 120000, shell: true})
    
    if (exitCode === 0) {
      let dt = new Date();
      let hh = dt.getHours();
      let mm = dt.getMinutes();
      console.log(`${hh}:${mm} - ${MODEL_NAME} ran successfully`);
    }
    
    watch('./models/', (event, filename) => {
      if (filename == 'output.json') {
        let dt = new Date();
        let hh = dt.getHours();
        let mm = dt.getMinutes();
        console.log(`${hh}:${mm} - output.json created successfully`);
        
        const data = readFileSync('./models/output.json', { encoding: 'utf8' });
        resolve(data);
      }
    });
  });
  
  runModel
  .then(result => {
    res.status(200).send(result);
  })
  .catch(err => {
    console.error(err);
  });
});

app.listen(port, () => {
  console.log(`model server running on port ${port}`);
});
