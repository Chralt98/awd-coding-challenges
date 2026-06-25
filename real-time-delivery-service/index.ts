import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

type Job = {
  id: string;
  progress: number; // 0–100
  status: "running" | "done";
  downloadUrl?: string;
};

const jobs = new Map<string, Job>();

app.get("/api/exports/:id", (req, res) => {
  const job = jobs.get(req.params.id);

  if (!job) {
    res.status(404).json({ error: "unknown job" });
    return;
  }

  res.json({
    status: job.status,
    progress: job.progress,
    downloadUrl: job.downloadUrl,
  });
});

app.listen(3000, () =>
  console.log("Server running on port 3000: http://localhost:3000"),
);
