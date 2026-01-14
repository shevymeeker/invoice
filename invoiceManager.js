/**
 * Invoice Manager
 * Handles invoice creation, editing, and PDF generation with branding
 */

class InvoiceManager {
  constructor() {
    this.currentInvoice = null;
    this.invoiceType = 'invoice'; // 'invoice', 'receipt', or 'proposal'
  }

  /**
   * Create new invoice from template
   */
  async createInvoice(templateId) {
    const template = INVOICE_TEMPLATES.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const invoice = {
      id: 'invoice-' + Date.now(),
      templateId: templateId,
      type: template.type,
      title: template.name,
      createdAt: new Date().toISOString(),
      data: {}
    };

    // Initialize invoice data with empty fields
    template.sections.forEach(section => {
      section.fields?.forEach(field => {
        if (field.defaultValue) {
          invoice.data[field.id] = field.defaultValue;
        } else if (field.type === 'date') {
          invoice.data[field.id] = new Date().toISOString().split('T')[0];
        } else {
          invoice.data[field.id] = '';
        }
      });
    });

    // Add line items array for invoice types that support it
    if (template.type === 'invoice' || template.type === 'receipt') {
      invoice.data.items = [];
    }

    this.currentInvoice = invoice;
    return invoice;
  }

  /**
   * Save invoice to database
   */
  async saveInvoice(invoice) {
    if (!invoice) invoice = this.currentInvoice;

    const db = window.DB;
    // Store invoices in responses store with special metadata
    const response = {
      id: invoice.id,
      templateId: invoice.templateId,
      isInvoice: true,
      invoiceType: invoice.type,
      data: invoice.data,
      createdAt: invoice.createdAt,
      savedAt: new Date().toISOString()
    };

    await db.saveResponse(response);
    return response;
  }

  /**
   * Load invoice from database
   */
  async loadInvoice(invoiceId) {
    const response = await window.DB.getResponse(invoiceId);
    if (!response || !response.isInvoice) {
      throw new Error('Invoice not found');
    }

    this.currentInvoice = {
      id: response.id,
      templateId: response.templateId,
      type: response.invoiceType,
      data: response.data,
      createdAt: response.createdAt,
      title: `Invoice ${response.invoiceNumber || 'Draft'}`
    };

    return this.currentInvoice;
  }

  /**
   * Get all invoices
   */
  async getAllInvoices() {
    const responses = await window.DB.getAllResponses();
    return responses.filter(r => r.isInvoice);
  }

  /**
   * Add line item to invoice
   */
  addLineItem(description = '', quantity = 1, price = 0) {
    if (!this.currentInvoice) return null;

    const item = {
      id: 'item-' + Date.now(),
      description: description,
      quantity: parseFloat(quantity) || 1,
      price: parseFloat(price) || 0,
      total: (parseFloat(quantity) || 1) * (parseFloat(price) || 0)
    };

    if (!this.currentInvoice.data.items) {
      this.currentInvoice.data.items = [];
    }

    this.currentInvoice.data.items.push(item);
    return item;
  }

  /**
   * Update line item
   */
  updateLineItem(itemId, description, quantity, price) {
    if (!this.currentInvoice?.data.items) return null;

    const item = this.currentInvoice.data.items.find(i => i.id === itemId);
    if (!item) return null;

    item.description = description;
    item.quantity = parseFloat(quantity) || 1;
    item.price = parseFloat(price) || 0;
    item.total = item.quantity * item.price;

    return item;
  }

  /**
   * Remove line item
   */
  removeLineItem(itemId) {
    if (!this.currentInvoice?.data.items) return false;

    const index = this.currentInvoice.data.items.findIndex(i => i.id === itemId);
    if (index === -1) return false;

    this.currentInvoice.data.items.splice(index, 1);
    return true;
  }

  /**
   * Get template by ID
   */
  getTemplate(templateId) {
    return INVOICE_TEMPLATES.find(t => t.id === templateId);
  }

  /**
   * Generate PDF invoice
   */
  async generatePdf() {
    if (!this.currentInvoice) {
      throw new Error('No invoice loaded');
    }

    const generator = new window.InvoicePdfGenerator();
    await generator.init();

    const data = {
      ...this.currentInvoice.data,
      items: this.currentInvoice.data.items || []
    };

    switch (this.currentInvoice.type) {
      case 'receipt':
        return await generator.generateReceipt(data);
      case 'proposal':
        return await generator.generateProposal(data);
      case 'invoice':
        return await generator.generateInvoice(data);
      default:
        throw new Error('Unknown invoice type');
    }
  }

  /**
   * Calculate totals
   */
  calculateTotals() {
    if (!this.currentInvoice?.data.items) {
      return { subtotal: 0, tax: 0, total: 0 };
    }

    let subtotal = 0;
    this.currentInvoice.data.items.forEach(item => {
      subtotal += (item.quantity * item.price) || 0;
    });

    const taxRate = parseFloat(this.currentInvoice.data['invoice-tax-rate']) || 0;
    const tax = (subtotal * taxRate) / 100;
    const total = subtotal + tax;

    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2)
    };
  }

  /**
   * Export invoice as JSON
   */
  exportJson() {
    return JSON.stringify(this.currentInvoice, null, 2);
  }

  /**
   * Import invoice from JSON
   */
  importJson(jsonString) {
    try {
      const invoice = JSON.parse(jsonString);
      this.currentInvoice = invoice;
      return invoice;
    } catch (e) {
      throw new Error('Invalid JSON format');
    }
  }

  /**
   * Duplicate invoice
   */
  async duplicateInvoice(invoiceId) {
    const original = await this.loadInvoice(invoiceId);
    const duplicate = {
      ...original,
      id: 'invoice-' + Date.now(),
      createdAt: new Date().toISOString()
    };

    this.currentInvoice = duplicate;
    return duplicate;
  }

  /**
   * Clone for new invoice with same template
   */
  cloneTemplate() {
    if (!this.currentInvoice) return null;

    const template = this.getTemplate(this.currentInvoice.templateId);
    const cloned = {
      id: 'invoice-' + Date.now(),
      templateId: this.currentInvoice.templateId,
      type: this.currentInvoice.type,
      title: this.currentInvoice.title,
      createdAt: new Date().toISOString(),
      data: {}
    };

    // Copy template defaults but clear user data
    template.sections.forEach(section => {
      section.fields?.forEach(field => {
        if (field.defaultValue) {
          cloned.data[field.id] = field.defaultValue;
        } else if (field.type === 'date') {
          cloned.data[field.id] = new Date().toISOString().split('T')[0];
        } else {
          cloned.data[field.id] = '';
        }
      });
    });

    if (template.type === 'invoice' || template.type === 'receipt') {
      cloned.data.items = [];
    }

    this.currentInvoice = cloned;
    return cloned;
  }

  /**
   * Validate invoice before save/export
   */
  validate() {
    const template = this.getTemplate(this.currentInvoice.templateId);
    const errors = [];

    // Check required fields
    template.sections.forEach(section => {
      section.fields?.forEach(field => {
        if (field.required && !this.currentInvoice.data[field.id]) {
          errors.push(`${field.label} is required`);
        }
      });
    });

    // Check line items if applicable
    if (template.type === 'invoice' || template.type === 'receipt') {
      if (!this.currentInvoice.data.items || this.currentInvoice.data.items.length === 0) {
        errors.push('At least one line item is required');
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
}

// Export for use in app
window.InvoiceManager = InvoiceManager;
