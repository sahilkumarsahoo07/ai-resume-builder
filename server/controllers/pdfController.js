import puppeteer from 'puppeteer';

export const generatePdf = async (req, res) => {
  const { html, css } = req.body;

  console.log('[PDF] Received generation request');
  console.log('[PDF] HTML length:', html?.length || 0);
  console.log('[PDF] CSS length:', css?.length || 0);

  if (!html) {
    console.warn('[PDF] Rejecting: No HTML provided');
    return res.status(400).json({ success: false, message: 'HTML content is required' });
  }

  let browser;
  try {
    console.log('[PDF] Launching browser...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none']
    });

    console.log('[PDF] Browser launched. Setting content...');
    const page = await browser.newPage();

    // Set standard viewport
    await page.setViewport({ width: 1200, height: 1600 });

    // Construct the full HTML document
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            ${css || ''}
            body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; }
            @page { size: A4; margin: 0; }
          </style>
        </head>
        <body>
          <div id="pdf-root">
            ${html}
          </div>
        </body>
      </html>
    `;

    await page.setContent(fullHtml, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    console.log('[PDF] Content set. Generating PDF...');
    // Generate PDF buffer
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
      preferCSSPageSize: true
    });

    console.log('[PDF] PDF generated. Buffer size:', pdfBuffer.length);
    await browser.close();

    // Standard headers for binary PDF transfer
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
      'Content-Disposition': `attachment; filename="${req.body.filename || 'resume.pdf'}"`,
      'Cache-Control': 'no-cache'
    });

    res.end(pdfBuffer, 'binary');
    console.log('[PDF] Response sent successfully');

  } catch (error) {
    console.error('[PDF] Generation Fatal Error:', error);
    if (browser) await browser.close();
    res.status(500).json({ success: false, message: 'Error generating PDF', error: error.message });
  }
};
