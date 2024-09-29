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
    const reader = new FileReader();
    reader.onload = async () => {
        try {
            const outputBuffer = await convertHEIC(reader.result);
            const downloadButton = document.createElement('button');
            downloadButton.textContent = 'Download';
            downloadButton.onclick = () => {
                const blob = new Blob([outputBuffer], {type: 'image/jpeg'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name.replace(/\.heic$|.HEIC$/, '.jpg');
                a.click();
            };
            if (autoDownloadElement.checked) {
                downloadButton.click();
            }
            item.appendChild(downloadButton);
        } catch (e) {
            console.error(e);
        }
    };
    reader.onprogress = (e) => {
        if (e.lengthComputable) {
            const progress = e.loaded / e.total * 100;
            name.textContent = `${file.name} (${progress.toFixed(2)}%)`;
        }
    }
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
