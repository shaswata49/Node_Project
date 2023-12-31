const { addListener } = require("../app");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");


//Create Product - Admin
exports.createProduct = catchAsyncErrors(async(req,res,next)=>{

    // let images = [];

    // if (typeof req.body.images === "string") {
    //   images.push(req.body.images);
    // } else {
    //   images = req.body.images;
    // }
  
    // const imagesLinks = [];
  
    // for (let i = 0; i < images.length; i++) {
    //   const result = await cloudinary.v2.uploader.upload(images[i], {
    //     folder: "products",
    //   });
  
    //   imagesLinks.push({
    //     public_id: result.public_id,
    //     url: result.secure_url,
    //   });
    // }
  
    // req.body.images = imagesLinks;

    req.body.user = req.user.id;
    
    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product,
    });
});


//Get All prduct
exports.getAllProducts = catchAsyncErrors(async(req,res)=>{
    
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find({
        isAvail:true
    }), req.query)
    .search()
    // .filter()
    .pagination(resultPerPage);

    
    const products = await apiFeature.query;

    res.status(200).json({
        success:true,
        products,
        productsCount,
        resultPerPage,
    });
});

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();
  
    res.status(200).json({
      success: true,
      products,
    });
  });

// Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
  
    if (!product) {
      return next(new ErrorHandler("Product Not Found",404));
    }
  
    res.status(200).json({
      success: true,
      product,
    });
  }) ;

//update product - admin

exports.updateProduct = catchAsyncErrors(async(req,res,next)=>{

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found",404));
      }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        product,
    });
});

//Delete Product

exports.deleteProduct = catchAsyncErrors(async(req,res,next)=>{


    const product = await Product.findById(req.params.id);
    
    if (!product) {
        return next(new ErrorHandler("Product Not Found",404));
    }

    await product.deleteOne();

    res.status(200).json({
        success:true,
        message:"Product deleted successfully"
    });
});
