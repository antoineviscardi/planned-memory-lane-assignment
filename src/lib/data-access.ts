import sqlite3 from "sqlite3";
import { Memory, User, memorySchema } from "./domain";
import { Image } from "./image-schema";

const db = new sqlite3.Database("memories.db");

export function setupDb() {
  db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      memory_lane_description TEXT
    )
  `);
    db.run(`
    CREATE TABLE IF NOT EXISTS memories (
      id TEXT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      timestamp_iso DATETIME NOT NULL
    )
  `);
    db.run(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      memory_id INTEGER,
      file_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      data BLOB NOT NULL,
      FOREIGN KEY(memory_id) REFERENCES memories(id)
    )
  `);
    db.run(`
    INSERT INTO users (id, name, memory_lane_description)
    VALUES ('1', 'Antoine', '')
    ON CONFLICT DO NOTHING;
  `);
  });
}

export async function getUser(): Promise<User> {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT id, name, memory_lane_description as memoryLaneDescription FROM users LIMIT 1",
      (err, rows) => {
        if (err) {
          reject(err.message);
        }
        const user = rows[0] as User;
        resolve(user);
      },
    );
  });
}

export async function getMemories(): Promise<Memory[]> {
  return new Promise((resolve, reject) => {
    const query = `
    SELECT 
      memories.id,
      memories.name,
      memories.description,
      memories.timestamp_iso AS timestampISO,
      images.id AS imageId
    FROM memories
    LEFT JOIN images ON memories.id = images.memory_id
  `;

    db.all(query, [], (err, rows) => {
      if (err) reject(err);

      const memoriesMap = new Map();

      // We ignore typing here because we valide the data before returning bellow.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (rows as any[]).forEach((row) => {
        if (!memoriesMap.has(row.id)) {
          memoriesMap.set(row.id, {
            id: row.id,
            name: row.name,
            description: row.description,
            timestampISO: new Date(row.timestampISO).toISOString(),
            images: [],
          });
        }

        if (row.imageId) {
          const memory = memoriesMap.get(row.id);
          memory.images.push(
            `${process.env.VITE_API_HOST}/images/${row.imageId}`,
          );
        }
      });

      try {
        const memories = Array.from(memoriesMap.values());
        const validatedMemories = memorySchema.array().parse(memories);
        resolve(validatedMemories);
      } catch (validationError) {
        reject(validationError);
      }
    });
  });
}

export async function createMemory(
  memory: Omit<Memory, "images">,
  images: Image[],
): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
      const { id, name, description, timestampISO } = memory;

      db.run(
        `INSERT INTO memories (id, name, description, timestamp_iso) VALUES (?, ?, ?, ?)`,
        [id, name, description, timestampISO],
        function (err) {
          if (err) {
            db.run("ROLLBACK");
            reject(err);
          }

          const insertPhoto = db.prepare(`
          INSERT INTO images (memory_id, file_name, mime_type, data)
          VALUES (?, ?, ?, ?)
        `);

          images.forEach((image) => {
            insertPhoto.run(
              id,
              image.originalname,
              image.mimetype,
              image.buffer,
            );
          });

          insertPhoto.finalize((err) => {
            if (err) {
              db.run("ROLLBACK");
              reject(err);
            }

            // Commit transaction
            db.run("COMMIT");
            resolve();
          });
        },
      );
    });
  });
}

export async function updateMemory(
  id: string,
  data: Pick<Memory, "name" | "description" | "timestampISO">,
  images: Image[] | null,
): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
      const { name, description, timestampISO } = data;

      db.run(
        `UPDATE memories SET name = ?, description = ?, timestamp_iso = ? WHERE id = ?`,
        [name, description, timestampISO, id],
        function (err) {
          if (err) {
            db.run("ROLLBACK");
            reject(err);
          }
        },
      );

      if (images && images.length) {
        db.run(`DELETE FROM images WHERE memory_id = ?`, [id]);

        const insertPhoto = db.prepare(`
        INSERT INTO images (memory_id, file_name, mime_type, data)
        VALUES (?, ?, ?, ?)
      `);

        images.forEach((image) => {
          insertPhoto.run(id, image.originalname, image.mimetype, image.buffer);
        });

        insertPhoto.finalize((err) => {
          if (err) {
            db.run("ROLLBACK");
            reject(err);
          }
        });
      }

      db.run("COMMIT");
      resolve();
    });
  });
}

export async function deleteMemory(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
      db.run(`DELETE FROM images WHERE memory_id = ?`, [id], (err) => {
        if (err) {
          reject(err);
          return;
        }
      });
      db.run("DELETE FROM memories WHERE id = ?", [id], (err) => {
        if (err) {
          reject(err);
        }
      });
      db.run("COMMIT");
      resolve();
    });
  });
}

export async function updateLaneDescription(data: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run("UPDATE users SET memory_lane_description = ?", [data], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

export async function getImage(
  id: string,
): Promise<{ mimeType: string; buffer: Buffer } | null> {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM images WHERE id = ?", [id], (err, row: any) => {
      if (err) {
        reject(err);
      }

      if (!row) {
        resolve(null);
      }

      resolve({ mimeType: row.mime_type, buffer: row.data });
    });
  });
}
