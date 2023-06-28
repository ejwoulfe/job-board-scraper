const puppeteer = require('puppeteer');
const jobBoardWebsites = require('./job-board-websites.js');
require('dotenv').config();


(async () => {
    console.log(jobBoardWebsites)
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    //linkedInLogin(page);
    // glassDoorLogin(page);
    // indeedLogin(page);
    zipRecruiterLogin(page);
    // await new Promise(r => setTimeout(r, 10000));
    // await browser.close();
})();


//                  LinkedIn                \\
async function linkedInLogin(page) {
    await page.goto(jobBoardWebsites.linkedIn.URL, {
        waitUntil: "domcontentloaded",
    });
    page.type('#session_key', process.env.ACCOUNT_USERNAME);
    await new Promise(r => setTimeout(r, 1000));
    page.type('#session_password', process.env.ACCOUNT_PASSWORD);
    await new Promise(r => setTimeout(r, 1000));
    page.click('div.flex.justify-between.sign-in-form__footer--full-width > button')
}



async function queryLinkedInJobs(page) {

}

//------------------------------------------\\


//                  Glassdoor                \\
async function glassDoorLogin(page) {
    await page.goto(jobBoardWebsites.glassdoor.URL, {
        waitUntil: "domcontentloaded",
    });
    await new Promise(r => setTimeout(r, 3000));
    page.type('#inlineUserEmail', process.env.ACCOUNT_USERNAME);
    await new Promise(r => setTimeout(r, 1000));
    page.click('#InlineLoginModule > div > div.view-container.inlineInnerContainer.mx-auto.my-0.mw-440 > div > div > div > div > form > div:nth-child(2) > button > span > span')
    await new Promise(r => setTimeout(r, 2000));
    page.type('#inlineUserPassword', process.env.ACCOUNT_PASSWORD);
    await new Promise(r => setTimeout(r, 1000));
    page.click('#InlineLoginModule > div > div.view-container.inlineInnerContainer.mx-auto.my-0.mw-440 > div > div > div > div > form > div.d-flex.align-items-center.flex-column > button > span > span')

}

async function queryGlassDoorJobs(page) {

}

//------------------------------------------\\


//                  Indeed                \\
async function indeedLogin(page) {
    await page.goto(jobBoardWebsites.indeed.URL, {
        waitUntil: "networkidle0",
    });
    // await new Promise(r => setTimeout(r, 3000));
    page.click('#gnav-main-container > div > div > div.css-9qge8r.e37uo190 > div.css-chsy6r.e37uo190 > div.css-10stsit.eu4oa1w0 > div > a');
    await new Promise(r => setTimeout(r, 3000));
    page.type('#ifl-InputFormField-3', process.env.ACCOUNT_USERNAME);
    await new Promise(r => setTimeout(r, 2000));
    page.click("#emailform > button");
    await new Promise(r => setTimeout(r, 2000));
    page.click('#auth-page-google-password-fallback');
    await new Promise(r => setTimeout(r, 2000));
    page.type('#ifl-InputFormField-116', process.env.ACCOUNT_PASSWORD);
    await new Promise(r => setTimeout(r, 1000));
    page.click('#loginform > button')

}

async function queryIndeedJobs(page) {

}


//------------------------------------------\\


//                  Google                \\

async function queryGoogleJobs(page) {

}