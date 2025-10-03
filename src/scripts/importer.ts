import path from "path";
import {google} from 'googleapis';
import { authenticate } from "@google-cloud/local-auth";
import axios from "axios"

// The scope for reading spreadsheets.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The path to the credentials file.
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

const readFromSheets = async() =>{
    const auth = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    })
    const sheets = google.sheets({version: "v4", auth})

    const result = await sheets.spreadsheets.values.get({
        spreadsheetId: '1b-P5ic_7aGN0hPdZm3KuOfWIIEcpD47Y2ZMj3ADjn4o',
        range: 'logs!A2:I'
    })
    const rows = result.data.values
    
    rows?.forEach(async (row)=>{
        await axios.post("http://localhost:5000/buildings", {name: row[3], lat: row[5], lng: row[6]})
    })
}


await readFromSheets()