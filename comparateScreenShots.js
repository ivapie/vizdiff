const puppeteer = require('puppeteer');
const fs = require('fs');
const pixelmatch = require('pixelmatch');
const PNG = require('pngjs').PNG;
const path = require('path')
const getColors = require('get-image-colors')

/**
 * Creates a ComparateScreenShot.
 *
 */

class ComparateScreenShot {
  constructor(screenshots) {
    this.screenshots = screenshots
    this.response = {
      status: null,
      message: null
    }
  }

  /**
   * compare()
   * 
   * Validate 2 images and create a promise to create the 2 images in the service
   */
  compare() {
    let self = this
    return new Promise(function (resolve, reject) {
      self.buildImages()
        .then(res => { resolve() })
        .catch(err => { reject(err) })
    }).catch(err => {
      throw err
    })
  }

  /**
   * init()
   * 
   * Start the process
   * @param {screenshots}.
   */
  init() {
    let self = this
    return new Promise(function (resolve, reject) {
      if (self.screenshots.length == 2) {
        self.compare()
          .then(r => { resolve({ status: "Complete", response: self.response.message }) })
          .catch(e => { reject({ status: "Error", response: e }) })
      }else{
        resolve({ status: "Error", response: "You need only 2 images" })
      }
    })
  }

  /**
   * buildImages()
   * 
   */
  buildImages() {
    let process = []
    let self = this

    return new Promise(function (resolve, reject) {

      self.screenshots.map(image => {
        process.push(self.createImage(image))
      })

      Promise.all(process).then(values => {
        resolve(self.createDiffImage(values))
      }).catch(err => {
        reject(err)
      })

    }).catch(err => {
      throw err
    })
  }
  
  /**
   * createDiffImage()
   * @param {res}
   * 
   */
  createDiffImage(res) {
    let self = this
    let diff
    let createImage

    return new Promise(function (resolve, reject) {

      diff = new PNG({ width: res[0].width, height: res[0].height });
      createImage = fs.createWriteStream('diff.png')

      pixelmatch(res[0].data, res[1].data, diff.data, res[0].width, res[0].height, { threshold: 0.1 });
      diff.pack().pipe(createImage)

      createImage.on('finish', function () {
        resolve(self.getPaletteColors(path.join(__dirname, 'diff.png')));
      });

    }).catch((err) => {
      throw err
    })
  }

  /**
   * getPaletteColors()
   * @param {image}
   * 
   */
  getPaletteColors(image) {
    let self = this
    return new Promise(function (resolve, reject) {
      getColors(image).then(colors => {
        self.response.message = colors
        resolve();
      }).catch(err => {
        self.response.message = e
        reject()
      })
    })
  }

  /**
   * createImage()
   * @param {image}
   * 
   */
  createImage(image) {
    let pathUrl
    let access
    let newImage
    return new Promise(function (resolve, reject) {
      try {
        pathUrl = path.join(__dirname, image)
        access = fs.accessSync(pathUrl)
        newImage = fs.createReadStream(pathUrl).pipe(new PNG())
        newImage.on('parsed', function (data) {
          resolve(newImage);
        });
      } catch (error) {
        throw error
      }
    })
  }
}

// Node unhandledRejection register event
process.on('unhandledRejection', (reason, error) => {
  console.log(reason);
});

module.exports = ComparateScreenShot




