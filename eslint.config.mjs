// @ts-check
import tseslint from 'typescript-eslint';
import boundaries from 'eslint-plugin-boundaries';

/**
 * ESLint flat config. Objetivo principal: ENFORCAR la Dependency Rule de Clean
 * Architecture con `eslint-plugin-boundaries`, más una prohibición de imports de
 * framework dentro de `domain/`.
 *
 * Se mantiene un set de reglas ENFOCADO (no se activan los presets "recommended"
 * completos) para que `ng lint` falle SOLO ante violaciones de arquitectura y no
 * por ruido de estilo en el código existente.
 */
export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'out-tsc/**',
      '.angular/**',
      'node_modules/**',
      'coverage/**',
    ],
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
    plugins: { boundaries },
    settings: {
      // Cada zona de la app es un "elemento" de arquitectura. El orden importa:
      // 'app' (archivos raíz de src/app) primero para no solaparse con capas.
      'boundaries/elements': [
        { type: 'app', mode: 'full', pattern: 'src/app/*.ts' },
        { type: 'domain', mode: 'full', pattern: 'src/app/domain/**/*' },
        { type: 'application', mode: 'full', pattern: 'src/app/application/**/*' },
        {
          type: 'infrastructure',
          mode: 'full',
          pattern: 'src/app/infrastructure/**/*',
        },
        { type: 'presentation', mode: 'full', pattern: 'src/app/presentation/**/*' },
        { type: 'core', mode: 'full', pattern: 'src/app/core/**/*' },
        { type: 'shared', mode: 'full', pattern: 'src/app/shared/**/*' },
      ],
    },
    rules: {
      // La Dependency Rule: las dependencias apuntan siempre hacia adentro.
      // Sintaxis v6 (boundaries/dependencies + selectores objeto).
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: { type: 'app' },
              allow: {
                to: {
                  type: ['app', 'core', 'shared', 'application', 'domain', 'presentation'],
                },
              },
            },
            { from: { type: 'domain' }, allow: { to: { type: 'domain' } } },
            {
              from: { type: 'application' },
              allow: { to: { type: ['application', 'domain', 'shared'] } },
            },
            {
              from: { type: 'infrastructure' },
              allow: { to: { type: ['infrastructure', 'domain', 'shared'] } },
            },
            {
              from: { type: 'presentation' },
              allow: {
                to: { type: ['presentation', 'application', 'domain', 'core', 'shared'] },
              },
            },
            { from: { type: 'core' }, allow: { to: { type: ['core', 'shared'] } } },
            { from: { type: 'shared' }, allow: { to: { type: 'shared' } } },
          ],
        },
      ],
    },
  },
  {
    // `domain` debe ser TypeScript PURO: prohibido Angular/PrimeNG (rxjs SÍ).
    files: ['src/app/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@angular/*', 'primeng', 'primeng/*', '@primeng/*'],
              message:
                'domain debe ser TypeScript puro: prohibido importar Angular/PrimeNG. rxjs sí está permitido.',
            },
          ],
        },
      ],
    },
  },
);
