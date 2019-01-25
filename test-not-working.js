var puppeteer = require('puppeteer');
var fs  = require('fs');
var pixelmatch = require('pixelmatch');
var PNG = require('pngjs').PNG;
var path = require('path')
var getColors = require('get-image-colors')

function compareScreenshots(file1, file2, filediff) {
  return new Promise((resolve, reject) => {

    const img1 = fs.createReadStream(file1).pipe(new PNG()).on('parsed', doneReading);
    const img2 = fs.createReadStream(file2).pipe(new PNG()).on('parsed', doneReading);

    let filesRead = 0;
    function doneReading() {
      // Wait until both files are read.
      if (++filesRead < 2) return;

      // Do the visual diff.
      const diff = new PNG({width: img1.width, height: img2.height});
      const numDiffPixels = pixelmatch(
          img1.data, img2.data, diff.data, img1.width, img1.height,
          {threshold: 0});

	  diff.pack().pipe(fs.createWriteStream(filediff));

      // The files should look the same.
      console.log('number of different pixels: ' + numDiffPixels + ' saved to: ' + filediff);

      resolve();
    }

  });
}

(async () => {

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

	compareScreenshots(
		'./imgs/big-desktop-1.png', 
		'./imgs/big-desktop-2.png',
		'./imgs/big-desktop-diff.png'
	);

	getColors(path.join(__dirname, './imgs/big-desktop-diff.png')).then(colors => {
	  // `colors` is an array of color objects
	  console.log("colors");
	  console.log(colors);
	})

})();




