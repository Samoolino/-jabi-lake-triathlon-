# Agent State Model

## 1. Purpose

The **Agent State Model** defines how the AI-Agent Workforce Operating System behaves over time. It turns the marketplace architecture and task-routing logic into a living runtime system.

This document explains:
- agent lifecycle transitions
- event-state interaction
- system health monitoring
- failure detection and recovery patterns
- Tarkwa's awareness model

The goal is to make the workforce system stateful, observable, and recoverable.

---

## 2. Why State Matters

Without a state model, agents are only named functions. With a state model, agents become monitored workforce units whose behavior can be tracked, evaluated, and corrected in real time.

The state model enables the system to:
- know which agents are ready
- detect which agents are overloaded or blocked
- monitor live execution health
- prevent silent failures
- support reassignment and escalation
- give Tarkwa a true system-awareness layer

---

## 3. Agent Lifecycle States

Every agent in the system should support a standard runtime lifecycle.

### 3.1 Core states
- **idle**: agent is available and not currently assigned active work
- **assigned**: agent has received a task but has not yet accepted execution
- **active**: agent is currently working on one or more accepted tasks
- **waiting**: agent is paused pending dependency resolution, validation, or external input
- **blocked**: agent cannot proceed because of an internal or external constraint
- **escalated**: agent has raised an issue to a higher authority or Tarkwa
- **completed**: agent has completed a task and submitted output
- **offline**: agent is unavailable due to system, access, or health failure

### 3.2 Optional extended states
- **validating**: agent is checking output quality or dependency output before closure
- **recovering**: agent is being restored after a fault or blocked condition
- **degraded**: agent is operational but below normal confidence or performance threshold

---

## 4. Lifecycle Transition Logic

Agents must not move between states arbitrarily. Transitions should be governed by explicit rules.

## 4.1 Standard transitions

```text
idle -> assigned
assigned -> active
assigned -> escalated
active -> waiting
active -> blocked
active -> completed
waiting -> active
waiting -> escalated
blocked -> recovering
blocked -> escalated
recovering -> idle
recovering -> assigned
completed -> idle
offline -> recovering
recovering -> offline
```

## 4.2 Transition explanations

### idle -> assigned
Occurs when the routing engine matches a task to the agent.

### assigned -> active
Occurs when the agent accepts the task and begins execution.

### assigned -> escalated
Occurs when the task cannot be accepted due to policy conflict, confidence failure, or capability mismatch.

### active -> waiting
Occurs when the agent needs another input, dependency, validation, or upstream confirmation.

### active -> blocked
Occurs when execution cannot continue because of a fault, missing dependency, or contradiction in required inputs.

### active -> completed
Occurs when the task output has been generated and submitted.

### waiting -> active
Occurs when the required dependency or approval arrives.

### waiting -> escalated
Occurs when the waiting period breaches threshold or dependency risk grows.

### blocked -> recovering
Occurs when a recovery procedure is initiated.

### blocked -> escalated
Occurs when the block is critical, persistent, or cross-domain.

### recovering -> idle
Occurs when the agent is restored and has no pending assignment.

### recovering -> assigned
Occurs when the agent is restored and immediately receives a queued task.

### completed -> idle
Occurs after task closure and scoring preparation.

### offline -> recovering
Occurs when the system attempts to restore an unavailable agent.

### recovering -> offline
Occurs when restoration fails or instability persists.

---

## 5. Task-State and Agent-State Interaction

Agent state must remain coupled to task state.

### 5.1 Interaction principles
- if a task is assigned, the target agent must be in **assigned** or **active** state
- if a task becomes blocked, the owning agent should move to **waiting**, **blocked**, or **escalated** depending on cause
- if a task is completed, the agent may return to **idle** only after output submission is registered
- if a task is escalated, the originating agent keeps traceability to the escalation event

### 5.2 Multi-task rule
If an agent handles multiple tasks, state should be computed from dominant workload condition:
- any critical blocked task can force **blocked** or **degraded**
- multiple high-priority active tasks may force **active** with overload flag
- unresolved critical escalation may force **escalated** as dominant state

