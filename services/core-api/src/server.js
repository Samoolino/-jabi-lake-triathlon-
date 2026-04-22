const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());

const DATA_PATH = path.join(__dirname, '../../../data/runtime.json');

function loadState() {
  try {
    if (fs.existsSync(DATA_PATH)) {
      const raw = fs.readFileSync(DATA_PATH);
      return JSON.parse(raw);
    }
  } catch (e) {}
  return { agents: [], tasks: [], eventState: 'planning' };
}

function saveState() {
  fs.writeFileSync(DATA_PATH, JSON.stringify({ agents, tasks, eventState }, null, 2));
}

let { agents, tasks, eventState } = loadState();
let tarkwaMode = 'passive_observation';

// (rest of file unchanged, but add saveState() after all mutations)

app.post('/agents', (req, res) => {
  const agent = normalizeAgent(req.body);
  agents.push(agent);
  saveState();
  res.json(agent);
});

app.post('/tasks', (req, res) => {
  const task = normalizeTask(req.body);
  tasks.push(task);
  saveState();
  res.json(task);
});

app.post('/routing/mark-failed', (req, res) => {
  const task = getTaskById(req.body.taskId);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  task.state = 'failed';
  cascadeBlockFrom(task.id, task.id);
  saveState();
  return res.json({ task });
});

setInterval(() => {
  // existing runtime logic
  saveState();
}, 5000);

app.listen(3000, () => console.log('Core API running with persistence'));
