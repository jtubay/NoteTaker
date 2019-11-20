const express = require("express");
const path = require("path");
const fs = require("fs");
const notes = require("./db.json")
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//const notes = [{}];
app.use(express.static("public"))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  return res.json(notes);
});

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = parseInt(notes[notes.length -1].id) +1
  notes.push(newNote);
  fs.writeFile("db.json", JSON.stringify(notes), (suc, err) => {
    if (err) {
      return console.log(err);
    }
  });
  res.json(newNote);
});

app.delete("/api/notes/:id", (req, res)=>{
    const id = req.params.id
    console.log(id)
    const noteToDelete= notes.findIndex(element=>  parseInt(element.id) === parseInt(id));
    notes.splice(noteToDelete, 1)
    fs.writeFile("db.json", JSON.stringify(notes), (suc, err) => {
        if (err) {
          return console.log(err);
        }
        res.sendStatus(200)
      });
})

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
