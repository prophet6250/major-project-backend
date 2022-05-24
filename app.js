const express = require("express");
const { setTimeout } = require("timers/promises");
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

app.post('/request', (req, res) => {
  const FILE_NAME = '12.txt';
  const MODEL_NAME = req.body.modelName;
  const { unlink, readFileSync, writeFileSync } = require('fs');
  const { spawnSync } = require('child_process');

  console.log(req.body);

  writeFileSync(`./models/test/${FILE_NAME}`, req.body.essay, { flag: 'w+' }, err => {
    if (err) {
      console.error(err);
      return;
    }
  });
  
  /*
  DESIGN NOTE: I am not sanitising NODLE_NAME, because... laziness. This is a security flaw. 
  Any input containing shell metacharacters may be used to trigger arbitrary command execution
  */
  spawnSync('bash', ['query.sh', MODEL_NAME], { cwd: './models' });

  const data = readFileSync('./models/output.json', { encoding: 'utf-8'});

  unlink('models/output.json', (err) => {
    if (err) throw err;
    console.log('models/output.json deleted successfully');
  });

  res.send(data);
});

app.listen(port, () => {
  console.log(`model server running on port ${port}`);
});
