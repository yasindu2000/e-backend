import Product from "../model/product.js";
import { isAdmin } from "./userController.js";

export async function createProduct(req, res){

  if(!isAdmin(req)){
    return res.status(403).json(
        {
            message: "Access denied.admins only"
        }
    )
  }



    const product = new Product(req.body)

    try {
        
        const reponse = await product.save()

        res.json(
            {
                message : "Product created succesfully"
            }
        )
    } catch (error) {

        console.error("error creating product", error)
        return res.status(500).json(
            {
                message: "failed to created product"
            }
        )
        
    }

}


export async function getProducts(req, res){

    try {

        if(isAdmin(req)){
            const product = await Product.find();
            return res.json(product);
        }else{
           const product = await Product.find({ isAvailble: true}) ;
           return res.json(product)
        }
        
    } catch (error) {
        console.error("error fetching products :", error);
        return res.status(500).json({
            message: "failed to fetch products"
        })
    }

}


export async function deleteProduct(req, res){

    if(!isAdmin(req)){
        res.status(403).json({
            message : "Access denied.admins only"
        })
        return;
    }

    try {
        
        const productId = req.params.productId;

        await Product.deleteOne({productId : productId})
        res.json({
            message : "Product deleted successfully"
        })

    } catch (error) {
        console.error("error deleting products :", error);
        return res.status(500).json({
            message: "failed to delete products"
        })
    }

}

export async function updateProduct(req, res){

    if(!isAdmin(req)){
        res.status(403).json({
            message : "Access denied.admins only"
        })
        return;
    }

    const data = req.body;
    const productId = req.params.productId;
    data.productId = productId;

    try {

        await Product.updateOne(
            {
                productId : productId
            },
            data
        );
        res.json({
            message : "Product updated succesfully"
        })
        
    } catch (error) {
        console.error("error deleting products :", error);
        return res.status(500).json({
            message: "failed to delete products"
        })
    }
}

export async function getProductInfo(req, res) {

    try {
          const productId = req.params.productId;
          const product = await Product.findOne({productId : productId})

          if(product == null){
            res.status(404).json({
                message : "product not found"
            })
            return;
          }
        if(isAdmin(req)){
            res.json(product);
           
        }else{
           if(product.isAvailble){
            res.json(product)
           }else{
            res.status(404).json({
                message : "product is not available"
            })
           }
        }
        
    } catch (error) {
        console.error("error fetching products :", error);
        return res.status(500).json({
            message: "failed to fetch products"
        })
    }

    
}

export async function searchProducts(req,res){
	const query = req.params.query

	try{
		const products = await Product.find({
			$or: [
				{name:  { $regex:query , $options: "i"}},
				{altNames : {$elemMatch : { $regex: query, $options: "i" }}}
			],
			isAvailble: true			
		})
		res.json(products);
	}catch{
		res.status(500).json({ message: "Failed to search products" });
	}

	
}