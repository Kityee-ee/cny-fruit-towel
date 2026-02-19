import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cai Shen SVG content (extracted from constants.ts)
const CAI_SHEN_SVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 480'><defs><linearGradient id='faceSkin' x1='0%' y1='0%' x2='0%' y2='100%'><stop offset='0%' stop-color='#FFE0B2'/><stop offset='100%' stop-color='#FFCC80'/></linearGradient><linearGradient id='robeRed' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='#E53935'/><stop offset='100%' stop-color='#B71C1C'/></linearGradient><linearGradient id='goldG' x1='0%' y1='0%' x2='0%' y2='100%'><stop offset='0%' stop-color='#FFECB3'/><stop offset='50%' stop-color='#FFC107'/><stop offset='100%' stop-color='#FF6F00'/></linearGradient><filter id='shadow'><feDropShadow dx='0' dy='8' stdDeviation='8' flood-opacity='0.3'/></filter></defs><g filter='url(#shadow)'><!-- Body Robe --><path d='M 80,440 Q 60,320 100,280 Q 80,280 60,300 L 50,360 Q 40,400 80,440 Z' fill='#B71C1C'/><path d='M 320,440 Q 340,320 300,280 Q 320,280 340,300 L 350,360 Q 360,400 320,440 Z' fill='#B71C1C'/><path d='M 100,280 Q 200,240 300,280 L 320,440 Q 200,480 80,440 Z' fill='url(#robeRed)'/><!-- Robe Decorative Lines --><path d='M 100,420 Q 150,380 200,420 Q 250,380 300,420' stroke='#FFC107' stroke-width='6' fill='none' stroke-linecap='round'/><path d='M 100,440 Q 150,400 200,440 Q 250,400 300,440' stroke='#FFC107' stroke-width='6' fill='none' stroke-linecap='round'/><!-- Head --><circle cx='200' cy='220' r='100' fill='url(#faceSkin)' stroke='#FFCC80' stroke-width='4'/><!-- Hat Base --><path d='M 100,160 Q 200,80 300,160 L 300,180 Q 200,140 100,180 Z' fill='#D32F2F'/><!-- Hat Top --><path d='M 110,170 Q 200,120 290,170 L 290,190 Q 200,150 110,190 Z' fill='url(#goldG)'/><!-- Hat Medallion --><circle cx='200' cy='170' r='24' fill='#FFC107' stroke='#FF6F00' stroke-width='4'/><text x='200' y='180' font-family='serif' font-size='24' fill='#B71C1C' text-anchor='middle' font-weight='bold'>福</text><!-- Hat Wings (Clouds) --><path d='M 100,160 Q 60,140 40,160 Q 20,180 40,200 Q 80,220 100,180' fill='#FFC107' stroke='#FF6F00' stroke-width='4'/><path d='M 300,160 Q 340,140 360,160 Q 380,180 360,200 Q 320,220 300,180' fill='#FFC107' stroke='#FF6F00' stroke-width='4'/><!-- Eyes --><path d='M 160,210 Q 170,200 180,210' stroke='#3E2723' stroke-width='6' fill='none' stroke-linecap='round'/><path d='M 220,210 Q 230,200 240,210' stroke='#3E2723' stroke-width='6' fill='none' stroke-linecap='round'/><!-- Nose --><ellipse cx='200' cy='230' rx='12' ry='8' fill='#FFAB91'/><!-- Mouth --><circle cx='200' cy='250' r='10' fill='#3E2723'/><!-- Moustache --><path d='M 190,240 Q 160,280 170,320' stroke='#3E2723' stroke-width='6' fill='none' stroke-linecap='round'/><path d='M 210,240 Q 240,280 230,320' stroke='#3E2723' stroke-width='6' fill='none' stroke-linecap='round'/><path d='M 200,260 Q 200,290 200,300' stroke='#3E2723' stroke-width='8' fill='none' stroke-linecap='round'/><!-- Hands --><circle cx='160' cy='320' r='24' fill='url(#faceSkin)' stroke='#FFCC80' stroke-width='3'/><circle cx='240' cy='320' r='24' fill='url(#faceSkin)' stroke='#FFCC80' stroke-width='3'/><!-- Large Ingot --><path d='M 140,300 Q 200,380 260,300 Q 280,280 260,280 Q 200,330 140,280 Q 120,280 140,300 Z' fill='url(#goldG)' stroke='#FF6F00' stroke-width='4'/><ellipse cx='200' cy='290' rx='40' ry='24' fill='#FFF59D' opacity='0.8'/><!-- Ingot Highlight --><ellipse cx='180' cy='285' rx='15' ry='10' fill='white' opacity='0.5'/></g></svg>`;

async function convertSvgToPng() {
  console.log('Starting SVG to PNG conversion...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set viewport to high resolution (1200x1440 for 3x scaling)
    await page.setViewport({ width: 1200, height: 1440, deviceScaleFactor: 1 });
    
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
              width: 1200px;
              height: 1440px;
              background: transparent;
            }
            svg {
              width: 1200px;
              height: 1440px;
            }
          </style>
        </head>
        <body>
          ${CAI_SHEN_SVG}
        </body>
      </html>
    `;
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Wait a bit for fonts to load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Take screenshot
    const outputPath = join(__dirname, 'public', 'assets', 'cai-shen.png');
    await page.screenshot({
      path: outputPath,
      type: 'png',
      clip: { x: 0, y: 0, width: 1200, height: 1440 },
      omitBackground: true // Transparent background
    });
    
    console.log(`✅ PNG saved to: ${outputPath}`);
    console.log(`   Resolution: 1200x1440px (3x the original SVG size)`);
    
  } catch (error) {
    console.error('Error converting SVG to PNG:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

convertSvgToPng().catch(console.error);
