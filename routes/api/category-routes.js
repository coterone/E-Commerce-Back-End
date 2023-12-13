const router = require("express").Router();
const { Category, Product } = require("../../models");

router.get("/", (req, res) => {
  Category.findAll({
    include: {
      model: Product,
      attributes: ["id", "product_name", "price", "stock", "category_id"],
    },
  })
    .then((Data) => {
      if (!Data) {
        res
          .status(404)
          .json({ message: "No categories found in the database" });
        return;
      }
      res.json(Data);
    })
    .catch((err) => {
      console.log("something went wrong");
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
  Category.findByPk(req.params.id, {
    include: {
      model: Product,
      attributes: ["id", "product_name", "price", "stock", "category_id"],
    },
  })
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .json({
            message: "No categories with that Id found in the database",
          });
        return;
      }
      res.json(data);
    })
    .catch((err) => {
      console.log("something went wrong");
      res.status(500).json(err);
    });
});

router.post("/", (req, res) => {
  Category.create(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log("something went wrong");
      res.status(500).json(err);
    });
});

router.put("/:id", (req, res) => {
  Category.update(
    {
      category_name: req.body.category_name,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((updatedCategory) => {
      res.json(updatedCategory);
    })
    .catch((err) => {
      console.log("something went wrong");
      res.status(500).json(err);
    });
});

router.delete("/:id", (req, res) => {
  Category.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((deletedCategory) => {
      res.json(deletedCategory);
    })
    .catch((err) => {
      console.log("something went wrong");
      res.status(500).json(err);
    });
});

module.exports = router;
