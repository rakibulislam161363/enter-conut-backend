import { defineConfig } from 'tsup'

export default defineConfig({
    entry: {
        index: 'src/index.ts'
    },
    format: ["esm"],
    target: "esnext",
    outDir: "dist",
    clean: true,
    bundle: true,
    splitting: false,
    sourcemap: true,
    external: ['fs', 'path', 'os', 'crypto', 'stream', 'http', 'https', 'redis', '@prisma/client'], 
});

