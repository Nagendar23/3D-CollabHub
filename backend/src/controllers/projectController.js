import Project from '../models/projectModel.js'

export const createProject = async (req, res) => {
  try {
    const { title, description } = req.body

    if (!title) {
      console.log('Title is required to create a project')
      return res.status(400).json({ message: 'Title is required to create a project' })
    }

    const project = await Project.create({
      owner: req.user,
      title,
      description,
    })

    console.log('Project created successfully', project)
    return res.status(201).json(project)
  } catch (err) {
    console.log('Server error while creating the project', err)
    return res.status(500).json({ message: 'server error while creating project' })
  }
}

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user }).sort({ createdAt: -1 })

    console.log('Got all the projects', projects)
    return res.json(projects)
  } catch (err) {
    console.log('Server error while fetching projects', err)
    return res.status(500).json({ message: 'Server error while fetching projects' })
  }
}

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params
    const project = await Project.findById(id)

    if (!project) {
      console.log('Project not found with given id', id)
      return res.status(404).json({ message: 'Project not found with given ID' })
    }

    if (project.owner.toString() !== req.user) {
      console.log('Not authorized to access this project')
      return res.status(401).json({ message: 'Not authorized to access this project' })
    }

    console.log('Project fetched successfully', project)
    return res.json(project)
  } catch (err) {
    console.log('Server error while fetching the project', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params
    const project = await Project.findById(id)

    if (!project) {
      console.log('Project not found with that id')
      return res.status(404).json({ message: 'Project not found with ID' })
    }

    if (project.owner.toString() !== req.user) {
      console.log('Not authorized to update this project')
      return res.status(401).json({ message: 'Not authorized to access this project' })
    }

    project.title = req.body.title || project.title
    project.description = req.body.description || project.description

    const updated = await project.save()
    console.log('Project updated successfully', updated)
    return res.json(updated)
  } catch (err) {
    console.log('Server error while updating', err)
    return res.status(500).json({ message: "Server error while updating" })
  }
}

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params
    const project = await Project.findById(id)

    if (!project) {
      console.log('Project not found with given id')
      return res.status(404).json({ message: 'Project not found with ID' })
    }

    if (project.owner.toString() !== req.user) {
      console.log('Not authorized to delete this project')
      return res.status(401).json({ message: 'Not authorized to access this project' })
    }

    await project.deleteOne()
    console.log('Project deleted successfully', project)
    return res.json({ message: 'Project deleted' })
  } catch (err) {
    console.log('Server error while deleting the project', err)
    return res.status(500).json({ message: 'Server error while deleting' })
  }
}