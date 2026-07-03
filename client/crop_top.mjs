import sharp from 'sharp';
await sharp('C:/Users/Yiwen/AppData/Local/Temp/claude/E--prague-stories/0323243d-934c-40f8-a3da-921a02fb1692/scratchpad/bleed-check2.png')
  .extract({ left: 600, top: 0, width: 570, height: 120 })
  .resize(1710, 360) // 3x zoom
  .toFile('C:/Users/Yiwen/AppData/Local/Temp/claude/E--prague-stories/0323243d-934c-40f8-a3da-921a02fb1692/scratchpad/top-crop-zoom.png');
console.log('done');
