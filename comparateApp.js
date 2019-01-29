const ComparateScreenShots = require('./comparateScreenShots')

var screenshots = [
  "/imgs/1.png",
  "/imgs/2.png"
]

var colors = new ComparateScreenShots(screenshots).init()
colors.then(data => {
  console.log( JSON.stringify(data) )
})


