const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

let pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';

const BG_COLOR = '0a0a0a';
const CARD_BG = '161616';
const GOLD = 'C9A96E';
const GOLD_LIGHT = 'D4B87A';
const GOLD_DARK = 'B8943F';
const TEXT_WHITE = 'FFFFFF';
const TEXT_GRAY = 'A0A0A0';

// Helper function to add slide with common dark background
function createSlide() {
  let slide = pptx.addSlide();
  slide.background = { color: BG_COLOR };
  return slide;
}

// Helper to add the header branding
function addHeader(slide, titleText, subtitleText) {
  // Logo
  slide.addImage({ 
    path: 'assets/images/logo.png', 
    x: 0.5, 
    y: 0.4, 
    w: 0.5, 
    h: 0.5 
  });
  
  // Brand title
  slide.addText([
    { text: 'CB Kitchen ', options: { color: TEXT_WHITE, bold: true } },
    { text: 'Sourcing Platform', options: { color: GOLD } }
  ], { 
    x: 1.1, 
    y: 0.45, 
    w: 5.0, 
    h: 0.4, 
    fontSize: 12, 
    fontFace: 'Arial' 
  });

  // Top dividing line
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, 
    y: 1.0, 
    w: 12.33, 
    h: 0.01, 
    fill: { color: '222222' } 
  });

  // Subtitle (italic accents)
  if (subtitleText) {
    slide.addText(subtitleText, { 
      x: 0.5, 
      y: 1.2, 
      w: 10, 
      h: 0.35, 
      fontFace: 'Georgia', 
      fontSize: 14, 
      italic: true, 
      color: GOLD 
    });
  }

  // Slide Title
  if (titleText) {
    slide.addText(titleText, { 
      x: 0.5, 
      y: 1.5, 
      w: 10, 
      h: 0.6, 
      fontFace: 'Georgia', 
      fontSize: 24, 
      bold: true, 
      color: TEXT_WHITE 
    });
  }
}

// Helper to add card-like backgrounds
function addCard(slide, x, y, w, h, goldBorder = false) {
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x,
    y: y,
    w: w,
    h: h,
    fill: { color: CARD_BG },
    line: { color: goldBorder ? GOLD : '222222', width: 1 },
    rectRadius: 0.0
  });
}

// ==========================================
// SLIDE 1: COVER SLIDE
// ==========================================
let s1 = createSlide();
s1.addImage({ 
  path: 'assets/images/logo.png', 
  x: 5.66, 
  y: 1.5, 
  w: 2.0, 
  h: 2.0 
});
s1.addText([
  { text: 'CB Kitchen ', options: { color: TEXT_WHITE, bold: true } },
  { text: 'Sourcing Platform', options: { color: GOLD } }
], {
  x: 1.0,
  y: 3.8,
  w: 11.33,
  h: 0.8,
  fontSize: 36,
  fontFace: 'Georgia',
  align: 'center'
});
s1.addText('Private Luxury Contractor Sourcing Network', {
  x: 1.0,
  y: 4.7,
  w: 11.33,
  h: 0.4,
  fontSize: 16,
  fontFace: 'Arial',
  color: GOLD,
  align: 'center'
});
s1.addShape(pptx.shapes.RECTANGLE, {
  x: 5.16,
  y: 5.3,
  w: 3.0,
  h: 0.02,
  fill: { color: GOLD }
});
s1.addText('Investor Presentation • Q2 2026', {
  x: 1.0,
  y: 5.6,
  w: 11.33,
  h: 0.4,
  fontSize: 12,
  fontFace: 'Arial',
  color: TEXT_GRAY,
  align: 'center'
});

// ==========================================
// SLIDE 2: THE PROBLEM
// ==========================================
let s2 = createSlide();
addHeader(s2, 'Traditional Contractor Sourcing is Broken', 'Market Friction');

addCard(s2, 0.5, 2.3, 3.8, 4.5);
s2.addText('Extreme Retail Markups', { x: 0.7, y: 2.5, w: 3.4, h: 0.5, fontSize: 18, bold: true, color: TEXT_WHITE, fontFace: 'Georgia' });
s2.addText('Contractors pay massive retail premiums (30% to 50%) for premium kitchen cabinets and bath vanities, directly eroding project profit margins.', { x: 0.7, y: 3.1, w: 3.4, h: 2.0, fontSize: 13, color: TEXT_GRAY, fontFace: 'Arial' });
s2.addText('30%–50%', { x: 0.7, y: 5.2, w: 3.4, h: 0.5, fontSize: 32, bold: true, color: GOLD, fontFace: 'Georgia' });
s2.addText('lost margin', { x: 0.7, y: 5.8, w: 3.4, h: 0.3, fontSize: 11, color: TEXT_WHITE, fontFace: 'Arial' });

