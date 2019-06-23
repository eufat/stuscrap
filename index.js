const puppeteer = require('puppeteer');
var fs = require('fs');

const URL = "https://forlap.ristekdikti.go.id/mahasiswa/detailsemester/MkI2QTMxRDQtN0NGMi00QkFGLUFGNTgtNTM0MzlFNDU2QUE5/20182";
const PAGE_NUM = 45;
const PAGE_ROW = 20;

(async () => {
  const browser = await puppeteer.launch({
      headless: true
  });
  datas = []
  let SCRAP_URL = URL

  for (let p = 1; p <= PAGE_NUM + 1; p++) {
    console.log(`Scrapping ${SCRAP_URL}`)
    const page = await browser.newPage();
    await page.goto(SCRAP_URL);
    const data = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('table tr td'))
        return tds.map(td => td.innerHTML)
    });

    datas = datas.concat(data);
    
    SCRAP_URL = URL + (PAGE_ROW * p);
    // console.log(`Scrapped ${PAGE_ROW * p} / ${PAGE_NUM * PAGE_ROW}`)
  }
  await browser.close();

  var file = fs.createWriteStream('scrap.txt');
  file.on('error', function(err) { /* error handling */ });

  datas.forEach(function(value) {
    file.write(value + '\n');
  });

  file.end(); 
})();