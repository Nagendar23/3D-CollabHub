import express from 'express'
import { uploadFile, getProjectFiles, getFileById, getFileVersions, getFileComments, addFileComment, deleteFile } from '../controllers/fileController.js'
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

router.get('/:fileId/versions',
    protect,
    getFileVersions
)

router.get('/:fileId/comments',
    protect,
    getFileComments
)

router.post('/:fileId/comments',
    protect,
    addFileComment
)

    router.delete('/:fileId',
        protect,
        deleteFile
    )

router.get("/:fileId",
    protect,
    getFileById
)

export default router;
