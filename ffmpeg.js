import { FFmpeg } from '@ffmpeg/ffmpeg';

const message = document.getElementById('message');

async function toBlobURL(url, mimeType) {
  console.log('getting buffer', url);
  const buf = await (await fetch(url)).arrayBuffer();
  console.log('got buffer', url);
  const blob = new Blob([buf], { type: mimeType });
  return URL.createObjectURL(blob);
}

async function load() {
  console.log('setting up ffmpeg');
  const ffmpeg = new FFmpeg();
  ffmpeg.on('log', ({ message }) => {
    console.log(message);
  });
  ffmpeg.on('progress', ({ progress }) => {
    message.innerHTML = `${progress * 100} %`;
  });
  // const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
  const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
  // const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/umd'
  const [coreURL, wasmURL, workerURL] = await Promise.all([
    toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
  ]);

  console.log('loading ffmpeg here');
  await ffmpeg.load({
    coreURL,
    wasmURL,
    workerURL,
  });
  console.log('ffmpeg loaded');
  return ffmpeg;
}

const ffmpegLoader = load();

const transcode = async (file, inpData) => {
  console.log('loading ffmpg');
  const ffmpeg = await ffmpegLoader;
  const name = file.name;
  console.log('ffmpeg loaded', name);
  await ffmpeg.writeFile(name, inpData);
  console.log('file written');
  await ffmpeg.exec([
    '-threads',
    '4',
    '-i',
    name,
    '-s',
    '1280x720',
    // '-acodec',
    // 'copy',
    // '-y',
    // '-vcodec', 'libx265',
    // '-vf', 'scale=480:-2,setsar=1:1',
    // '-crf', '28',
    // '-b', '400k',
    'output.mp4',
  ]);
  console.log('file transcoded');
  const data = await ffmpeg.readFile('output.mp4');
  console.log('file read');
  return new Blob([data.buffer], { type: 'video/mp4' });
};

export async function handleVideoFile(file, inpData) {
  console.log('getting file', file);
  // const inpData = await fetch('https://raw.githubusercontent.com/ffmpegwasm/testdata/master/Big_Buck_Bunny_180_10s.webm').then(d => d.arrayBuffer()).then(d => new Uint8Array(d));
  return await transcode(file, new Uint8Array(inpData));
}
