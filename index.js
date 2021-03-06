const express = require("express");
const db = require("./data/db");
const server = express();
server.use(express.json());

//endpoints

server.get("/", (req, res) => {
  res.send("working...");
});

//users
server.get("/users", (req, res) => {
  db("users")
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The users information could not be retrieved." });
    });
});
server.get("/users/:id", (req, res) => {
  const { id } = req.params;
  db("users")
    .where("id", Number(id))
    .then(user => {
      if (user.length === 0) {
        res
          .status(404)
          .json({ mesage: "The user with the specified ID does not exist." });
      }
      res.status(200).json(user);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: " The user information could not be retrieved" });
    });
});

server.get("/users/:id/posts", (req, res) => {
  db("posts")
    .where("userId", req.params.id)
    .then(posts => {
      if (posts.length === 0) {
        res
          .status(404)
          .json({ message: "The posts with the specified ID does not exist." });
      }
      res.status(200).json(posts);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

server.post("/users", (req, res) => {
  const user = req.body;
  db.insert(user)
    .into("Users")
    .then(ids => {
      const id = ids[0];
      res.status(201).json({ id, ...user });
    })
    .catch(error => {
      res.status(500).json({
        error: "There was an error while saving the user to the database."
      });
    });
});
server.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  db("users")
    .where("id", Number(id))
    .delete()
    .then(users => {
      if (users === 0) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
      res.status(200).json({ message: "user deleted" });
    })
    .catch(error => {
      res.status(500).json({ error: "The user could not be deleted." });
    });
});
server.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const name = req.body;
  if (!name) {
    res.status(400).json({ errorMessage: "Please provide name for post." });
  }
  db("users")
    .where("id", Number(id))
    .update(name)
    .then(user => {
      if (!user) {
        res.status(404).json({
          errorMessage: "The user with the specified ID does not exist."
        });
      }
      res.status(200).json(name);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The user information could not be modified." });
    });
});

//posts
server.get("/posts", (req, res) => {
  db("Posts")
    .then(Posts => {
      res.status(200).json(Posts);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});
// server.get("/posts/:id", (req, res) => {
//   const { id } = req.params;
//   db("posts")
//     .where("id", Number(id))
//     .then(post => {
//       if (post.length === 0) {
//         res
//           .status(404)
//           .json({ mesage: "The post with the specified ID does not exist." });
//       }
//       res.status(200).json(post);
//     })
//     .catch(error => {
//       res
//         .status(500)
//         .json({ error: " The user information could not be retrieved" });
//     });
// });

server.get("/posts/:id", (req, res) => {
  const { id } = req.params;
  db("posts")
    .join("users", "posts.userId", "=", "users.id")
    .select("posts.id", "users.name", "posts.text", "posts.createdAt")
    .where("posts.id", Number(id))
    .then(post => {
      console.log(post);
      if (post.length === 0) {
        res
          .status(404)
          .json({ mesage: "The post with the specified ID does not exist." });
      }
      res.status(200).json(post);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: " The user information could not be retrieved" });
    });
});

server.get("/posts/:id/tags", (req, res) => {
  db("tags")
    .where("postId", req.params.id)
    .then(tags => {
      if (tags.length === 0) {
        res
          .status(404)
          .json({ message: "The tags with the specified ID does not exist." });
      }
      res.status(200).json(tags);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

server.post("/posts", (req, res) => {
  const post = req.body;
  db.insert(post)
    .into("Posts")
    .then(ids => {
      const id = ids[0];
      res.status(201).json({ id, ...post });
    })
    .catch(error => {
      res.status(500).json({
        error: "There was an error while saving the post to the database."
      });
    });
});
server.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  db("posts")
    .where("id", Number(id))
    .delete()
    .then(posts => {
      if (posts === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
      res.status(200).json({ message: "post deleted" });
    })
    .catch(error => {
      res.status(500).json({ error: "The post could not be deleted." });
    });
});
server.put("/posts/:id", (req, res) => {
  const { id } = req.params;
  const text = req.body;
  if (!text) {
    res.status(400).json({ errorMessage: "Please provide text for post." });
  }
  db("posts")
    .where("id", Number(id))
    .update(text)
    .then(post => {
      if (!post) {
        res.status(404).json({
          errorMessage: "The user with the specified ID does not exist."
        });
      }
      res.status(200).json(text);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The user information could not be modified." });
    });
});

//tags
server.get("/tags", (req, res) => {
  db("Tags")
    .then(Tags => {
      res.status(200).json(Tags);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});
server.get("/tags/:id", (req, res) => {
  const { id } = req.params;
  db("tags")
    .where("id", Number(id))
    .then(tag => {
      if (tag.length === 0) {
        res
          .status(404)
          .json({ mesage: "The post with the specified ID does not exist." });
      }
      res.status(200).json(tag);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: " The user information could not be retrieved" });
    });
});
server.post("/tags", (req, res) => {
  const tag = req.body;
  db.insert(tag)
    .into("Tags")
    .then(ids => {
      const id = ids[0];
      res.status(201).json({ id, ...tag });
    })
    .catch(error => {
      res.status(500).json({
        error: "There was an error while saving the user to the database."
      });
    });
});
server.delete("/tags/:id", (req, res) => {
  const { id } = req.params;
  db("tags")
    .where("id", Number(id))
    .delete()
    .then(tags => {
      if (tags === 0) {
        res
          .status(404)
          .json({ message: "The tag with the specified ID does not exist." });
      }
      res.status(200).json({ message: "tag deleted" });
    })
    .catch(error => {
      res.status(500).json({ error: "The tag could not be deleted." });
    });
});
server.put("/tags/:id", (req, res) => {
  const { id } = req.params;
  const tag = req.body;
  if (!tag) {
    res.status(400).json({ errorMessage: "Please provide text for post." });
  }
  db("tags")
    .where("id", Number(id))
    .update(tag)
    .then(tag => {
      if (!tag) {
        res.status(404).json({
          errorMessage: "The user with the specified ID does not exist."
        });
      }
      res.status(200).json(tag);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The user information could not be modified." });
    });
});

const port = 8000;
server.listen(port, function() {
  console.log(`Web API listening on http://localhost:${port}`);
});