addCard(s2, 4.76, 2.3, 3.8, 4.5);
s2.addText('Unpredictable Delays', { x: 4.96, y: 2.5, w: 3.4, h: 0.5, fontSize: 18, bold: true, color: TEXT_WHITE, fontFace: 'Georgia' });
s2.addText('Local distributors suffer from volatile lead times, delayed shipping, and lack of prioritization for active job sites, causing expensive delays.', { x: 4.96, y: 3.1, w: 3.4, h: 2.0, fontSize: 13, color: TEXT_GRAY, fontFace: 'Arial' });
s2.addText('6–12', { x: 4.96, y: 5.2, w: 3.4, h: 0.5, fontSize: 32, bold: true, color: GOLD, fontFace: 'Georgia' });
s2.addText('weeks lead time', { x: 4.96, y: 5.8, w: 3.4, h: 0.3, fontSize: 11, color: TEXT_WHITE, fontFace: 'Arial' });

addCard(s2, 9.03, 2.3, 3.8, 4.5);
s2.addText('Dedicated Factory Relationships', { x: 9.23, y: 2.5, w: 3.4, h: 0.5, fontSize: 18, bold: true, color: TEXT_WHITE, fontFace: 'Georgia' });
s2.addText('CB Kitchen works directly with vetted manufacturing partners to ensure quality standards, communication efficiency, and long-term sourcing reliability.', { x: 9.23, y: 3.1, w: 3.4, h: 2.0, fontSize: 13, color: TEXT_GRAY, fontFace: 'Arial' });
s2.addText('100%', { x: 9.23, y: 5.2, w: 3.4, h: 0.5, fontSize: 32, bold: true, color: GOLD, fontFace: 'Georgia' });
s2.addText('vetted partners', { x: 9.23, y: 5.8, w: 3.4, h: 0.3, fontSize: 11, color: TEXT_WHITE, fontFace: 'Arial' });

// ==========================================
// SLIDE 3: THE SOLUTION
// ==========================================
let s3 = createSlide();
addHeader(s3, 'A Direct Sourcing Channel', 'Platform Sourcing');

addCard(s3, 0.5, 2.3, 3.8, 4.5);
s3.addText('Direct Factory Sourcing', { x: 0.7, y: 2.5, w: 3.4, h: 0.5, fontSize: 18, bold: true, color: TEXT_WHITE, fontFace: 'Georgia' });
s3.addText('Direct sourcing creates stronger opportunities for contractor profitability by reducing unnecessary layers between manufacturers and buyers.', { x: 0.7, y: 3.1, w: 3.4, h: 2.0, fontSize: 13, color: TEXT_GRAY, fontFace: 'Arial' });
s3.addText('Higher', { x: 0.7, y: 5.2, w: 3.4, h: 0.5, fontSize: 32, bold: true, color: GOLD, fontFace: 'Georgia' });
s3.addText('profit potential', { x: 0.7, y: 5.8, w: 3.4, h: 0.3, fontSize: 11, color: TEXT_WHITE, fontFace: 'Arial' });

addCard(s3, 4.76, 2.3, 3.8, 4.5);
s3.addText('Founder-Led Verification', { x: 4.96, y: 2.5, w: 3.4, h: 0.5, fontSize: 18, bold: true, color: TEXT_WHITE, fontFace: 'Georgia' });
s3.addText('CB Kitchen actively develops relationships with manufacturers and sourcing partners worldwide to verify quality standards, strengthen supplier relationships, and support long-term growth.', { x: 4.96, y: 3.1, w: 3.4, h: 2.0, fontSize: 13, color: TEXT_GRAY, fontFace: 'Arial' });
s3.addText('Founder-Led', { x: 4.96, y: 5.2, w: 3.4, h: 0.5, fontSize: 32, bold: true, color: GOLD, fontFace: 'Georgia' });
s3.addText('Quality Verification', { x: 4.96, y: 5.8, w: 3.4, h: 0.3, fontSize: 11, color: TEXT_WHITE, fontFace: 'Arial' });

