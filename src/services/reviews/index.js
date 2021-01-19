const router = require("express").Router();

const Model = require("../../utils/model");

const Reviews = new Model("reviews");

// router.get("/", async (req, res, next) => {
//   try {
//     const { rows } = await Reviews.findOne(req.query);
//     res.send(rows);
//   } catch (e) {
//     console.log(e);
//     res.status(500).send(e);
//   }
// });

router.get("/:id", async (req, res, next) => {
  try {
    const { rows } = await Reviews.findReview();
    res.send(rows);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/:id", async (req, res, next) => {
  try {
    const response = await Reviews.saveWithId(req.body, req.params.id);
    if (response.rowCount === 1) {
      res.send("INSERT SUCCESS");
    } else {
      res.status(500).send("Something went wrong");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const response = await Reviews.findByIdAndUpdate(
      req.params.id,
      req.body,
      "review_id_PK"
    );
    if (response.rowCount === 1) {
      res.send("UPDATE SUCCESS");
    } else {
      res.status(500).send("Something went wrong");
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const result = await Reviews.findByIdAndDelete(
      req.params.id,
      "review_id_PK"
    );
    if (result.rowCount === 1) {
      res.send("DELETE SUCCESS");
    } else {
      res.status(500).send("Something went wrong");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

module.exports = router;
