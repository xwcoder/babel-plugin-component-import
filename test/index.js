import path from 'path'
import { includes } from 'lodash'
import * as babel from '@babel/core'
import getFixtures from '@babel/helper-fixtures'
import plugin from '../src'

const name = path.basename(path.dirname(__dirname))
const suites = getFixtures(`${__dirname}/fixtures`)
const suiteOpts = {
  // ignoreTasks: ['as-arguments'],
  includeTasks: [
    // 'declarator variable'
    //
    // 'property'
    //
    // 'statement if'
    // 'statement return'
    // 'statement switch'
    //
    // 'expression call',
    // 'expression member'
    // 'expression array'
    // 'expression binary'
    // 'expression assignment'
    // 'expression logical'
    // 'expression new'
    // 'expression condition'
    //
    // 'export'
    //
  ]
}

for (const suite of suites) {

  if (includes(suiteOpts.ignoreSuites, suite.title)) {
    continue
  }

  describe(`${name}/${suite.title}`, () => {

    for (const task of suite.tests) {

      if (suiteOpts.includeTasks
          && suiteOpts.includeTasks.length
          && !includes(suiteOpts.includeTasks, task.title)
          && !includes(suiteOpts.includeTasks, `${suite.title}/${task.title}`)) {
        continue
      }

      if (includes(suiteOpts.ignoreTasks, task.title)
          || includes(suiteOpts.ignoreTasks, `${suite.title}/${task.title}`)) {
        continue
      }

      const testFn = task.disabled ? it.skip : it

      const { options = {} } = task
      const { plugins = [] } = options

      options.plugins = [
        [plugin, {
          libraryName: '@tencent/comby-lib-mobile',
          libraryDirectory: 'components',
          style: 'scss',
          styleLibraryName: '@tencent/comby-lib-mobile_default',
          styleDirectory: 'dist'
        }],
        ...plugins
      ]

      testFn(task.title, () => {
        const { code } = babel.transform(task.actual.code, options)
        expect(code).toMatchSnapshot()
      })
    }
  })
}
