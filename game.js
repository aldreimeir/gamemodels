import {drawSprite, spritePortrait} from './sprites.js';
const roster=[
{name:'Lengvert',title:'The wildcard',skin:'#9b6344',hair:'#211b18',color:'#c8ed54',tone:'#646e37',speed:5.3,power:1.05,url:'https://www.instagram.com/lengvert/'},
{name:'Daniel Onaghise',title:'The heavyweight',skin:'#6b3927',hair:'#181717',color:'#c4b299',tone:'#655541',speed:4.5,power:1.3,url:'https://www.kult.com.au/men/mainboard/639-daniel-onaghise'},
{name:'Letsi',title:'The quick step',skin:'#79503c',hair:'#201c19',color:'#a3b9c1',tone:'#435b61',speed:6.2,power:.9,url:'https://imgmodels.com/directory/sydney/letsi/'},
{name:'Magol Maker',title:'The closer',skin:'#492c24',hair:'#141515',color:'#c69c83',tone:'#664b45',speed:5,power:1.15,url:'https://imgmodels.com/directory/sydney/magol-maker/'}];
function portrait(r,i){return `<img class="pixel-portrait" src="${spritePortrait(r,i)}" alt="${r.name} provisional pixel-art fighter; photo likeness pending">`;}

let selected=0;
const cards=document.querySelector('#cards');
function renderCards(){cards.innerHTML=roster.map((r,i)=>`<div class="card ${i===selected?'selected':''}" role="button" tabindex="0" aria-pressed="${i===selected}" data-i="${i}"><div class="portrait" style="--tone:${r.tone}">${portrait(r,i)}<span class="card-num">0${i+1} / RR</span>${i===selected?'<span class="selected-label">● SELECTED</span>':''}</div><div class="card-info"><h3>${r.name}</h3><p>${r.title.toUpperCase()}</p><div class="stats"><span>SPD <b>${'▰'.repeat(Math.round(r.speed)-2)}</b></span><span>PWR <b>${'▰'.repeat(Math.round(r.power*3))}</b></span></div></div><a class="profile" href="${r.url}" target="_blank" rel="noopener noreferrer" aria-label="${r.name} profile">↗</a></div>`).join('');cards.querySelectorAll('.card').forEach(el=>{const select=()=>{selected=Number(el.dataset.i);renderCards();if(!running)draw();};el.onclick=e=>{if(!e.target.closest('a'))select();};el.onkeydown=e=>{if((e.key==='Enter'||e.key===' ')&&!e.target.closest('a')){e.preventDefault();select();}};});}
const canvas=document.querySelector('#game'),ctx=canvas.getContext('2d'),overlay=document.querySelector('#overlay'),play=document.querySelector('#play'),pauseButton=document.querySelector('#pause'),announcement=document.querySelector('#announcement');
const platforms=[{x:220,y:410,w:760},{x:310,y:290,w:180},{x:710,y:290,w:180}];
let fighters=[],particles=[],running=false,paused=false,time=120,last=0,aiTimer=0;
const keys=new Set();
function makeFighter(index,x,face){return {r:roster[index],x,y:200,vx:0,vy:0,face,damage:0,stocks:3,jumps:0,ground:false,cool:0,flash:0,inv:1,attack:0};}
function start(){fighters=[makeFighter(selected,400,1),makeFighter((selected+1)%4,800,-1)];particles=[];time=120;running=true;paused=false;aiTimer=0;overlay.style.display='none';pauseButton.hidden=false;announcement.textContent='';last=performance.now();canvas.focus();}
play.onclick=start;document.querySelector('#reset').onclick=start;
function pause(){if(!running)return;paused=!paused;announcement.textContent=paused?'PAUSED':'';pauseButton.textContent=paused?'▶':'Ⅱ';}
pauseButton.onclick=pause;
function keyDown(k){if(k==='escape'){pause();return;}if(!keys.has(k)&&running&&!paused){if(k==='w'||k==='arrowup')jump(fighters[0]);if(k==='j')attack(fighters[0],fighters[1],false);if(k==='k')attack(fighters[0],fighters[1],true);}keys.add(k);}
window.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(['w','a','d','j','k','arrowleft','arrowright','arrowup','escape',' '].includes(k)&&!e.target.closest('a,button,[role="button"]'))e.preventDefault();if(!e.target.closest('a,button,[role="button"]'))keyDown(k);});window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>{keys.clear();if(running&&!paused)pause();});
document.querySelectorAll('[data-key]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keyDown(b.dataset.key);};b.onpointerup=b.onpointercancel=()=>keys.delete(b.dataset.key);});
function jump(f){if(f.jumps<2){f.vy=-11.8;f.jumps++;f.ground=false;}}
function attack(f,other,power){if(f.cool>0)return;f.cool=power?.85:.32;f.attack=power?.24:.15;f.heavy=power;const dx=other.x-f.x,dy=Math.abs(other.y-f.y);if(Math.abs(dx)<(power?108:86)&&dy<75&&dx*f.face>-12&&other.inv<=0){const amount=(power?17:8)*f.r.power;other.damage+=amount;const force=(power?6.5:3.7)+other.damage*.075;other.vx=f.face*force*f.r.power;other.vy=-force*.68;other.ground=false;other.flash=.18;other.inv=.2;for(let i=0;i<14;i++)particles.push({x:other.x,y:other.y-32,vx:(Math.random()-.5)*12,vy:(Math.random()-.5)*12,life:.4,color:power?'#d5fa49':'#ffffff'});}}
function finish(message){running=false;pauseButton.hidden=true;overlay.style.display='flex';overlay.querySelector('h3').innerHTML=message;overlay.querySelector('p').textContent='Another look. Another round.';play.innerHTML='RUN IT BACK <span>↗</span>';}
function update(dt){const scale=dt*60;time=Math.max(0,time-dt);const [p,c]=fighters;let direction=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0);if(direction){p.vx+=direction*1.05*scale;if(p.flash<=0)p.face=direction;}
const dx=p.x-c.x;c.face=dx>0?1:-1;if(c.flash<=0){if(Math.abs(dx)>65)c.vx+=Math.sign(dx)*.68*scale;else c.vx*=.82;aiTimer-=dt;if(aiTimer<=0){if((p.y<c.y-45||c.x<250||c.x>950||c.y>430)&&c.jumps<2)jump(c);if(Math.abs(dx)<100&&Math.abs(p.y-c.y)<80)attack(c,p,Math.random()>.65);aiTimer=.24+Math.random()*.27;}}
for(const f of fighters){f.cool=Math.max(0,f.cool-dt);f.flash=Math.max(0,f.flash-dt);f.inv=Math.max(0,f.inv-dt);f.attack=Math.max(0,f.attack-dt);if(f.flash<=0)f.vx=Math.max(-f.r.speed,Math.min(f.r.speed,f.vx));const oldY=f.y;f.vy+=.48*scale;f.x+=f.vx*scale;f.y+=f.vy*scale;f.vx*=Math.pow(f.ground?.8:.97,scale);f.ground=false;for(const b of platforms){if(f.vy>=0&&oldY<=b.y&&f.y>=b.y&&f.x>b.x-10&&f.x<b.x+b.w+10){f.y=b.y;f.vy=0;f.jumps=0;f.ground=true;}}
if(f.y>700||f.x<-150||f.x>1350){f.stocks--;if(f.stocks<=0){finish(f===p?'OUT OF<br><em>STYLE.</em>':'SPOTLIGHT<br><em>SECURED.</em>');return;}Object.assign(f,{x:f===p?450:750,y:100,vx:0,vy:0,damage:0,jumps:0,inv:2});}}
for(const s of particles){s.x+=s.vx*scale;s.y+=s.vy*scale;s.life-=dt;}particles=particles.filter(s=>s.life>0);if(time<=0){const score=p.stocks-c.stocks||c.damage-p.damage;finish(score===0?'A PERFECT<br><em>TIE.</em>':score>0?'SPOTLIGHT<br><em>SECURED.</em>':'OUT OF<br><em>STYLE.</em>');}}
function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h);}
function text(t,x,y,size,color,align='left'){ctx.fillStyle=color;ctx.font=`${size}px "Barlow Condensed",Arial,sans-serif`;ctx.textAlign=align;ctx.fillText(t,x,y);}
function drawFighter(f){
  const index=roster.indexOf(f.r);
  const pose=f.attack>0?(f.heavy?'power':'attack'):!f.ground?'jump':Math.abs(f.vx)>.6?'run':'idle';
  const frame=Math.floor(performance.now()/(pose==='run'?95:360));
  ctx.save();ctx.imageSmoothingEnabled=false;
  ctx.translate(Math.round(f.x),Math.round(f.y));
  if(f.inv>0&&Math.floor(f.inv*12)%2)ctx.globalAlpha=.45;
  ctx.scale(f.face*2,2);ctx.translate(-26,-63);
  if(f.flash>0)ctx.filter='brightness(2)';
  drawSprite(ctx,f.r,index,pose,frame);ctx.restore();
  text(f===fighters[0]?'YOU':'CPU',f.x,f.y-140,12,f===fighters[0]?'#d5fa49':'#e7d7c9','center');
}

