# System Architecture

## 1. Purpose

The **System Architecture** defines the deployable infrastructure of the AI-Agent Workforce Operating System that powers the Jabi Lake AI-ESG Triathlon. It converts the documented operating logic into implementation-ready services, APIs, runtime flows, storage patterns, and deployment layers.

This architecture is designed so the system can:
- run the Jabi Lake Triathlon as a live proof-of-efficiency environment
- be sold as event technology
- be deployed across other sports and venue operations
- extend into logistics, city operations, and ESG systems
- evolve toward a marketplace protocol foundation

---

## 2. Architecture Goal

The goal is to build a system where:
- AI agents are registered and stateful
- tasks are created, routed, executed, monitored, scored, and archived
- Tarkwa acts as the supervisory orchestration engine
- real-time venue and operational data can trigger work
- human operators can observe and override when required
- performance history becomes marketplace reputation

---

## 3. System Overview

The platform is organized into five major planes.

### 3.1 Experience Plane
Interfaces used by humans.

### 3.2 Orchestration Plane
Decision and routing services that coordinate the workforce.

### 3.3 Intelligence Plane
State, scoring, event awareness, and risk interpretation services.

### 3.4 Data Plane
Persistent stores, logs, registries, and event streams.

### 3.5 Integration Plane
Sensors, APIs, venue data, communications, and external systems.

---

## 4. Core Service Architecture

## 4.1 Experience Plane

### Dashboard App
Primary command dashboard for live event visibility.

Functions:
- event state overview
- agent health and states
- active task queue
- alerts and escalations
- environment and venue data panels
- ESG status summaries

### Ops Console
Operational console for human controllers.

Functions:
- task creation and override
- agent assignment inspection
- escalation approval
- recovery actions
- human-in-the-loop decisions

### Admin Console
Administrative control surface.

Functions:
- agent configuration
- role definitions
- threshold settings
- scoring policies
- deployment controls

---

## 4.2 Orchestration Plane

### Tarkwa Engine
The supervisory orchestration core.

Responsibilities:
- ingest system health and event state
- supervise routing exceptions
- coordinate cross-cluster actions
- apply strategic prioritization
- trigger escalations and emergency modes
- preserve command decision traceability

### Task Router Service
Core execution logic for task assignment.

Responsibilities:
- intake tasks
- classify and score priorities
- compute agent fit
- assign tasks
- reroute or escalate when needed

### Workflow Coordinator
Handles parent-child task structures and multi-agent coordination.

Responsibilities:
- split complex tasks into subtasks
- track dependencies
- synchronize validation and reporting steps
- close workflows only when required parts are complete

---

## 4.3 Intelligence Plane

### Event State Service
Maintains the current event-wide operational condition.

Responsibilities:
- track event phase
- compute live-normal, elevated, critical states
- aggregate environment, logistics, and incident signals
- publish event-state changes to dependent services

### Agent State Service
Tracks real-time lifecycle states for agents.

Responsibilities:
- register current states
- detect stuck or unstable agents
- manage heartbeat and availability signals
- publish state transition events

### Scoring Engine
Computes task scores, agent reputation, and cluster performance.

Responsibilities:
- score completed tasks
- maintain reputation histories
- calculate routing-relevant trust metrics
- apply penalties, recovery credits, and tiering

### Risk & Governance Engine
Evaluates ESG, safety, and policy-sensitive conditions.

Responsibilities:
- detect governance exceptions
- flag ESG-sensitive tasks
- require validation where needed
- trigger human approval rules

---

## 4.4 Data Plane

### Agent Registry
Stores structured agent definitions.

Data examples:
- agent ID
- class
- capabilities
- role
- authority boundary
- scoring profile
- status metadata

### Task Registry
Stores task objects and lifecycle history.

Data examples:
- task ID
- type
- domain
- priority score
- assignment history
- state transitions
- completion metadata

### Audit Log Service
Stores traceability records.

Data examples:
- routing decisions
- Tarkwa commands
- escalations
- human overrides
- recovery actions
- score-impacting events

### Time-Series/Event Stream Store
Stores high-frequency runtime signals.

Data examples:
- agent heartbeats
- venue sensor signals
- task events
- alert streams
- dashboard state updates

### Document/Knowledge Store
Stores reusable intelligence.

