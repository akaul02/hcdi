You are generating a single JSON file for the **Rasoi DiagramData viewer** (React Flow + C4 drill-down).

## Output contract

- Return **JSON only** (one root object). No markdown, no extra explanation.
- Required top-level keys: `version`, `scopeLabels`, `context`, `containers`, `components`, `codeViews`.
- Use `version: 4`.
- Use stable ids across snapshots whenever entities are unchanged.

## Core constraints (must follow exactly)

some constraints:

No Generic Labels: Never use "src", "lib", "utils", or "package" as names. Look inside those folders and name the component based on its primary responsibility (e.g., "Authentication Handler" instead of "src/auth").

Resolve Ambiguity: If a component is a duplicate or a circular reference, identify its unique role in the data flow. Do not use "Same as..." labels.

Abstraction Level: Focus on the "Container" or "Component" level. I want to see how data flows between logical modules, not a 1:1 mapping of my file tree.

Self-Correction Step: Before finalizing the output, review your labels. If any label is a folder name, rename it to a functional noun phrase.

The diagram is still too cluttered and lacks a "narrative." I want you to redraw this architecture diagram specifically through the lens of a [Primary User Action, e.g., 'User completing a checkout flow'].

Follow these Storytelling Rules:

Establish a Flow: Arrange components from left to right (or top to bottom) following the life of a request. Don't just dump them in a box.

Primary vs. Secondary: Make the core components (the "Happy Path") larger or more central. Tuck utility components (like Auth or API Client) to the side or bottom as "Supporting Layers."

Action-Oriented Verbs: Instead of just "Renders" or "Wraps," use specific verbs on the lines: "Authenticates session," "Orchestrates payment," "Streams chat tokens."

Clean Layout: Ensure no text overlaps. If the diagram is too wide, use a "Layered" approach where the UI is on top, Logic in the middle, and External Systems (like Stripe) at the bottom.

Grouping: Group the internal components into a "System Boundary" and clearly separate the "External Systems."

Format: [Mermaid / C4 JSON]
Focus on this story: [e.g., How a student interacts with the coaching chat to get feedback on their practice.]

## Primary user action inference

If the user did not provide `[Primary User Action]`, infer it from the codebase by inspecting:
- entry routes/pages/controllers,
- core use-case services,
- request handlers and integrations.

Then use the inferred action as the narrative anchor across context, container, and component views.

## Rasoi C4 mapping

- **context**:
  - Must include **exactly one** node with `kind: "software-system"`.
  - Include person/external actors that begin or end the primary user action.
  - Edges should clearly describe request or data movement direction.
- **containers**:
  - Each drillable container must exist as `kind: "container"` and map to `components` key.
  - Keep one coherent request flow and avoid dumping all services equally.
- **components**:
  - Non-empty object.
  - Every key must match a container id.
  - Emphasize logical modules and boundaries, not file-by-file mapping.
- **codeViews**:
  - Optional details for important component internals.
  - Use `code-class` and `code-interface` nodes where valuable.

## Hard schema requirements (validator-enforced)

1. `version` is a number.
2. `components` is non-empty.
3. `scopeLabels` has non-empty strings for every `components` key.
4. `context.nodes` has exactly one `software-system`.
5. For each `components` key `k`:
   - `containers.nodes[k]` exists and is `kind: "container"`,
   - `containers.layouts[k]` exists,
   - `components[k]` has valid `viewBox`, `nodes`, `edges`, `layouts`.
6. `codeViews` exists and is an object.

## Quality requirements for Rasoi visuals

- Every node must have clear `title` and idiot-level clear `summary`.
- Use descriptive `techLabel` where it improves understanding.
- Edge labels must use action verbs and make direction obvious.
- Use `dashed: true` only for async/background/external dependency style links.
- Keep layout readable with minimal crossing and no label overlap intent.
- Reuse ids for same entities across views to improve drill consistency and diffs.

## Snapshot output location convention

When used in automated snapshot pipelines, write final JSON to:
- `sessions/<session-id>/vN/diagram.json`

## Final task

Analyze the provided codebase and generate one high-quality `diagram-data.json` that follows all rules above and tells a coherent story of the primary user action.
