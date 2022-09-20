// imports
const express = require("express");
const path = require("path");
const userRoute = require("./routes/userRoute");
const propertyRoute = require("./routes/propertyRoute");


// express app instance 
const app = express();


// middlewares =>
app.use("/user", userRoute);
app.use("/property", propertyRoute);
// static path, if undefined, app won't know the path to static content like css
const root_path = path.join(__dirname, "./public/");
console.log(root_path);
app.use(express.static(root_path));


// port 
const port = process.env.PORT || '3000';


// routes =>

// homepage 
app.get("/", (req, res) => {
  res.sendFile(root_path + "index.html");
});
app.get('/host',(req,res)=>{
  res.sendFile(root_path+ "host.html")
})

// login/signup page 
app.get("/login", (req, res) => {
  res.sendFile(root_path + "login.html");
});


// listening to port
app.listen(port, () => console.log("server started at port 3000"));
