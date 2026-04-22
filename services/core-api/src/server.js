const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const TARKWA_TICK_MS = 5000;

let agents = [];
let tasks = [];
let eventState = 'planning';
let tarkwaMode = 'passive_observation';

function nowIso() {
  return new Date().toISOString();
}

function normalizeAgent(payload = {}) {
  return {
    id: payload.id,
    name: payload.name,
    role: payload.role,
    capabilities: Array.isArray(payload.capabilities) ? payload.capabilities : [],
    state: payload.state || 'idle',
    workload: Number.isFinite(payload.workload) ? payload.workload : 0,
    health: payload.health || 'green',
    lastHeartbeatAt: payload.lastHeartbeatAt || nowIso(),
    createdAt: payload.createdAt || nowIso(),
  };
}

function normalizeTask(payload = {}) {
  return {
    id: payload.id,
    title: payload.title,
    priority: typeof payload.priority === 'number' ? payload.priority : 0.5,
    requiredCapabilities: Array.isArray(payload.requiredCapabilities)
      ? payload.requiredCapabilities
      : [],
    state: payload.state || 'created',
    assignedAgent: payload.assignedAgent || null,
    progress: payload.progress || 0,
    createdAt: payload.createdAt || nowIso(),
    updatedAt: payload.updatedAt || nowIso(),
  };
}

function recalculateAgentState(agent) {
  if (agent.health === 'red') {
    agent.state = 'blocked';
    return agent;
  }
  if (agent.workload <= 0) {
    agent.state = 'idle';
  } else if (agent.workload >= 3) {
    agent.state = 'active';
    agent.health = agent.health === 'red' ? 'red' : 'amber';
  } else {
    agent.state = 'active';
  }
  return agent;
}

function getOpenTasksForAgent(agentId) {
  return tasks.filter(
    (task) => task.assignedAgent === agentId && !['completed', 'failed'].includes(task.state)
  );
}

function syncAgentWorkloads() {
  agents = agents.map((agent) => {
    agent.workload = getOpenTasksForAgent(agent.id).length;
    return recalculateAgentState(agent);
  });
}

function computeCapabilityFit(agent, task) {
  if (!task.requiredCapabilities.length) return 0.4;
  const matched = task.requiredCapabilities.filter((cap) => agent.capabilities.includes(cap)).length;
  return matched / task.requiredCapabilities.length;
}

function computeWorkloadReadiness(agent) {
  if (agent.health === 'red') return 0;
  if (agent.workload === 0) return 1;
  if (agent.workload === 1) return 0.8;
  if (agent.workload === 2) return 0.5;
  return 0.2;
}

function computeAgentFit(agent, task) {
  const capabilityFit = computeCapabilityFit(agent, task);
  const workloadReadiness = computeWorkloadReadiness(agent);
  const stateReadiness = agent.state === 'blocked' ? 0 : agent.state === 'idle' ? 1 : 0.7;
  const healthScore = agent.health === 'green' ? 1 : agent.health === 'amber' ? 0.6 : 0;

  return (
    capabilityFit * 0.45 +
    workloadReadiness * 0.25 +
    stateReadiness * 0.15 +
    healthScore * 0.15
  );
}

function pickBestAgent(task) {
  const ranked = agents
    .map((agent) => ({ agent, fit: computeAgentFit(agent, task) }))
    .filter((entry) => entry.fit > 0)
    .sort((a, b) => b.fit - a.fit);

  return ranked[0] || null;
}

function updateTarkwaMode() {
  const blockedTasks = tasks.filter((task) => task.state === 'blocked').length;
  const activeTasks = tasks.filter((task) => task.state === 'active').length;
  const amberAgents = agents.filter((agent) => agent.health === 'amber').length;
  const redAgents = agents.filter((agent) => agent.health === 'red').length;

  if (eventState === 'live-critical' || redAgents > 0 || blockedTasks >= 2) {
    tarkwaMode = 'emergency_escalation';
  } else if (eventState === 'live-elevated' || amberAgents >= 2 || activeTasks >= 4) {
    tarkwaMode = 'direct_command';
  } else if (activeTasks > 0 || amberAgents > 0) {
    tarkwaMode = 'active_supervision';
  } else {
    tarkwaMode = 'passive_observation';
  }
}

