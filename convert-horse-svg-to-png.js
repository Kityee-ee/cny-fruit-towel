import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Horse SVG content (from constants.ts)
const HORSE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'><defs><linearGradient id='horseBody' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='#E8B896'/><stop offset='50%' stop-color='#D4A574'/><stop offset='100%' stop-color='#C18A5B'/></linearGradient><linearGradient id='horseMane' x1='0%' y1='0%' x2='100%' y2='0%'><stop offset='0%' stop-color='#CD5C5C'/><stop offset='100%' stop-color='#A0522D'/></linearGradient><linearGradient id='horseBelly' x1='0%' y1='0%' x2='0%' y2='100%'><stop offset='0%' stop-color='#F5DEB3'/><stop offset='100%' stop-color='#E8B896'/></linearGradient><radialGradient id='eyeGradient' cx='50%' cy='40%' r='60%'><stop offset='0%' stop-color='#4A90E2'/><stop offset='70%' stop-color='#4A90E2'/><stop offset='100%' stop-color='#FFA500'/></radialGradient><linearGradient id='collarGrad' x1='0%' y1='0%' x2='100%' y2='0%'><stop offset='0%' stop-color='#DC143C'/><stop offset='100%' stop-color='#B22222'/></linearGradient><linearGradient id='goldPattern' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='#FFD700'/><stop offset='100%' stop-color='#FFA500'/></linearGradient><filter id='shadow'><feDropShadow dx='0' dy='4' stdDeviation='6' flood-opacity='0.4'/></filter></defs><g filter='url(#shadow)'><!-- Main Body --><ellipse cx='150' cy='220' rx='60' ry='50' fill='url(#horseBody)'/><!-- Belly --><ellipse cx='150' cy='230' rx='45' ry='35' fill='url(#horseBelly)'/><!-- Neck --><path d='M 150,170 Q 150,130 130,90 Q 120,70 110,60' stroke='url(#horseBody)' stroke-width='50' fill='none' stroke-linecap='round'/><!-- Head --><ellipse cx='110' cy='50' rx='30' ry='28' fill='url(#horseBody)'/><!-- Muzzle --><ellipse cx='95' cy='60' rx='18' ry='15' fill='url(#horseBelly)'/><!-- Ears --><path d='M 125,30 Q 135,20 145,30 L 140,40 Q 130,35 125,30' fill='url(#horseBody)'/><path d='M 125,30 Q 130,25 135,30' fill='#FFB6C1'/><!-- Eyes --><ellipse cx='100' cy='45' rx='12' ry='14' fill='url(#eyeGradient)'/><ellipse cx='120' cy='45' rx='12' ry='14' fill='url(#eyeGradient)'/><!-- Eye Highlights --><ellipse cx='105' cy='42' rx='5' ry='6' fill='white' opacity='0.9'/><ellipse cx='125' cy='42' rx='5' ry='6' fill='white' opacity='0.9'/><!-- Pupils --><circle cx='102' cy='46' r='4' fill='#333'/><circle cx='122' cy='46' r='4' fill='#333'/><!-- Eyelashes --><path d='M 88,42 Q 90,38 92,42' stroke='#333' stroke-width='1.5' fill='none'/><path d='M 132,42 Q 134,38 136,42' stroke='#333' stroke-width='1.5' fill='none'/><!-- Cheeks --><ellipse cx='85' cy='55' rx='8' ry='6' fill='#FFB6C1' opacity='0.8'/><ellipse cx='135' cy='55' rx='8' ry='6' fill='#FFB6C1' opacity='0.8'/><!-- Mouth/Smile --><path d='M 85,65 Q 95,72 105,70 Q 115,72 125,70' stroke='#333' stroke-width='3' fill='none' stroke-linecap='round'/><!-- Tongue --><ellipse cx='100' cy='68' rx='6' ry='4' fill='#FF69B4'/><!-- Mane (Wavy) --><path d='M 150,90 Q 170,85 180,95 Q 190,105 185,120 Q 180,135 170,130 Q 160,125 150,90' fill='url(#horseMane)'/><path d='M 155,100 Q 175,95 185,105 Q 195,115 190,130 Q 185,145 175,140 Q 165,135 155,100' fill='url(#horseMane)'/><path d='M 160,110 Q 180,105 190,115 Q 200,125 195,140 Q 190,155 180,150 Q 170,145 160,110' fill='url(#horseMane)'/><path d='M 165,120 Q 185,115 195,125 Q 205,135 200,150 Q 195,165 185,160 Q 175,155 165,120' fill='url(#horseMane)'/><!-- Tail (Curly) --><path d='M 210,200 Q 240,180 250,200 Q 260,220 255,240 Q 250,260 240,250 Q 230,240 210,200' fill='url(#horseMane)'/><path d='M 215,210 Q 245,190 255,210 Q 265,230 260,250 Q 255,270 245,260 Q 235,250 215,210' fill='url(#horseMane)'/><path d='M 220,220 Q 250,200 260,220 Q 270,240 265,260 Q 260,280 250,270 Q 240,260 220,220' fill='url(#horseMane)'/><!-- Chinese Collar --><path d='M 100,80 Q 120,75 140,80 L 145,100 Q 120,95 100,100 Z' fill='url(#collarGrad)'/><!-- Gold Patterns on Collar --><path d='M 105,85 Q 115,82 125,85 Q 135,88 130,92 Q 120,90 110,92 Q 105,90 105,85' fill='url(#goldPattern)' opacity='0.8'/><path d='M 110,90 Q 120,87 130,90 Q 140,93 135,97 Q 125,95 115,97 Q 110,95 110,90' fill='url(#goldPattern)' opacity='0.8'/><!-- Frog Button (Knot) --><circle cx='122' cy='90' r='6' fill='url(#goldPattern)'/><path d='M 116,90 Q 122,85 128,90 Q 122,95 116,90' stroke='#FFD700' stroke-width='2' fill='none'/><!-- Body Decorations (Floral/Cloud Patterns) --><path d='M 120,150 Q 140,145 150,155 Q 160,165 155,175 Q 150,185 140,180 Q 130,175 120,150' fill='#DC143C' opacity='0.6'/><path d='M 130,160 Q 145,158 150,165 Q 155,172 152,178 Q 149,184 142,182 Q 135,180 130,160' fill='url(#goldPattern)' opacity='0.7'/><path d='M 160,180 Q 180,175 190,185 Q 200,195 195,205 Q 190,215 180,210 Q 170,205 160,180' fill='#20B2AA' opacity='0.5'/><path d='M 170,190 Q 185,188 190,195 Q 195,202 192,208 Q 189,214 182,212 Q 175,210 170,190' fill='url(#goldPattern)' opacity='0.6'/><!-- Front Legs (Prancing Pose) --><!-- Left Front Leg (Raised, holding firecrackers) --><path d='M 100,170 Q 80,140 70,120 Q 65,110 60,100' stroke='url(#horseBody)' stroke-width='25' fill='none' stroke-linecap='round'/><ellipse cx='60' cy='100' rx='12' ry='10' fill='url(#horseBody)'/><!-- Hoof --><ellipse cx='60' cy='108' rx='10' ry='8' fill='#A0673D'/><!-- Right Front Leg --><path d='M 120,180 Q 130,160 140,150 Q 145,145 150,140' stroke='url(#horseBody)' stroke-width='20' fill='none' stroke-linecap='round'/><ellipse cx='150' cy='140' rx='10' ry='8' fill='url(#horseBody)'/><ellipse cx='150' cy='148' rx='8' ry='6' fill='#A0673D'/><!-- Hind Legs --><path d='M 180,220 Q 200,240 210,280 Q 215,300 220,320' stroke='url(#horseBody)' stroke-width='22' fill='none' stroke-linecap='round'/><ellipse cx='220' cy='320' rx='11' ry='9' fill='url(#horseBody)'/><ellipse cx='220' cy='330' rx='9' ry='7' fill='#A0673D'/><path d='M 120,230 Q 110,250 105,280 Q 103,300 100,320' stroke='url(#horseBody)' stroke-width='20' fill='none' stroke-linecap='round'/><ellipse cx='100' cy='320' rx='10' ry='8' fill='url(#horseBody)'/><ellipse cx='100' cy='330' rx='8' ry='6' fill='#A0673D'/><!-- Firecrackers String --><line x1='50' y1='95' x2='50' y2='50' stroke='#DC143C' stroke-width='3'/><!-- Firecracker 1 --><rect x='45' y='50' width='10' height='20' rx='2' fill='#DC143C'/><rect x='45' y='50' width='10' height='4' fill='url(#goldPattern)'/><rect x='45' y='66' width='10' height='4' fill='url(#goldPattern)'/><!-- Firecracker 2 --><rect x='45' y='72' width='10' height='20' rx='2' fill='#DC143C'/><rect x='45' y='72' width='10' height='4' fill='url(#goldPattern)'/><rect x='45' y='88' width='10' height='4' fill='url(#goldPattern)'/><!-- Firecracker 3 --><rect x='45' y='94' width='10' height='20' rx='2' fill='#DC143C'/><rect x='45' y='94' width='10' height='4' fill='url(#goldPattern)'/><rect x='45' y='110' width='10' height='4' fill='url(#goldPattern)'/><!-- Yellow Tassel --><path d='M 50,114 Q 48,120 50,126 Q 52,132 50,138' stroke='#FFD700' stroke-width='3' fill='none'/><circle cx='50' cy='140' r='3' fill='#FFD700'/></g></svg>`;

async function convertHorseSvgToPng() {
  console.log('Starting Horse SVG to PNG conversion...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set viewport to high resolution (900x1200 for good quality)
    await page.setViewport({ width: 900, height: 1200, deviceScaleFactor: 1 });
    
    // Create HTML content with the SVG
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 900px;
              height: 1200px;
              background: transparent;
            }
            svg {
              width: 900px;
              height: 1200px;
            }
          </style>
        </head>
        <body>
          ${HORSE_SVG}
        </body>
      </html>
    `;
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Wait a bit for rendering
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Take screenshot
    const outputPath = join(__dirname, 'public', 'assets', 'horse.png');
    await page.screenshot({
      path: outputPath,
      type: 'png',
      clip: { x: 0, y: 0, width: 900, height: 1200 },
      omitBackground: true // Transparent background
    });
    
    console.log(`✅ PNG saved to: ${outputPath}`);
    console.log(`   Resolution: 900x1200px`);
    console.log(`\n💡 You can now replace this PNG with your own image file!`);
    console.log(`   Just save your image as: public/assets/horse.png`);
    
  } catch (error) {
    console.error('Error converting SVG to PNG:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

convertHorseSvgToPng().catch(console.error);
