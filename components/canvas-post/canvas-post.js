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

        const windowWidth = res.windowWidth
        const windowHeight = res.windowHeight

        // 根据视觉稿宽度与视图宽度比，计算缩放比例
        const autoScale = (val) => {
          return val * ( windowWidth / 750)
        }

        console.log('getSystemInfo:', pageData.canvasInfo)
        console.log('can i use measureText', wx.canIUse('canvasContext.measureText'))

        // 下载图片 -> 绘制
        wx.downloadFile({
          url: pageData.canvasInfo.img,
          success: res => {

            wx.getImageInfo({
              src: res.tempFilePath,
              success: res2 => {
                console.log('getImageInfo:', res2)

                // 根据图片宽度缩放到视窗，计算适配高度
                const imgHeight = windowWidth * res2.height / res2.width

                ctx.drawImage(res.tempFilePath, 0, 0, windowWidth, imgHeight)

                ctx.setFontSize(autoScale(32))
                ctx.setFillStyle('#333333')
                this.fillTextAutoBreak(ctx, pageData.canvasInfo.title, autoScale(20), imgHeight + 40, autoScale(400))

                ctx.setFontSize(autoScale(28))
                ctx.setFillStyle('#999999')
                this.fillTextAutoBreak(ctx, pageData.canvasInfo.desc, autoScale(20), imgHeight + 60, autoScale(400))

                ctx.drawImage(pageData.canvasInfo.qrcode, autoScale(480), imgHeight + 20, autoScale(200), autoScale(200))

                ctx.draw()
              }
            })
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
