import express from 'express'
import { uploadFile, getProjectFiles } from '../controllers/fileController.js'
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';


const router = express.Router();

router.get('/project/:projectId',
    protect,
    getProjectFiles
)

router.post('/:projectId/upload',
    protect,
    upload.single("file"),
    uploadFile
)

export default router;
