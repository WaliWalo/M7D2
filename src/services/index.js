/** put all routes together here and export out  */

const router = require("express").Router();

const articlesRouter = require("./articles");
const authorsRouter = require("./authors");
const categoriesRouter = require("./categories");
const reviewsRouter = require("./reviews");

router.use("/articles", articlesRouter);
router.use("/authors", authorsRouter);
router.use("/categories", categoriesRouter);
router.use("/reviews", reviewsRouter);

module.exports = router;
