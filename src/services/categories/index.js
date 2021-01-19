const router = require("express").Router();

const Model = require("../../utils/model");

const Categories = new Model("categories");

router.get("/", async (req, res, next) => {
  try {
    const { rows } = await Categories.findOne(req.query);
    res.send(rows);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { rows } = await Categories.findById(req.params.id, "category_id_PK");
    res.send(rows);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const response = await Categories.save(req.body);
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
    const response = await Categories.findByIdAndUpdate(
      req.params.id,
      req.body,
      "category_id_PK"
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
    const result = await Categories.findByIdAndDelete(
      req.params.id,
      "category_id_PK"
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
