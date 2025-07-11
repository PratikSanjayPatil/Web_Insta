const express = require('express');
const uuidv4 = require('uuid').v4; // For generating unique IDs
const path = require('path');
const app = express();
const methodOverride = require('method-override'); // For overriding HTTP methods
const port = 8080;

app.use(methodOverride('_method')); // Override HTTP methods for form submissions

app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

let posts = [
  {
    id: uuidv4(),
    username: "John Doe",
    caption: "This is my first post!",
    img: "https://i.pinimg.com/originals/0e/60/36/0e603631faf49e64b2d4beef52da62c0.jpg",
  },
  {
    id: uuidv4(),
    username: "Jane Smith",
    caption: "Hello, world!",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQMadvX1GeM10vYbRJ-TZxL2WeAG_XHWDIJQ&s",
  },
];


app.get("/",(req,res)=>{
    res.render("index.ejs", { posts });
})

app.get("/posts/new",(req,res)=>{
    res.render("newPost.ejs");
})

app.post("/posts",(req,res)=>{
    let {username,img,caption} = req.body;
    let id = uuidv4(); // Generate a unique ID
    let newPost = { id, username, caption, img };
    posts.push(newPost);
    res.redirect("/");
})

app.get("/posts/:id", (req, res) => {
    let {id} = req.params;
    let post = posts.find((p) => p.id === id);
    res.render("show.ejs",{post})
})

app.delete("/posts/:id", (req, res) => {
    let {id} = req.params;
    posts = posts.filter((p) => p.id !== id);
    res.redirect("/");
})

app.get("/posts/:id/edit", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => p.id === id);
  if (!post) {
    return res.status(404).send("Post not found");
  } else {
    res.render("editPost.ejs", { post });
  }
});

app.patch("/posts/:id", (req, res) => {
    let { id } = req.params;
    let { username, caption, img } = req.body;
    let post = posts.find((p) => p.id === id);
    if (!post) {
        return res.status(404).send("Post not found");
    }
    post.username = username;
    post.caption = caption;
    post.img = img;
    res.redirect("/");
})

app.listen(port, ()=>{
    console.log("App listen on port: " + port);
});
