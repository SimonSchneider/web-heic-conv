import heicConvert from 'heic-convert/browser.js';
import {downloadElem, downloadReady, fileInputSource, getControls} from "./common.js";

const controls = getControls('controls');

function convertHEIC(arrayBuffer, format) {
    const inputBuffer = new Uint8Array(arrayBuffer);
    return heicConvert({
        buffer: inputBuffer,
        format,
        quality: controls.quality,
    });
}

function newFileListItem(file) {
    const item = document.createElement('li');
    const name = document.createElement('span');
    name.textContent = file.name;
    item.appendChild(name);
    const a = item.appendChild(downloadElem());
    const reader = new FileReader();
    reader.onload = async () => {
        const format = controls.format;
        const lcFormat = format.toLowerCase();
        const outputBuffer = await convertHEIC(reader.result, format);
        const blob = new Blob([outputBuffer], {type: `image/${lcFormat}`});
        downloadReady(a, blob, file.name, lcFormat, controls.autoDownload);
    };
    reader.readAsArrayBuffer(file);
    return item;
}

const list = document.getElementById('fileList');

fileInputSource('fileInput', (file) => {
    list.appendChild(newFileListItem(file));
});
