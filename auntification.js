// import fs from 'fs';
// import {promisify} from 'util';
// import {google} from 'googleapis';
// import path from 'path';

// const readFile = promisify( fs.readFile );
// const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// const CREDENTIALS_PATH = path.join('credentials.json' );


// const getAuthClient = async () => {
//    const content = await readFile( CREDENTIALS_PATH )
//        .catch( error => console.log( 'Error loading client secret file:', error ) );

//    const { client_email, private_key } = JSON.parse( content );

//    const client = new google.auth.JWT(
//        client_email,
//        null,
//        private_key,
//        SCOPES,
//        null,
//    );
//    return client;
// };


// export default getAuthClient;