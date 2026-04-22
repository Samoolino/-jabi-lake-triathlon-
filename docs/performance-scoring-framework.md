# Performance Scoring Framework

## 1. Purpose

The **Performance Scoring Framework** defines how the AI-Agent Workforce Operating System evaluates trust, quality, reliability, and marketplace value. It completes the marketplace layer by turning agent performance into measurable reputation.

Within the Jabi Lake AI-ESG Triathlon, scoring is used to determine which agents are trusted for critical work, which agents require oversight, how task value is converted into performance history, and how the workforce can evolve into a reusable and commercially deployable marketplace.

This framework is what transforms the system from a command architecture into a **reputation-driven AI workforce economy**.

---

## 2. Strategic Function

The scoring layer exists to answer five questions:

- which agents are reliable enough for critical tasks?
- which agents should be routed more often or less often?
- which agents are improving or degrading over time?
- how should the system represent trust and reputation?
- how can performance become economic value in a marketplace?

Without scoring, the workforce remains static.
With scoring, the workforce becomes adaptive, accountable, and commercially meaningful.

---

## 3. Scoring Principles

The scoring system should follow these principles:

### 3.1 Evidence-based
Scores must come from observable task behavior, not assumptions.

### 3.2 Task-context aware
A task completed under low risk should not be weighted the same as a task completed under high complexity or event-critical conditions.

### 3.3 Time-sensitive
Recent performance should matter more than distant historical performance.

### 3.4 Role-sensitive
Guardian agents, reporting agents, sensor agents, and execution agents should not all be judged with the same exact weighting profile.

### 3.5 Governance-aware
Scores must include ESG, safety, auditability, and escalation integrity, not only speed.

### 3.6 Explainable
A human operator should be able to understand why an agent has a given score.

---

## 4. Scoring Architecture

The framework should operate across four layers.

### 4.1 Task Score Layer
Measures performance on a single task.

### 4.2 Agent Score Layer
Aggregates task outcomes into an individual agent profile.

### 4.3 Cluster Score Layer
Measures the performance of groups of agents by functional domain.

### 4.4 Marketplace Reputation Layer
Turns scores into trust rankings, routing preference, marketplace status, and future service value.

---

## 5. Task-Level Scoring

Each completed task should produce a scorecard.

## 5.1 Core task metrics
A task score should consider:
- acceptance speed
- execution timeliness
- output quality
- confidence accuracy
- dependency handling
- collaboration quality
- escalation appropriateness
- governance compliance
- ESG sensitivity handling

## 5.2 Illustrative task score formula

```text
Task Performance Score =
(acceptance speed x 0.10) +
(execution timeliness x 0.15) +
(output quality x 0.20) +
(confidence accuracy x 0.10) +
(dependency handling x 0.10) +
(collaboration quality x 0.10) +
(escalation appropriateness x 0.10) +
(governance compliance x 0.10) +
(ESG sensitivity handling x 0.05)
```

## 5.3 Task difficulty modifier
The system should apply a context modifier based on:
- task priority level
- event state at time of execution
- dependency complexity
- safety relevance
- public visibility

Illustrative logic:

```text
Weighted Task Score = Task Performance Score x Task Difficulty Multiplier
```

Where higher-complexity and higher-risk tasks may carry larger scoring significance.

---

## 6. Agent-Level Scoring

Agent-level scoring should aggregate task results into a dynamic reputation profile.

## 6.1 Core agent dimensions
Each agent should be evaluated across:
- reliability
- responsiveness
- quality
- governance integrity
- ESG alignment
- collaboration
- resilience under strain
- recovery behavior after failure

## 6.2 Illustrative agent score formula

```text
Agent Reputation Score =
(reliability x 0.20) +
(responsiveness x 0.15) +
(output quality x 0.20) +
(governance integrity x 0.15) +
(ESG alignment x 0.10) +
(collaboration quality x 0.10) +
(resilience x 0.05) +
(recovery effectiveness x 0.05)
```

## 6.3 Recency weighting
Recent tasks should carry more importance than old tasks.

Illustrative logic:
- last 10 tasks = strongest influence
- previous 20 tasks = moderate influence
- older tasks = archival trend only

This prevents an old high score from masking current degradation.

---

## 7. Role-Specific Scoring Profiles

Different agent classes should use different weight profiles.

## 7.1 Guardian agents
Examples: Tarkwa

Weight emphasis:
- governance integrity
- routing correctness
- escalation judgment
- cross-cluster coordination
- decision traceability

## 7.2 Command agents
Examples: cluster leads

Weight emphasis:
- coordination quality
- backlog control
- reassignment effectiveness
- issue containment

## 7.3 Functional agents
Examples: Air Quality Agent, Venue Setup Agent

Weight emphasis:
- task quality
- response time
- confidence accuracy
- domain reliability

## 7.4 Reporting agents
Examples: Live Report Agent, Executive Summary Agent

Weight emphasis:
- output clarity
- timeliness
- factual consistency
- escalation sensitivity

## 7.5 Sensor/interpreter agents
Examples: Moisture Agent, Weather Interpretation Agent

Weight emphasis:
- signal accuracy
- confidence stability
- alert precision
- false positive control

---

## 8. Marketplace Reputation Bands

To make the scoring actionable, the system should convert raw scores into reputation bands.

### Suggested bands
- **Tier A / Trusted Critical**: eligible for critical and strategic tasks
- **Tier B / High Reliability**: eligible for standard and elevated tasks
- **Tier C / Operational**: eligible for normal tasks with supervision on higher-risk work
- **Tier D / Restricted**: limited assignment until improvement or validation
- **Tier E / Recovery Required**: temporarily removed from independent routing

