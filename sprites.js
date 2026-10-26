// Original low-resolution sprite artwork. Likeness remains provisional until photo references are available.
const looks = [
  { hair: 'crop', top: '#bccb58', light: '#e6ee94', shadow: '#738034', pants: '#252f32', shoe: '#e2dec4' },
  { hair: 'coils', top: '#c8b696', light: '#f1dfba', shadow: '#8f7459', pants: '#303039', shoe: '#e7d9be' },
  { hair: 'high', top: '#87a8b9', light: '#bfdfdf', shadow: '#4b667e', pants: '#262a3b', shoe: '#b8d9dd' },
  { hair: 'close', top: '#b88e79', light: '#e3b6a0', shadow: '#775342', pants: '#282729', shoe: '#d7c5b4' },
];
export function drawSprite(context, fighter, index, pose = 'idle', frame = 0) {
  const look = looks[index];
  const outline = '#11131d';
  const skin = fighter.skin;
  const box = (x,y,w,h,color) => {context.fillStyle=color;context.fillRect(x,y,w,h);};
  const limb = (x,y,w,h,color) => {box(x-1,y-1,w+2,h+2,outline);box(x,y,w,h,color);};
  const bob = pose === 'idle' ? frame % 2 : 0;
  context.save();context.translate(0,bob);
  // Legs use discrete animation frames, so every edge stays on the sprite grid.
  const stride = pose === 'run' ? [0,4,0,-4][frame % 4] : pose === 'jump' ? 3 : 0;
  limb(18-stride,43,6,15,look.pants);limb(27+stride,43,6,15,look.pants);
  box(19-stride,45,2,11,'#525263');box(28+stride,45,2,11,'#525263');
  limb(16-stride,58,9,3,look.shoe);limb(27+stride,58,10,3,look.shoe);
  // Back arm, then jacket and neck.
  limb(13,28,5,15,look.shadow);limb(13,42,5,4,skin);
  limb(18,27,16,18,look.top);box(18,29,3,14,look.light);box(29,29,5,15,look.shadow);
  box(24,28,3,16,outline);box(21,27,9,3,'#ecded0');box(23,25,6,4,skin);
  box(18,43,16,3,outline);box(25,43,3,2,'#c8c1a0');
  // Pixel head: brow, eye whites, cheek plane, nose, mouth and jaw.
  limb(19,11,14,13,skin);box(21,24,10,2,skin);box(30,15,3,8,'#34252a');
  box(20,13,2,7,'#bc846455');box(22,15,4,1,outline);box(29,15,3,1,outline);
  box(22,16,3,1,'#e6d8c5');box(29,16,2,1,'#e6d8c5');box(24,16,1,1,outline);box(30,16,1,1,outline);
  box(27,17,2,3,'#35252a');box(25,22,5,1,'#2c2025');box(22,23,2,1,'#b07858');
  // Different provisional silhouettes. Do not describe these as verified likenesses.
  if(look.hair==='high'){box(18,5,15,8,outline);box(20,3,10,4,outline);box(20,6,3,3,'#363039');box(27,5,3,2,'#363039');}
  else if(look.hair==='coils'){box(18,9,16,5,outline);for(let x=18;x<34;x+=4){box(x,7,3,3,outline);box(x+1,9,1,1,'#3e3337');}}
  else if(look.hair==='crop'){box(18,8,15,5,outline);box(20,7,10,2,outline);box(19,10,3,2,'#373139');}
  else {box(19,9,14,3,outline);box(19,12,2,3,outline);box(20,10,10,1,'#373139');}
  box(18,16,2,5,skin);
  if(pose==='attack'||pose==='power'){
    limb(32,28,7,5,look.light);limb(39,28,8,4,skin);limb(46,26,5,6,skin);
    if(pose==='power'){box(50,22,2,3,'#e4ff8e');box(53,27,4,2,'#ffffff');box(50,34,2,3,'#bce55c');}
  }else{limb(32,29,5,12,look.top);limb(32,40,5,5,skin);box(32,30,2,8,look.light);}
  context.restore();
}
export function spritePortrait(fighter,index){
  const canvas=document.createElement('canvas');canvas.width=64;canvas.height=70;
  const context=canvas.getContext('2d');context.imageSmoothingEnabled=false;
  context.translate(4,2);drawSprite(context,fighter,index);
  return canvas.toDataURL('image/png');
}
