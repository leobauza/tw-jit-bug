const HtmlWebpackPlugin = require('html-webpack-plugin')
const parse5 = require('parse5')
const fs = require('fs')

/**
 * Plugin to have wrapperless inline svgs
 * Requires HTMLWebpackPlugin and special settings on html-loader (see: `webpack.common.js`)
 * Adapted from: https://github.com/theGC/html-webpack-inline-svg-plugin/blob/master/index.js
 */
class FPHTMLWebpackInlineSvgsPlugin {
  // eslint-disable-next-line no-unused-vars
  constructor(options) {
    // Configure your plugin with options...
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(
      'FPHTMLWebpackInlineSvgsPlugin',
      (compilation) => {
        /**
         * This is as close as I'll ever get to an explanation of this:
         * https://github.com/jantimon/html-webpack-plugin#events
         */
        const hooks = HtmlWebpackPlugin.getHooks(compilation)
        hooks.afterTemplateExecution.tapAsync(
          'FPHTMLWebpackInlineSvgsPlugin',
          async (data, callback) => {
            /**
             * We are using parse5 to make it easier to manipulate the html:
             * https://github.com/inikulin/parse5/blob/master/packages/parse5/docs/index.md
             */
            const html = parse5.parse(data.html)
            const htmlNode = html.childNodes.find(
              ({ nodeName }) => nodeName === 'html'
            )
            let bodyNode = htmlNode.childNodes.find(
              ({ nodeName }) => nodeName === 'body'
            )

            const svgs = await this.getSvgFiles(bodyNode)
            bodyNode = this.replaceInlineImages(bodyNode, {}, svgs)

            const newData = {
              ...data,
              html: parse5.serialize(html),
            }

            callback(null, newData)
          }
        )
      }
    )
  }

  /**
   * Recursively get all inline images (ie. `<img inline src="./path/from/project/root.svg" />)
   *
   * @param {DocumentFragment} documentFragment - html processed by parse5
   * @param {Array} inlineImages - array of parse5 nodes
   * @returns {Array} array of parse5 nodes (all inline images in the document)
   */
  getInlineImages(documentFragment, inlineImages) {
    if (documentFragment.childNodes && documentFragment.childNodes.length) {
      documentFragment.childNodes.forEach((childNode) => {
        if (this.isNodeValidInlineImage(childNode)) {
          let srcs = []

          for (const img of inlineImages) {
            srcs = srcs.concat(this.getAttr(img, 'src').value)
          }

          const childNodeSrc = this.getAttr(childNode, 'src').value

          // don't add to `inlineImages` if we already have this src
          if (srcs.includes(childNodeSrc)) {
            return
          }

          inlineImages.push(childNode)
        } else {
          inlineImages = this.getInlineImages(childNode, inlineImages)
        }
      })
    }

    return inlineImages
  }

  /**
   * Convert inline images into an array of svg objects with the propeties
   * we'll need:
   *
   * - src: the original source so we can match inline svg to img
   * - svgNode: the svg string processed by parse5 so we can replace the
   *   img node with an svg node
   *
   * @param {DocumentFragment} documentFragment - html processed by parse5
   * @returns {Array} array of svg information objects
   */
  async getSvgFiles(documentFragment) {
    const inlineImages = this.getInlineImages(documentFragment, [])

    const svgFiles = inlineImages.map(async (inlineImage) => {
      const srcAttr = this.getAttr(inlineImage, 'src')

      const svgString = await new Promise((resolve) => {
        fs.readFile(srcAttr.value, 'utf8', (err, data) => {
          if (err) {
            resolve()
          }

          resolve(data)
        })
      })
      const svgNode = parse5.parseFragment(svgString).childNodes[0]

      return {
        src: srcAttr.value,
        svgNode,
      }
    })

    return Promise.all(svgFiles)
  }

  /**
   * Check that the node is an inline img and an svg
   *
   * @param {DocumentFragment} node - parse5 node
   */
  isNodeValidInlineImage(node) {
    if (!node.attrs) {
      return false
    }

    const hasInlineAttr = this.getAttr(node, 'inline')
    const isImg = node.nodeName === 'img'

    if (isImg && hasInlineAttr) {
      const srcAttr = this.getAttr(node, 'src')
      const isSvg = srcAttr.value.includes('.svg')

      return isSvg
    }

    return false
  }

  /**
   * Recursively replace img nodes with svg nodes in the html processed by parse5
   *
   * @param {DocumentFragment} documentFragment - parse5 processed html
   * @param {DocumentFragment} replacedDocumentFragment - parse5 processed html (with recursive replacemnts)
   * @param {Object} svgs - key value pairs of svg paths and svg parse5 nodes
   * @returns {DocumentFragment} - parse5 processed html to be serialized into an html string
   */
  replaceInlineImages(documentFragment, replacedDocumentFragment, svgs) {
    replacedDocumentFragment = {
      ...documentFragment,
      childNodes: documentFragment.childNodes || [],
    }

    if (documentFragment.childNodes && documentFragment.childNodes.length) {
      documentFragment.childNodes.forEach((childNode, index) => {
        if (this.isNodeValidInlineImage(childNode)) {
          const srcAttr = this.getAttr(childNode, 'src')
          // add any attr that isn't `inline` or `src` to inline svg
          const additionalAttrs = childNode.attrs.filter((childNodeAttr) => {
            return (
              childNodeAttr.name !== 'inline' && childNodeAttr.name !== 'src'
            )
          })

          const svgObject = svgs.find((svg) => {
            return svg.src === srcAttr.value
          })

          replacedDocumentFragment.childNodes[index] = {
            ...svgObject.svgNode,
            attrs: [...svgObject.svgNode.attrs, ...additionalAttrs],
          }
        } else {
          replacedDocumentFragment.childNodes[index] = this.replaceInlineImages(
            childNode,
            replacedDocumentFragment,
            svgs
          )
        }
      })
    }

    return replacedDocumentFragment
  }

  /**
   * Helper for getting attributes from parse5 nodes
   *
   * @param {DocumentFragment} node - parse5 processed html
   * @param {string} attrName - html attribute to extract
   * @returns {(Object|undefined)} {name: 'attribute name', value: 'attribute value'}
   */
  getAttr(node, attrName) {
    const result = node.attrs.find((attr) => {
      return attr.name === attrName
    })

    return result
  }
}

module.exports = FPHTMLWebpackInlineSvgsPlugin
