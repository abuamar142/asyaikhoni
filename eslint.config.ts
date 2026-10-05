import { fileURLToPath } from 'node:url'
import { globalIgnores } from 'eslint/config'
import {
  configureVueProject,
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// The package scans `rootDir` for *.vue to build its type-aware file groups,
// but it converts globalIgnores through
// `fg.convertPathToPattern(path.resolve(cwd, pattern))`, which both escapes
// every glob char (`**/db/**` → `\*\*/db/\*\*`) and makes the result
// absolute — fast-glob matches neither against cwd-relative entries. So the
// ignores never pruned anything, the scan walked into db/volumes/db/data
// (root-owned Supabase volume, mode 700) and crashed with EACCES before
// linting a single file. Scope the scan to src/, where every .vue file lives;
// the groups only feed type-aware configs, and this project is not using them
// (type checking is vue-tsc's job). Enabling `vueTsConfigs.*TypeChecked`
// later would need the upstream conversion fixed instead — the returned paths
// are rootDir-relative and would not match ESLint's basePath-relative `files`.
configureVueProject({ rootDir: fileURLToPath(new URL('./src', import.meta.url)) })

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  // db/ = Supabase local stack data (root-owned Docker volumes, no lintable source);
  // the rest ESLint's own ignore handling applies to file selection directly.
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/db/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,

  {
    // 156 pre-existing `any`s live on the offline/share data boundaries
    // (Dexie rows, share payloads) where the shapes cross IndexedDB and REST.
    // They were never enforced because lint had not run since db/ appeared;
    // keep them visible as warnings so new code does not add more, and the
    // gate can actually be used. Promote back to error once they are typed.
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
)