These bands help Tarkwa and the router choose agents quickly under pressure.

---

## 9. Negative Scoring Events

Some events should directly reduce or constrain agent reputation.

### 9.1 Soft penalties
Used for:
- minor delays
- weak collaboration
- avoidable reassignment
- repeated low-priority backlog slippage

### 9.2 Hard penalties
Used for:
- unjustified failure to escalate
- governance breach
- release of unvalidated critical output
- repeated confidence misreporting
- critical-task timeout without acceptable reason

### 9.3 Recovery credits
Scores should also support recovery.

An agent may regain trust through:
- strong recent task completion
- validated recovery after prior failure
- successful handling of higher-complexity work
- improved collaboration and escalation behavior

---

## 10. Cluster and System Scoring

The marketplace should not only score individuals. It should also measure domains.

## 10.1 Cluster score factors
A cluster score should reflect:
- average agent reputation
- task backlog health
- escalation frequency
- blocked-task concentration
- recovery success rate
- governance compliance rate

## 10.2 Why cluster scores matter
Cluster scoring helps identify:
- weak functional domains
- overloaded operational areas
- underperforming coordination structures
- where Tarkwa should increase supervision

---

## 11. Trust and Routing Impact

Scores must influence routing behavior.

## 11.1 Routing consequences of reputation
- higher-reputation agents should receive more critical or sensitive tasks
- lower-reputation agents should receive more constrained or supervised tasks
- degraded agents may require validation before closure
- recovery-tier agents may be excluded from autonomous routing

## 11.2 Tarkwa use of scores
Tarkwa should use scoring to:
- choose between similarly capable agents
- decide when supervision is required
- identify rising stars and unstable performers
- tune routing thresholds during live-elevated or live-critical states

---

## 12. Economic Meaning of Scores

To become a marketplace, scoring must create economic meaning.

## 12.1 Score as market trust
An agent's score becomes a market signal for:
- trustworthiness
- assignment preference
- workload capacity
- premium task eligibility
- commercial packaging value

## 12.2 Task value and score interaction
Higher-value tasks completed well should generate larger marketplace benefit than low-impact routine tasks.

This can later support:
- premium routing
- performance-weighted compensation models
- service-level packaging
- agent subscription tiers
- protocol-level incentive design

## 12.3 Reputation economy concept
The marketplace evolves into a reputation economy where:
- work history builds trust
- trust improves routing frequency
- routing frequency improves economic opportunity
- strong performance compounds agent value over time

---

## 13. Anti-Gaming Safeguards

A scoring system must resist manipulation.

### Safeguards should include:
- no score reward for trivial task inflation
- context weighting to prevent easy-task score farming
- validation checks for self-reported success
- penalties for false confidence or unjustified closure
- caps on score spikes from low-value repetitive work
- audit trails for suspicious reputation changes

---

## 14. Human Review and Score Governance

Critical scoring outcomes should remain reviewable.

### Human review should be allowed for:
- large reputation drops
- hard penalties
- critical-task scoring disputes
- governance breach determinations
- premium tier eligibility decisions

This ensures the marketplace remains trusted and fair.

---

## 15. Minimum Data Schema

A scoring-ready agent record should include:

```yaml
agent_score:
  agent_id: agent.live_report
  reputation_tier: B
  reputation_score: 0.82
  reliability: 0.84
  responsiveness: 0.79
  output_quality: 0.88
  governance_integrity: 0.81
  esg_alignment: 0.76
  collaboration_quality: 0.83
  resilience: 0.74
  recovery_effectiveness: 0.71
  last_10_task_weighted_score: 0.85
  hard_penalty_flag: false
```

A scoring-ready task record should include:

```yaml
task_score:
  task_id: task.route_moisture_east_001
  agent_id: agent.moisture
  priority_band: P2
  task_difficulty_multiplier: 1.15
  raw_task_score: 0.80
  weighted_task_score: 0.92
  escalation_quality: 0.88
  governance_compliance: 1.00
```

---

## 16. Deployable Implementation

To make scoring operational, the platform should include:
- **Scoring Engine Service** to compute task and agent scores
- **Reputation Registry** to store score history and reputation tiers
- **Validation Interface** to support human review of contested outcomes
- **Routing Adapter** so router decisions use reputation in real time
- **Marketplace Dashboard** to visualize trusted, degraded, and rising agents

---

## 17. Product and Commercial Impact

With this framework in place, the system can support three major product directions.

### 17.1 Event technology product
Use scoring to demonstrate agent efficiency during live triathlon operations and sell the platform as event intelligence software.

### 17.2 Cross-domain orchestration framework
Use scoring to manage AI workforce quality in other sports, logistics systems, smart city operations, and ESG monitoring environments.

### 17.3 Marketplace protocol foundation
Use scoring as the base trust primitive for future protocol-level marketplaces where agents, services, and task flows are matched through reputation-aware logic.

---

## 18. Practical Outcome

With the performance scoring framework added, the system can now:
- decide who is trusted
- decide who needs supervision
- turn task history into reputation
- convert reputation into routing value
- support future economic and protocol design

This is the layer that completes the marketplace logic.

---

## 19. Closing Definition

The **Performance Scoring Framework** is the trust and value engine of the AI-Agent Workforce Operating System. It transforms task performance into reputation, turns reputation into routing power, and creates the conditions for a deployable, monetizable, and eventually protocol-capable AI workforce economy.