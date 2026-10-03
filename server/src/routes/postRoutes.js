const express = require("express");
const prisma = require("../prisma");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a post
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, published } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required.",
      });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: published || false,
        authorId: req.userId,
      },
    });

    res.status(201).json({
      message: "Post created successfully.",
      post,
    });
  } catch (error) {
    console.error("Create post error:", error);

    res.status(500).json({
      message: "Something went wrong.",
    });
  }
});

// Get all published posts
router.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(posts);
  } catch (error) {
    console.error("Get posts error:", error);

    res.status(500).json({
      message: "Something went wrong.",
    });
  }
});
// Update a post
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const postId = Number(req.params.id);
    const { title, content, published } = req.body;

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found.",
      });
    }

    if (post.authorId !== req.userId) {
      return res.status(403).json({
        message: "You can only edit your own posts.",
      });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
        published,
      },
    });

    res.json({
      message: "Post updated successfully.",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Update post error:", error);

    res.status(500).json({
      message: "Something went wrong.",
    });
  }
});

// Delete a post
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const postId = Number(req.params.id);

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found.",
      });
    }

    if (post.authorId !== req.userId) {
      return res.status(403).json({
        message: "You can only delete your own posts.",
      });
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    res.json({
      message: "Post deleted successfully.",
    });
  } catch (error) {
    console.error("Delete post error:", error);

    res.status(500).json({
      message: "Something went wrong.",
    });
  }
});

module.exports = router;