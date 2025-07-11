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
    img: "https://cdn.pinno.app/api/internal/cdb/contents/27551e6e-b500-4b95-ba63-e457be8a5666/0/163091",
  },
  {
    id: uuidv4(),
    username: "Jane Smith",
    caption: "Hello, world!",
    img: "https://i.pinimg.com/736x/aa/e8/3c/aae83c886411c0d855ba2538202bb67d.jpg",
  },
  {
    id: uuidv4(),
    username: "Alice Johnson",
    caption: "Loving the view!",
    img: "https://e0.pxfuel.com/wallpapers/243/683/desktop-wallpaper-sarashakeel-on-instagram-beautiful-nature-beautiful-pretty-pinterest-beach.jpg",
  },
  {
    id: uuidv4(),
    username: "Bob Brown",
    caption: "Just chilling.",
    img: "https://i.pinimg.com/736x/10/eb/3a/10eb3a6dbd9e1282551db79b7f6ea258.jpg",
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