function buildAwareness() {
  syncAgentWorkloads();
  updateTarkwaMode();

  return {
    eventState,
    tarkwaMode,
    totals: {
      agents: agents.length,
      tasks: tasks.length,
      openTasks: tasks.filter((task) => !['completed', 'failed'].includes(task.state)).length,
      blockedTasks: tasks.filter((task) => task.state === 'blocked').length,
      completedTasks: tasks.filter((task) => task.state === 'completed').length,
    },
    agentStates: {
      idle: agents.filter((agent) => agent.state === 'idle').length,
      active: agents.filter((agent) => agent.state === 'active').length,
      blocked: agents.filter((agent) => agent.state === 'blocked').length,
    },
    healthBands: {
      green: agents.filter((agent) => agent.health === 'green').length,
      amber: agents.filter((agent) => agent.health === 'amber').length,
      red: agents.filter((agent) => agent.health === 'red').length,
    },
    prioritySummary: {
      critical: tasks.filter((task) => task.priority >= 0.85 && task.state !== 'completed').length,
      elevated: tasks.filter((task) => task.priority >= 0.6 && task.priority < 0.85 && task.state !== 'completed').length,
      normal: tasks.filter((task) => task.priority < 0.6 && task.state !== 'completed').length,
    },
  };
}

app.post('/agents', (req, res) => {
  if (!req.body.id || !req.body.name || !req.body.role) {
    return res.status(400).json({ error: 'id, name, and role are required' });
  }

  if (agents.some((agent) => agent.id === req.body.id)) {
    return res.status(409).json({ error: 'Agent with this id already exists' });
  }

  const agent = normalizeAgent(req.body);
  agents.push(agent);
  syncAgentWorkloads();
  res.status(201).json(agent);
});

app.get('/agents', (req, res) => {
  syncAgentWorkloads();
  res.json(agents);
});

app.post('/agents/:agentId/heartbeat', (req, res) => {
  const agent = agents.find((entry) => entry.id === req.params.agentId);
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  agent.lastHeartbeatAt = nowIso();
  if (req.body.health && ['green', 'amber', 'red'].includes(req.body.health)) {
    agent.health = req.body.health;
  }
  recalculateAgentState(agent);
  res.json(agent);
});

app.post('/tasks', (req, res) => {
  if (!req.body.id || !req.body.title) {
    return res.status(400).json({ error: 'id and title are required' });
  }

  if (tasks.some((task) => task.id === req.body.id)) {
    return res.status(409).json({ error: 'Task with this id already exists' });
  }

  const task = normalizeTask(req.body);
  tasks.push(task);
  res.status(201).json(task);
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/routing/assign', (req, res) => {
  const task = tasks.find((entry) => entry.id === req.body.taskId);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (!['created', 'blocked'].includes(task.state)) {
    return res.status(400).json({ error: 'Task is not assignable in its current state' });
  }

  syncAgentWorkloads();
  const best = pickBestAgent(task);
  if (!best) {
    task.state = 'blocked';
    task.updatedAt = nowIso();
    updateTarkwaMode();
    return res.status(409).json({ error: 'No eligible agent available', task });
  }

  task.assignedAgent = best.agent.id;
  task.state = 'assigned';
  task.updatedAt = nowIso();

  syncAgentWorkloads();
  updateTarkwaMode();

  return res.json({
    task,
    selectedAgent: best.agent,
    fitScore: Number(best.fit.toFixed(3)),
  });
});

app.post('/state/event-transition', (req, res) => {
  const allowed = ['planning', 'pre-live', 'live-normal', 'live-elevated', 'live-critical', 'recovery', 'post-event'];
  if (!allowed.includes(req.body.eventState)) {
    return res.status(400).json({ error: 'Invalid eventState' });
  }

  eventState = req.body.eventState;
  updateTarkwaMode();
  res.json({ eventState, tarkwaMode });
});

app.get('/tarkwa/awareness', (req, res) => {
  res.json(buildAwareness());
});

setInterval(() => {
  syncAgentWorkloads();

  tasks.forEach((task) => {
    if (task.state === 'assigned') {
      task.state = 'active';
      task.progress = 0.5;
      task.updatedAt = nowIso();
      return;
    }

    if (task.state === 'active') {
      const assignedAgent = agents.find((agent) => agent.id === task.assignedAgent);
      if (!assignedAgent || assignedAgent.health === 'red') {
        task.state = 'blocked';
        task.updatedAt = nowIso();
        return;
      }

      if (task.priority >= 0.85 && eventState === 'live-critical') {
        task.progress = 0.75;
        task.updatedAt = nowIso();
        return;
      }

      task.state = 'completed';
      task.progress = 1;
      task.updatedAt = nowIso();
    }
  });

  syncAgentWorkloads();
  updateTarkwaMode();
}, TARKWA_TICK_MS);

app.listen(PORT, () => {
  console.log(`Core API running on port ${PORT}`);
});
