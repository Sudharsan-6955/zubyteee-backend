const Skills = require('../models/Skills');
let skillsValue = "";
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Admin = require('../models/Admin');
const Profile = require('../models/Profile');

// POST /api/admin/profile (save admin image)
router.post('/profile', async (req, res) => {
  const { image } = req.body;
  try {
    let profile = await Profile.findOne();
    if (profile) {
      profile.image = image;
      await profile.save();
    } else {
      profile = new Profile({ image });
      await profile.save();
    }
    res.status(200).json({ message: 'Admin image updated!', image: profile.image });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update admin image.' });
  }
});

// GET /api/admin/profile (get admin image)
router.get('/profile', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ message: 'No admin image found.' });
    res.json({ image: profile.image });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch admin image.' });
  }
});

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin || admin.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: 'Login error' });
  }
});
// POST /api/admin/create-admin (one-time setup)
router.post('/create-admin', async (req, res) => {
  const { username, password } = req.body;
  try {
    const exists = await Admin.findOne({ username });
    if (exists) return res.status(400).json({ message: 'Admin already exists.' });
    const admin = new Admin({ username, password });
    await admin.save();
    res.status(201).json({ message: 'Admin created.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create admin.' });
  }
});

// GET /api/admin/projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects.' });
  }
});

// POST /api/admin/projects
router.post('/projects', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: 'Failed to save project.' });
  }
});

// PUT /api/admin/projects/:id
router.put('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update project.' });
  }
});

// DELETE /api/admin/projects/:id
router.delete('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.json({ message: 'Project deleted.' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete project.' });
  }
});

// POST /api/admin/skills
router.post('/skills', async (req, res) => {
  const { skills } = req.body;
  if (!skills) {
    return res.status(400).json({ message: 'No skills provided.' });
  }
  try {
    let doc = await Skills.findOne();
    if (doc) {
      // Append new skills to existing skills, avoiding duplicates
      const existingSkillsArr = doc.skills.split(',').map(s => s.trim()).filter(Boolean);
      const newSkillsArr = skills.split(',').map(s => s.trim()).filter(Boolean);
      const combinedSkillsArr = Array.from(new Set([...existingSkillsArr, ...newSkillsArr]));
      doc.skills = combinedSkillsArr.join(',');
      await doc.save();
    } else {
      doc = new Skills({ skills });
      await doc.save();
    }
    res.status(200).json({ message: 'Skills updated successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save skills.' });
  }
});

// GET /api/admin/skills
router.get('/skills', async (req, res) => {
  try {
    const doc = await Skills.findOne();
    res.json({ skills: doc ? doc.skills : "" });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch skills.' });
  }
});

module.exports = router;
