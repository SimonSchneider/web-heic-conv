import heicConvert from 'heic-convert/browser.js';

const qualityElement = document.getElementById('quality');

function convertHEIC(arrayBuffer) {
    const inputBuffer = new Uint8Array(arrayBuffer);
    return heicConvert({
        buffer: inputBuffer,
        format: 'JPEG',
        quality: qualityElement.value,
    });
}

const autoDownloadElement = document.getElementById('autoDownload');

function newFileListItem(file) {
    const item = document.createElement('li');
    const name = document.createElement('span');
    name.textContent = file.name;
    item.appendChild(name);
    const a = document.createElement('a');
    a.textContent = 'Download';
    a.setAttribute("class", "disabled")
    item.appendChild(a);
    const reader = new FileReader();
    reader.onload = async () => {
        const outputBuffer = await convertHEIC(reader.result);
        const blob = new Blob([outputBuffer], {type: 'image/jpeg'});
        a.href = URL.createObjectURL(blob);
        a.setAttribute("class", "")
        a.download = file.name.replace(/\.heic$|.HEIC$/, '.jpg');
        if (autoDownloadElement.checked) {
            a.click();
        }
    };
    reader.readAsArrayBuffer(file);
    return item;
}

const list = document.getElementById('fileList');

document.getElementById('fileInput').addEventListener('change', async (e) => {
    const files = e.target.files;
    if (!files.length) {
        return;
    }
    for (const file of files) {
        list.appendChild(newFileListItem(file));
    }
});

console.log('Hello, world!');
