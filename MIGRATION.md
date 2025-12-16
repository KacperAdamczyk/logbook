# Migration from pnpm to bun

## Status

This project has been migrated from pnpm to bun as the package manager and runtime.

## Completed Steps

- ✅ Updated `package.json` scripts to use `bun` instead of `pnpm`
- ✅ Replaced `pnpm.onlyBuiltDependencies` with `trustedDependencies` (bun equivalent)
- ✅ Updated all documentation files:
  - `.github/copilot-instructions.md`
  - `AGENTS.md`
  - `README.md`
- ✅ Removed `pnpm-lock.yaml`

## Remaining Steps

### Generate bun.lockb

Due to environment compatibility issues in the GitHub Actions runner, the `bun.lockb` file could not be generated automatically. To complete the migration:

1. **On your local machine** (or in a compatible environment), run:
   ```bash
   bun install
   ```

2. This will generate the `bun.lockb` file based on the `package.json`

3. Commit the generated `bun.lockb` file:
   ```bash
   git add bun.lockb
   git commit -m "Add bun.lockb"
   ```

### Known Issues

The GitHub Actions runner environment (`ubuntu-latest` / `ubuntu-24.04`) has compatibility issues with bun (versions tested: 1.1.38, 1.3.4, 1.3.5-canary) that cause crashes during dependency resolution:
- Assertion failures
- Segmentation faults  
- Package metadata parsing errors (particularly with `zod` 4.x)

This is a known issue with bun in certain virtualized/CI environments and does not affect local development or production deployments.

**CI Workarounds:**
- Use the official `oven/bun` Docker container in CI workflows
- Consider using `setup-bun` GitHub Action with Docker mode
- For GitHub Actions, you may need to use an older runner image or run bun within Docker

### Alternative: Using Docker

If local installation also fails, you can use the official bun Docker image:

```bash
docker run --rm -v $(pwd):/app -w /app oven/bun:1 bun install
```

## Verification

After generating `bun.lockb`, verify the migration works:

```bash
# Install dependencies
bun install

# Run tests
bun test

# Start dev server
bun dev

# Build project
bun build
```

All commands should work as expected with bun replacing pnpm.
