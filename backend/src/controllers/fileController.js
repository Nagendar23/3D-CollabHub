import File from "../models/File.js";
import FileVersion from "../models/FileVersion.js";
import Project from "../models/projectModel.js";
import Comment from "../models/Comment.js";

import cloudinary from "../config/cloudinary.js";

//upload new file or new version
export const uploadFile = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { fileId } = req.body;

    const project = await Project.findOne({
      _id: projectId,
      owner: req.user,
    });
    if (!project) {
      console.log("Project not found");
      return res.status(404).json({ message: "Project not found" });
    }
    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Validate file size (max 100MB)
    const MAX_FILE_SIZE = 100 * 1024 * 1024;
    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ message: "File too large (max 100MB)" });
    }

    // Validate file type for 3D models
    const ALLOWED_TYPES = [
      "model/gltf+json",
      "model/gltf-binary",
      "application/octet-stream",
      "text/plain",
      "application/json",
    ];
    const fileName = req.file.originalname.toLowerCase();
    const isValid3DFormat =
      fileName.endsWith(".glb") ||
      fileName.endsWith(".gltf") ||
      fileName.endsWith(".obj") ||
      fileName.endsWith(".stl");

    if (!isValid3DFormat) {
      return res.status(400).json({
        message: "Invalid file type. Supported: GLB, GLTF, OBJ, STL",
      });
    }

    // Wrap upload_stream in a Promise
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
        },
        async (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          try {
            let file;
            if (!fileId) {
              file = await File.create({
                project: projectId,
                name: req.file.originalname, // ← Change from originalName to originalname
              });
            } else {
              file = await File.findOne({
                _id: fileId,
                project: projectId,
              });
              if (!file) {
                reject(new Error("File not found"));
                return;
              }
            }

            const versionCount = await FileVersion.countDocuments({
              file: file._id,
            });

            const version = await FileVersion.create({
              file: file._id,
              versionNumber: versionCount + 1,
              fileUrl: result.secure_url,
              publicId: result.public_id,
              fileType: req.file.mimetype,
              fileSize: req.file.size,
              uploadedBy: req.user,
            });
            file.currentVersion = version._id;
            await file.save();

            resolve({ file, version });
          } catch (err) {
            reject(err);
          }
        },
      );

      uploadStream.end(req.file.buffer);
    });
    console.log("File Uploaded sucessfully", result);
    res.status(201).json(result);
  } catch (err) {
    console.log("Upload failed ", err);
    return res.status(500).json({ message: "Upload failed" });
  }
};

export const getProjectFiles = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const files = await File.find({
      project: req.params.projectId,
    })
      .populate("currentVersion")
      .sort({ createdAt: -1 });

      console.log("Successfully Fetched project files ", files);
    res.json(files);

  } catch (err) {
    console.log("Failed to fetch project files ",err);
    return res.status(500).json({message:"Failed to fetch project files"})
  }
};


export const getFileById = async(req,res)=>{
  try{
    const file = await File.findById(req.params.fileId)
    .populate("currentVersion");

    if(!file){
      console.log("File not found");
      return res.status(404).json({message:"File not found"})
    }

    // Verify file belongs to a project owned by the authenticated user
    const project = await Project.findOne({
      _id: file.project,
      owner: req.user,
    });

    if(!project){
      console.log("Unauthorized file access attempt");
      return res.status(403).json({message:"Unauthorized"})
    }

    res.json(file)
  }catch(err){
    console.log("Server error while fetching file");
    return res.status(500).json({message:"Server error while fetching file"})
  }
}

export const getFileVersions = async (req, res) => {
  try {
    const { fileId } = req.params;

    // Verify file belongs to a project owned by the user
    const file = await File.findById(fileId);
    if(!file){
      return res.status(404).json({ message: "File not found" });
    }

    const project = await Project.findOne({
      _id: file.project,
      owner: req.user,
    });

    if(!project){
      return res.status(403).json({ message: "Unauthorized" });
    }

    const versions = await FileVersion.find({ file: fileId })
      .sort({ versionNumber: -1 })
      .lean();

    res.json(versions);
  } catch (err) {
    console.log("Failed to fetch file versions", err);
    return res.status(500).json({ message: "Failed to fetch file versions" });
  }
};

export const getFileComments = async (req, res) => {
  try {
    const { fileId } = req.params;

    // Verify file belongs to a project owned by the user
    const file = await File.findById(fileId);
    if(!file){
      return res.status(404).json({ message: "File not found" });
    }

    const project = await Project.findOne({
      _id: file.project,
      owner: req.user,
    });

    if(!project){
      return res.status(403).json({ message: "Unauthorized" });
    }

    const comments = await Comment.find({ file: fileId })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.json(comments);
  } catch (err) {
    console.log("Failed to fetch comments", err);
    return res.status(500).json({ message: "Failed to fetch comments" });
  }
};

export const addFileComment = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    if (text.length > 2000) {
      return res.status(400).json({ message: "Comment too long (max 2000 chars)" });
    }

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Verify file belongs to a project owned by the user
    const project = await Project.findOne({
      _id: file.project,
      owner: req.user,
    });

    if(!project){
      return res.status(403).json({ message: "Unauthorized" });
    }

    const comment = await Comment.create({
      file: fileId,
      user: req.user,
      text: text.trim(),
    });

    const populated = await comment.populate("user", "name email");

    res.status(201).json(populated);
  } catch (err) {
    console.log("Failed to add comment", err);
    return res.status(500).json({ message: "Failed to add comment" });
  }
};

  export const deleteFile = async (req, res) => {
    try {
      const { fileId } = req.params;

      // Fetch the file
      const file = await File.findById(fileId);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      // Verify file belongs to a project owned by the user
      const project = await Project.findOne({
        _id: file.project,
        owner: req.user,
      });

      if (!project) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // Delete all versions and their Cloudinary assets
      const versions = await FileVersion.find({ file: fileId });
      for (const version of versions) {
        if (version.publicId) {
          try {
            await cloudinary.uploader.destroy(version.publicId, {
              resource_type: "auto",
            });
          } catch (cloudError) {
            console.log("Error deleting from Cloudinary:", cloudError);
          }
        }
      }

      // Delete versions from DB
      await FileVersion.deleteMany({ file: fileId });

      // Delete comments
      await Comment.deleteMany({ file: fileId });

      // Delete the file
      await file.deleteOne();

      console.log("File deleted successfully", fileId);
      res.json({ message: "File deleted" });
    } catch (err) {
      console.log("Failed to delete file", err);
      return res.status(500).json({ message: "Failed to delete file" });
    }
  };