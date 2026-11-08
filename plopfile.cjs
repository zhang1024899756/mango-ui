/**
 * Mango UI component generator.
 *
 *   pnpm plop
 *
 * Scaffolds every file a component needs at once — Vue SFC, types, styles,
 * barrel export, Storybook story, Vitest test and the VitePress doc page.
 * Afterwards it prints the two manual steps (also listed at the end of
 * CONTRIBUTING.md): export from src/index.ts and add a docs sidebar entry.
 */
module.exports = function (plop) {
  plop.setHelper('groupId', (kind) => (kind === 'effects' ? 'Effects' : 'Elements'))

  plop.setGenerator('component', {
    description: '创建一个组件（元素组件或特效组件）',
    prompts: [
      {
        type: 'list',
        name: 'kind',
        message: '组件类型：',
        choices: [
          { name: '元素组件 → src/components/', value: 'components' },
          { name: '特效组件 → src/effects/', value: 'effects' },
        ],
      },
      {
        type: 'input',
        name: 'name',
        message: '组件目录名（kebab-case，如 avatar）：',
        validate: (value) =>
          /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(value) ||
          '小写字母开头，只用小写字母、数字和连字符',
      },
      {
        type: 'input',
        name: 'label',
        message: '中文名（用于文档标题，如 头像）：',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/{{kind}}/{{name}}/{{pascalCase name}}.vue',
        templateFile: 'plop-template/component.vue.hbs',
      },
      {
        type: 'add',
        path: 'src/{{kind}}/{{name}}/types.ts',
        templateFile: 'plop-template/types.hbs',
      },
      {
        type: 'add',
        path: 'src/{{kind}}/{{name}}/index.ts',
        templateFile: 'plop-template/index.hbs',
      },
      {
        type: 'add',
        path: 'src/{{kind}}/{{name}}/styles/{{name}}.scss',
        templateFile: 'plop-template/style.hbs',
      },
      {
        type: 'add',
        path: 'src/{{kind}}/{{name}}/{{pascalCase name}}.stories.ts',
        templateFile: 'plop-template/stories.hbs',
      },
      {
        type: 'add',
        path: 'src/{{kind}}/{{name}}/{{pascalCase name}}.test.ts',
        templateFile: 'plop-template/test.hbs',
      },
      {
        type: 'add',
        path: 'docs/components/{{name}}.md',
        templateFile: 'plop-template/docs.hbs',
      },
    ],
  })
}
