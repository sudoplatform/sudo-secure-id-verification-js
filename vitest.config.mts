import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['test/**/*.spec.ts'],
        exclude: ['node_modules', 'lib', 'cjs'],
        setupFiles: ['./test/setup.ts'],
        // Run integration tests sequentially, unit tests can run in parallel
        fileParallelism: false,
        // Suppress sourcemap warnings from dependencies
        onConsoleLog(log) {
            if (log.includes('Sourcemap') && log.includes('points to missing source files')) {
                return false
            }
        },
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json-summary'],
            reportsDirectory: './build/coverage',
            include: ['src/**/*.ts'],
            exclude: ['**/*.d.ts', 'src/gen/**'],
            thresholds: {
                statements: 60,
                branches: 60,
                functions: 60,
                lines: 60,
            },
        },
    },
})
