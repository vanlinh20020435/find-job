const express = require('express')
const app = express()
var router = express.Router();
const port = 8888

router.get('/', (req, res) => {
  res.send('Hello Express!')
})

app.use('/',router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})