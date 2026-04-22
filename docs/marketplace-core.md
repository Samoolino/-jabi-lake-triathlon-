# AI-Agent Workforce Marketplace Core

## Purpose
The Jabi Lake AI-ESG Triathlon is the proving ground for an **AI workforce operating system**. The event validates a reusable system for agent orchestration, task routing, ESG-aware operations, and workforce-market logic.

This architecture is designed to evolve into:
- a sports-tech product
- an AI orchestration framework
- a marketplace protocol foundation

## Core Product Thesis
The deeper product is not event management alone. It is a structured operating system where:
- agents are workforce units
- tasks are economic work objects
- Tarkwa is the guardian orchestration layer
- execution is measurable and auditable
- performance history becomes marketplace reputation

## System Layers
### 1. Identity Layer
Defines each agent by:
- unique ID
- role title
- capability profile
- authority boundary
- state model
- reporting line
- performance record

### 2. Task Layer
Defines each task by:
- task ID
- category
- priority
- required capabilities
- dependencies
- due trigger
- expected output
- escalation rule

### 3. Routing Layer
Controls:
- task assignment
- multi-agent coordination
- reassignment
- escalation to Tarkwa
- human review triggers

### 4. Execution Layer
Controls:
- task acceptance
- active work state
- blocked state handling
- completion reporting
- exception handling

### 5. Governance Layer
Controls:
- ESG constraints
- compliance rules
- explainability
- audit logging
- conflict resolution
- human override boundaries

### 6. Scoring Layer
Measures:
- response time
- completion reliability
- output quality
- confidence stability
- ESG adherence
- collaboration quality

### 7. Marketplace Layer
Enables:
- agent discoverability
- capability matching
- workload balancing
- reputation history
- service packaging
- future deployment reuse

## Full Agent Architecture
Every agent should follow a common model:

```yaml
agent:
  id: agent.tarkwa
  name: Tarkwa
  class: guardian
  domain: orchestration
  role: Supreme command and governance agent
  capabilities:
    - task_routing
    - conflict_resolution
    - priority_governance
    - escalation_control
    - executive_reporting
  inputs:
    - cluster_reports
    - live_event_state
    - risk_signals
  outputs:
    - command_directives
    - escalation_orders
    - executive_summaries
```

## Agent Classes
- **Guardian Agents**: top-level supervision and protection
- **Command Agents**: cluster-level management
- **Functional Agents**: domain specialists
- **Task Agents**: narrow sub-task executors
- **Sensor/Interpreter Agents**: convert raw data into operational meaning
- **Audit/Memory Agents**: preserve records and learning

## Task Economy Logic
A task enters the system because of:
- schedule triggers
- sensor signals
- human requests
- dependencies
- incidents
- governance requirements

### Task categories
- planning
- sensing
- validation
- reporting
- escalation
- compliance
- coordination
- recovery

### Task lifecycle
```text
Created -> Classified -> Routed -> Accepted -> Active -> Completed -> Scored -> Archived
```

Alternative path:
```text
Created -> Classified -> Routed -> Blocked -> Escalated -> Reassigned
```

### Task value model
Task value should reflect:
- urgency
- complexity
- criticality
- dependency weight
- ESG sensitivity
- public impact

Illustrative formula:
```text
Task Value Score =
(urgency x 0.25) +
(complexity x 0.20) +
(criticality x 0.25) +
(ESG sensitivity x 0.15) +
(public impact x 0.15)
```

## Tarkwa Command Protocol
Tarkwa is the real orchestration protocol of the system.

### Mandatory responsibilities
Tarkwa must:
- maintain global event-state awareness
- receive cluster summaries
- classify cross-domain priorities
- route and reroute work
- detect unresolved dependencies
- enforce governance and ESG constraints
- escalate critical risks to humans
- preserve high-impact decision logs

### Command cycle
```text
Observe -> Interpret -> Prioritize -> Route -> Verify -> Escalate -> Record
```

### Threshold levels
- **Level 1 Informational**: functional-agent handling
- **Level 2 Operational**: cluster-level handling
- **Level 3 Strategic**: Tarkwa-led supervision
- **Level 4 Critical**: mandatory human escalation

### Guardrails
Tarkwa must not:
- fabricate certainty
- suppress material risk
- close critical safety issues without verification
- bypass human emergency authority
- mark uncertain outputs as validated

## Routing and Allocation Logic
Task assignment should consider:
- capability match
- current state
- workload balance
- confidence score
- required response time
- dependency graph
- governance sensitivity

Illustrative routing rule:
```text
Assign task to the highest-fit available agent
where fit = capability match + reliability score + state readiness - overload penalty
```

### Reassignment triggers
Reassign when:
- acceptance timeout is exceeded
- assigned agent becomes blocked
- dependencies fail
- confidence falls below threshold
- higher-priority tasks interrupt execution

### Human-in-the-loop triggers
Required for:
- medical or life-safety recommendations
- legal/regulatory decisions
- final event suspension decisions
- critical public statements
- major reputation-impacting actions

## State Model
### Agent states
- idle
- assigned
- active
- blocked
- waiting
- escalated
- completed
- offline

### Event states
- planning
- pre-live
- live-normal
- live-elevated
- live-critical
- recovery
- post-event

### Market states
- available capacity
- overloaded zones
- unfilled task demand
- high-risk task concentration
- scoring confidence distribution

## Scoring and Reputation Logic
Each agent should be scored on:
- acceptance speed
- completion rate
- output quality
- confidence accuracy
- escalation judgment
- ESG compliance behavior
- collaboration reliability

Illustrative formula:
```text
Agent Reputation Score =
(response time x 0.15) +
(completion reliability x 0.25) +
(output quality x 0.20) +
(governance compliance x 0.15) +
(ESG adherence x 0.10) +
(collaboration quality x 0.15)
```

## Deployable System Design
Minimum deployable components:
- **Agent Registry Service**
- **Task Registry Service**
- **Tarkwa Orchestration Engine**
- **Live Event State Engine**
- **Reporting Interface**
- **Audit Log Service**

### Suggested architecture
- frontend dashboard
- backend orchestration service
- database for agents, tasks, and logs
- sensor/API ingestion layer
- rules engine for thresholds
- scoring service for reputation

### Suggested repo modules
```text
/apps
  /dashboard
  /ops-console
/services
  /agent-registry
  /task-router
  /tarkwa-engine
  /event-state
  /scoring-engine
  /audit-log
/docs
  marketplace-core.md
  task-routing-model.md
  agent-state-model.md
  performance-scoring-framework.md
```

## Productization Path
### Phase 1
- define vision
- define organogram
- define registry
- define marketplace core

### Phase 2
- formalize routing rules
- define state machine
- define scoring logic
- define event intelligence schemas

### Phase 3
- build dashboard
- build registry service
- build orchestration engine
- simulate live task routing

### Phase 4
- deploy at Jabi Lake triathlon pilot
- collect task history and performance data
- refine thresholds and reliability models

### Phase 5
- package agent services
- support reusable deployments
- connect future venues and event classes
- evolve toward protocol-level marketplace logic

## Closing Definition
The AI-Agent Workforce Marketplace Core transforms the Jabi Lake AI-ESG Triathlon from an event concept into a deployable AI workforce system. The triathlon is the proof environment. The product is the operating system.