const express = require("express");
const Product = require("../models/product");
const Category = require("../models/category");
const { default: mongoose } = require("mongoose");
const router = express.Router();

// router.get(`/`, async (req, res) => {
//   try {
//     // Initialize filter object
//     let filter = {};

//     // Check if categories query parameter exists and split it
//     if (req.query.categories) {
//       const categoriesArray = req.query.categories.split(",");
//       filter = { category: { $in: categoriesArray } }; // Use $in for multiple values
//     }

//     // Find products with the filter and populate the category field
//     const productList = await Product.find(filter).populate("category");

//     // Check if products are found
//     if (productList.length === 0) {
//       return res
//         .status(404)
//         .json({ success: false, message: "No products found" });
//     }

//     // Send the product list
//     res.status(200).json({ success: true, products: productList });
//   } catch (err) {
//     // Handle errors
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

router.get(`/`, async (req, res) => {
  // const productList = await Product.find().select("name image -_id");
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }
  const productList = await Product.find(filter).populate("category"); // populates using id in category
  if (!productList) {
    res.status(500).json({ success: false });
  }

  res.send(productList);
});

router.get(`/:id`, async (req, res) => {
  const productList = await Product.findById(req.params.id).populate(
    "category"
  );

  if (!productList) {
    res.status(500).json({ success: false });
  }

  res.send(productList);
});

router.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).json({ message: "Invalid category" });

  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReview: req.body.numReview,
    isFeatured: req.body.isFeatured,
  });

  product
    .save()
    .then((createdProduct) => {
      res.status(201).json(createdProduct);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

router.put(`/:id`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("Invalid product Id");
  }

  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).json({ message: "Invalid category" });

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReview: req.body.numReview,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );

  if (!product) {
    res
      .status(500)
      .json({ success: false, message: "The product could not be updated" });
  }

  res.send(product);
});

router.delete("/:id", (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: "The product is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

router.get("/get/count", async (req, res) => {
  try {
    const productCount = await Product.countDocuments();

    if (!productCount) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to get product count" });
    }

    res.status(200).json({
      success: true,
      productCount: productCount,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/get/featured/:count", async (req, res) => {
  try {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({ isFeatured: true }).limit(+count);

    if (!products) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to get product count" });
    }

    res.send(products);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
