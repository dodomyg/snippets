const CODE = require("../models/CODE");

const getSnippet = async (req, resp) => {
  try {
    const data = await CODE.find({}).populate("author", "email").sort({
      createdAt: -1,
    });
    return resp.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
};

const getSingleSnippet = async (req, resp) => {
  try {
    const { id } = req.params;
    const data = await CODE.findById(id).populate("author", "email");
    return resp.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
};

const createSnippet = async (req, resp) => {
  try {
    const { title, pl, code, desc } = req.body;
    if (!title || !pl || !code) {
      return resp.status(422).json({
        error:
          "Please provide all required fields: title, programming language, and code.",
      });
    }

    const newSnippet = new CODE({
      title,
      pl,
      code,
      desc,
      author: req.user._id,
    });

    await newSnippet.save();
    return resp.status(201).json(newSnippet);
  } catch (error) {
    console.log(error);
    return resp.status(500).json({ error: "Server error" });
  }
};

const deleteSnippet = async (req, resp) => {
  const { id } = req.params;
  try {
    if (!req.user._id) {
      return resp.status(401).json({ error: "Unauthorized user" });
    }
    const delSnippet = await CODE.findByIdAndDelete(id);
    if (!delSnippet) {
      return resp.status(404).json({ error: "Snippet not found" });
    }
    return resp.status(200).json({ message: "Snippet deleted successfully" });
  } catch (error) {
    console.log(error);
    return resp.status(500).json({ error: "Server error" });
  }
};

const updateSnippet = async (req, resp) => {
  const { id } = req.params;
  try {
    if (!req.user._id) {
      return resp.status(401).json({ error: "Unauthorized user" });
    }

    const { title, pl, code, desc } = req.body;
    if (!title || !pl || !code) {
      return resp.status(422).json({
        error:
          "Please provide all required fields: title, programming language, and code.",
      });
    }

    const updatedSnippet = await CODE.findByIdAndUpdate(
      id,
      {
        title,
        pl,
        code,
        desc,
      },
      { new: true }
    );

    if (!updatedSnippet) {
      return resp.status(404).json({ error: "Snippet not found" });
    }

    return resp.status(200).json({
      message: "Snippet updated successfully",
      updatedSnippet,
    });
  } catch (error) {
    console.log(error);
    return resp.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getSingleSnippet,
  getSnippet,
  createSnippet,
  deleteSnippet,
  updateSnippet,
};
