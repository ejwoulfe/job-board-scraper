const puppeteer = require('puppeteer');
const jobBoardWebsites = require('./job-board-websites.js');
require('dotenv').config();


const jobTitle = "Front End Developer";
const jobLocation = "United States";

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    // await linkedInLogin(page);
    // await linkedInJobs24Hours(page);
    // await glassDoorLogin(page);
    // await queryGlassDoorJobs(page);
    // await indeedJobs24Hours(page);
    await googleJobs24Hours(page);


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
    await new Promise(r => setTimeout(r, 2000));
}



async function linkedInJobs24Hours(page) {
    await new Promise(r => setTimeout(r, 2000));
    page.type('#jobs-search-box-keyword-id-ember22', jobTitle);
    await new Promise(r => setTimeout(r, 2000));
    page.type('#jobs-search-box-location-id-ember22', jobLocation)
    await new Promise(r => setTimeout(r, 1000));
    page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 5000));
    page.click('#ember329 > button');
    await new Promise(r => setTimeout(r, 2000));
    page.click('#timePostedRange-r86400');
    await new Promise(r => setTimeout(r, 2000));
    page.click('#ember533')

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
    await new Promise(r => setTimeout(r, 7000));
    page.click('#SearchForm > div.d-flex.d-lg-none.pr-std > button')
    await new Promise(r => setTimeout(r, 2000));
    page.type('#scKeyword', jobTitle)
    await new Promise(r => setTimeout(r, 2000));
    page.click('#scLocation', { clickCount: 3 })
    await new Promise(r => setTimeout(r, 1000));
    page.type('#scLocation', jobLocation)
    await new Promise(r => setTimeout(r, 1000));
    page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 4000));
    page.click('#Discover > div > div > div.d-flex.flex-column.col-lg-8.col-12.mt-lg-0 > div:nth-child(1) > div.mt-std.d-flex.justify-content-center > a')

}

//------------------------------------------\\


//                  Indeed                \\
async function indeedLogin(page) {
    await page.goto(jobBoardWebsites.indeed.URL, {
        waitUntil: "networkidle0",
    });
    await new Promise(r => setTimeout(r, 3000));
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

async function indeedJobs24Hours(page) {
    await page.goto(jobBoardWebsites.indeed.URL, {
        waitUntil: "networkidle0",
    });
    await new Promise(r => setTimeout(r, 3000));
    page.type('#text-input-what', jobTitle);
    await new Promise(r => setTimeout(r, 1000));
    page.keyboard.press('Tab');
    page.click('#text-input-where', { clickCount: 3 })
    await new Promise(r => setTimeout(r, 1000));
    page.type('#text-input-where', jobLocation)
    await new Promise(r => setTimeout(r, 1000));
    page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 3000));
    page.click('#filter-dateposted');
    await new Promise(r => setTimeout(r, 2000));
    page.click('#filter-dateposted-menu > li:nth-child(1) > a')



}


//------------------------------------------\\


//                  Google                \\

async function googleJobs24Hours(page) {
    await page.goto(jobBoardWebsites.google.URL, {
        waitUntil: "networkidle0",
    });
    page.type('#APjFqb', jobTitle + " jobs, " + jobLocation);
    await new Promise(r => setTimeout(r, 1000))
    page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 3000))
    page.click('#fMGJ3e > a');
    await new Promise(r => setTimeout(r, 3000))
    page.click('#choice_box_root > div.vk0qtc > div.w0rs6e > span:nth-child(5)');
    await new Promise(r => setTimeout(r, 2000))
    page.click('#choice_box_root > div.KzzVYe > div:nth-child(4) > div.JMgW3.tl-single-select > div:nth-child(2)')


}