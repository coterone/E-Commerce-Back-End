const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

router.get("/", (req, res) => {
  Product.findAll({
    include: [
      {
        model: Category,
        attributes: ["category_name"],
      },
      {
        model: Tag,
        attributes: ["tag_name"],
      },
    ],
  })
    .then((Data) => {
      if (!Data) {
        res.status(404).json({ message: "No products found in the database" });
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
  Product.findByPk(req.params.id, {
    include: [
      {
        model: Category,
        attributes: ["category_name"],
      },
      {
        model: Tag,
        attributes: ["tag_name"],
      },
    ],
  })
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .json({ message: "No product with that id found in the database" });
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
  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put("/:id", (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        ProductTag.findAll({
          where: { product_id: req.params.id },
        }).then((productTags) => {
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.delete("/:id", (req, res) => {
  Product.destroy({
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