Data examples:
- procedures
- incident summaries
- lessons learned
- event reports
- historical patterns

---

## 4.5 Integration Plane

### Sensor Ingestion Layer
Connects environmental and venue data.

Example inputs:
- air quality feeds
- moisture/humidity feeds
- weather feeds
- route condition observations
- crowd density or access signals

### Human Input Layer
Allows manual task and incident creation.

Example inputs:
- operator reports
- volunteer reports
- logistics issues
- sponsor requests
- emergency observations

### Notification Layer
Sends outputs to people and systems.

Example outputs:
- alert messages
- incident escalations
- reporting digests
- dashboard updates
- webhook events

### External Systems Layer
Supports future integrations.

Example targets:
- timing systems
- ticketing systems
- mapping systems
- city mobility feeds
- ESG reporting systems

---

## 5. Runtime Interaction Flow

## 5.1 Standard task flow

```text
Input Signal -> Task Router -> Classification -> Priority Score -> Agent Fit Match -> Assignment -> Agent State Update -> Task Execution -> Completion -> Scoring -> Archive
```

## 5.2 Escalation flow

```text
Task Failure or Critical Signal -> Risk/Governance Engine -> Tarkwa Engine -> Escalation Decision -> Human or Cluster Lead Review -> Reassignment or Intervention
```

## 5.3 State-awareness flow

```text
Agent Heartbeat + Task Progress + Event Signals -> Agent State Service + Event State Service -> Tarkwa Engine -> Routing and Supervisory Adjustments
```

---

## 6. API Architecture

The system should expose internal and operator-facing APIs.

## 6.1 Core API groups

### Agent APIs
Examples:
- `POST /agents`
- `GET /agents`
- `GET /agents/{agentId}`
- `PATCH /agents/{agentId}`
- `POST /agents/{agentId}/heartbeat`
- `POST /agents/{agentId}/state-transition`

### Task APIs
Examples:
- `POST /tasks`
- `GET /tasks`
- `GET /tasks/{taskId}`
- `POST /tasks/{taskId}/classify`
- `POST /tasks/{taskId}/assign`
- `POST /tasks/{taskId}/complete`
- `POST /tasks/{taskId}/escalate`
- `POST /tasks/{taskId}/reassign`

### Routing APIs
Examples:
- `POST /routing/evaluate`
- `POST /routing/assign-best-fit`
- `POST /routing/escalate`
- `POST /routing/split-task`

### State APIs
Examples:
- `GET /state/system`
- `GET /state/event`
- `GET /state/agents`
- `POST /state/event-transition`
- `POST /state/recovery`

### Scoring APIs
Examples:
- `POST /scores/task`
- `POST /scores/agent/recompute`
- `GET /scores/agents/{agentId}`
- `GET /scores/clusters/{clusterId}`
- `POST /scores/penalty`
- `POST /scores/recovery-credit`

### Tarkwa APIs
Examples:
- `GET /tarkwa/awareness`
- `POST /tarkwa/override-route`
- `POST /tarkwa/strategic-escalation`
- `POST /tarkwa/mode`

---

## 7. Event-Driven Architecture

Although APIs are required, the system should also be event-driven.

### 7.1 Key runtime events
- `task.created`
- `task.classified`
- `task.assigned`
- `task.accepted`
- `task.blocked`
- `task.completed`
- `task.escalated`
- `agent.heartbeat`
- `agent.state.changed`
- `event.state.changed`
- `system.health.degraded`
- `score.updated`
- `tarkwa.override.applied`

### 7.2 Why event-driven design matters
It allows:
- real-time dashboards
- loose coupling between services
- faster reaction to failure states
- scalable integrations
- replayable audit and simulation streams

---

## 8. Data Storage Strategy

A practical implementation should use multiple storage patterns.

### Relational store
Use for:
- agents
- tasks
- assignments
- scoring summaries
- configuration

### Event stream or message bus
Use for:
- heartbeats
- task events
- alerts
- state change notifications

### Time-series storage
Use for:
- sensor values
- health metrics
- response timings
- load and utilization trends

### Document storage
Use for:
- reports
- incident summaries
- procedures
- knowledge records

---

## 9. Runtime Modes

The platform should support at least four runtime modes.

### 9.1 Simulation mode
Used before live deployment.