addCard(s3, 9.03, 2.3, 3.8, 4.5);
s3.addText('Priority Logistics Support', { x: 9.23, y: 2.5, w: 3.4, h: 0.5, fontSize: 18, bold: true, color: TEXT_WHITE, fontFace: 'Georgia' });
s3.addText('End-to-end container tracking and customs clearance management. Sourcing members receive guaranteed delivery times for zero delay.', { x: 9.23, y: 3.1, w: 3.4, h: 2.0, fontSize: 13, color: TEXT_GRAY, fontFace: 'Arial' });
s3.addText('100%', { x: 9.23, y: 5.2, w: 3.4, h: 0.5, fontSize: 32, bold: true, color: GOLD, fontFace: 'Georgia' });
s3.addText('cleared transit', { x: 9.23, y: 5.8, w: 3.4, h: 0.3, fontSize: 11, color: TEXT_WHITE, fontFace: 'Arial' });

// ==========================================
// SLIDE 4: VALUE PROPOSITION
// ==========================================
let s4 = createSlide();
addHeader(s4, 'Commanding Sourcing Value Prop', 'Financial Value');

s4.addText('CB Kitchen removes retail margins and creates substantial margin recovery for builders, general contractors, and remodelers.', {
  x: 0.5, y: 2.3, w: 7.0, h: 0.6, fontSize: 14, color: TEXT_WHITE, fontFace: 'Arial'
});

s4.addText('Founding Member Sourcing Lock', { x: 0.5, y: 3.1, w: 7.0, h: 0.3, fontSize: 15, bold: true, color: GOLD, fontFace: 'Georgia' });
s4.addText('Early contractor members lock in an annual access rate of $300/year, guaranteed for life.', { x: 0.5, y: 3.4, w: 7.0, h: 0.6, fontSize: 12, color: TEXT_GRAY, fontFace: 'Arial' });

s4.addText('Direct Sourcing Access', { x: 0.5, y: 4.1, w: 7.0, h: 0.3, fontSize: 15, bold: true, color: GOLD, fontFace: 'Georgia' });
s4.addText('Full private catalog access with immediate, unlimited request for quote support.', { x: 0.5, y: 4.4, w: 7.0, h: 0.6, fontSize: 12, color: TEXT_GRAY, fontFace: 'Arial' });

s4.addText('High Quality Cabinet Sourcing', { x: 0.5, y: 5.1, w: 7.0, h: 0.3, fontSize: 15, bold: true, color: GOLD, fontFace: 'Georgia' });
s4.addText('Top-tier finishes, solid wood faces, and premium soft-close hardware sourced globally.', { x: 0.5, y: 5.4, w: 7.0, h: 0.6, fontSize: 12, color: TEXT_GRAY, fontFace: 'Arial' });

addCard(s4, 8.3, 2.3, 4.5, 4.5, true);
s4.addText('$15,000', { x: 8.3, y: 3.2, w: 4.5, h: 0.8, fontSize: 48, bold: true, color: GOLD, fontFace: 'Georgia', align: 'center' });
s4.addText('Average Savings', { x: 8.3, y: 4.2, w: 4.5, h: 0.4, fontSize: 18, color: TEXT_WHITE, fontFace: 'Georgia', align: 'center' });
s4.addText('Based on standard builder cabinet & vanity packages compared to local showroom pricing.', {
  x: 8.6, y: 4.8, w: 3.9, h: 0.8, fontSize: 12, color: TEXT_GRAY, fontFace: 'Arial', align: 'center'
});

// ==========================================
// SLIDE 5: BUSINESS MODEL
// ==========================================
let s5 = createSlide();
addHeader(s5, 'Our Sourcing Business Model', 'Revenue Capture');

// Left Column (Membership Sourcing Fees)
addCard(s5, 0.5, 2.3, 5.9, 4.5);
s5.addText('Membership Sourcing Fees', { x: 0.8, y: 2.5, w: 5.3, h: 0.4, fontSize: 18, bold: true, color: TEXT_WHITE, fontFace: 'Georgia' });
s5.addText('Recurring Annual ARR', { x: 0.8, y: 2.9, w: 5.3, h: 0.3, fontSize: 12, color: GOLD, italic: true, fontFace: 'Georgia' });

