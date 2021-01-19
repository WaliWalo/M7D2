const router = require("express").Router();

const Model = require("../../utils/model");

const Authors = new Model("authors");

router.get("/", async (req, res, next) => {
  try {
    const { rows } = await Authors.findOne(req.query);
    res.send(rows);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { rows } = await Authors.findById(req.params.id, "author_id_PK");
    res.send(rows);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const response = await Authors.save(req.body);
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
    const response = await Authors.findByIdAndUpdate(
      req.params.id,
      req.body,
      "author_id_PK"
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
    const result = await Authors.findByIdAndDelete(
      req.params.id,
      "author_id_PK"
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
