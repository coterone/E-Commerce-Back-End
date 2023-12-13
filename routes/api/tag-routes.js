const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

router.get("/", (req, res) => {
  Tag.findAll({
    include: {
      model: Product,
      attributes: ["product_name", "price", "stock", "category_id"],
    },
  })
    .then((Data) => {
      if (!Data) {
        res.status(404).json({ message: "No Tags found in the database" });
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
  Tag.findByPk(req.params.id, {
    include: {
      model: Product,
      attributes: ["product_name", "price", "stock", "category_id"],
    },
  })
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .json({ message: "No Tag with that id found in the database" });
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
  Tag.create(req.body)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .json({ message: "please enter data to create the new tag." });
        return;
      }
      res.json(data);
    })
    .catch((err) => {
      console.log("something went wrong");
      res.status(500).json(err);
    });
});

router.put("/:id", (req, res) => {
  Tag.update(
    {
      tag_name: req.body.tag_name,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((updatedTag) => {
      res.json(updatedTag);
    })
    .catch((err) => {
      console.log("something went wrong");
      res.status(500).json(err);
    });
});

router.delete("/:id", (req, res) => {
  Tag.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((deleted) => {
      res.json(deleted);
    })
    .catch((err) => {
      console.log("something went wrong");
      res.status(500).json(err);
    });
});

module.exports = router;
