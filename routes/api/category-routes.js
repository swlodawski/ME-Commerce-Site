const router = require('express').Router();
const { Category, Product } = require('../../models');


// The `/api/categories` endpoint
  // find all categories
  // be sure to include its associated Products
router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll({
    include: [Product]
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status (500).json(err);
  }
});
  // find one category by its `id` value
  // be sure to include its associated Products
router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{model: Product}]
    });
    if (!categoryData) {
      res.status(404).json({message: 'This category does not exist'});
      return;
    }
    res.status(200).json(categoryData)
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});
  // update a category by its `id` value
router.put('/:id', async (req, res) => {
  try { 
    const [updatedRows] = await Category.update(req.body, {
    where: {
      id: req.params.id
    }
  });
  if (updatedRows === 0) {
    res.status(404).json({message: 'Category does not exist'});
    return;
  } const updateCategory = await Category.findByPk(req.params.id);
  res.status(200).json(updateCategory)
} catch (err) {
  res.status(400).json(err)
}
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try { 
    const [deletedRows] = await Category.destroy({
    where: {
      id: req.params.id
    }
  });
  if (deletedRows === 0) {
    res.status(404).json({message: 'Category does not exist'});
    return;
  } res.status(200).json({message: 'Category has been deleted'})
} catch (err) {
  res.status(400).json(err)
}
});

module.exports = router;
