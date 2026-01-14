/**
 * Invoice Templates
 * Professional invoice templates based on small business design standards
 * Supports Receipt, Proposal, and Invoice formats with dynamic branding
 */

const INVOICE_TEMPLATES = [
  {
    id: 'receipt',
    name: 'Small Business Receipt',
    description: 'Professional receipt for completed transactions',
    category: 'Finance',
    icon: '🧾',
    type: 'receipt',
    sections: [
      {
        id: 'receipt-header',
        title: 'Receipt Header',
        description: 'Company branding and receipt information',
        isHeader: true,
        fields: [
          {
            id: 'receipt-company-name',
            type: 'text',
            label: 'Company Name',
            placeholder: 'Your Business Name',
            required: true,
            fontSize: 24,
            fontWeight: 'bold'
          },
          {
            id: 'receipt-date',
            type: 'date',
            label: 'Date',
            required: true
          },
          {
            id: 'receipt-number',
            type: 'text',
            label: 'Receipt #',
            placeholder: 'Receipt number',
            required: true
          }
        ]
      },
      {
        id: 'receipt-customer',
        title: 'Customer Information',
        description: 'Who received this receipt?',
        fields: [
          {
            id: 'receipt-customer-name',
            type: 'text',
            label: 'Customer Name',
            required: true
          },
          {
            id: 'receipt-customer-email',
            type: 'email',
            label: 'Customer Email',
            required: false
          }
        ]
      },
      {
        id: 'receipt-items',
        title: 'Line Items',
        description: 'Products or services provided',
        isLineItems: true,
        fields: [
          {
            id: 'receipt-item-description',
            type: 'text',
            label: 'Description',
            required: true
          },
          {
            id: 'receipt-item-quantity',
            type: 'number',
            label: 'Quantity',
            required: true,
            defaultValue: 1
          },
          {
            id: 'receipt-item-price',
            type: 'currency',
            label: 'Price',
            required: true
          },
          {
            id: 'receipt-item-total',
            type: 'currency',
            label: 'Total',
            required: true,
            isCalculated: true
          }
        ]
      },
      {
        id: 'receipt-totals',
        title: 'Totals',
        description: 'Payment summary',
        isTotals: true,
        fields: [
          {
            id: 'receipt-subtotal',
            type: 'currency',
            label: 'Subtotal',
            isCalculated: true
          },
          {
            id: 'receipt-tax',
            type: 'currency',
            label: 'Tax',
            required: false
          },
          {
            id: 'receipt-total',
            type: 'currency',
            label: 'Total',
            isCalculated: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        ]
      },
      {
        id: 'receipt-payment',
        title: 'Payment Method',
        description: 'How was this paid?',
        fields: [
          {
            id: 'receipt-payment-method',
            type: 'radio',
            label: 'Payment Method',
            options: ['Cash', 'Card', 'Check', 'Bank Transfer', 'Other'],
            required: true
          }
        ]
      },
      {
        id: 'receipt-notes',
        title: 'Notes',
        description: 'Additional information',
        fields: [
          {
            id: 'receipt-notes-text',
            type: 'textarea',
            label: 'Notes',
            placeholder: 'Add any additional notes or instructions',
            required: false
          }
        ]
      }
    ]
  },

  {
    id: 'proposal',
    name: 'Small Business Proposal',
    description: 'Professional project proposal with scope and pricing',
    category: 'Finance',
    icon: '📋',
    type: 'proposal',
    sections: [
      {
        id: 'proposal-header',
        title: 'Proposal Header',
        description: 'Company branding and proposal information',
        isHeader: true,
        fields: [
          {
            id: 'proposal-company-name',
            type: 'text',
            label: 'Company Name',
            placeholder: 'Your Business Name',
            required: true,
            fontSize: 24,
            fontWeight: 'bold'
          },
          {
            id: 'proposal-date',
            type: 'date',
            label: 'Date',
            required: true
          }
        ]
      },
      {
        id: 'proposal-client',
        title: 'Client Information',
        description: 'Who is this proposal for?',
        fields: [
          {
            id: 'proposal-client-name',
            type: 'text',
            label: 'Client Name',
            required: true
          },
          {
            id: 'proposal-client-company',
            type: 'text',
            label: 'Client Company',
            required: false
          },
          {
            id: 'proposal-client-email',
            type: 'email',
            label: 'Client Email',
            required: true
          }
        ]
      },
      {
        id: 'proposal-project',
        title: 'Project Details',
        description: 'What is the project about?',
        fields: [
          {
            id: 'proposal-project-name',
            type: 'text',
            label: 'Project Name',
            placeholder: 'Project title',
            required: true
          },
          {
            id: 'proposal-project-description',
            type: 'textarea',
            label: 'Project Description',
            placeholder: 'Describe the project scope and objectives',
            required: true
          }
        ]
      },
      {
        id: 'proposal-scope',
        title: 'Work Includes',
        description: 'What will be delivered?',
        fields: [
          {
            id: 'proposal-scope-items',
            type: 'textarea',
            label: 'Work Scope',
            placeholder: 'List all deliverables and work items (one per line)',
            required: true,
            rows: 5
          }
        ]
      },
      {
        id: 'proposal-delivery',
        title: 'Work Delivered',
        description: 'Delivery schedule and milestones',
        fields: [
          {
            id: 'proposal-delivery-items',
            type: 'textarea',
            label: 'Delivery Milestones',
            placeholder: 'List delivery dates and milestones (one per line)',
            required: true,
            rows: 4
          }
        ]
      },
      {
        id: 'proposal-timeline',
        title: 'Timeline',
        description: 'Project schedule',
        fields: [
          {
            id: 'proposal-timeline-items',
            type: 'textarea',
            label: 'Timeline',
            placeholder: 'List timeline milestones (one per line)',
            required: true,
            rows: 3
          }
        ]
      },
      {
        id: 'proposal-investment',
        title: 'Investment',
        description: 'Project cost',
        fields: [
          {
            id: 'proposal-investment-amount',
            type: 'currency',
            label: 'Total Investment',
            required: true
          },
          {
            id: 'proposal-investment-notes',
            type: 'textarea',
            label: 'Investment Notes',
            placeholder: 'Payment terms, conditions, or additional details',
            required: false,
            rows: 3
          }
        ]
      },
      {
        id: 'proposal-notes',
        title: 'Notes',
        description: 'Additional information',
        fields: [
          {
            id: 'proposal-notes-text',
            type: 'textarea',
            label: 'Notes',
            placeholder: 'Add any additional notes or instructions',
            required: false,
            rows: 4
          }
        ]
      }
    ]
  },

  {
    id: 'invoice',
    name: 'Professional Invoice',
    description: 'Complete invoice with itemized billing and payment terms',
    category: 'Finance',
    icon: '💼',
    type: 'invoice',
    sections: [
      {
        id: 'invoice-header',
        title: 'Invoice Header',
        description: 'Company branding and invoice information',
        isHeader: true,
        fields: [
          {
            id: 'invoice-company-name',
            type: 'text',
            label: 'Company Name',
            placeholder: 'Your Business Name',
            required: true,
            fontSize: 20,
            fontWeight: 'bold'
          },
          {
            id: 'invoice-company-address',
            type: 'textarea',
            label: 'Company Address',
            placeholder: 'Full address',
            required: false,
            rows: 2
          },
          {
            id: 'invoice-company-phone',
            type: 'tel',
            label: 'Phone',
            required: false
          },
          {
            id: 'invoice-company-email',
            type: 'email',
            label: 'Email',
            required: false
          }
        ]
      },
      {
        id: 'invoice-info',
        title: 'Invoice Information',
        description: 'Invoice details and dates',
        fields: [
          {
            id: 'invoice-number',
            type: 'text',
            label: 'Invoice #',
            placeholder: 'Invoice number',
            required: true
          },
          {
            id: 'invoice-date',
            type: 'date',
            label: 'Invoice Date',
            required: true
          },
          {
            id: 'invoice-due-date',
            type: 'date',
            label: 'Due Date',
            required: true
          }
        ]
      },
      {
        id: 'invoice-billing',
        title: 'Bill To',
        description: 'Client information',
        fields: [
          {
            id: 'invoice-bill-name',
            type: 'text',
            label: 'Client Name',
            required: true
          },
          {
            id: 'invoice-bill-company',
            type: 'text',
            label: 'Company',
            required: false
          },
          {
            id: 'invoice-bill-address',
            type: 'textarea',
            label: 'Address',
            placeholder: 'Full billing address',
            required: false,
            rows: 2
          },
          {
            id: 'invoice-bill-email',
            type: 'email',
            label: 'Email',
            required: false
          },
          {
            id: 'invoice-bill-phone',
            type: 'tel',
            label: 'Phone',
            required: false
          }
        ]
      },
      {
        id: 'invoice-items',
        title: 'Line Items',
        description: 'Services or products provided',
        isLineItems: true,
        fields: [
          {
            id: 'invoice-item-description',
            type: 'text',
            label: 'Description',
            required: true
          },
          {
            id: 'invoice-item-quantity',
            type: 'number',
            label: 'Qty',
            required: true,
            defaultValue: 1
          },
          {
            id: 'invoice-item-rate',
            type: 'currency',
            label: 'Rate',
            required: true
          },
          {
            id: 'invoice-item-total',
            type: 'currency',
            label: 'Total',
            required: true,
            isCalculated: true
          }
        ]
      },
      {
        id: 'invoice-totals',
        title: 'Totals',
        description: 'Amount due',
        isTotals: true,
        fields: [
          {
            id: 'invoice-subtotal',
            type: 'currency',
            label: 'Subtotal',
            isCalculated: true
          },
          {
            id: 'invoice-tax-rate',
            type: 'text',
            label: 'Tax Rate (%)',
            required: false
          },
          {
            id: 'invoice-tax',
            type: 'currency',
            label: 'Tax',
            required: false
          },
          {
            id: 'invoice-total',
            type: 'currency',
            label: 'Total',
            isCalculated: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        ]
      },
      {
        id: 'invoice-payment',
        title: 'Payment Information',
        description: 'Payment terms and methods',
        fields: [
          {
            id: 'invoice-payment-terms',
            type: 'radio',
            label: 'Payment Terms',
            options: ['Due on Receipt', 'Net 15', 'Net 30', 'Net 60', 'Custom'],
            required: true
          },
          {
            id: 'invoice-payment-methods',
            type: 'textarea',
            label: 'Payment Methods',
            placeholder: 'Bank transfer details, card info, check instructions, etc.',
            required: false,
            rows: 3
          }
        ]
      },
      {
        id: 'invoice-notes',
        title: 'Notes',
        description: 'Additional information and terms',
        fields: [
          {
            id: 'invoice-notes-text',
            type: 'textarea',
            label: 'Notes & Terms',
            placeholder: 'Add any notes, special instructions, or terms',
            required: false,
            rows: 4
          }
        ]
      }
    ]
  }
];

// Export for use in app
window.INVOICE_TEMPLATES = INVOICE_TEMPLATES;
