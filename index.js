const puppeteer = require('puppeteer');
const fs = require('fs');
const _ = require('lodash');

const BASE_URL = "https://forlap.ristekdikti.go.id/mahasiswa/detailsemester"
const DEP_CODE = "MkI2QTMxRDQtN0NGMi00QkFGLUFGNTgtNTM0MzlFNDU2QUE5"
const YEAR = "2018"
const TERM = "2"
const URL = BASE_URL + "/" + DEP_CODE + "/" + YEAR + TERM + "/";
const PAGE_NUM = 13;
const PAGE_ROW = 20;
const OUTPUT_FILE = "scrap.csv";
const NIM_KEY = "150";

(async () => {
  const browser = await puppeteer.launch({
      headless: true
  });
  datas = []
  let SCRAP_URL = URL

  for (let p = 1; p <= PAGE_NUM; p++) {
    console.log(`Scrapping ${SCRAP_URL}`)
    const page = await browser.newPage();
    await page.goto(SCRAP_URL);


    const data = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('table tr td'))
        return tds.map(td => {
          if (td.nodeName == "A") {
            return td.innerHTML
          } else {
            return td.innerText
          }
        })
    });

    datas = datas.concat(data);

    SCRAP_URL = URL + (PAGE_ROW * p);
    console.log(`Scrapped ${PAGE_ROW * p} / ${PAGE_NUM * PAGE_ROW}`)
  }
  await browser.close();

  let file = fs.createWriteStream(OUTPUT_FILE);
  file.on('error', function(err) { /* error handling */ });

  chunked_datas = _.chunk(datas, 3);

  chunked_datas = chunked_datas.map(val => {
    if (val[1].includes(NIM_KEY)) {
      return val.join(', ')
    }
  }).filter(value => value != undefined);

  chunked_datas.forEach(function(value) {
    file.write(value + '\n');
  });

  file.end();
})();