// Genera una página que muestra un tileset ampliado con el número de cada pieza.
// Uso: node tools/indice-tiles.mjs <png> <columnas> <filas> <margen|0> <espaciado> <salida.html>
import { writeFileSync, readFileSync } from "node:fs";
const [png, cols, rows, margin, spacing, out, x0 = "0", y0 = "0", vw = cols, vh = rows] = process.argv.slice(2);
const b64 = readFileSync(png).toString("base64");
const html = `<!doctype html><body style="margin:0;background:#888"><canvas id=c></canvas><script>
const img=new Image();img.onload=()=>{const S=6,T=16,C=${cols},R=${rows},M=${margin},P=${spacing},X0=${x0},Y0=${y0},VW=${vw},VH=${vh};
const c=document.getElementById('c');c.width=VW*(T*S+2);c.height=VH*(T*S+2);const g=c.getContext('2d');g.imageSmoothingEnabled=false;
for(let y=Y0;y<Y0+VH;y++)for(let x=X0;x<X0+VW;x++){const sx=M+x*(T+P),sy=M+y*(T+P),dx=(x-X0)*(T*S+2),dy=(y-Y0)*(T*S+2);
g.fillStyle=((x+y)%2)?'#9a9a9a':'#b0b0b0';g.fillRect(dx,dy,T*S,T*S);g.drawImage(img,sx,sy,T,T,dx,dy,T*S,T*S);
g.font='bold 13px monospace';g.fillStyle='#000';g.fillText(y*C+x,dx+3,dy+14);g.fillStyle='#ff0';g.fillText(y*C+x,dx+2,dy+13);}
document.title='ok';};img.src='data:image/png;base64,${b64}';</script>`;
writeFileSync(out, html);
