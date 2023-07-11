const puppeteer = require('puppeteer');
const jobBoardWebsites = require('./job-board-websites.js');
const exportJobsToFile = require('./export-to-Excel.js');

require('dotenv').config();


const jobTitle = "Front End Developer";
const jobLocation = "Florida, United States";

(async () => {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ['--window-size=1620,900'], });
    const page = await browser.newPage();


    await linkedInLogin(page);
    await new Promise(r => setTimeout(r, 15000));

    await linkedInJobs24Hours(page, jobTitle, jobLocation, 0);
    await new Promise(r => setTimeout(r, 5000));

    let jobs = await scrapeJobs(page, browser);
    exportJobsToFile(jobs);
    await new Promise(r => setTimeout(r, 3000));
    await browser.close();
})();

async function linkedInJobs24Hours(page, title, location, start) {
    let queryTitle = title.replaceAll(' ', '%20');
    let queryLocation = location.replaceAll(' ', '%20').replaceAll(',', '%2C');

    if (start === 0) {
        await page.goto(`https://www.linkedin.com/jobs/search/?keywords=${queryTitle}&location=${queryLocation}&f_TPR=r86400&refresh=true&f_E=2`, {
            waitUntil: "domcontentloaded",
        });
    } else {
        await page.goto(`https://www.linkedin.com/jobs/search/?keywords=${queryTitle}&location=${queryLocation}&f_TPR=r86400&refresh=true&start=${start}&f_E=2`, {
            waitUntil: "domcontentloaded",
        });
    }

    // await page.goto(`https://www.linkedin.com/jobs/search/?keywords=${queryTitle}&location=${queryLocation}&f_TPR=r86400&refresh=true&start=50&f_E=2`, {
    //     waitUntil: "domcontentloaded",
    // });



}
async function scrapeJobs(page, browser) {
    //listContainer, cardContainer, jobTitle, jobLocation, companyName, applyNowButton, jobDescription

    let jobObjectsArr = [];



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
    let totalJobsScraped = 0;




    for (let i = 1; i <= listLimit; i++) {

        console.log("i: " + i)
        await page.evaluate((listContainer, i) => {
            document.querySelector(`${listContainer} > li:nth-child(${i})`).scrollIntoView();
        }, listContainer, i)

        await page.click(`${listContainer} > li:nth-child(${i})`);
        await new Promise(r => setTimeout(r, 2000));
        totalJobsScraped += 1;
        console.log(totalJobsScraped)

        if ((totalJobsScraped >= listLimit) === true) {
            break;
        }





        // Job Title
        let cardJobTitle = await page.evaluate((cardContainer) => {
            return document.querySelector(`${cardContainer} h2`).innerText;
        }, cardContainer)

        const promoted = await page.evaluate(() => {
            return document.querySelector('div > div.job-card-container.relative.job-card-list.job-card-container--clickable.job-card-list--underline-title-on-hover.jobs-search-results-list__list-item--active > ul').innerText

        })



        const jobInformation = await page.evaluate(() => {
            return document.querySelector('div.jobs-unified-top-card__primary-description').innerText.split('  ');

        })
        let companyName = jobInformation[0];
        console.log(companyName)

        if (promoted.trim() === "Promoted" || promoted.trim() === "Expired" || promoted.trim().includes('Easy Apply')) {
            await new Promise(r => setTimeout(r, 2000));

        } else if (companyName.trim() === "Dice") {
            await new Promise(r => setTimeout(r, 2000));

        } else {

            await new Promise(r => setTimeout(r, 2000));
            await page.click(applyButtonSelector);
            await new Promise(r => setTimeout(r, 7000));
            const pages = await browser.pages()
            console.log(pages[2])
            if (pages[2] !== undefined) {
                const applyLink = pages[2].url();
                await pages[2].close();
                console.log(jobInformation)
                jobObjectsArr.push({
                    title: cardJobTitle, companyName: jobInformation[0]?.trim(), location: jobInformation[1]?.trim(), numOfApplicants: jobInformation[2]?.trim(), apply: applyLink
                })
            }





        }

        if (i === numOfListItems) {
            linkedInJobs24Hours(page, jobTitle, jobLocation, pageNumber * 25)
            await new Promise(r => setTimeout(r, 5000));
            pageNumber += 1;
            console.log(pageNumber)

            i = 0;
            numOfListItems = await page.evaluate(() => {
                return document.querySelectorAll('#main > div > div.scaffold-layout__list > div > ul > li').length
            });



            await new Promise(r => setTimeout(r, 5000));

        }



    }




    return jobObjectsArr;


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