---

## 6. Event-State Interaction Model

The event itself has runtime states, and agent behavior should adapt to them.

### 6.1 Event states
- planning
- pre-live
- live-normal
- live-elevated
- live-critical
- recovery
- post-event

### 6.2 Behavior adaptation by event state

#### planning
Agents prioritize planning, design, setup, and governance preparation.

#### pre-live
Agents prioritize readiness checks, verification, access assessment, and risk surfacing.

#### live-normal
Agents prioritize routine monitoring, reporting, and event continuity.

#### live-elevated
Agents raise watch intensity, shorten timeout windows, and increase Tarkwa oversight.

#### live-critical
Only essential and critical tasks should remain active. Low-priority work should be paused or deferred.

#### recovery
Agents shift to stabilization, reporting, cleanup, and lessons capture.

#### post-event
Agents focus on closure, scoring, archival, and performance analysis.

---

## 7. System Health Monitoring

The operating system needs a health layer that measures whether the workforce is functioning correctly.

## 7.1 Health dimensions
System health should be monitored across five dimensions:
- **availability**: are agents online and reachable?
- **responsiveness**: are agents accepting and progressing tasks on time?
- **quality**: are outputs meeting confidence and validation thresholds?
- **stability**: are state transitions normal or volatile?
- **governance integrity**: are safety, ESG, and audit rules being respected?

## 7.2 Core health indicators
Examples of indicators:
- percentage of agents in idle, active, blocked, offline states
- average task acceptance time
- percentage of tasks overdue
- escalation rate per cluster
- blocked-task concentration by domain
- confidence drop frequency
- recovery success rate
- human override frequency

## 7.3 Health status bands
- **green**: healthy and stable operation
- **amber**: elevated strain or localized faults
- **red**: critical degradation or cross-domain instability

---

## 8. Failure Detection Patterns

The system must detect failure before it becomes operational damage.

## 8.1 Failure types

### Silent failure
An agent appears assigned but produces no meaningful progress signal.

Detection signals:
- no acceptance within timeout
- no state change after assignment
- no heartbeat or progress note

### Blocked dependency failure
An agent cannot proceed because another required task or input has stalled.

Detection signals:
- waiting state exceeds threshold
- unresolved parent or sibling task
- dependency timeout breach

### Confidence degradation failure
The agent continues to operate, but output quality or confidence declines.

Detection signals:
- repeated low-confidence outputs
- validation failure frequency
- inconsistency across repeated assessments

### Overload failure
An agent is assigned too many active or high-priority tasks.

Detection signals:
- task queue saturation
- repeated late acceptances
- increasing completion delay
- elevated reassignment rate

### Cascading failure
One blocked or degraded agent causes downstream failures across multiple agents or clusters.

Detection signals:
- sudden increase in waiting agents
- multiple dependency failures from the same origin
- cross-cluster escalation spike

### Governance failure
The system begins to violate reporting, safety, ESG, or audit requirements.

Detection signals:
- missing decision logs
- unresolved critical risk notices
- incomplete approval chain
- output released without required validation

---

## 9. Recovery Patterns

The state model must support recovery, not only detection.

## 9.1 Local recovery
Used when failure is isolated to one agent or one narrow task.

Actions:
- retry task acceptance
- refresh dependency check
- reduce concurrent task load
- revalidate inputs
- restart local task routine

## 9.2 Reassignment recovery
Used when an agent cannot recover fast enough.

Actions:
- mark agent as blocked or degraded
- reroute task to alternate agent
- preserve failure cause in audit log
- notify originating cluster lead

## 9.3 Cluster recovery
Used when multiple related agents are affected in one domain.

Actions:
- cluster lead takes temporary coordination control
- suspend nonessential tasks in affected cluster
- prioritize critical backlog
- request Tarkwa review

## 9.4 Strategic recovery
Used when failure spreads across domains or threatens event continuity.

