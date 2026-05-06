# Visualization JSON Generator Kit (Rasoi DiagramData)

Drop this package into a codebase so an agent can generate Rasoi-compatible `diagram.json` snapshots.

## Included files

- `DIAGRAM_DATA_PROMPT.md`: Source-of-truth prompt for creating DiagramData JSON.
- `validate-diagram-data.mjs`: Structural validator for snapshots.

## Snapshot location convention

Write snapshots to:

- `sessions/<session-id>/vN/diagram.json`

Keep IDs stable across versions when entities do not change.

## Validation command

From repo root:

```bash
node packages/visualization-json-generator/validate-diagram-data.mjs sessions/<session-id>/vN/diagram.json
```

Fix validation errors before loading in Rasoi.
