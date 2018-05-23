// var app = getApp()

Component({
  properties: {
    canvasInfo: {
      type: Object,
      value: {}
    }
  },
  data: {},
  ready () {
    const pageData = this.data
    const ctx = wx.createCanvasContext('postCanvas', this)

    wx.getSystemInfo({
      success: res => {
        let w = res.windowWidth
        let h = res.windowHeight

        var scale2x = w / 750

        console.log('getSystemInfo:', pageData.canvasInfo)

        // 下载图片 -> 绘制
        wx.downloadFile({
          url: pageData.canvasInfo.img,
          success: res => {
            console.log('getImageInfo:', res)

            ctx.drawImage(res.tempFilePath, 0, 0, w, h)

            console.log('can i use measureText', wx.canIUse('canvasContext.measureText'))

            ctx.setFontSize(28 * scale2x)
            ctx.setFillStyle('#ff0000')
            this.fillTextAutoBreak(ctx, '对制造商们来说最关心的就是找到一种新方法，在保证产品end', 20 * scale2x, h - 120, 100)

            ctx.draw()
          }
        })
      }
    })
  },
  methods: {
    fillTextAutoBreak (ctx, text, x, y, maxWidth) {
      if (typeof text !== 'string' || text === '') return

      // 读取canvas宽高
      // if (maxWidth === undefined) {
      //   maxWidth =
      // }

      // 读取canvas样式
      const lineHeight = 20

      var textArr = text.split('')
      var line = ''

      for (var i = 0; i < textArr.length; i++) {
        var textLine = line + textArr[i]
        var lineTextWidth = ctx.measureText(textLine).width

        if (lineTextWidth > maxWidth) {
          ctx.fillText(line, x, y)
          // 重置line
          line = textArr[i]
          y += lineHeight
        } else {
          line = textLine
        }
      }
      ctx.fillText(line, x, y)
    },
    saveImage () {
      wx.canvasToTempFilePath({
        canvasId: 'postCanvas',
        fileType: 'jpg',
        quality: 1,
        success (res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success (res) {
              wx.showToast({
                title: '已保存到手机相册'
              })
            }
          })
        }
      }, this)
    }
  }
})
