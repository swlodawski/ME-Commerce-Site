const router = require('express').Router();
const { includes } = require('lodash');
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const Category = await Category.findAll();
    include: [
      {
        model: Product,
        attrbutes: 'product'
      },
    ],
  // find all categories
  // be sure to include its associated Products
    res.status(200).json(newCategory);
  } catch (err) {
    res.status (400).json(err);
  }

});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCategory = await Category.create(req.body);
    include: [
    {  model: Product,
      attrbutes: ['product']
      },
    ],

    res.status(200).json(newCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
