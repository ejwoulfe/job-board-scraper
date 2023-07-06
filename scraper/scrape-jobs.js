const puppeteer = require('puppeteer');
const jobBoardWebsites = require('./job-board-websites.js');
require('dotenv').config();


const jobTitle = "Front End Developer";
const jobLocation = "United States";

(async () => {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ['--window-size=1620,900'], });
    const page = await browser.newPage();


    await linkedInLogin(page);
    await new Promise(r => setTimeout(r, 15000));

    await linkedInJobs24Hours(page, jobTitle, jobLocation, 0);
    await new Promise(r => setTimeout(r, 5000));
    await scrapeJobs(page, browser);
    // await glassDoorLogin(page);
    // await queryGlassDoorJobs(page);
    // await indeedJobs24Hours(page);
    // await googleJobs24Hours(page);


    // await new Promise(r => setTimeout(r, 3000));
    // await browser.close();
})();

async function linkedInJobs24Hours(page, title, location, start) {
    let queryTitle = title.replaceAll(' ', '%20');
    let queryLocation = location.replaceAll(' ', '%20').replaceAll(',', '%2C');

    if (start === 0) {
        await page.goto(`https://www.linkedin.com/jobs/search/?keywords=${queryTitle}&location=${queryLocation}&f_TPR=r86400&refresh=true`, {
            waitUntil: "domcontentloaded",
        });
    } else {
        await page.goto(`https://www.linkedin.com/jobs/search/?keywords=${queryTitle}&location=${queryLocation}&f_TPR=r86400&refresh=true&start=${start}`, {
            waitUntil: "domcontentloaded",
        });
    }



}
async function scrapeJobs(page, browser) {
    //listContainer, cardContainer, jobTitle, jobLocation, companyName, applyNowButton, jobDescription



    const listContainer = '#main > div > div.scaffold-layout__list > div > ul';

    const cardContainer = '#main > div > div.scaffold-layout__detail.overflow-x-hidden.jobs-search__job-details';

    const applyButtonSelector = '#main > div > div.scaffold-layout__detail.overflow-x-hidden.jobs-search__job-details div.relative.jobs-unified-top-card__container--two-pane > div.jobs-unified-top-card__content--two-pane > div:nth-child(4) > div > div > div button';



    const listLimit = await page.evaluate(() => {
        let numOfResults = document.querySelector("#main > div > div.scaffold-layout__list > header > div.jobs-search-results-list__title-heading > small > div > span").innerText;
        return Number(numOfResults.split(' ')[0].replace(',', ''));

    })


    let numOfListItems = await page.evaluate(() => {
        return document.querySelectorAll('#main > div > div.scaffold-layout__list > div > ul > li').length
    });
    let pageNumber = 1;




    for (let i = 1; i <= listLimit; i++) {

        let listElement = `${listContainer} > li:nth-child(${i})`;
        console.log(listElement)



        await page.click(`${listContainer} > li:nth-child(${i})`);
        console.log("list item " + i)
        await new Promise(r => setTimeout(r, 5000));


        // let element = await page.waitForSelector(applyButtonSelector);
        // let applyButtonText = await element.evaluate(el => el.textContent);

        // // Job Title
        // let cardJobTitle = await page.evaluate((cardContainer) => {
        //     return document.querySelector(`${cardContainer} h2`).innerText;
        // }, cardContainer)
        // console.log(cardJobTitle)
        // if (applyButtonText.trim() === "Easy Apply") {
        //     console.log("easy found")
        //     await new Promise(r => setTimeout(r, 2000));
        //     continue;
        // } else {
        //     console.log('else')

        //     await page.click(applyButtonSelector);
        //     await new Promise(r => setTimeout(r, 7000));
        //     const pages = await browser.pages()
        //     const applyLink = pages[2].url();
        //     console.log(applyLink);
        //     await pages[2].close();
        // }
        if (i === numOfListItems) {
            linkedInJobs24Hours(page, jobTitle, jobLocation, pageNumber * 25)
            await new Promise(r => setTimeout(r, 5000));
            pageNumber += 1;

            i = 0;
            numOfListItems = await page.evaluate(() => {
                return document.querySelectorAll('#main > div > div.scaffold-layout__list > div > ul > li').length
            });
            console.log(numOfListItems)
            await new Promise(r => setTimeout(r, 5000));

        }



    }

    // // Company Name
    // const jobInformation = document.querySelector('div.jobs-unified-top-card__primary-description').innerText;
    // let infoArray = jobInformation.split('·');







}

//                  LinkedIn                \\
async function linkedInLogin(page) {
    await page.goto(jobBoardWebsites.linkedIn.URL);
    page.type('#session_key', process.env.ACCOUNT_USERNAME);
    await new Promise(r => setTimeout(r, 1000));
    page.type('#session_password', process.env.ACCOUNT_PASSWORD);
    await new Promise(r => setTimeout(r, 1000));
    page.click('div.flex.justify-between.sign-in-form__footer--full-width > button')

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
    await new Promise(r => setTimeout(r, 7000));
    page.click('#Discover > div > div > div.d-flex.flex-column.col-lg-8.col-12.mt-lg-0 > div:nth-child(1) > div.mt-std.d-flex.justify-content-center > a')
    await new Promise(r => setTimeout(r, 3000));
    return;

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
    await new Promise(r => setTimeout(r, 3000));
    return;



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
    await new Promise(r => setTimeout(r, 3000));
    return;


}

