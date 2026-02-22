const FOLDER_ID = '15opHbX_z0iSyUL0XR0XF8H9owpKRA_u-';
const API_KEY = 'AIzaSyD1pUOeZCHHTlUeNmriN8OZ1C3RvJCN6JE';

async function listFiles() {
    const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+trashed=false&key=${API_KEY}&fields=files(id,name)&pageSize=30`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(JSON.stringify(data.files, null, 2));
}

listFiles();