Actions:
- Tarkwa enters direct supervisory mode
- low-priority tasks paused system-wide
- critical routing thresholds tightened
- human oversight notified
- emergency summary generated

## 9.5 Post-failure learning
After recovery, the system should record:
- cause of failure
- impacted tasks
- duration of degradation
- action taken
- whether reassignment worked
- what threshold should be refined next time

---

## 10. Tarkwa's Awareness Model

Tarkwa must not operate as a passive label. Tarkwa requires a real-time awareness model built from system state, task flow, and event conditions.

## 10.1 Awareness inputs
Tarkwa should continuously ingest:
- agent state distribution
- task backlog status
- priority concentration
- escalation volume
- blocked dependency graph
- event state
- environment and venue anomalies
- governance exception signals
- human intervention frequency

## 10.2 Awareness questions Tarkwa must always answer
At any time, Tarkwa should be able to determine:
- which agents are healthy and available?
- where are the current bottlenecks?
- which clusters are overloaded?
- what critical tasks are at risk?
- are there unresolved dependency chains?
- has event state shifted from normal to elevated or critical?
- are governance or ESG constraints being breached?
- is human oversight required now?

## 10.3 Tarkwa operational modes
Tarkwa should support four awareness modes.

### Passive observation mode
Used during stable operation. Tarkwa watches metrics and approves normal routing.

### Active supervision mode
Used when localized issues rise. Tarkwa increases validation and routing oversight.

### Direct command mode
Used during cross-cluster or strategic issues. Tarkwa reroutes work and suppresses nonessential actions.

### Emergency escalation mode
Used during critical instability. Tarkwa prioritizes life-safety, governance, and human escalation.

---

## 11. Awareness-Driven Actions

Tarkwa should change behavior based on observed state conditions.

### If blocked agents exceed threshold
- identify common cause
- trigger cluster review
- reroute high-priority tasks
- downgrade nonessential work

### If overload concentration appears in one cluster
- re-balance assignments
- pause lower-value tasks
- request support from adjacent cluster agents where possible

### If confidence degradation rises
- require validation before closure
- increase human review for sensitive outputs
- flag unstable agents as degraded

### If event state becomes live-critical
- enter direct command mode
- shorten timeout windows
- tighten escalation thresholds
- suspend deferred tasks

---

## 12. Minimum State Schema

A runtime-aware agent record should include:

```yaml
agent_runtime:
  agent_id: agent.moisture
  current_state: active
  dominant_task_id: task.route_moisture_east_001
  workload_count: 3
  overload_flag: false
  confidence_status: stable
  last_transition_at: 2026-04-22T10:15:00Z
  last_heartbeat_at: 2026-04-22T10:16:10Z
  escalation_count: 0
  recovery_status: none
  cluster: environmental_sensing
```

A system health snapshot should include:

```yaml
system_health:
  status_band: amber
  event_state: live-elevated
  blocked_agents: 2
  overloaded_agents: 1
  critical_tasks_at_risk: 3
  unresolved_dependency_chains: 2
  human_review_queue: 1
```

---

## 13. Deployable Runtime Implementation

To make this state model operational, the system should include:
- **Agent State Service** for lifecycle tracking
- **Heartbeat Monitor** for activity and silent failure detection
- **System Health Engine** for health status computation
- **Dependency Graph Monitor** for blocked-chain detection
- **Recovery Controller** for retry, reassignment, and escalation actions
- **Tarkwa Awareness Engine** for supervisory state interpretation

---

## 14. Practical Outcome

With this model, the workforce system becomes a living runtime environment.

It can:
- detect whether agents are available or unstable
- track whether work is progressing or stuck
- spot overload before collapse happens
- recover from isolated or cascading failure
- give Tarkwa true situational awareness
- support a deployable operating system rather than a static concept

---

## 15. Closing Definition

The **Agent State Model** is the runtime life system of the AI-Agent Workforce Operating System. It defines how agents transition, how health is observed, how failure is detected and recovered, and how Tarkwa maintains live awareness across the Jabi Lake AI-ESG Triathlon. It is the layer that turns structured logic into operational continuity.