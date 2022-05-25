const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/request', (req, res) => {
  const FILE_NAME = '12.txt';
  const MODEL_NAME = req.body.modelName;
  const { readFileSync, writeFileSync } = require('fs');
  const { spawnSync } = require('child_process');

  console.log(req.body);

  writeFileSync(`./models/test/${FILE_NAME}`, req.body.essay, { flag: 'w+' }, err => {
    if (err) {
      console.error(err);
      return;
    }
  });
  
  /*
  DESIGN NOTE: I am not sanitising MODEL_NAME, because... laziness. This is a security flaw. 
  Any input containing shell metacharacters may be used to trigger arbitrary command execution
  */
  spawnSync('bash', ['query.sh', MODEL_NAME], { cwd: './models' });

  const data = readFileSync('./models/output.json', { encoding: 'utf-8'});

  res.send(data);
});

app.listen(port, () => {
  console.log(`model server running on port ${port}`);
});
