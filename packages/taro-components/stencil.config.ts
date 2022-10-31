import { Config } from '@stencil/core'
import { OutputTarget } from '@stencil/core/internal'
import { reactOutputTarget } from '@stencil/react-output-target'
import { sass } from '@stencil/sass'
import { vueOutputTarget as vue3OutputTarget } from '@stencil/vue-output-target'
import { vueOutputTarget as vue2OutputTarget } from 'stencil-vue2-output-target'

const { jsWithTs: tsjPreset } = require('ts-jest/presets')

const isProd = process.env.NODE_ENV === 'production'
const outputTargets: OutputTarget[] = [
  reactOutputTarget({
    componentCorePackage: '@tarojs/components/dist/types/components',
    proxiesFile: '../taro-components-library-react/src/components.ts'
  }),
  vue2OutputTarget({
    componentCorePackage: '@tarojs/components/dist/types/components',
    proxiesFile: '../taro-components-library-vue2/src/components.ts'
  }),
  vue3OutputTarget({
    componentCorePackage: '@tarojs/components/dist/types/components',
    proxiesFile: '../taro-components-library-vue3/src/components.ts'
  }),
  {
    type: 'dist',
    esmLoaderPath: '../loader'
  }
]

if (!isProd) {
  outputTargets.push({ type: 'docs-readme' })
}

export const config: Config = {
  namespace: 'taro-components',
  globalStyle: './src/global.css',
  plugins: [
    sass()
  ],
  sourceMap: isProd,
  nodeResolve: {
    preferBuiltins: false,
    // @ts-ignore
    mainFields: ['main:h5', 'browser', 'module', 'jsnext:main', 'main']
  },
  outputTargets,
  bundles: [
    { components: ['taro-checkbox-core', 'taro-checkbox-group-core'] },
    { components: ['taro-movable-area-core', 'taro-movable-view-core'] },
    { components: ['taro-picker-core', 'taro-picker-group'] },
    { components: ['taro-picker-view-core', 'taro-picker-view-column-core'] },
    { components: ['taro-radio-core', 'taro-radio-group-core'] },
    { components: ['taro-swiper-core', 'taro-swiper-item-core'] },
    { components: ['taro-video-core', 'taro-video-control', 'taro-video-danmu'] }
  ],
  buildEs5: 'prod',
  testing: {
    testRegex: '(/__tests__/.*|(\\.|/)(spec|test|tt))\\.[jt]sx?$',
    transform: {
      ...tsjPreset.transform
    },
    globals: {
      window: true,
      ENABLE_INNER_HTML: true,
      ENABLE_ADJACENT_HTML: true,
      ENABLE_SIZE_APIS: true,
      ENABLE_TEMPLATE_CONTENT: true,
      ENABLE_MUTATION_OBSERVER: true,
      ENABLE_CLONE_NODE: true,
      ENABLE_CONTAINS: true,
      'ts-jest': {
        diagnostics: false,
        tsconfig: {
          allowJs: true,
          jsx: 'react',
          target: 'ES6'
        }
      }
    },
    emulate: [{
      device: 'iPhone 8'
    }]
  },
  rollupConfig: {
    inputOptions: {
      treeshake: true
    }
  },
  rollupPlugins: {
    after: [{
      name: 'add-external',
      options: opts => {
        opts.external = ['@tarojs/taro']

        return opts
      }
    }]
  }
}
