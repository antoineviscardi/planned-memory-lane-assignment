import "dotenv/config";

import express from "express";
import multer from "multer";
import cors from "cors";

import { memorySchema } from "./src/lib/domain";
import { Image, imageSchema } from "./src/lib/image-schema";
import {
  createMemory,
  deleteMemory,
  getImage,
  getMemories,
  getUser,
  setupDb,
  updateLaneDescription,
  updateMemory,
} from "./src/lib/data-access";

const app = express();
const port = 4001;

const upload = multer({ storage: multer.memoryStorage() });

setupDb();

app.use(cors(), express.json());

app.get("/user", async (req, res) => {
  const user = await getUser().catch((err) => {
    res.status(500).json({ success: false, error: err });
  });
  res.json({ user });
});

app.get("/memories", async (req, res) => {
  const memories = await getMemories().catch((err) => {
    res.status(500).json({ success: false, error: err });
  });
  res.json({ memories });
});

app.post("/memories", upload.array("images"), async (req, res) => {
  const newMemory = memorySchema.omit({ images: true }).safeParse({
    id: req.body.id,
    name: req.body.name,
    description: req.body.description,
    timestampISO: req.body.timestampISO,
  });
  if (newMemory.error) {
    res.status(400).json({ error: newMemory.error });
    return;
  }

  const files = imageSchema.array().safeParse(req.files);
  if (files.error) {
    res.status(400).json({ error: files.error });
    return;
  }
  if (files.data.length < 1) {
    res.status(400).json({ error: "At least on images is required." });
    return;
  }

  await createMemory(newMemory.data, files.data).catch((err) =>
    res.status(500).json({ success: false, error: err }),
  );

  res.json({ success: true, message: "Memory created" });
});

app.put("/memories/:id", upload.array("images"), async (req, res) => {
  const { id } = req.params;

  const newMemory = memorySchema.omit({ id: true, images: true }).safeParse({
    name: req.body.name,
    description: req.body.description,
    timestampISO: req.body.timestampISO,
  });
  if (newMemory.error) {
    res.status(400).json({ error: newMemory.error });
    return;
  }

  let files: Image[] = [];
  if (req.files.length) {
    const result = imageSchema.array().safeParse(req.files);
    if (result.error) {
      res.status(400).json({ error: result.error });
      return;
    }
    if (result.data.length < 1) {
      res.status(400).json({ error: "At least on images is required." });
      return;
    }

    files = result.data;
  }

  await updateMemory(id, newMemory.data, files).catch((err) => {
    res.status(500).json({ success: false, error: err });
  });
});

app.delete("/memories/:id", async (req, res) => {
  const { id } = req.params;
  await deleteMemory(id).catch((err) => {
    res.status(500).json({ success: false, message: err });
  });
  res.json({ success: true, message: "Memory deleted" });
});

app.put("/description", async (req, res) => {
  const { description } = req.body;

  if (!description) {
    res.status(400).json({
      error: "Please provide a description field",
    });
    return;
  }

  await updateLaneDescription(description).catch((err) => {
    res.status(500).json({ success: false, message: err });
  });
});

app.get("/images/:id", async (req, res) => {
  const { id } = req.params;

  const image = await getImage(id).catch((err) => {
    res.status(500).json({ success: false, message: err });
  });
  if (!image) {
    res.status(404).json({ success: false, message: "image not found" });
    return;
  }

  res.setHeader("Content-Type", image.mimeType);
  res.write(image.buffer);
  res.end();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
