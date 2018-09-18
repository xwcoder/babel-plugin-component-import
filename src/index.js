import { join } from 'path'
import { declare } from '@babel/helper-plugin-utils'
import { addDefault, addSideEffect } from '@babel/helper-module-imports'

function camel2Dash(_str) {
  const str = _str[0].toLowerCase() + _str.substr(1)
  return str.replace(/([A-Z])/g, ($1) => `-${$1.toLowerCase()}`)
}

function camel2Underline(_str) {
  const str = _str[0].toLowerCase() + _str.substr(1)
  return str.replace(/([A-Z])/g, ($1) => `_${$1.toLowerCase()}`)
}

export default declare(function createPlugin (api, {
  libraryName,
  libraryDirectory = 'lib',
  style = false,
  camel2DashComponentName = true,
  camel2UnderlineComponentName = false,
  fileName = '',
  customName,
  styleLibraryName,
  styleDirectory = 'dist',
  styleLibraryPath,
}) {

  api.assertVersion(7)

  const { types } = api

  let pathToRemove = []
  let importSpecifiers = {}
  let importDefaultSpecifiers = {}
  let importNamespaceSpecifiers = {}
  let imported = {}

  function addImport (name, path) {

    if (!imported[name]) {

      let transformedName = name

      if (camel2UnderlineComponentName) {
       transformedName = camel2Underline(name)
      } else if (camel2DashComponentName) {
       transformedName = camel2Dash(name)
      }

      const importPath = customName
                          ? customName(transformedMethodName)
                          : join(libraryName, libraryDirectory, transformedName, fileName)

      imported[name] = addDefault(path, importPath, { nameHint: name })

      if (style) {

        let styleImportPath = importPath

        if (styleLibraryName) {
          styleImportPath = join(styleLibraryName, styleDirectory, transformedName)
        } else if (styleLibraryPath) {
          styleImportPath = join(styleLibraryPath, transformedName)
        }

        if (style === true) {
          styleImportPath = `${styleImportPath}/style`
        } else if (typeof style === 'string') {
          styleImportPath = `${styleImportPath}/style/${style}`
        } else if (typeof style === 'function') {
          const stylePath = style(importPath)
          if (stylePath) {
            styleImportPath = stylePath
          }
        }

        addSideEffect(path, styleImportPath)
      }
    }

    return {
      ...imported[name]
    }
  }

  function buildExpression (node, props, path) {

    const { scope } = path

    props.forEach(prop => {

      const item = node[prop] || {}
      const { name } = item

      if (!name || !types.isIdentifier(item) || !scope.hasBinding(name)) {
        return
      }

      const { path: bindingPath } = scope.getBinding(name) || {}

      if (importSpecifiers[name] && types.isImportSpecifier(bindingPath)) {

        node[prop] = addImport(importSpecifiers[name], path)

      } else if (importDefaultSpecifiers[name] && types.isImportDefaultSpecifier(bindingPath)
        || importNamespaceSpecifiers[name] && types.isImportNamespaceSpecifier(bindingPath)) {

        pathToRemove = pathToRemove.filter(itemPath =>
          !itemPath.node.specifiers.some(specifier =>
            (types.isImportDefaultSpecifier(specifier)
              || types.isImportNamespaceSpecifier(specifier))
            && specifier.local.name === name)
        )
      }
    })
  }

  return {

    visitor: {

      Program: {
        enter () {
          pathToRemove = []
          importSpecifiers = {}
          importDefaultSpecifiers = {}
          importNamespaceSpecifiers = {}
          imported = {}
        },
        exit () {
          pathToRemove.forEach(path => !path.removed && path.remove())
        }
      },

      ImportDeclaration (path) {

        const { node } = path
        if (!node) {
          return
        }

        const { value } = node.source

        if (value === libraryName) {

          node.specifiers.forEach(specifier => {

            const localName = specifier.local.name

            if (types.isImportSpecifier(specifier)) {
              importSpecifiers[localName] = specifier.imported.name
            } else if (types.isImportDefaultSpecifier(specifier)) {
              importDefaultSpecifiers[localName] = true
            } else if (types.isImportNamespaceSpecifier(specifier)) {
              importNamespaceSpecifiers[localName] = true
            }
          })

          pathToRemove.push(path)
        }
      },

      // Declarations

      VariableDeclarator (path) {
        buildExpression(path.node, ['init'], path)
      },

      Property (path) {
        buildExpression(path.node, ['value'], path)
      },

      // Statements
      IfStatement (path) {
        buildExpression(path.node, ['test'], path)
      },

      ReturnStatement (path) {
        buildExpression(path.node, ['argument'], path)
      },

      SwitchStatement (path) {
        const { node } = path
        const { cases = [] } = node

        buildExpression(node, ['discriminant'], path)
        cases.forEach(caseItem => buildExpression(caseItem, ['test'], path))
      },

      // Expressions
      ArrayExpression (path) {
        const { node: { elements } } = path
        const props = elements.map((_, index) => index)
        buildExpression(elements, props, path)
      },

      CallExpression (path) {
        const { node } = path
        const { arguments: args } = node
        const props = args.map((_, index) => index)

        buildExpression(node, ['callee'], path)
        buildExpression(args, props, path)
      },

      ConditionalExpression (path) {
        buildExpression(path.node, ['test', 'consequent', 'alternate'], path)
      },

      NewExpression (path) {
        const { node } = path
        const { arguments: args } = node
        const props = args.map((_, index) => index)

        buildExpression(node, ['callee'], path)
        buildExpression(args, props, path)
      },

      MemberExpression (path) {
        const { node, scope } = path

        if (!node.object || !node.object.name) {
          return
        }

        const { name } = node.object

        if (!scope.hasBinding(name)) {
          return
        }

        const { path: bindingPath } = scope.getBinding(name) || {}

        if (!bindingPath) {
          return
        }

        if (importDefaultSpecifiers[name] && types.isImportDefaultSpecifier(bindingPath)
            || importNamespaceSpecifiers[name] && types.isImportNamespaceSpecifier(bindingPath)) {

          path.replaceWith(addImport(node.property.name, path))

        } else if (importSpecifiers[name] && types.isImportSpecifier(bindingPath)) {
          node.object = addImport(importSpecifiers[name], path)
        }
      },

      BinaryExpression (path) {
        buildExpression(path.node, ['left', 'right'], path)
      },

      AssignmentExpression (path) {
        buildExpression(path.node, ['left', 'right'], path)
      },

      LogicalExpression (path) {
        buildExpression(path.node, ['left', 'right'], path)
      },

      // export
      ExportDefaultDeclaration (path) {
        buildExpression(path.node, ['declaration'], path)
      },

      ExportNamedDeclaration (path) {
        const { node: { specifiers } } = path

        specifiers.forEach(specifiers => buildExpression(specifiers, ['local'], path))
      }
    }
  }
})
