# ExecPlans

An ExecPlan is a living implementation document for work that cannot be understood or safely completed as a small isolated change.

Create one for a major feature, structural refactor, storage migration, external integration, real billing, AI backend, or significant data-model change. Store plans in `docs/plans/` using the next numeric prefix.

Every plan must contain: Goal, Context, Current State, Scope, Non-Goals, Architecture, Files/Areas Affected, Milestones, Testing, Security Considerations, Risks, Progress, Decisions, and Final Outcome.

Update progress while implementing. Record discoveries and decisions when they happen. At completion, reconcile the final outcome with code and project-state documentation. A plan describes execution; it does not replace an ADR or product requirements.
