import express from "express";
import expressAsyncHandler from "express-async-handler";
import ProductController from "./product.controller";
import multer from "multer";
import fs from "fs";
import path from "path";
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "uploads/";
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
    // Specify the upload directory
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Define the file name format
    let extension = path.extname(file.originalname);
    let filename =
      Date.now() + Math.random().toString().slice(2, 6) + extension;

    cb(null, filename);
  },
});
// Create a multer instance with the storage strategy
const upload = multer({ storage: storage });

router.get("/", expressAsyncHandler(ProductController.index));
router.post(
  "/",
  upload.array("images", 5),
  expressAsyncHandler(ProductController.create)
);
router.put(
  "/:id",
  upload.array("images", 5),
  expressAsyncHandler(ProductController.update)
);
router.patch(
  "/:id/status",
  expressAsyncHandler(ProductController.updateStatus)
);
router.delete("/:id", expressAsyncHandler(ProductController.delete));

export default router;