Capabilities:
- inject sample tasks
- replay sensor scenarios
- test routing logic
- test recovery behavior
- validate Tarkwa oversight patterns

### 9.2 Pilot mode
Used in controlled event trials.

Capabilities:
- limited sensor integrations
- supervised routing
- more human approvals
- constrained scoring impact

### 9.3 Live mode
Used for real event operations.

Capabilities:
- real-time ingestion
- full routing engine
- active scoring
- live dashboards
- escalations and operator control

### 9.4 Post-event analysis mode
Used after operations close.

Capabilities:
- replay task flows
- analyze bottlenecks
- review failures and escalations
- update scoring and thresholds

---

## 10. Tarkwa Service-Level Design

Tarkwa must operate as a service, not just a concept.

## 10.1 Inputs to Tarkwa Engine
- event-state snapshots
- system health summaries
- task backlog risk summaries
- escalation queues
- dependency graph alerts
- cluster performance summaries
- governance exception signals

## 10.2 Outputs from Tarkwa Engine
- route overrides
- strategic priorities
- cross-cluster coordination orders
- suppression of low-priority work
- emergency mode activation
- human escalation requests
- decision log entries

## 10.3 Tarkwa operating loop

```text
Read awareness inputs -> detect instability or strategic need -> apply routing or escalation decisions -> publish commands -> record rationale
```

---

## 11. Security and Control Boundaries

The platform should include control boundaries from the start.

### Minimum boundaries
- role-based access control for operators
- write restrictions on critical overrides
- audit trail for all manual interventions
- service authentication between components
- protected governance and scoring policy changes
- restricted direct modification of reputation scores

---

## 12. Deployment Topology

A pragmatic deployment path should start simple and expand.

## 12.1 Phase 1: local prototype
Deploy as:
- one frontend app
- one backend service with modular internal components
- one relational database
- one lightweight message bus

Best for:
- simulation
- design validation
- early demos

## 12.2 Phase 2: pilot cloud deployment
Deploy as:
- dashboard frontend
- separate router, state, and scoring services
- managed database
- managed message/event system
- basic monitoring stack

Best for:
- controlled field pilots
- venue testing
- limited live operations

## 12.3 Phase 3: production deployment
Deploy as:
- multiple containerized services
- autoscaled ingestion and API layers
- managed event stream platform
- observability stack
- backup and disaster recovery flows

Best for:
- live triathlon execution
- multi-event operation
- commercial deployment

---

## 13. Suggested Repository Structure

```text
/apps
  /dashboard
  /ops-console
  /admin-console
/services
  /tarkwa-engine
  /task-router
  /workflow-coordinator
  /agent-state-service
  /event-state-service
  /scoring-engine
  /risk-governance-engine
  /agent-registry
  /task-registry
  /audit-log-service
  /integration-gateway
/packages
  /shared-types
  /event-schemas
  /scoring-models
  /routing-rules
  /ui-components
/docs
  system-architecture.md
  marketplace-core.md
  task-routing-model.md
  agent-state-model.md
  performance-scoring-framework.md
```

---

## 14. Build Sequence

A practical build sequence should be:

### Step 1
Set up shared schemas and data models.

### Step 2
Build Agent Registry and Task Registry.

### Step 3
Build Task Router and Event State Service.

### Step 4
Build Agent State Service and heartbeat handling.

### Step 5
Build Tarkwa Engine supervisory loop.

### Step 6
Build Scoring Engine and reputation registry.

### Step 7
Build dashboard and ops console.

### Step 8
Add simulation harness and replay tools.

### Step 9
Add live integrations for Jabi Lake pilot.

---

## 15. Product Outcome

With this architecture, the project becomes a deployable software platform rather than a concept-only repository.

It can become:
- a triathlon event operating system
- an event intelligence and ESG monitoring product
- a reusable AI-agent orchestration framework
- a workforce marketplace core for future protocol development

---

## 16. Closing Definition

The **System Architecture** is the deployment blueprint of the AI-Agent Workforce Operating System. It connects agents, tasks, routing, states, scoring, Tarkwa supervision, and external signals into a buildable infrastructure. It is the bridge between documentation and working software, enabling the Jabi Lake AI-ESG Triathlon to function as both a live event platform and the proving ground for a broader AI workforce economy.