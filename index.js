var puppeteer = require('puppeteer');
var fs  = require('fs');
var pixelmatch = require('pixelmatch');
var PNG = require('pngjs').PNG;
var path = require('path')
var getColors = require('get-image-colors')

function compareScreenshots(file1, file2) {
  return new Promise(function(resolve, reject){
 	  var img1 = fs.createReadStream( path.join(__dirname, file1) ).pipe(new PNG()).on('parsed', doneReading),
	      img2 = fs.createReadStream( path.join(__dirname, file2) ).pipe(new PNG()).on('parsed', doneReading),
        filesRead = 0;

    function doneReading() {
      if (++filesRead < 2) 
        return;
    
      var diff = new PNG({width: img1.width, height: img1.height});
      pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, {threshold: 0.1});
      
      var isCreated = fs.createWriteStream('diff.png')
      diff.pack().pipe(isCreated)
      
      isCreated.on('finish', function(){
        diffImage( path.join(__dirname, 'diff.png') );
        resolve();
      });
    }
  })
}

function diffImage(image) {
  getColors(image).then(colors => {
      console.log('Response', colors)     
    })
}

  /*
  var browser = await puppeteer.launch();
	var page = await browser.newPage();
	await page.setViewport({width:1600, height:1250});
	await page.goto('http://localhost/github/test-1/');
	await page.screenshot({path: './imgs/big-desktop-1.png'});
	await browser.close();

	var browser = await puppeteer.launch();
	var page = await browser.newPage();
	await page.setViewport({width:1600, height:1250});
	await page.goto('http://localhost/github/test-2-2/');
	await page.screenshot({path: './imgs/big-desktop-2.png'});
	await browser.close();
 */
	compareScreenshots(
    '/imgs/1.png', 
    '/imgs/2.png'
  ).then( data => {
    console.log(data)
  }).catch(err => {
    console.log("err", err)
  }) ;





