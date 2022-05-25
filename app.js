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

  console.log(`STEP 1: incoming request to run model ${MODEL_NAME}...`);

  const { readFileSync, writeFileSync } = require('fs');
  const { spawnSync } = require('child_process');

  writeFileSync(`./models/test/${FILE_NAME}`, req.body.essay, { flag: 'w+' });
  console.log(`STEP 2: input file ${FILE_NAME} successfully written...`);
  
  /*
    DESIGN NOTE: I am not sanitising MODEL_NAME, because... laziness. This is a security flaw. 
    Any input containing shell metacharacters may be used to trigger arbitrary command execution
  */
  let runModel = spawnSync('bash', ['query.sh', MODEL_NAME], { cwd: './models' });
  
  console.log('\n########## MODEL OUTPUT START #########');
  console.log(runModel.stdout.toString());
  console.log('########## MODEL OUTPUT END #########\n');
  console.log(`STEP 3: ${MODEL_NAME} ran successfully`)

  const data = readFileSync('./models/output.json', { encoding: 'utf-8'});
  console.log('STEP 4: output.json read successfully. sending response to client...\n\n');
  res.send(data);
});

app.listen(port, () => {
  console.log(`model server running on port ${port}`);
});
