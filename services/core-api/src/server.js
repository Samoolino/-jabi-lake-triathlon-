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

function clampScore(value, fallback = 0.7) {
  const numeric = typeof value === 'number' ? value : fallback;
  return Math.max(0, Math.min(1, numeric));
}

function deriveReputationTier(score) {
  if (score >= 0.9) return 'A';
  if (score >= 0.75) return 'B';
  if (score >= 0.6) return 'C';
  if (score >= 0.4) return 'D';
  return 'E';
}

function normalizeAgent(payload = {}) {
  const reputationScore = clampScore(payload.reputationScore, 0.7);
  return {
    id: payload.id,
    name: payload.name,
    role: payload.role,
    capabilities: Array.isArray(payload.capabilities) ? payload.capabilities : [],
    state: payload.state || 'idle',
    workload: Number.isFinite(payload.workload) ? payload.workload : 0,
    health: payload.health || 'green',
    reliability: clampScore(payload.reliability, reputationScore),
    responsiveness: clampScore(payload.responsiveness, reputationScore),
    governanceIntegrity: clampScore(payload.governanceIntegrity, reputationScore),
    reputationScore,
    reputationTier: payload.reputationTier || deriveReputationTier(reputationScore),
    scoringHistory: Array.isArray(payload.scoringHistory) ? payload.scoringHistory : [],
    completedTaskCount: Number.isFinite(payload.completedTaskCount) ? payload.completedTaskCount : 0,
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
    taskScore: payload.taskScore || null,
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
    agent.reputationTier = deriveReputationTier(agent.reputationScore);
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

function computeReputationComponent(agent) {
  return (
    agent.reputationScore * 0.5 +
    agent.reliability * 0.2 +
    agent.responsiveness * 0.15 +
    agent.governanceIntegrity * 0.15
  );
}

function computeAgentFit(agent, task) {
  const capabilityFit = computeCapabilityFit(agent, task);
  const workloadReadiness = computeWorkloadReadiness(agent);
  const stateReadiness = agent.state === 'blocked' ? 0 : agent.state === 'idle' ? 1 : 0.7;
  const healthScore = agent.health === 'green' ? 1 : agent.health === 'amber' ? 0.6 : 0;
  const reputationComponent = computeReputationComponent(agent);

  return (
    capabilityFit * 0.35 +
    workloadReadiness * 0.20 +
    stateReadiness * 0.10 +
    healthScore * 0.10 +
    reputationComponent * 0.25
  );
}

function getEligibleAgents(task) {
  return agents.filter((agent) => {
    if (agent.health === 'red') return false;
    if (task.priority >= 0.85 && agent.reputationScore < 0.75) return false;
    return true;
  });
}

function pickBestAgent(task) {
  const ranked = getEligibleAgents(task)
    .map((agent) => ({
      agent,
      fit: computeAgentFit(agent, task),
      reputationComponent: computeReputationComponent(agent),
    }))
    .filter((entry) => entry.fit > 0)
    .sort((a, b) => b.fit - a.fit);

  return ranked[0] || null;
}

function computeTaskScore(task, agent) {
  const acceptanceSpeed = 0.85;
  const executionTimeliness = task.priority >= 0.85 && eventState === 'live-critical' ? 0.7 : 0.9;
  const outputQuality = clampScore(agent.reliability, 0.75);
  const confidenceAccuracy = clampScore(agent.reputationScore, 0.75);
  const dependencyHandling = 0.8;
  const collaborationQuality = clampScore(agent.responsiveness, 0.75);
  const escalationAppropriateness = task.state === 'blocked' ? 0.6 : 0.9;
  const governanceCompliance = clampScore(agent.governanceIntegrity, 0.75);
  const esgSensitivityHandling = task.priority >= 0.85 ? governanceCompliance : 0.85;

  const rawTaskScore =
    acceptanceSpeed * 0.10 +
    executionTimeliness * 0.15 +
    outputQuality * 0.20 +
    confidenceAccuracy * 0.10 +
    dependencyHandling * 0.10 +
    collaborationQuality * 0.10 +
    escalationAppropriateness * 0.10 +
    governanceCompliance * 0.10 +
    esgSensitivityHandling * 0.05;

  const difficultyMultiplier = task.priority >= 0.85 ? 1.15 : task.priority >= 0.6 ? 1.05 : 1;
  const weightedTaskScore = clampScore(rawTaskScore * difficultyMultiplier, rawTaskScore);

  return {
    rawTaskScore: Number(rawTaskScore.toFixed(3)),
    weightedTaskScore: Number(weightedTaskScore.toFixed(3)),
    difficultyMultiplier,
    scoredAt: nowIso(),
  };
}

function applyTaskScoreToAgent(agent, taskScore) {
  const nextReputation = clampScore(agent.reputationScore * 0.8 + taskScore.weightedTaskScore * 0.2, agent.reputationScore);
  const nextReliability = clampScore(agent.reliability * 0.85 + taskScore.rawTaskScore * 0.15, agent.reliability);
  const nextResponsiveness = clampScore(agent.responsiveness * 0.85 + taskScore.rawTaskScore * 0.15, agent.responsiveness);
  const nextGovernance = clampScore(agent.governanceIntegrity * 0.85 + taskScore.weightedTaskScore * 0.15, agent.governanceIntegrity);

  agent.reputationScore = Number(nextReputation.toFixed(3));
  agent.reliability = Number(nextReliability.toFixed(3));
  agent.responsiveness = Number(nextResponsiveness.toFixed(3));
  agent.governanceIntegrity = Number(nextGovernance.toFixed(3));
  agent.reputationTier = deriveReputationTier(agent.reputationScore);
  agent.completedTaskCount += 1;
  agent.scoringHistory.push({
    weightedTaskScore: taskScore.weightedTaskScore,
    rawTaskScore: taskScore.rawTaskScore,
    scoredAt: taskScore.scoredAt,
  });
  agent.scoringHistory = agent.scoringHistory.slice(-10);
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

  const rankedAgents = [...agents]
    .sort((a, b) => b.reputationScore - a.reputationScore)
    .map((agent) => ({
      id: agent.id,
      name: agent.name,
      reputationScore: agent.reputationScore,
      reputationTier: agent.reputationTier,
      state: agent.state,
      health: agent.health,
      completedTaskCount: agent.completedTaskCount,
    }));

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
    routingPreference: {
      trustedAgents: rankedAgents.slice(0, 3),
      degradedAgents: rankedAgents.filter((agent) => agent.reputationScore < 0.6),
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

app.post('/scores/agents/:agentId', (req, res) => {
  const agent = agents.find((entry) => entry.id === req.params.agentId);
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  if (req.body.reputationScore !== undefined) {
    agent.reputationScore = clampScore(req.body.reputationScore, agent.reputationScore);
  }
  if (req.body.reliability !== undefined) {
    agent.reliability = clampScore(req.body.reliability, agent.reliability);
  }
  if (req.body.responsiveness !== undefined) {
    agent.responsiveness = clampScore(req.body.responsiveness, agent.responsiveness);
  }
  if (req.body.governanceIntegrity !== undefined) {
    agent.governanceIntegrity = clampScore(req.body.governanceIntegrity, agent.governanceIntegrity);
  }

  agent.reputationTier = deriveReputationTier(agent.reputationScore);
  res.json(agent);
});

app.get('/scores/agents/:agentId', (req, res) => {
  const agent = agents.find((entry) => entry.id === req.params.agentId);
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  res.json({
    id: agent.id,
    name: agent.name,
    reputationScore: agent.reputationScore,
    reputationTier: agent.reputationTier,
    reliability: agent.reliability,
    responsiveness: agent.responsiveness,
    governanceIntegrity: agent.governanceIntegrity,
    completedTaskCount: agent.completedTaskCount,
    recentScores: agent.scoringHistory,
    routingWeight: Number(computeReputationComponent(agent).toFixed(3)),
  });
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
    reputationComponent: Number(best.reputationComponent.toFixed(3)),
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
      task.taskScore = computeTaskScore(task, assignedAgent);
      applyTaskScoreToAgent(assignedAgent, task.taskScore);
    }
  });

  syncAgentWorkloads();
  updateTarkwaMode();
}, TARKWA_TICK_MS);

app.listen(PORT, () => {
  console.log(`Core API running on port ${PORT}`);
});
