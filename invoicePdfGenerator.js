/**
 * Invoice PDF Generator
 * Generates professional branded invoices, receipts, and proposals
 * With dynamic colors, logos, and company branding
 */

class InvoicePdfGenerator {
  constructor() {
    this.branding = null;
    this.colors = {
      primary: '#3f51b5',
      accent: '#4caf50',
      text: '#333333',
      lightText: '#666666',
      border: '#e0e0e0'
    };
  }

  async init() {
    this.branding = await window.DB.getBranding() || {};
    if (this.branding.brandColors) {
      this.colors.primary = this.branding.brandColors.primary || this.colors.primary;
      this.colors.accent = this.branding.brandColors.accent || this.colors.accent;
    }
  }

  /**
   * Generate Receipt PDF
   */
  async generateReceipt(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let currentY = 20;
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    // Header with company branding
    currentY = this.addInvoiceHeader(doc, data.companyName || 'RECEIPT', currentY, margin, contentWidth, 'receipt');

    // Receipt number and date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Receipt #: ${data.receiptNumber || '00000'}`, margin, currentY);
    doc.text(`Date: ${this.formatDate(data.date || new Date())}`, pageWidth - margin - 60, currentY);
    currentY += 10;

    // Customer info section
    if (data.customerName) {
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(this.hexToRGB(this.colors.primary).r, this.hexToRGB(this.colors.primary).g, this.hexToRGB(this.colors.primary).b);
      doc.text('CUSTOMER', margin, currentY);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(0, 0, 0);
      currentY += 5;
      doc.setFontSize(10);
      doc.text(data.customerName, margin, currentY);
      if (data.customerEmail) {
        currentY += 5;
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(data.customerEmail, margin, currentY);
      }
      currentY += 8;
    }

    // Items table
    currentY = this.addItemsTable(doc, data.items || [], currentY, margin, contentWidth, 'receipt');

    // Totals
    currentY += 5;
    this.addTotalsSection(doc, data, currentY, margin, contentWidth, 'receipt');

    // Save PDF
    const filename = `receipt-${data.receiptNumber || 'draft'}-${new Date().getTime()}.pdf`;
    doc.save(filename);

    return filename;
  }

