const express = require("express");

const { uploadFile,getFiles,getFile,deleteFile } = require("../controllers/file.controller");

const { protect } = require("../middleware/auth.middleware");

const upload = require("../middleware/upload.middleware");

const router = express.Router();

router.post("/upload",protect,upload.single("file"),uploadFile);
router.get("/",protect,getFiles);
router.get("/:id",protect,getFile);
router.delete("/:id",protect,deleteFile);

module.exports = router;