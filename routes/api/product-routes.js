const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
try 
  {
    const productData = await Product.findAll({
    include: [{model: Category}, {model: Tag}]
});
res.status(200).json(productData)
} catch (err) {
  res.status(500).json(err)
}
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{model: Category}, {model: Tag}]
    });
    if (!productData) {
      
    }
    res.status(200).json(productData)
  } catch (err) {
    res.status(404).json({message: 'Product does not exist'});
  }
});

//   req.body should look like this...
//     {
//       product_name: "Basketball",
//       price: 200.00,
//       stock: 3,
//       tagIds: [1, 2, 3, 4]
//     }

// create new product
router.post('/', async(req, res) => {
  try {
    const productData = await Product.create({
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
    });
     if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArray = req.body.tagIds.map((tag_id) => {
        return {
          product_id: productData.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArray);
     }
     res.status(200).json(productData);
  } catch (err) {
    console.log(err);
  }
});

// update product
router.put('/:id', async(req, res)=> {
  try {
    const [updateCategory] = await Product.update(req.body, {
      where: {id: req.params.id},
    });
    if (updatedRows===0) {
      return res.status(404).json({message: 'The product id does not exist'});
    }
    if(req.body.tagIds && req.body.tagIds.length) {
      const productTags = await ProductTag.findAll({
        where: {product_id: req.params.id}
      });
      const productTagIds = productTags.map(({tag_id}) => {tag_id});
      const newProductTags = req.body.tagIds.filter((tag_id) => !productTagIds.includes(tag_id)).map((tag_id)=> {
        return{
          product_id: req.params.id,
          tag_id,
        };
      });

      const productTagsToRemove = ProductTags.filter(({tag_id}) => !req.body.tagIds.includes(tag_id)).map(({id})=>id);
      await Promise.all([
        ProductTag.destroy({where: {id: productTagsToRemove}}),
        ProductTag.bulkCreate(newProductTags),
      ]);
    }
    const updatedProduct = await Product.findByPk(req.params.id, {
      include: [{model: 'Tag', ProductTag}]
    });
    res.json(updatedProduct)
  } catch (err) {
    console.log(err);
    res.status(400).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const deleteRows = await Product.destroy({
      where: {
        id: req.params.id
      }
    });
    if(deleteRows===0) {
      res.status(404).json({message: "This product id does not exist"});
      return;
    }
    res.status(200).json({message: 'Product deleted'});
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