  /**
   * Generate Proposal PDF
   */
  async generateProposal(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 20;
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    // Header
    currentY = this.addInvoiceHeader(doc, 'PROPOSAL', currentY, margin, contentWidth, 'proposal');

    // Date
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Date: ${this.formatDate(data.date || new Date())}`, margin, currentY);
    currentY += 8;

    // Client info
    if (data.clientName || data.clientCompany) {
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(this.hexToRGB(this.colors.primary).r, this.hexToRGB(this.colors.primary).g, this.hexToRGB(this.colors.primary).b);
      doc.text('FOR:', margin, currentY);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(0, 0, 0);
      currentY += 5;
      if (data.clientName) {
        doc.setFontSize(10);
        doc.text(data.clientName, margin, currentY);
        currentY += 5;
      }
      if (data.clientCompany) {
        doc.setFontSize(9);
        doc.text(data.clientCompany, margin, currentY);
        currentY += 5;
      }
      if (data.clientEmail) {
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(data.clientEmail, margin, currentY);
        currentY += 8;
      }
    }

    // Project name
    if (data.projectName) {
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(this.hexToRGB(this.colors.primary).r, this.hexToRGB(this.colors.primary).g, this.hexToRGB(this.colors.primary).b);
      const projectLines = doc.splitTextToSize(data.projectName, contentWidth);
      doc.text(projectLines, margin, currentY);
      currentY += (projectLines.length * 6) + 5;
    }

    // Project description
    if (data.projectDescription) {
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('PROJECT DESCRIPTION', margin, currentY);
      currentY += 5;
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      const descLines = doc.splitTextToSize(data.projectDescription, contentWidth);
      doc.text(descLines, margin, currentY);
      currentY += (descLines.length * 4) + 5;
    }

    // Work includes
    if (data.workIncludes) {
      currentY = this.addProposalSection(doc, 'WORK INCLUDES', data.workIncludes, currentY, margin, contentWidth);
    }

    // Work delivered
    if (data.workDelivered) {
      currentY = this.addProposalSection(doc, 'WORK DELIVERED', data.workDelivered, currentY, margin, contentWidth);
    }

    // Timeline
    if (data.timeline) {
      currentY = this.addProposalSection(doc, 'TIMELINE', data.timeline, currentY, margin, contentWidth);
    }

    // Investment
    if (data.investmentAmount) {
      currentY += 3;
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(this.hexToRGB(this.colors.primary).r, this.hexToRGB(this.colors.primary).g, this.hexToRGB(this.colors.primary).b);
      doc.text('INVESTMENT', margin, currentY);
      currentY += 5;
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(`$${this.formatCurrency(data.investmentAmount)}`, margin, currentY);
      currentY += 6;
      if (data.investmentNotes) {
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        const notesLines = doc.splitTextToSize(data.investmentNotes, contentWidth);
        doc.text(notesLines, margin, currentY);
        currentY += (notesLines.length * 3);
      }
    }

    // Notes
    if (data.notes) {
      currentY += 5;
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(100, 100, 100);
      const notesLines = doc.splitTextToSize(data.notes, contentWidth);
      doc.text(notesLines, margin, currentY);
    }

    const filename = `proposal-${data.projectName ? data.projectName.substring(0, 20).replace(/\s+/g, '-') : 'draft'}-${new Date().getTime()}.pdf`;
    doc.save(filename);

    return filename;
  }

  /**
   * Generate Invoice PDF
   */
  async generateInvoice(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 20;
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    // Header
    currentY = this.addInvoiceHeader(doc, 'INVOICE', currentY, margin, contentWidth, 'invoice');

    // Invoice info and dates
    const infoStartY = 25;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);

    // Left side - Invoice number
    doc.text('Invoice #', margin, infoStartY);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(data.invoiceNumber || '00000', margin, infoStartY + 5);

    // Right side - Dates
    const rightCol = pageWidth - margin - 60;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont(undefined, 'normal');
    doc.text('Invoice Date:', rightCol, infoStartY);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(this.formatDate(data.invoiceDate || new Date()), rightCol, infoStartY + 5);

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont(undefined, 'normal');
    doc.text('Due Date:', rightCol, infoStartY + 12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(this.formatDate(data.dueDate || new Date()), rightCol, infoStartY + 17);

    currentY = 45;

    // Two column layout
    const colWidth = (contentWidth / 2) - 3;

    // Bill To
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(this.hexToRGB(this.colors.primary).r, this.hexToRGB(this.colors.primary).g, this.hexToRGB(this.colors.primary).b);
    doc.text('BILL TO:', margin, currentY);

    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    currentY += 5;

    if (data.billName) {
      doc.text(data.billName, margin, currentY);
      currentY += 4;
    }
    if (data.billCompany) {
      doc.setFontSize(9);
      doc.text(data.billCompany, margin, currentY);
      currentY += 4;
    }
    if (data.billAddress) {
      doc.setFontSize(8);
      const addressLines = doc.splitTextToSize(data.billAddress, colWidth);
      doc.text(addressLines, margin, currentY);
      currentY += (addressLines.length * 3) + 2;
    }
    if (data.billEmail) {
      doc.setFontSize(8);
      doc.text(data.billEmail, margin, currentY);
      currentY += 3;
    }

    // Company info on right
    const companyY = 45;
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(this.hexToRGB(this.colors.primary).r, this.hexToRGB(this.colors.primary).g, this.hexToRGB(this.colors.primary).b);
    doc.text('FROM:', rightCol, companyY);

    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    let companyInfoY = companyY + 5;

    if (this.branding.companyName) {
      doc.text(this.branding.companyName, rightCol, companyInfoY);
      companyInfoY += 3;
    }
    if (this.branding.companyAddress) {
      const compAddrLines = doc.splitTextToSize(this.branding.companyAddress, colWidth);
      doc.setFontSize(8);
      doc.text(compAddrLines, rightCol, companyInfoY);
      companyInfoY += (compAddrLines.length * 3);
    }
    if (this.branding.companyPhone) {
      doc.setFontSize(8);
      doc.text(this.branding.companyPhone, rightCol, companyInfoY);
      companyInfoY += 3;
    }
    if (this.branding.companyEmail) {
      doc.setFontSize(8);
      doc.text(this.branding.companyEmail, rightCol, companyInfoY);
    }

    currentY = 85;

    // Items table
    currentY = this.addItemsTable(doc, data.items || [], currentY, margin, contentWidth, 'invoice');

    // Totals
    this.addTotalsSection(doc, data, currentY + 5, margin, contentWidth, 'invoice');

    // Payment info
    if (data.paymentTerms || data.paymentMethods) {
      const totalsY = 250;
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(this.hexToRGB(this.colors.primary).r, this.hexToRGB(this.colors.primary).g, this.hexToRGB(this.colors.primary).b);
      doc.text('PAYMENT INFORMATION:', margin, totalsY);

      doc.setFont(undefined, 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(8);
      let payY = totalsY + 5;

      if (data.paymentTerms) {
        doc.text(`Terms: ${data.paymentTerms}`, margin, payY);
        payY += 4;
      }

      if (data.paymentMethods) {
        const methodLines = doc.splitTextToSize(`Methods: ${data.paymentMethods}`, contentWidth);
        doc.text(methodLines, margin, payY);
      }
    }

    const filename = `invoice-${data.invoiceNumber || 'draft'}-${new Date().getTime()}.pdf`;
    doc.save(filename);

    return filename;
  }

  /**
   * Add invoice header with branding
   */
  addInvoiceHeader(doc, title, startY, margin, contentWidth, type) {
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add colored accent bar
    const primaryRGB = this.hexToRGB(this.colors.primary);
    doc.setFillColor(primaryRGB.r, primaryRGB.g, primaryRGB.b);
    doc.rect(0, startY - 10, pageWidth, 15, 'F');

    // Company name/logo area
    if (this.branding.logoUrl) {
      try {
        doc.addImage(this.branding.logoUrl, 'PNG', margin, startY - 8, 20, 20);
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(title, margin + 25, startY);
      } catch (e) {
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(title, margin, startY);
      }
    } else {
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(title, margin, startY);
    }

    // Company name on right
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    const rightX = pageWidth - margin - 50;
    if (this.branding.companyName) {
      const nameLines = doc.splitTextToSize(this.branding.companyName, 50);
      doc.text(nameLines, rightX, startY - 5);
    }

    return startY + 15;
  }

  /**
   * Add items table
   */
  addItemsTable(doc, items, startY, margin, contentWidth, type) {
    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = startY;

    // Table header
    const primaryRGB = this.hexToRGB(this.colors.primary);
    doc.setFillColor(primaryRGB.r, primaryRGB.g, primaryRGB.b);
    doc.rect(margin, currentY - 5, contentWidth, 8, 'F');

    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(255, 255, 255);

    const col1 = margin + 3;
    const col2 = pageWidth - margin - 60;
    const col3 = pageWidth - margin - 35;
    const col4 = pageWidth - margin - 12;

    doc.text('DESCRIPTION', col1, currentY);
    doc.text(type === 'receipt' ? 'QTY' : 'QTY', col2, currentY);
    doc.text(type === 'receipt' ? 'PRICE' : 'RATE', col3, currentY);
    doc.text('TOTAL', col4, currentY);

    currentY += 8;

    // Table rows
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);

    let subtotal = 0;

    items.forEach((item) => {
      const descLines = doc.splitTextToSize(item.description || '', 50);
      const lineHeight = 4;
      const itemHeight = Math.max(descLines.length * lineHeight + 2, 6);

      // Check if we need a new page
      if (currentY + itemHeight > 240) {
        doc.addPage();
        currentY = 20;
      }

      // Item row
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, currentY - 4, contentWidth, itemHeight, 'F');
      doc.setDrawColor(230, 230, 230);
      doc.rect(margin, currentY - 4, contentWidth, itemHeight);

      // Description
      doc.text(descLines, col1, currentY);

      // Qty
      const qty = parseFloat(item.quantity) || 0;
      doc.text(qty.toString(), col2, currentY, { align: 'center' });

      // Price/Rate
      const rate = parseFloat(item.price || item.rate) || 0;
      const rateStr = `$${this.formatCurrency(rate)}`;
      doc.text(rateStr, col3, currentY, { align: 'right' });

      // Total
      const total = qty * rate;
      subtotal += total;
      const totalStr = `$${this.formatCurrency(total)}`;
      doc.text(totalStr, col4, currentY, { align: 'right' });

      currentY += itemHeight;
    });

    return currentY;
  }

  /**
   * Add totals section
   */
  addTotalsSection(doc, data, startY, margin, contentWidth, type) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const rightCol = pageWidth - margin - 50;

    let currentY = startY;

    // Calculate subtotal
    let subtotal = 0;
    if (data.items && Array.isArray(data.items)) {
      data.items.forEach(item => {
        const qty = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.price || item.rate) || 0;
        subtotal += qty * price;
      });
    }

    // Subtotal line
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text('Subtotal:', rightCol - 30, currentY);
    doc.text(`$${this.formatCurrency(subtotal)}`, rightCol + 10, currentY, { align: 'right' });

    currentY += 5;

    // Tax line (if applicable)
    let tax = 0;
    if (data.tax) {
      tax = parseFloat(data.tax);
      doc.text('Tax:', rightCol - 30, currentY);
      doc.text(`$${this.formatCurrency(tax)}`, rightCol + 10, currentY, { align: 'right' });
      currentY += 5;
    }

    // Total line
    const total = subtotal + tax;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(11);
    const primaryRGB = this.hexToRGB(this.colors.primary);
    doc.setTextColor(primaryRGB.r, primaryRGB.g, primaryRGB.b);

    doc.text('TOTAL:', rightCol - 30, currentY);
    doc.text(`$${this.formatCurrency(total)}`, rightCol + 10, currentY, { align: 'right' });
  }

  /**
   * Add proposal section
   */
  addProposalSection(doc, title, content, startY, margin, contentWidth) {
    let currentY = startY + 3;

    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(this.hexToRGB(this.colors.primary).r, this.hexToRGB(this.colors.primary).g, this.hexToRGB(this.colors.primary).b);
    doc.text(title, margin, currentY);

    currentY += 5;

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);

    // Split content by newlines and render as bullet points
    const items = content.split('\n').filter(line => line.trim());
    items.forEach(item => {
      const lines = doc.splitTextToSize(`• ${item.trim()}`, contentWidth - 5);
      doc.text(lines, margin + 3, currentY);
      currentY += (lines.length * 4) + 2;
    });

    return currentY;
  }

  /**
   * Helper: Format date
   */
  formatDate(date) {
    if (typeof date === 'string') {
      return date;
    }
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  /**
   * Helper: Format currency
   */
  formatCurrency(value) {
    return parseFloat(value).toFixed(2);
  }

  /**
   * Helper: Convert hex to RGB
   */
  hexToRGB(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 63, g: 81, b: 181 }; // Default primary color
  }
}

// Export for use in app
window.InvoicePdfGenerator = InvoicePdfGenerator;
