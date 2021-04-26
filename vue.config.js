module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/demo/'
    : '/',

   chainWebpack: config => {
    config.module
      .rule('raw')
      .test(/\.csv$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
  }
}
