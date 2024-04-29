const express = require("express");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("./config/connect"); //
const User = require("./modules/user"); //
const Post = require("./modules/post"); //
const Filter = require("./modules/filter.js"); //
const { ObjectId } = require("mongodb");

const app = express();
const cors = require("cors");
const { Error } = require("./config/connect");

var img =
  "https://res.cloudinary.com/dq1kpxxyl/image/upload/v1701024205/uploads/rfcidinltz7jafw6rig5.png";
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
var active_acount = "";
const PORT = process.env.PORT || 3000;
app.use(express.static("dist")); ////////////§§§§§§§!!!!!!!!!!
cloudinary.config({
  cloud_name: "dq1kpxxyl",
  api_key: "895693122276336",
  api_secret: "6Kgm17e3OwT4eWL3lxXcWFx-L50",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads", // Optional: Change the folder where the image will be stored on Cloudinary
    format: async (req, file) => "png", // Optional: Convert the image to a specific format (e.g., 'png')
    transformation: [
      { width: 1800, height: 1800, crop: "limit" }, // Set the maximum dimensions
    ],
  },
});

const upload = multer({ storage: storage });

app.post("/post-an-ad", upload.array("images", 20), async (req, res9) => {
  const post = new Post(req.body);
  post.image = req.files.map((file) => file.path);
  const dateActuelle = new Date();

  // Obtenez l'année, le mois et le jour de la date actuelle
  const annee = dateActuelle.getFullYear();
  const mois = (dateActuelle.getMonth() + 1).toString().padStart(2, "0"); // +1 car les mois commencent à 0
  const jour = dateActuelle.getDate().toString().padStart(2, "0");

  // Formatez la date dans le format "YYYY-MM-DD"
  const dateFormatee = `${annee}-${mois}-${jour}`;
  post.now = dateFormatee;
  post
    .save()
    .then((resulte) => {
      //res.send(savedUser)
      console.log("recu", resulte);

      User.findById(post.id)
        .then((res) => {
          res.idss.push(resulte._id);
          User.findByIdAndUpdate({ _id: post.id }, { idss: res.idss })
            .then((res4) => {
              console.log(res4);
              /* for (i = 0; i < res4.subs.length; i++) {
                User.findOne(res4.subs[i]).then(ref=>{
                  for(j=0;i<ref.appareil.length;j++){
                    webpush.sendNotification(ref.appareil[j], JSON.stringify(payLad));

                  }
                })
                
              }*/
              res9.send(res4);
            })
            .catch((err) => {
              console.log(err);
              res9.send(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/check", (req, res) => {
  console.log(req.query.email);
  console.log(req.query.password);

  User.findOne({
    $and: [{ email: req.query.email }, { pass: req.query.password }],
  })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/recherche", (req, res) => {
  num = parseInt(req.query.recherche);
  if (isNaN(num)) {
    num = 0;
  }

  Post.find({
    $or: [
      { title: { $regex: new RegExp(req.query.recherche, "i") } },
      { city: { $regex: new RegExp(req.query.recherche, "i") } },
      { price: num },
      { des: { $regex: new RegExp(req.query.recherche, "i") } },
      { number: num },
    ],
  })
    .then((post) => {
      res.send(post);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

app.post("/sing_up", (req, res) => {
  const user = new User(req.body);

  User.findOne({ $or: [{ email: user.email }, { phone: user.phone }] })
    .then((user1) => {
      if (user1) {
        // User with the same email or phone number exists
        res.send(null);
      } else {
        // User does not exist, save the new user
        user
          .save()
          .then((savedUser) => {
            res.send(savedUser);
            console.log("User saved", savedUser);
          })
          .catch((err) => {
            res.send(err);
            console.log("Error saving user", err);
          });
      }
    })
    .catch((err) => {
      res.send(err);
      console.log("Error finding user", err);
    });
});

app.get("/all", (req, res) => {
  console.log(req.query.city);
  Post.find({ station: { $regex: new RegExp(req.query.city, "i") } })
    .then((resulte) => {
      res.send(resulte);
    })
    .catch((error) => {
      res.send(error);
    });
});
app.post("/lastest", (req, res) => {
  const filter = new Filter(req.body);
  console.log(filter.date);
  Post.find({
    now: { $gte: filter.date },
  })
    .then((posts) => {
      res.send(posts);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
app.get("/my_posted", (req, res0) => {
  User.findById(req.query.id)
    .then((res) => {
      var objectIds = res.idss.map((id) => new mongoose.Types.ObjectId(id));

      Post.find({ _id: { $in: objectIds } })
        .then((res5) => {
          res0.send(res5);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});
app.get("/log_out", (req, res) => {
  active_acount = "";
});

app.post("/add_pic", upload.array("images", 20), async (req, res9) => {
  //update pic
  pics = req.files.map((file) => file.path);
  console.log("taswira jet");
  console.log(pics);
  res9.status(200).send(pics);
});

app.post("/update", (req, res0) => {
  const post = new Post(req.body);
  const dateActuelle = new Date();

  // Obtenez l'année, le mois et le jour de la date actuelle
  const annee = dateActuelle.getFullYear();
  const mois = (dateActuelle.getMonth() + 1).toString().padStart(2, "0"); // +1 car les mois commencent à 0
  const jour = dateActuelle.getDate().toString().padStart(2, "0");

  // Formatez la date dans le format "YYYY-MM-DD"
  const dateFormatee = `${annee}-${mois}-${jour}`;
  post.now = dateFormatee;
  console.log(post);
  Post.findByIdAndUpdate({ _id: post._id }, post)
    .then((res) => {
      console.log("taswira tsajlet");
      console.log(res);

      res0.send(res);
    })
    .catch((err) => {
      console.log(err);
      res0.status(404).send(err);
    });
});

app.post("/avence_recherche", (req, res0) => {
  const filter = new Filter(req.body);
  if (filter.date == "") {
    filter.date = 2098 - 10 - 27;
  }
  if (filter.ids == "") {
    Post.find({
      $or: [
        { date: { $gte: filter.date, $lte: 2099 - 10 - 28 } },
        { city: filter.city },
        { price: filter.price },
        { number: filter.number },
      ],
    })
      .then((res) => res0.send(res))
      .catch((err) => res0.status(404).send(err));
  } else {
    Post.findById(filter.ids)
      .then((res8) => res0.send(res8))
      .catch((err) => res0.status(404).send(err));
  }
});

app.delete("/delete/:id&:user_id", (req, res) => {
  console.log("--");

  id = req.params.id;
  user_id = req.params.user_id;
  console.log(user_id);

  /*
  Post.findByIdAndDelete({ _id: id })
    .then((res1) => {*/
  new_res = [];
  User.findById(user_id)
    .then((res2) => {
      console.log("-*-");
      for (let i = 0; i < res2.idss.length; i++) {
        if (res2.idss[i] !== user_id) {
          new_res.push(res2.idss[i]);
        }
      }

      console.log(new_res);
      res.status(200).send(res2);
    })
    .catch((err) => {
      res.status(404).send(err);
    }); /*
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send(err);
    });*/
});

var user_ifo = {};
app.get("/details", (req, res) => {
  const objectId = new ObjectId(req.query.id);

  User.findOne({ idss: { $in: [objectId] } })
    .then((user_info) => {
      console.log(user_info);
      Post.findById(req.query.id)
        .then((result) => {
          user_info = { user_info, result, img };
          console.log(user_info);
          res.status(200).send(user_info);
        })
        .catch((err) => {
          res.status(404).send(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/acount", (req, res) => {
  User.findById(req.query.id)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

app.get("/detail", (req, res) => {
  Post.findById(req.query.id)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

app.post("/save_subs", (req, res) => {
  console.log("------------");
  console.log(req.body.email);
  User.findOne(req.body.email)
    .then((resa) => {
      resa.appareil.push(req.body.key);
    })
    .catch((err) => res.status(404).send(err));

  User.findById(req.body.id)
    .then((result) => {
      result.subs.push(req.body.email);
      User.findByIdAndUpdate(req.body.id, { subs: result.subs })
        .then((resu) => res.status(200).send(resu))
        .catch((err) => res.status(404).send(err));
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.post("/save_comment", (req, res) => {
  console.log(req.body.user_comment);
  console.log(req.body.Comme);
  console.log(req.body.id);
  
  // Search for the post
  Post.findById(req.body.id)
    .then((result) => {
      // Find the user
      User.findOne({ email: req.body.user_comment })
        .then((rese) => {
          
          
          // Update post comment
          result.comment.push([rese._id, rese.name, img, req.body.Comme]);
          Post.findByIdAndUpdate(req.body.id, { comment: result.comment })
            .then((updatedPost) => {
              // Send response after successful update
              res.status(200).send(updatedPost);
            })
            .catch((updateErr) => {
              // Handle update error
              console.error("Error updating post:", updateErr);
              res.status(500).send("Error updating post");
            });
        })
        .catch((userErr) => {
          // Handle user lookup error
          console.error("Error finding user:", userErr);
          res.status(500).send("Error finding user");
        });
    })
    .catch((postErr) => {
      // Handle post lookup error
      console.error("Error finding post:", postErr);
      res.status(400).send("Error finding post");
    });
});
app.post("/delete_comment/:id&:user_email", (req, res) => {
  console.log(req.body.user_comment);
  console.log(req.body.Comme);
  console.log('.id');
  
  id = req.params.id;
  user_email = req.params.user_email;
  console.log(id);
  console.log(user_id);
  res.status(200).send(id);
})


const webpush = require("web-push");
//console.log(webpush.generateVAPIDKeys())
publicKey =
  "BNAdoLoEZxkNncC_Lx8V0MDStV0BtxT9ws2sD0wW_WmdwKNkF2weG98sIROgvv5DoTcE_fQCQM2Lxcg2ek8h3Do";
privateKey = "JK1xagRxWzHFK79lP0A6ktWBNaEp5GFNKeLq2uJMDMs";

const payLad = {
  notification: {
    data: { url: "https://www.youtube.com/watch?v=0vSEmEdYKro" },
    title: "jek messaj ya rayen",
    vibrate: [100, 50, 100],
  },
};
webpush.setVapidDetails("mailto:rayen3touzi@gmail.com", publicKey, privateKey);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
