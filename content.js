// This script reads the page text to find job details automatically
function scrapeJobDetails() {
    let title = "Unknown Position";
    let company = "Unknown Company";
    // Quick look for heading tags where job titles usually live
    const h1Elements = document.querySelectorAll('h1');
    if (h1Elements.length > 0) {
        
        title = h1Elements[0].innerText.trim();
    }

    // Look around the page title or common text layout for company names
    const possibleCompanies = document.querySelectorAll('.company, [class*="company"], h2');
    if (possibleCompanies.length > 0) {
        company = possibleCompanies[0].innerText.trim();
    }

    return { title, company };
}
// Send the details back to our popup window when asked
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getJobDetails") {
        sendResponse(scrapeJobDetails());
    }
});
