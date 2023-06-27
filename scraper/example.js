const puppeteer = require('puppeteer');
const jobBoardWebsites = require('./job-board-websites.js');




(async () => {
    console.log(jobBoardWebsites)
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(jobBoardWebsites.linkedIn.URL);
    await new Promise(r => setTimeout(r, 5000));
    await browser.close();
})();

