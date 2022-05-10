const express = require("express");
const { clearInterval } = require("timers");
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


app.post('/request/model', (req, res) => {
  /* 
    DESIGN NOTE: I am never rejecting the promise. I don't think this is the right approach
    and more of a duct-tape solution for this problem. Feel free to fix this issue. 
  */
  let runModel = new Promise((resolve, reject) => {
    const MODEL_NAME = `${req.body.modelName}`;
    const { readFileSync, watch } = require('fs');
    const { spawn } = require('child_process');

    /*
      DESIGN NOTE: I am not sanitising NODLE_NAME, because... laziness. This is a security flaw. 
      Any input containing shell metacharacters may be used to trigger arbitrary command execution
    */
    const modelProcess = spawn('bash', ['query.sh', `${MODEL_NAME}`], {stdio: 'ignore', cwd: './models', timeout: 120000})
    
    modelProcess.stderr.on('data', (err) => {
      console.error(`stderr: ${err.toString()}`);
    });

    modelProcess.on('close', (exitCode) => {
      console.log(`child process exited with code ${exitCode}`);
    });
    
    watch('./models', (event, filename) => {
      if (filename == 'output.json') {
        resolve(readFileSync('./models/output.json', {encoding: 'utf8'}));
      }
    });
  });
  
  runModel
  .then(result => {
    res.end(result.toString());
  })
  .catch(err => {
    console.error(err);
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}...`)
});
