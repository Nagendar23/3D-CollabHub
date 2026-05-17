import File from "../models/File.js";
import FileVersion from "../models/FileVersion.js";
import Project from "../models/projectModel.js";

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
