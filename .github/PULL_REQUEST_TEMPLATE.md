<!--
  PR title must follow Conventional Commits, e.g.:
    feat: add map clustering to admin dashboard
    fix: prevent Bearer null header when logged out
    docs: update CONTRIBUTING setup steps
-->

## Description

<!-- What does this PR do and why? -->

## Related issue

<!-- e.g. Closes #42 -->
Closes #

## Type of change

<!-- Mark with an "x" all that apply. -->

- [ ] 🐛 Bug fix (`fix:`)
- [ ] ✨ New feature (`feat:`)
- [ ] 📝 Documentation (`docs:`)
- [ ] ♻️ Refactor (`refactor:`)
- [ ] 🎨 Style / formatting (`style:`)
- [ ] 🔧 Build / tooling / deps (`build:` / `chore:`)

## Screenshots / recording

<!-- Required for any visible UI change. Before & after if relevant. -->

| Before | After |
| --- | --- |
|  |  |

## Checklist

- [ ] PR title follows [Conventional Commits](https://www.conventionalcommits.org/).
- [ ] `pnpm run typecheck` passes.
- [ ] `pnpm run build` passes.
- [ ] My changes are focused on a single logical concern.
- [ ] I did **not** hand-edit generated code under `lib/**/generated/` (if the API changed, I updated `openapi.yaml` and re-ran `pnpm run codegen`).
- [ ] I did not manually inject `Authorization` headers (auth is handled globally — see CONTRIBUTING.md).
- [ ] Shared dependency versions go through the `catalog:` in `pnpm-workspace.yaml`.
- [ ] I read the [Contributing guide](../CONTRIBUTING.md).

## Additional notes

<!-- Anything reviewers should know: trade-offs, follow-ups, areas needing extra attention. -->
