const heicConvert = import('heic-convert/browser.js');
import { fileInputSource, getFileList, getControls } from './common.js';

const fileList = getFileList('fileList');
const controls = getControls('controls');

function convertHEIC(arrayBuffer, format) {
  const inputBuffer = new Uint8Array(arrayBuffer);
  return heicConvert.then((conv) =>
    conv.default({
      buffer: inputBuffer,
      format: format.toUpperCase(),
      quality: controls.quality,
    })
  );
}

function handleFile(file) {
  const fileEntry = fileList.add(file);
  const reader = new FileReader();
  reader.onload = async () => {
    const format = controls.format;
    const outputBuffer = await convertHEIC(reader.result, format);
    const blob = new Blob([outputBuffer], { type: `image/${format}` });
    fileEntry.downloadReady(blob, format, controls.autoDownload);
  };
  reader.readAsArrayBuffer(file);
}

fileInputSource('fileInput', handleFile);
