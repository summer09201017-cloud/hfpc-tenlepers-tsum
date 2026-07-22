// 烤曉臻(zh-TW-HsiaoChenNeural)語音三句 → voice/*.mp3(逐句落盤,重跑到「新產 0」即完成)
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require2 = createRequire('C:/Users/HFP/Downloads/hfpc-git/hfpc-paul-game/node_modules/');
const { MsEdgeTTS, OUTPUT_FORMAT } = require2('msedge-tts');

const OUT = path.resolve(import.meta.dirname, '..', 'voice');
fs.mkdirSync(OUT, { recursive: true });
const LINES = [
  ['intro', '你們去把身體給祭司察看。他們去的時候就潔淨了。'],
  ['bless', '內中有一個見自己已經好了,就回來大聲歸榮耀與神,又俯伏在耶穌腳前感謝他;這人是撒馬利亞人。'],
  ['win', '耶穌說:潔淨了的不是十個人嗎?那九個在哪裡呢?就對那人說:起來,走吧!你的信救了你了。路加福音十七章,十五至十九節。']
];
let made = 0;
for (const [name, text] of LINES) {
  const file = path.join(OUT, name + '.mp3');
  if (fs.existsSync(file) && fs.statSync(file).size > 2000) continue;
  const tts = new MsEdgeTTS();
  await tts.setMetadata('zh-TW-HsiaoChenNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const { audioStream } = await tts.toStream(text);
  const chunks = [];
  await new Promise((res, rej) => {
    audioStream.on('data', c => chunks.push(c));
    audioStream.on('end', res);
    audioStream.on('error', rej);
  });
  fs.writeFileSync(file, Buffer.concat(chunks));
  made++;
  console.log('baked', name, fs.statSync(file).size, 'bytes');
}
console.log('done, 新產', made);
process.exit(0);
