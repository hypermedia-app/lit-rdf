# Working on lit-rdf

## Library APIs and examples

When changing library behavior or maintaining examples and consumer skills, inspect the relevant implementation in `src/components/`, `src/controllers/`, `src/converter.ts`, and `src/sort.ts`. Check `package.json` for public exports. Existing examples include `stories/BasicExamples.ts`, `stories/FilterNodeExamples.ts`, and `stories/TargetNode.elements.ts`.

Source behavior takes precedence over broad descriptions in the README or generated manifest. Keep consumer guidance focused on public APIs; repository paths and development commands belong here.

Examples should include data matching their vocabulary, every required import, and a real collection renderer when multiple nodes are selected. Explain the expected visible output and how the dataset, focus, and nested bindings connect.

## Verification

Verify new demos in a browser when practical: initial labels, collection order, filter changes including zero matches, and nested per-item values. Use `npm run test:unit -- --run` for relevant unit checks and the repository's Storybook/browser tests for new stories. Do not describe a type check as browser verification.

Do not silently modify the library to accommodate a demonstration; report an observed library limitation separately.
