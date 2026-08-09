/**
 * Google Apps Script for India GCC Admin Panel
 *
 * Deploy this as a Web App to use Google Sheets as your database.
 *
 * Instructions:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Paste this entire file
 * 4. Click Deploy → New deployment → Web app
 * 5. Set "Execute as: Me" and "Who has access: Anyone"
 * 6. Authorize permissions and copy the Web App URL
 * 7. Paste the URL into the Admin Settings page
 */

// Your Google Sheet ID (from the URL: docs.google.com/spreadsheets/d/THIS_PART/edit)
var SHEET_ID = '10dSjik_VyOgz0x9QPdAtuw78ueWP0LAR0cO1RFpFQjc';
var DATA_SHEET = 'SiteData';

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    var action = (e.parameter.action || (e.postData && JSON.parse(e.postData.contents).action) || '');

    if (action === 'read') {
      var data = readData();
      output.setContent(JSON.stringify({ success: true, data: data }));
    } else if (action === 'write') {
      var postData = e.postData ? JSON.parse(e.postData.contents) : {};
      var dataToWrite = postData.data;
      writeData(dataToWrite);
      output.setContent(JSON.stringify({ success: true }));
    } else {
      output.setContent(JSON.stringify({ success: false, error: 'Unknown action: ' + action }));
    }
  } catch (err) {
    output.setContent(JSON.stringify({ success: false, error: err.toString() }));
  }

  return output;
}

function readData() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(DATA_SHEET);

  if (!sheet || sheet.getLastRow() === 0) {
    // Return default empty structure if sheet is empty
    return {
      teamMembers: [],
      modules: [],
      gallery: [],
      config: { tools: [], checklist: [] },
    };
  }

  var values = sheet.getRange('A1').getValue();
  try {
    return JSON.parse(values);
  } catch (e) {
    return {
      teamMembers: [],
      modules: [],
      gallery: [],
      config: { tools: [], checklist: [] },
    };
  }
}

function writeData(data) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(DATA_SHEET);

  if (!sheet) {
    sheet = ss.insertSheet(DATA_SHEET);
  }

  // Clear existing data
  sheet.clearContents();

  // Write JSON data to cell A1
  sheet.getRange('A1').setValue(JSON.stringify(data));
}

/**
 * Run this function once manually to initialize the sheet
 * with the default data structure.
 */
function initializeSheet() {
  var defaultData = {
    teamMembers: [],
    modules: [],
    gallery: [],
    config: { tools: [], checklist: [] },
  };
  writeData(defaultData);
}
