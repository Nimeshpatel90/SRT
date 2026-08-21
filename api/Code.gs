const SPREADSHEET_ID="13TQ-pX_dWd9dgl8dcMlC9mfSNGf6euaHELXg7tDO6Ng";
const SHEET_NAME="TRIP DETAILS";

function doGet(){
  const sh=SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  if(!sh)return json({error:"TRIP DETAILS sheet not found"});
  const lastRow=sh.getLastRow(), lastCol=sh.getLastColumn();
  if(lastRow<3)return json({company:"KTC",totalTrips:0,trips:[]});

  const h=sh.getRange(1,1,2,lastCol).getDisplayValues();
  const headers=h[0].map((a,i)=>{
    const b=String(h[1][i]||"").trim(), a1=String(a||"").trim();
    return (a1&&b?(a1+" "+b):a1||b).replace(/\s+/g," ").trim();
  });

  const rows=sh.getRange(3,1,lastRow-2,lastCol).getDisplayValues()
    .filter(r=>r.some(v=>String(v).trim()!==""));

  const trips=rows.map(r=>{
    const o={}; headers.forEach((h,i)=>{if(h)o[h]=r[i]}); return o;
  });

  const find=(o,names)=>{
    const keys=Object.keys(o);
    for(const n of names){
      const k=keys.find(x=>x.toLowerCase().trim()===n.toLowerCase().trim());
      if(k)return o[k];
    }
    for(const n of names){
      const k=keys.find(x=>x.toLowerCase().includes(n.toLowerCase()));
      if(k)return o[k];
    }
    return "";
  };

  const safe=trips.map(t=>({
    "KTC Rq Num":find(t,["KTC Rq Num","KTC Request"]),
    "GUEST COMPANY":find(t,["GUEST COMPANY","COMPANY"]),
    "GUEST MOBILE":find(t,["GUEST MOBILE","MOBILE"]),
    "TRIP TYPE":find(t,["TRIP TYPE"]),
    "CAR":find(t,["CAR"]),
    "DRIVER":find(t,["DRIVER"]),
    "Start Date":find(t,["Start Date"]),
    "Start Time":find(t,["Start Time"]),
    "Start KM":find(t,["Start KM"]),
    "End Date":find(t,["End Date"]),
    "End Time":find(t,["End Time"]),
    "End KM":find(t,["End KM"]),
    "Actual KM":find(t,["Actual KM"]),
    "Toll":find(t,["Toll"]),
    "Parking":find(t,["Parking"]),
    "Trip Description":find(t,["Trip Description"])
  }));

  return json({company:"KTC",totalTrips:safe.length,trips:safe});
}

function json(data){
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}