import * as pdfjs from './vendor/pdfjs/pdf.mjs';

export async function readDocumentPdf(file, onOcrPage, isActive) {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('./vendor/pdfjs/pdf.worker.mjs?v=5.6.205-complete', import.meta.url).href;
  const task = pdfjs.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
    isEvalSupported: false,
    disableFontFace: true
  });
  let worker;
  const recognize = async page => {
    if (!worker) worker = await createOcrWorker();
    if (!isActive()) throw Error('Phiên quản trị đã kết thúc.');
    return recognizePage(page, worker);
  };
  try {
    const pdf = await task.promise;
    return await readDocumentPdfPages(pdf, recognize, onOcrPage, isActive);
  } finally {
    await Promise.allSettled([task.destroy(), worker?.terminate()]);
  }
}

export async function readDocumentPdfPages(pdf, recognize, onOcrPage, isActive = () => true) {
  if (pdf.numPages > 500) throw Error('PDF vượt quá 500 trang. Vui lòng chia nhỏ.');
  let text = '', ocrPages = 0, ocrSample = '';
  for (let n = 1; n <= pdf.numPages; n++) {
    if (!isActive()) throw Error('Phiên quản trị đã kết thúc.');
    const page = await pdf.getPage(n);
    const content = await page.getTextContent();
    let pageText = content.items.filter(item => typeof item.str === 'string')
      .map(item => item.str + (item.hasEOL ? '\n' : ' ')).join('').trim();
    if (!pageText) {
      onOcrPage(n, pdf.numPages);
      pageText = (await recognize(page)).trim();
      if (pageText) {
        ocrPages++;
        if (ocrSample.length < 2400) ocrSample += `[Trang ${n}]\n${pageText.slice(0, 2400 - ocrSample.length)}\n\n`;
      }
    }
    if (pageText) text += `[Trang ${n}]\n${pageText}\n\n`;
    if (text.length > 500000) throw Error('PDF vượt giới hạn văn bản. Vui lòng chia nhỏ.');
    page.cleanup?.();
  }
  if (!text.trim()) throw Error('OCR không nhận dạng được chữ. Vui lòng thử bản scan rõ hơn.');
  return {text, ocrPages, ocrSample};
}

async function createOcrWorker() {
  const {default: Tesseract} = await import('./vendor/tesseract/tesseract.mjs');
  let timeout, expired = false;
  try {
    return await new Promise((resolve, reject) => {
      const fail = () => reject(Error('Không khởi động được OCR tiếng Việt. Vui lòng kiểm tra kết nối rồi thử lại.'));
      timeout = setTimeout(() => {
        expired = true;
        fail();
      }, 60000);
      Tesseract.createWorker('vie', 1, {
        workerPath: new URL('./vendor/tesseract/worker.min.js', import.meta.url).href,
        workerBlobURL: false,
        corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@6.0.0',
        langPath: 'https://cdn.jsdelivr.net/npm/@tesseract.js-data/vie@1.0.0/4.0.0_best_int',
        errorHandler: fail
      }).then(worker => {
        if (expired) return worker.terminate();
        resolve(worker);
      }).catch(fail);
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function recognizePage(page, worker) {
  const base = page.getViewport({scale: 1});
  const scale = Math.min(3, 2600 / Math.max(base.width, base.height));
  const viewport = page.getViewport({scale});
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  try {
    await page.render({canvas, viewport}).promise;
    const {data} = await worker.recognize(canvas);
    return data.text;
  } finally {
    canvas.width = canvas.height = 0;
  }
}
