const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const app = express();
console.log(__dirname)
const root_path = path.join(__dirname,'/views/')
// using this otherwise app won't know the path to css
app.use(express.static(root_path));

app.get('/',(req,res) => {
    res.sendFile(root_path + "index.html")
})

app.listen(3000,() => console.log('server started'))