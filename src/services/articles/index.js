const router = require("express").Router();

const Model = require("../../utils/model");

const Articles = new Model("articles");

router.get("/", async (req, res, next) => {
  try {
    const result = await Articles.findOneWithJoin(req.query);
    res.send(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { rows } = await Articles.articlesFindOne(
      req.params.id,
      "article_id_PK"
    );

    res.send(rows);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    // const response = await Articles.save(req.body);
    const response = await Articles.saveWithJoinTable(
      req.body,
      "articles_authors",
      req.query,
      "article_id_PK"
    );
    console.log(response);
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
    const response = await Articles.findByIdAndUpdate(
      req.params.id,
      req.body,
      "article_id_PK"
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
    const result = await Articles.findByIdAndDelete(
      req.params.id,
      "article_id_PK"
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
