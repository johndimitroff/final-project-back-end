const express = require("express");

const Project = require("../models/project-model.js");

const router = express.Router();

const User = require("../models/user-model.js");

//POST a project

router.post("/startproject", (req, res, next) => {
  const {
    projectName,
    shortDescription,
    longDescription,
    pictureUrl,
    videoFile,
    format,
    cast,
    crew,
    locations,
    genre,
    endDate,
    expectedReleaseDate,
    budget,
    budgetItems
  } = req.body;

  let owner = req.user._id;

  Project.create({
    projectName,
    shortDescription,
    longDescription,
    pictureUrl,
    videoFile,
    budget,
    budgetItems,
    endDate,
    expectedReleaseDate,
    format,
    cast,
    crew,
    locations,
    genre,
    owner: req.user._id
  })
    .then(projectDoc => {
      User.findByIdAndUpdate(req.user._id, {
        $push: { projectsCreated: projectDoc._id }
      })
        //every time you do a database request you need a THEN and a CATCH
        .then(userDoc => {
          console.log(projectDoc);
          res.json({ projectDoc });
        })
        .catch(err => next(err));
      // console.log("WHAT IS THIS", User);
    })
    .catch(err => next(err));
});

//GET AllProjects page
router.get("/projects", (req, res, next) => {
  Project.find()
    .sort({ createdAt: -1 })
    .then(projectResults => res.json(projectResults))
    .catch(err => next(err));
});

//GET a particular project's page
router.get("/projects/:projectId", (req, res, next) => {
  const { projectId } = req.params;
  Project.findById(projectId)
    .populate("owner")
    .then(projectDoc => res.json(projectDoc))
    .catch(err => next(err));
});

//GET a particular project's WATCH page
// router.get("/projects/:projectId/watch", (req, res, next) => {
//   const { projectId } = req.params;
//   Project.findById(projectId)
//     .populate("owner")
//     .then(projectDoc => res.json(projectDoc))
//     .catch(err => next(err));
// });

router.post("/process-selection/:projectId", (req, res, next) => {
  let { projectId } = req.params;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, {
    $push: { projectsContributed: { project: projectId, amount: 1 } }
  })
    .then(userDoc => {
      Project.findByIdAndUpdate(
        projectId,
        {
          $inc: { moneyReceived: 1 },
          //{moneyRecieived: moneyReceived++}
          $push: { contributors: userId }
        },
        { runValidators: true, new: true }
      )
        .then(projectDoc => res.json(projectDoc))
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

module.exports = router;