function draw(){const gradient=ctx.createLinearGradient(0,0,0,560);gradient.addColorStop(0,'#142225');gradient.addColorStop(1,'#333d32');ctx.fillStyle=gradient;ctx.fillRect(0,0,1200,560);ctx.fillStyle='#aebba077';ctx.beginPath();ctx.arc(935,105,36,0,Math.PI*2);ctx.fill();for(let i=0;i<30;i++){const h=45+((i*71)%135);rect(i*45,390-h,37,h,'#172522');for(let j=0;j<4;j++)for(let k=0;k<4;k++)if((i+j+k)%3===0)rect(i*45+6+j*7,395-h+k*19,3,5,'#70816a55');}ctx.strokeStyle='#9eae7b22';ctx.lineWidth=55;ctx.beginPath();ctx.moveTo(170,410);ctx.lineTo(470,0);ctx.moveTo(1030,410);ctx.lineTo(730,0);ctx.stroke();text('RR',600,229,100,'#c7d3ad12','center');text('SYDNEY AFTER DARK',600,254,13,'#a5b79255','center');for(const b of platforms){rect(b.x,b.y,b.w,13,'#7d8a66');rect(b.x,b.y,b.w,3,'#d5fa49');rect(b.x,b.y+13,b.w,10,'#111a17');}rect(260,433,15,127,'#1a2420');rect(925,433,15,127,'#1a2420');if(fighters.length){fighters.forEach(drawFighter);for(const s of particles)rect(s.x,s.y,4,4,s.color);fighters.forEach((f,i)=>{const x=i===0?30:950;rect(x,24,220,77,'#0c1613dd');rect(x,24,3,77,i===0?'#d5fa49':'#bb9a7c');text(f.r.name.toUpperCase(),x+15,47,17,'#e4e8d8');text(Math.round(f.damage)+'%',x+15,84,31,f.damage>100?'#f58d69':'#d5fa49');text('●'.repeat(f.stocks),x+140,81,17,'#d4dfbd');});text(`${Math.floor(Math.ceil(time)/60)}:${String(Math.ceil(time)%60).padStart(2,'0')}`,600,53,30,'#e0e6d6','center');}}
function frame(now){const dt=Math.min((now-last)/1000,1/30);last=now;if(running&&!paused)update(dt);draw();requestAnimationFrame(frame);}renderCards();requestAnimationFrame(frame);
