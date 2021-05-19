/**
 * Creating New Pages:
 *
 * 1. Create a new twig file in `src/`
 * 2. Add a new route to the routes object (the key should be the filename, and
 *    the value should be the template path)
 * 3. The `/` route MUST exist
 *
 * eg. The file `sample.html` will be compiled to `/sample.html`
 * that file can then be viewed at `localhost:8080/sample`
 */
const routes = [{ '/': 'src/index.twig' }, { 'sample.html': 'src/sample.twig' }]

const rewrites = routes.map((route) => {
  let filename = Object.keys(route)[0]
  let path = filename.split('.')[0]

  return {
    from: path !== '/' ? new RegExp(`/${path}$`) : new RegExp(`${path}$`),
    to: filename === '/' ? 'index.html' : `/${filename}`,
  }
})

/*================================================================================
 * WARNING: don't change anything below this line unless you know what you are doing
 =================================================================================*/
const routeManifest = routes.map((route) => {
  const filename = Object.keys(route)[0]

  if (filename === '/') {
    return {
      template: route[filename],
    }
  }

  return {
    /**
     * @NOTE
     * Because of limitations of `twig-html-loader` we cannot pass arbitrary variables into
     * twig templates from here. If you would like to pass arbitrary variables do so in
     * `webpack.common.js` in the data options for the `twig-html-loader`
     *
     * (see: https://github.com/radiocity/twig-html-loader/issues/9)
     *
     * @TODO check in on this issue (Last checked: Mar. 29 2021)
     */

    /**
     * Output filename
     *
     * this is the name that will allow this page to be accessed
     * eg. localhost:8080/sample.html
     */
    filename: filename,
    /**
     * Template to use
     *
     * if no loader was specified the lodash template loader
     * would be used to process the templates. However, the
     * default configuration of FedPack™ uses various loaders
     * to process twig files
     *
     * see: ./config/webpack/webpack.common.js
     */
    template: route[filename],
  }
})

module.exports = {
  routeManifest,
  rewrites,
}