let leftItems = [
  { label: 'Founding Members', val: 'First 500 at $300/year' },
  { label: 'Regular Members', val: 'Next 4,500 at $499/year' },
  { label: 'Target Members Year 1', val: '5,000 contractors' }
];
leftItems.forEach((item, idx) => {
  s5.addText(item.label, { x: 0.8, y: 3.4 + (idx * 0.45), w: 2.5, h: 0.4, fontSize: 13, color: TEXT_WHITE, fontFace: 'Arial' });
  s5.addText(item.val, { x: 3.3, y: 3.4 + (idx * 0.45), w: 3.0, h: 0.4, fontSize: 13, color: TEXT_GRAY, fontFace: 'Arial', align: 'right' });
});
s5.addText('ARR Potential: $2.39M', { x: 0.8, y: 5.8, w: 5.3, h: 0.5, fontSize: 18, bold: true, color: GOLD, fontFace: 'Georgia' });

// Right Column (Project Sourcing Revenue - Highlighted)
addCard(s5, 6.9, 2.3, 5.9, 4.5, true);
s5.addText('Project Sourcing Revenue', { x: 7.2, y: 2.5, w: 5.3, h: 0.4, fontSize: 18, bold: true, color: TEXT_WHITE, fontFace: 'Georgia' });
s5.addText('Margin on Materials', { x: 7.2, y: 2.9, w: 5.3, h: 0.3, fontSize: 12, color: GOLD, italic: true, fontFace: 'Georgia' });

let rightItems = [
  { label: 'Typical Project Range', val: '$10,000 – $25,000+' },
  { label: 'Margin Potential', val: '15% to 20%' },
  { label: 'Sourcing Revenue', val: 'Varies By Scope' }
];
rightItems.forEach((item, idx) => {
  s5.addText(item.label, { x: 7.2, y: 3.4 + (idx * 0.45), w: 2.5, h: 0.4, fontSize: 13, color: TEXT_WHITE, fontFace: 'Arial' });
  s5.addText(item.val, { x: 9.7, y: 3.4 + (idx * 0.45), w: 3.0, h: 0.4, fontSize: 13, color: TEXT_GRAY, fontFace: 'Arial', align: 'right' });
});
s5.addText('Margin Potential: 15%–20%', { x: 7.2, y: 5.8, w: 5.3, h: 0.5, fontSize: 18, bold: true, color: GOLD, fontFace: 'Georgia' });

// ==========================================
// SLIDE 6: WHY CONTRACTORS CHOOSE CB KITCHEN
// ==========================================
let s6 = createSlide();
addHeader(s6, 'Why Contractors Choose CB Kitchen', 'Competitive Advantage');

const valuePoints = [
  { title: 'Direct Factory Relationships', desc: 'Access vetted manufacturers directly without unnecessary middlemen.' },
  { title: 'Higher Contractor Margins', desc: 'Designed to improve contractor profitability through direct sourcing.' },
  { title: 'Private Contractor Network', desc: 'Exclusive sourcing access for builders, developers, remodelers, and contractors.' },
  { title: 'Quality Verification Process', desc: 'Products and suppliers are reviewed before sourcing recommendations are made.' },
  { title: 'Project-Based Support', desc: 'Support for kitchens, vanities, closets, and commercial projects.' },
  { title: 'Scalable Supply Chain', desc: 'Built to support both small projects and large developments.' }
];

const colWidth = 3.8;
const colGap = 0.46;
const rowHeight = 1.9;
const rowGap = 0.2;

valuePoints.forEach((vp, idx) => {
  const col = idx % 3;
  const row = Math.floor(idx / 3);
  const x = 0.5 + col * (colWidth + colGap);
  const y = 2.2 + row * (rowHeight + rowGap);
  
  addCard(s6, x, y, colWidth, rowHeight);
  s6.addText(vp.title, { x: x + 0.2, y: y + 0.2, w: colWidth - 0.4, h: 0.4, fontSize: 13, bold: true, color: GOLD, fontFace: 'Georgia' });
  s6.addText(vp.desc, { x: x + 0.2, y: y + 0.6, w: colWidth - 0.4, h: 1.1, fontSize: 11, color: TEXT_WHITE, fontFace: 'Arial' });
});

s6.addText('Save and make contractors hundreds of thousands a year.', {
  x: 0.5,
  y: 6.5,
  w: 12.33,
  h: 0.4,
  fontSize: 15,
  italic: true,
  color: GOLD,
  fontFace: 'Georgia',
  align: 'center'
});

