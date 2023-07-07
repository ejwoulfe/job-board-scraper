const XLSX = require('xlsx');
const path = require('path');


function exportJobsToFile(jobObjects) {

    const columnHeaders = [
        "Job Title",
        "Company Name",
        "Location and Age",
        "# of Applicants",
        "Apply Link"
    ];
    const workSheetName = "Jobs"
    const filePath = './jobs.xlsx';

    const data = jobObjects.map((job => {
        return [job.title, job.companyName, job.location, job.numOfApplicants, job.apply];
    }))
    const workBook = XLSX.utils.book_new();
    const workSheetData = [
        columnHeaders,
        ...data
    ];
    const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);
    XLSX.utils.book_append_sheet(workBook, workSheet, workSheetName);
    XLSX.writeFile(workBook, path.resolve(filePath));

}

module.exports = exportJobsToFile;