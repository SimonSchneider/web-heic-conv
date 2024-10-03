import { handleVideoFile } from './ffmpeg.js';

const heicConvert = import('heic-convert/browser.js');
import { fileInputSource, getFileList, getControls } from './common.js';

const fileList = getFileList('fileList');
const controls = getControls('controls');

async function convertHEIC(arrayBuffer, format) {
  const inputBuffer = new Uint8Array(arrayBuffer);
  const outputBuffer = await heicConvert.then((conv) =>
    conv({
      buffer: inputBuffer,
      format: format.toUpperCase(),
      quality: controls.quality,
    })
  );
  return new Blob([outputBuffer], { type: `image/${format.toLowerCase()}` });
}

function handleFile(file) {
  const fileEntry = fileList.add(file);
  const reader = new FileReader();
  reader.onload = async () => {
    const format = controls.format;
    // const blob = await convertHEIC(reader.result, format);
    const blob = await handleVideoFile(file, reader.result);
    fileEntry.downloadReady(blob, 'mp4', controls.autoDownload);
  };
  reader.readAsArrayBuffer(file);
}

fileInputSource('fileInput', handleFile);