// ==========================================
// SLIDE 7: TIMELINE TO SOURCING SCALE
// ==========================================
let s7 = createSlide();
addHeader(s7, 'Timeline to Sourcing Scale', 'Growth Milestones');

addCard(s7, 0.5, 2.3, 3.8, 4.5);
s7.addText('Phase 1 (Completed)', { x: 0.7, y: 2.5, w: 3.4, h: 0.3, fontSize: 12, color: TEXT_GRAY, fontFace: 'Arial' });
s7.addText('Vetted Sourcing Channels', { x: 0.7, y: 2.9, w: 3.4, h: 0.5, fontSize: 16, bold: true, color: GOLD, fontFace: 'Georgia' });
s7.addText('Direct-to-factory relationships locked in. Transparent PNG assets processed, favicon linked, local directories synced.', { x: 0.7, y: 3.6, w: 3.4, h: 2.0, fontSize: 12, color: TEXT_GRAY, fontFace: 'Arial' });

addCard(s7, 4.76, 2.3, 3.8, 4.5, true);
s7.addText('Phase 2 (Current)', { x: 4.96, y: 2.5, w: 3.4, h: 0.3, fontSize: 12, color: GOLD, fontFace: 'Arial' });
s7.addText('Catalog & Portal Launch', { x: 4.96, y: 2.9, w: 3.4, h: 0.5, fontSize: 16, bold: true, color: TEXT_WHITE, fontFace: 'Georgia' });
s7.addText('Online quote system active. Private member portal and admin application management system deployment across target environments.', { x: 4.96, y: 3.6, w: 3.4, h: 2.0, fontSize: 12, color: TEXT_GRAY, fontFace: 'Arial' });

addCard(s7, 9.03, 2.3, 3.8, 4.5);
s7.addText('Phase 3 (Future)', { x: 9.23, y: 2.5, w: 3.4, h: 0.3, fontSize: 12, color: TEXT_GRAY, fontFace: 'Arial' });
s7.addText('Global Procurement Scale', { x: 9.23, y: 2.9, w: 3.4, h: 0.5, fontSize: 16, bold: true, color: GOLD, fontFace: 'Georgia' });
s7.addText('Launch container shipments directly to major markets. Expanding material categories to stone countertops, fixtures, and appliances.', { x: 9.23, y: 3.6, w: 3.4, h: 2.0, fontSize: 12, color: TEXT_GRAY, fontFace: 'Arial' });

// ==========================================
// SLIDE 8: INVESTMENT OPPORTUNITY
// ==========================================
let s8 = createSlide();
addHeader(s8, 'Investment Opportunity', 'Investment Detail');

addCard(s8, 0.5, 2.3, 5.9, 4.5);
s8.addText('Direct Sourcing Contact', { x: 0.8, y: 2.6, w: 5.3, h: 0.5, fontSize: 20, bold: true, color: TEXT_WHITE, fontFace: 'Georgia' });
s8.addText('CBKitchen.io', { x: 0.8, y: 3.4, w: 5.3, h: 0.4, fontSize: 16, color: GOLD, fontFace: 'Arial' });
s8.addText('support@cbkitchen.io', { x: 0.8, y: 4.0, w: 5.3, h: 0.4, fontSize: 16, color: GOLD, fontFace: 'Arial' });

addCard(s8, 6.9, 2.3, 5.9, 4.5, true);
s8.addText('We are raising funding to scale container-level direct sourcing and expand our QC inspection teams. Access our live private catalogs, pricing sheets, and admin systems below.', {
  x: 7.2, y: 2.8, w: 5.3, h: 1.5, fontSize: 14, color: TEXT_WHITE, fontFace: 'Arial'
});
s8.addText('Explore Live Platform', { x: 7.2, y: 4.8, w: 5.3, h: 0.5, fontSize: 16, bold: true, color: GOLD, fontFace: 'Georgia' });

// ==========================================
// EXPORT AND SAVE
// ==========================================
const outPath = path.join(__dirname, 'exports', 'CB-Kitchen-Strategic-Partnership-Opportunity.pptx');
pptx.writeFile({ fileName: outPath })
  .then(fileName => console.log(`PowerPoint presentation successfully exported to: ${fileName}`))
  .catch(err => console.error(`Error generating PowerPoint:`, err));
