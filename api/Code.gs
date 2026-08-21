const SPREADSHEET_ID = '13TQ-pX_dWd9dgl8dcMlC9mfSNGf6euaHELXg7tDO6Ng';
const SHEET_NAME = 'TRIP DETAILS';

function doGet(e) {
  const view = (e && e.parameter && e.parameter.view) || 'all';
  const company = ((e && e.parameter && e.parameter.company) || '').trim().toLowerCase();

  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet) return json({error:'Sheet not found: ' + SHEET_NAME});

  const values = sheet.getDataRange().getValues();
  if (!values.length) return json(view === 'company' ? {companyName: company, trips: []} : []);

  const headers = values.shift().map(String);
  const data = values.map(row => {
    const o = {};
    headers.forEach((h,i) => {
      o[h] = row[i] instanceof Date ? row[i].toISOString() : row[i];
    });
    return o;
  });

  if (view === 'company') {
    const companyIdField = headers.find(h => h.toLowerCase() === 'company id');
    const companyNameField = headers.find(h => h.toLowerCase() === 'company name');

    if (!companyIdField) {
      return json({
        error: 'Company ID column not found. Add a column named "Company ID" to TRIP DETAILS.'
      });
    }

    const trips = data.filter(x =>
      String(x[companyIdField] || '').trim().toLowerCase() === company
    );

    const companyName = trips.length && companyNameField
      ? String(trips[0][companyNameField] || company)
      : company;

    // Public/company-safe fields only.
    const safeTrips = trips.map(x => ({
      'Start Date/Time': x['Start Date/Time'],
      'End Date/Time': x['End Date/Time'],
      'KTC Request': x['KTC Request'],
      'Trip Type': x['Trip Type'],
      'Car': x['Car'],
      'Driver': x['Driver'],
      'Actual KM': x['Actual KM'],
      'Trip Description': x['Trip Description']
    }));

    return json({companyName, trips: safeTrips});
  }

  return json(data);
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
