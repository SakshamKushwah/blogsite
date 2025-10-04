const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const upload = require('../utils/multerConfig');
const { auth, adminOnly } = require('../middleware/auth');
const fs = require('fs').promises; // use promises for async/await
const path = require('path');

// create post (with optional image)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, category, content, imageAlignment } = req.body;
    const post = new Post({
      title,
      category,
      content,
      imageAlignment: imageAlignment || 'left',
      author: req.user._id,
    });
    if (req.file) post.imageUrl = `/uploads/${req.file.filename}`;
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email role')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// delete post (admin or post author)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    // allow admin or author
    if (req.user.role !== 'admin' && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    // remove image file if exists
    if (post.imageUrl) {
      const filePath = path.join(__dirname, '..', post.imageUrl);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.warn('Failed to delete file', err);
      }
    }

    // delete the post
    await post.deleteOne(); // use deleteOne instead of remove
    res.json({ msg: 'Post deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
