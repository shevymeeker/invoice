/**
 * Sample Form Templates
 * Pre-built templates that users can import to get started quickly
 * These templates are generic and auto-branded with user's company info
 */

const SAMPLE_TEMPLATES = [
  {
    name: 'Website Quick Start',
    description: '6-step intake to capture everything needed to launch a site',
    category: 'Web',
    icon: '🚀',
    sections: [
      {
        id: 'quick-start-1',
        title: "What's your business called?",
        description: 'This becomes the main headline on the site',
        questions: [
          {
            id: 'quick-start-business-name',
            type: 'text',
            label: "Business Name",
            required: true
          }
        ]
      },
      {
        id: 'quick-start-2',
        title: 'What does your business do?',
        description: 'One clear sentence works best',
        questions: [
          {
            id: 'quick-start-description',
            type: 'textarea',
            label: 'Business Description',
            required: true
          }
        ]
      },
      {
        id: 'quick-start-3',
        title: 'Top 3 services',
        description: 'List the core offers you provide',
        questions: [
          {
            id: 'quick-start-service-1',
            type: 'text',
            label: 'Service 1',
            required: true
          },
          {
            id: 'quick-start-service-2',
            type: 'text',
            label: 'Service 2',
            required: true
          },
          {
            id: 'quick-start-service-3',
            type: 'text',
            label: 'Service 3',
            required: true
          }
        ]
      },
      {
        id: 'quick-start-4',
        title: 'Best phone number',
        description: 'Published for customer inquiries',
        questions: [
          {
            id: 'quick-start-phone',
            type: 'text',
            label: 'Phone Number',
            required: true
          }
        ]
      },
      {
        id: 'quick-start-5',
        title: 'Do you have a logo?',
        description: 'Upload it or describe how it should look',
        questions: [
          {
            id: 'quick-start-logo-url',
            type: 'text',
            label: 'Logo URL or notes (optional)',
            required: false
          }
        ]
      },
      {
        id: 'quick-start-6',
        title: 'Anything else?',
        description: 'Special requests, brand colors, inspiration sites, deadlines',
        questions: [
          {
            id: 'quick-start-notes',
            type: 'textarea',
            label: 'Additional Details (optional)',
            required: false
          }
        ]
      }
    ]
  },
  {
    name: 'Contact Form',
    description: 'Simple contact form for general inquiries and questions',
    category: 'General',
    icon: '✉️',
    sections: [
      {
        id: 'sample-contact-1',
        title: 'Contact Information',
        description: 'How can we reach you?',
        questions: [
          {
            id: 'sample-contact-1-1',
            type: 'text',
            label: 'Full Name',
            required: true
          },
          {
            id: 'sample-contact-1-2',
            type: 'text',
            label: 'Email Address',
            required: true
          },
          {
            id: 'sample-contact-1-3',
            type: 'text',
            label: 'Phone Number',
            required: false
          },
          {
            id: 'sample-contact-1-4',
            type: 'text',
            label: 'Company/Organization (optional)',
            required: false
          }
        ]
      },
      {
        id: 'sample-contact-2',
        title: 'Your Message',
        description: 'Tell us how we can help',
        questions: [
          {
            id: 'sample-contact-2-1',
            type: 'radio',
            label: 'Subject',
            required: true,
            options: ['General Inquiry', 'Request a Quote', 'Support', 'Partnership', 'Other']
          },
          {
            id: 'sample-contact-2-2',
            type: 'textarea',
            label: 'Message',
            required: true
          },
          {
            id: 'sample-contact-2-3',
            type: 'radio',
            label: 'Preferred contact method',
            required: false,
            options: ['Email', 'Phone', 'No Preference']
          }
        ]
      }
    ]
  },

  {
    name: 'Job Application',
    description: 'Employment application form for collecting candidate information',
    category: 'HR',
    icon: '💼',
    sections: [
      {
        id: 'sample-job-1',
        title: 'Personal Information',
        description: 'Tell us about yourself',
        questions: [
          {
            id: 'sample-job-1-1',
            type: 'text',
            label: 'Full Name',
            required: true
          },
          {
            id: 'sample-job-1-2',
            type: 'text',
            label: 'Email Address',
            required: true
          },
          {
            id: 'sample-job-1-3',
            type: 'text',
            label: 'Phone Number',
            required: true
          },
          {
            id: 'sample-job-1-4',
            type: 'textarea',
            label: 'Current Address',
            required: true
          },
          {
            id: 'sample-job-1-5',
            type: 'text',
            label: 'LinkedIn Profile (optional)',
            required: false
          }
        ]
      },
      {
        id: 'sample-job-2',
        title: 'Position & Availability',
        description: 'Which position are you applying for?',
        questions: [
          {
            id: 'sample-job-2-1',
            type: 'text',
            label: 'Position Applied For',
            required: true
          },
          {
            id: 'sample-job-2-2',
            type: 'radio',
            label: 'Employment Type Desired',
            required: true,
            options: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Flexible']
          },
          {
            id: 'sample-job-2-3',
            type: 'text',
            label: 'Desired Salary/Rate',
            required: false
          },
          {
            id: 'sample-job-2-4',
            type: 'text',
            label: 'Available Start Date',
            required: true
          }
        ]
      },
      {
        id: 'sample-job-3',
        title: 'Experience & Qualifications',
        description: 'Share your background',
        questions: [
          {
            id: 'sample-job-3-1',
            type: 'textarea',
            label: 'Relevant Work Experience (most recent first)',
            required: true
          },
          {
            id: 'sample-job-3-2',
            type: 'textarea',
            label: 'Education & Certifications',
            required: true
          },
          {
            id: 'sample-job-3-3',
            type: 'textarea',
            label: 'Key Skills & Competencies',
            required: true
          },
          {
            id: 'sample-job-3-4',
            type: 'textarea',
            label: 'Why are you interested in this position?',
            required: true
          }
        ]
      },
      {
        id: 'sample-job-4',
        title: 'References',
        description: 'Professional references (optional)',
        questions: [
          {
            id: 'sample-job-4-1',
            type: 'textarea',
            label: 'Reference 1: Name, Title, Company, Phone',
            required: false
          },
          {
            id: 'sample-job-4-2',
            type: 'textarea',
            label: 'Reference 2: Name, Title, Company, Phone',
            required: false
          },
          {
            id: 'sample-job-4-3',
            type: 'checkbox',
            label: 'Acknowledgment',
            required: true,
            options: ['I certify that the information provided is accurate and complete']
          },
          {
            id: 'sample-job-4-4',
            type: 'signature',
            label: 'Applicant Signature',
            required: true
          }
        ]
      }
    ]
  },

  {
    name: 'Registration Form',
    description: 'General registration form for events, services, or memberships',
    category: 'Events',
    icon: '📋',
    sections: [
      {
        id: 'sample-reg-1',
        title: 'Participant Information',
        description: 'Who is registering?',
        questions: [
          {
            id: 'sample-reg-1-1',
            type: 'text',
            label: 'Full Name',
            required: true
          },
          {
            id: 'sample-reg-1-2',
            type: 'text',
            label: 'Email Address',
            required: true
          },
          {
            id: 'sample-reg-1-3',
            type: 'text',
            label: 'Phone Number',
            required: true
          },
          {
            id: 'sample-reg-1-4',
            type: 'text',
            label: 'Organization/Company (if applicable)',
            required: false
          },
          {
            id: 'sample-reg-1-5',
            type: 'text',
            label: 'Job Title/Role (if applicable)',
            required: false
          }
        ]
      },
      {
        id: 'sample-reg-2',
        title: 'Registration Details',
        description: 'What are you registering for?',
        questions: [
          {
            id: 'sample-reg-2-1',
            type: 'radio',
            label: 'Registration Type',
            required: true,
            options: ['Individual', 'Group', 'Organization', 'Student']
          },
          {
            id: 'sample-reg-2-2',
            type: 'text',
            label: 'Number of Participants (if group)',
            required: false
          },
          {
            id: 'sample-reg-2-3',
            type: 'checkbox',
            label: 'What are you interested in?',
            required: true,
            options: ['Full Access', 'Basic Package', 'Premium Package', 'VIP Package']
          },
          {
            id: 'sample-reg-2-4',
            type: 'radio',
            label: 'How did you hear about us?',
            required: false,
            options: ['Website', 'Social Media', 'Referral', 'Email', 'Advertisement', 'Other']
          }
        ]
      },
      {
        id: 'sample-reg-3',
        title: 'Additional Information',
        description: 'Help us serve you better',
        questions: [
          {
            id: 'sample-reg-3-1',
            type: 'textarea',
            label: 'Dietary Restrictions/Allergies (if applicable)',
            required: false
          },
          {
            id: 'sample-reg-3-2',
            type: 'textarea',
            label: 'Special Accommodations Needed',
            required: false
          },
          {
            id: 'sample-reg-3-3',
            type: 'textarea',
            label: 'Additional Comments or Questions',
            required: false
          },
          {
            id: 'sample-reg-3-4',
            type: 'checkbox',
            label: 'Agreement',
            required: true,
            options: ['I agree to the terms and conditions', 'I consent to receive updates and communications']
          },
          {
            id: 'sample-reg-3-5',
            type: 'signature',
            label: 'Signature',
            required: true
          }
        ]
      }
    ]
  },

  {
    name: 'Order Form',
    description: 'Product or service order form with pricing and delivery details',
    category: 'Sales',
    icon: '🛒',
    sections: [
      {
        id: 'sample-order-1',
        title: 'Customer Information',
        description: 'Billing and contact details',
        questions: [
          {
            id: 'sample-order-1-1',
            type: 'text',
            label: 'Full Name',
            required: true
          },
          {
            id: 'sample-order-1-2',
            type: 'text',
            label: 'Email Address',
            required: true
          },
          {
            id: 'sample-order-1-3',
            type: 'text',
            label: 'Phone Number',
            required: true
          },
          {
            id: 'sample-order-1-4',
            type: 'textarea',
            label: 'Billing Address',
            required: true
          },
          {
            id: 'sample-order-1-5',
            type: 'text',
            label: 'Company/Organization (optional)',
            required: false
          }
        ]
      },
      {
        id: 'sample-order-2',
        title: 'Order Details',
        description: 'What would you like to order?',
        questions: [
          {
            id: 'sample-order-2-1',
            type: 'textarea',
            label: 'Product/Service Description (Item 1)',
            required: true
          },
          {
            id: 'sample-order-2-2',
            type: 'text',
            label: 'Quantity',
            required: true
          },
          {
            id: 'sample-order-2-3',
            type: 'textarea',
            label: 'Additional Items (optional)',
            required: false
          },
          {
            id: 'sample-order-2-4',
            type: 'checkbox',
            label: 'Add-ons or Special Options',
            required: false,
            options: ['Rush Processing', 'Gift Wrapping', 'Extended Warranty', 'Installation Service']
          },
          {
            id: 'sample-order-2-5',
            type: 'textarea',
            label: 'Special Instructions or Customization',
            required: false
          }
        ]
      },
      {
        id: 'sample-order-3',
        title: 'Delivery & Payment',
        description: 'How and when do you need this?',
        questions: [
          {
            id: 'sample-order-3-1',
            type: 'radio',
            label: 'Delivery Method',
            required: true,
            options: ['Shipping', 'Local Pickup', 'Digital Delivery', 'In-Person Service']
          },
          {
            id: 'sample-order-3-2',
            type: 'textarea',
            label: 'Shipping Address (if different from billing)',
            required: false
          },
          {
            id: 'sample-order-3-3',
            type: 'text',
            label: 'Desired Delivery/Service Date',
            required: false
          },
          {
            id: 'sample-order-3-4',
            type: 'radio',
            label: 'Payment Method',
            required: true,
            options: ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash', 'Invoice', 'Other']
          },
          {
            id: 'sample-order-3-5',
            type: 'text',
            label: 'Purchase Order Number (if applicable)',
            required: false
          },
          {
            id: 'sample-order-3-6',
            type: 'signature',
            label: 'Signature to Confirm Order',
            required: true
          }
        ]
      }
    ]
  },

  {
    name: 'Reservation Form',
    description: 'Booking form for appointments, services, or venue reservations',
    category: 'Bookings',
    icon: '📅',
    sections: [
      {
        id: 'sample-res-1',
        title: 'Contact Information',
        description: 'Who is making the reservation?',
        questions: [
          {
            id: 'sample-res-1-1',
            type: 'text',
            label: 'Full Name',
            required: true
          },
          {
            id: 'sample-res-1-2',
            type: 'text',
            label: 'Email Address',
            required: true
          },
          {
            id: 'sample-res-1-3',
            type: 'text',
            label: 'Phone Number',
            required: true
          },
          {
            id: 'sample-res-1-4',
            type: 'text',
            label: 'Alternative Contact Number (optional)',
            required: false
          }
        ]
      },
      {
        id: 'sample-res-2',
        title: 'Reservation Details',
        description: 'When and what would you like to book?',
        questions: [
          {
            id: 'sample-res-2-1',
            type: 'radio',
            label: 'Type of Reservation',
            required: true,
            options: ['Appointment', 'Service', 'Event Space', 'Table/Seating', 'Equipment', 'Other']
          },
          {
            id: 'sample-res-2-2',
            type: 'text',
            label: 'Preferred Date',
            required: true
          },
          {
            id: 'sample-res-2-3',
            type: 'text',
            label: 'Preferred Time',
            required: true
          },
          {
            id: 'sample-res-2-4',
            type: 'text',
            label: 'Alternative Date/Time (if available)',
            required: false
          },
          {
            id: 'sample-res-2-5',
            type: 'text',
            label: 'Duration (hours/days)',
            required: false
          },
          {
            id: 'sample-res-2-6',
            type: 'text',
            label: 'Number of People/Guests',
            required: true
          }
        ]
      },
      {
        id: 'sample-res-3',
        title: 'Additional Details',
        description: 'Special requests and preferences',
        questions: [
          {
            id: 'sample-res-3-1',
            type: 'checkbox',
            label: 'Special Requirements',
            required: false,
            options: ['Wheelchair Accessible', 'Parking Needed', 'AV Equipment', 'Catering', 'Other']
          },
          {
            id: 'sample-res-3-2',
            type: 'textarea',
            label: 'Special Requests or Notes',
            required: false
          },
          {
            id: 'sample-res-3-3',
            type: 'radio',
            label: 'How did you hear about us?',
            required: false,
            options: ['Website', 'Social Media', 'Referral', 'Previous Customer', 'Advertisement', 'Other']
          },
          {
            id: 'sample-res-3-4',
            type: 'checkbox',
            label: 'Agreement',
            required: true,
            options: ['I understand the cancellation policy', 'I agree to the terms and conditions']
          },
          {
            id: 'sample-res-3-5',
            type: 'signature',
            label: 'Signature to Confirm Reservation',
            required: true
          }
        ]
      }
    ]
  },

  {
    name: 'Client Intake Form - Website Copy Generation',
    description: 'Comprehensive intake form for collecting client information to generate website copy',
    category: 'Marketing',
    icon: '📝',
    sections: [
      {
        id: 'sample-intake-1',
        title: 'Basic Information',
        description: 'Tell us about your business',
        questions: [
          {
            id: 'sample-intake-1-1',
            type: 'text',
            label: 'Company/Business Name',
            required: true
          },
          {
            id: 'sample-intake-1-2',
            type: 'textarea',
            label: 'What service do you provide? (Be specific - e.g., "Tree removal and storm cleanup" not just "landscaping")',
            required: true
          },
          {
            id: 'sample-intake-1-3',
            type: 'text',
            label: 'Business phone number (This is where quote requests will be sent via text)',
            required: true
          },
          {
            id: 'sample-intake-1-4',
            type: 'text',
            label: 'Where do you provide service? (City, county, or region)',
            required: true
          }
        ]
      },
      {
        id: 'sample-intake-2',
        title: 'Your Customers',
        description: 'Help us understand who you serve',
        questions: [
          {
            id: 'sample-intake-2-1',
            type: 'textarea',
            label: 'Who is your ideal customer? (e.g., "Homeowners with overgrown properties", "Property managers", "Realtors")',
            required: true
          },
          {
            id: 'sample-intake-2-2',
            type: 'textarea',
            label: 'What problem are they trying to solve when they call you?',
            required: true
          },
          {
            id: 'sample-intake-2-3',
            type: 'textarea',
            label: 'Why do other companies fail to solve this problem? (What makes the job difficult?)',
            required: true
          },
          {
            id: 'sample-intake-2-4',
            type: 'textarea',
            label: 'What happens if they DON\'T hire someone to fix this? (What pain continues?)',
            required: true
          }
        ]
      },
      {
        id: 'sample-intake-3',
        title: 'Your Solution',
        description: 'What makes you different',
        questions: [
          {
            id: 'sample-intake-3-1',
            type: 'textarea',
            label: 'What makes YOUR company different from competitors? (Your unique advantage)',
            required: true
          },
          {
            id: 'sample-intake-3-2',
            type: 'textarea',
            label: 'How do you actually solve the problem? (Your process, equipment, approach)',
            required: true
          },
          {
            id: 'sample-intake-3-3',
            type: 'text',
            label: 'How fast can you typically complete jobs? (Timeline/turnaround)',
            required: true
          },
          {
            id: 'sample-intake-3-4',
            type: 'text',
            label: 'How do you price your work? (e.g., "Flat-rate quotes", "By the job, not by the hour")',
            required: true
          }
        ]
      },
      {
        id: 'sample-intake-4',
        title: 'Services',
        description: 'Your three main services',
        questions: [
          {
            id: 'sample-intake-4-1',
            type: 'text',
            label: 'Service 1 Name',
            required: true
          },
          {
            id: 'sample-intake-4-2',
            type: 'textarea',
            label: 'Service 1 - What it includes',
            required: true
          },
          {
            id: 'sample-intake-4-3',
            type: 'text',
            label: 'Service 2 Name',
            required: true
          },
          {
            id: 'sample-intake-4-4',
            type: 'textarea',
            label: 'Service 2 - What it includes',
            required: true
          },
          {
            id: 'sample-intake-4-5',
            type: 'text',
            label: 'Service 3 Name',
            required: true
          },
          {
            id: 'sample-intake-4-6',
            type: 'textarea',
            label: 'Service 3 - What it includes',
            required: true
          }
        ]
      },
      {
        id: 'sample-intake-5',
        title: 'Brand Voice',
        description: 'Your company\'s personality',
        questions: [
          {
            id: 'sample-intake-5-1',
            type: 'checkbox',
            label: 'How would you describe your company\'s personality? (Check all that apply)',
            required: true,
            options: [
              'Professional and polished',
              'Friendly and approachable',
              'No-nonsense and direct',
              'Confident and bold',
              'Down-to-earth and reliable'
            ]
          },
          {
            id: 'sample-intake-5-2',
            type: 'textarea',
            label: 'If you had to describe your company in ONE sentence, what would it be?',
            required: true
          }
        ]
      },
      {
        id: 'sample-intake-6',
        title: 'Logo & Branding',
        description: 'Visual identity information',
        questions: [
          {
            id: 'sample-intake-6-1',
            type: 'radio',
            label: 'Do you have a logo file?',
            required: true,
            options: ['Yes', 'No']
          },
          {
            id: 'sample-intake-6-2',
            type: 'text',
            label: 'If yes, please provide email address to send logo file',
            required: false
          },
          {
            id: 'sample-intake-6-3',
            type: 'radio',
            label: 'Do you have specific brand colors?',
            required: true,
            options: ['Yes', 'No']
          },
          {
            id: 'sample-intake-6-4',
            type: 'text',
            label: 'If yes, what are your brand colors?',
            required: false
          }
        ]
      },
      {
        id: 'sample-intake-7',
        title: 'Final Question',
        description: 'The one thing that matters most',
        questions: [
          {
            id: 'sample-intake-7-1',
            type: 'textarea',
            label: 'What\'s the ONE thing you want every potential customer to remember about your business?',
            required: true
          },
          {
            id: 'sample-intake-7-2',
            type: 'signature',
            label: 'Client Signature',
            required: true
          }
        ]
      }
    ]
  },

  /* ============================================
     TRADES & FIELD SERVICES TEMPLATES
     Heavy-duty forms for real work
     ============================================ */

  {
    name: 'Service Call Request',
    description: 'Dispatch-ready intake for emergency and scheduled service calls',
    category: 'Trades',
    icon: '🔧',
    industry: 'trades',
    sections: [
      {
        id: 'service-call-1',
        title: 'Customer Information',
        description: 'Job site contact details',
        questions: [
          {
            id: 'sc-customer-name',
            type: 'text',
            label: 'Customer Name',
            required: true
          },
          {
            id: 'sc-phone',
            type: 'tel',
            label: 'Phone Number',
            required: true
          },
          {
            id: 'sc-alt-phone',
            type: 'tel',
            label: 'Alternate Phone',
            required: false
          },
          {
            id: 'sc-email',
            type: 'email',
            label: 'Email Address',
            required: false
          }
        ]
      },
      {
        id: 'service-call-2',
        title: 'Job Site Location',
        description: 'Where is the work needed?',
        questions: [
          {
            id: 'sc-address',
            type: 'textarea',
            label: 'Street Address',
            required: true
          },
          {
            id: 'sc-city',
            type: 'text',
            label: 'City',
            required: true
          },
          {
            id: 'sc-access-notes',
            type: 'textarea',
            label: 'Access Instructions (gate codes, parking, entrance location)',
            required: false
          },
          {
            id: 'sc-property-type',
            type: 'radio',
            label: 'Property Type',
            required: true,
            options: ['Residential', 'Commercial', 'Industrial', 'Multi-Family', 'Government/Municipal']
          }
        ]
      },
      {
        id: 'service-call-3',
        title: 'Service Details',
        description: 'What needs to be done?',
        questions: [
          {
            id: 'sc-priority',
            type: 'radio',
            label: 'Priority Level',
            required: true,
            options: ['EMERGENCY - Immediate', 'URGENT - Same Day', 'STANDARD - Schedule', 'ROUTINE - When Available']
          },
          {
            id: 'sc-service-type',
            type: 'checkbox',
            label: 'Type of Service Needed',
            required: true,
            options: ['Repair', 'Installation', 'Maintenance', 'Inspection', 'Replacement', 'Troubleshooting', 'Emergency Response']
          },
          {
            id: 'sc-problem-description',
            type: 'textarea',
            label: 'Describe the Problem or Work Needed',
            required: true
          },
          {
            id: 'sc-equipment',
            type: 'text',
            label: 'Equipment Make/Model (if applicable)',
            required: false
          },
          {
            id: 'sc-previous-work',
            type: 'radio',
            label: 'Have we serviced this location before?',
            required: true,
            options: ['Yes', 'No', 'Not Sure']
          }
        ]
      },
      {
        id: 'service-call-4',
        title: 'Scheduling',
        description: 'When do you need service?',
        questions: [
          {
            id: 'sc-preferred-date',
            type: 'text',
            label: 'Preferred Date',
            required: true
          },
          {
            id: 'sc-preferred-time',
            type: 'radio',
            label: 'Preferred Time Window',
            required: true,
            options: ['First Available', 'Morning (7AM-12PM)', 'Afternoon (12PM-5PM)', 'Evening (After 5PM)', 'Flexible']
          },
          {
            id: 'sc-authorization',
            type: 'checkbox',
            label: 'Service Authorization',
            required: true,
            options: ['I authorize service at the location above', 'I understand a service fee may apply', 'I am authorized to request service for this property']
          },
          {
            id: 'sc-signature',
            type: 'signature',
            label: 'Customer Signature',
            required: true
          }
        ]
      }
    ]
  },

  {
    name: 'Job Estimate / Quote',
    description: 'Professional estimate form with itemized pricing and scope of work',
    category: 'Trades',
    icon: '📋',
    industry: 'trades',
    sections: [
      {
        id: 'estimate-1',
        title: 'Customer Information',
        description: 'Bill-to contact details',
        questions: [
          {
            id: 'est-customer-name',
            type: 'text',
            label: 'Customer / Company Name',
            required: true
          },
          {
            id: 'est-contact-person',
            type: 'text',
            label: 'Contact Person',
            required: true
          },
          {
            id: 'est-phone',
            type: 'tel',
            label: 'Phone Number',
            required: true
          },
          {
            id: 'est-email',
            type: 'email',
            label: 'Email Address',
            required: true
          },
          {
            id: 'est-address',
            type: 'textarea',
            label: 'Billing Address',
            required: true
          }
        ]
      },
      {
        id: 'estimate-2',
        title: 'Job Site Details',
        description: 'Where will the work be performed?',
        questions: [
          {
            id: 'est-job-address',
            type: 'textarea',
            label: 'Job Site Address (if different from billing)',
            required: false
          },
          {
            id: 'est-job-name',
            type: 'text',
            label: 'Project / Job Name',
            required: true
          },
          {
            id: 'est-site-conditions',
            type: 'checkbox',
            label: 'Site Conditions (check all that apply)',
            required: false,
            options: ['Clear Access', 'Difficult Access', 'Working at Heights', 'Confined Space', 'Hazardous Materials', 'Occupied Space', 'After-Hours Required']
          }
        ]
      },
      {
        id: 'estimate-3',
        title: 'Scope of Work',
        description: 'Detailed description of work to be performed',
        questions: [
          {
            id: 'est-work-description',
            type: 'textarea',
            label: 'Work Description',
            required: true
          },
          {
            id: 'est-materials',
            type: 'textarea',
            label: 'Materials / Equipment Included',
            required: true
          },
          {
            id: 'est-exclusions',
            type: 'textarea',
            label: 'Exclusions / Not Included',
            required: false
          },
          {
            id: 'est-permits',
            type: 'radio',
            label: 'Permits Required?',
            required: true,
            options: ['Yes - Included in Price', 'Yes - Additional Cost', 'No Permits Required', 'Customer Responsible for Permits']
          }
        ]
      },
      {
        id: 'estimate-4',
        title: 'Pricing',
        description: 'Cost breakdown and terms',
        questions: [
          {
            id: 'est-labor-cost',
            type: 'text',
            label: 'Labor Cost',
            required: true
          },
          {
            id: 'est-material-cost',
            type: 'text',
            label: 'Materials Cost',
            required: true
          },
          {
            id: 'est-other-cost',
            type: 'text',
            label: 'Other Costs (permits, disposal, etc.)',
            required: false
          },
          {
            id: 'est-total',
            type: 'text',
            label: 'TOTAL ESTIMATE',
            required: true
          },
          {
            id: 'est-payment-terms',
            type: 'radio',
            label: 'Payment Terms',
            required: true,
            options: ['Due on Completion', '50% Deposit / 50% Completion', 'Net 30', 'Progress Payments', 'Other']
          },
          {
            id: 'est-valid-until',
            type: 'text',
            label: 'Estimate Valid Until',
            required: true
          }
        ]
      },
      {
        id: 'estimate-5',
        title: 'Timeline & Approval',
        description: 'Scheduling and authorization',
        questions: [
          {
            id: 'est-start-date',
            type: 'text',
            label: 'Estimated Start Date',
            required: true
          },
          {
            id: 'est-duration',
            type: 'text',
            label: 'Estimated Duration',
            required: true
          },
          {
            id: 'est-warranty',
            type: 'textarea',
            label: 'Warranty Information',
            required: false
          },
          {
            id: 'est-approval',
            type: 'checkbox',
            label: 'Customer Approval',
            required: true,
            options: ['I accept this estimate and authorize work to proceed', 'I understand pricing may change if scope changes', 'I agree to the payment terms stated above']
          },
          {
            id: 'est-signature',
            type: 'signature',
            label: 'Customer Signature',
            required: true
          }
        ]
      }
    ]
  },

  {
    name: 'Work Order',
    description: 'Field-ready work order for tracking job completion and materials',
    category: 'Trades',
    icon: '📝',
    industry: 'trades',
    sections: [
      {
        id: 'wo-1',
        title: 'Work Order Info',
        description: 'Job identification',
        questions: [
          {
            id: 'wo-number',
            type: 'text',
            label: 'Work Order Number',
            required: true
          },
          {
            id: 'wo-date',
            type: 'text',
            label: 'Date',
            required: true
          },
          {
            id: 'wo-tech-name',
            type: 'text',
            label: 'Technician / Crew Lead',
            required: true
          },
          {
            id: 'wo-job-type',
            type: 'radio',
            label: 'Job Type',
            required: true,
            options: ['Repair', 'Installation', 'Maintenance', 'Inspection', 'Callback', 'Warranty']
          }
        ]
      },
      {
        id: 'wo-2',
        title: 'Customer & Location',
        description: 'Job site information',
        questions: [
          {
            id: 'wo-customer',
            type: 'text',
            label: 'Customer Name',
            required: true
          },
          {
            id: 'wo-phone',
            type: 'tel',
            label: 'Customer Phone',
            required: true
          },
          {
            id: 'wo-address',
            type: 'textarea',
            label: 'Job Site Address',
            required: true
          }
        ]
      },
      {
        id: 'wo-3',
        title: 'Work Performed',
        description: 'Detailed description of completed work',
        questions: [
          {
            id: 'wo-description',
            type: 'textarea',
            label: 'Description of Work Completed',
            required: true
          },
          {
            id: 'wo-time-arrival',
            type: 'text',
            label: 'Arrival Time',
            required: true
          },
          {
            id: 'wo-time-departure',
            type: 'text',
            label: 'Departure Time',
            required: true
          },
          {
            id: 'wo-total-hours',
            type: 'text',
            label: 'Total Hours on Site',
            required: true
          }
        ]
      },
      {
        id: 'wo-4',
        title: 'Materials Used',
        description: 'Parts and materials for this job',
        questions: [
          {
            id: 'wo-materials-1',
            type: 'text',
            label: 'Material/Part 1 (Qty x Description)',
            required: false
          },
          {
            id: 'wo-materials-2',
            type: 'text',
            label: 'Material/Part 2 (Qty x Description)',
            required: false
          },
          {
            id: 'wo-materials-3',
            type: 'text',
            label: 'Material/Part 3 (Qty x Description)',
            required: false
          },
          {
            id: 'wo-materials-other',
            type: 'textarea',
            label: 'Additional Materials',
            required: false
          }
        ]
      },
      {
        id: 'wo-5',
        title: 'Status & Follow-up',
        description: 'Job completion status',
        questions: [
          {
            id: 'wo-status',
            type: 'radio',
            label: 'Job Status',
            required: true,
            options: ['COMPLETE - No Follow-up Needed', 'COMPLETE - Follow-up Required', 'INCOMPLETE - Parts Ordered', 'INCOMPLETE - Reschedule Needed', 'INCOMPLETE - Customer Request']
          },
          {
            id: 'wo-followup',
            type: 'textarea',
            label: 'Follow-up Notes / Next Steps',
            required: false
          },
          {
            id: 'wo-recommendations',
            type: 'textarea',
            label: 'Recommendations for Customer',
            required: false
          }
        ]
      },
      {
        id: 'wo-6',
        title: 'Signatures',
        description: 'Work acknowledgment',
        questions: [
          {
            id: 'wo-tech-signature',
            type: 'signature',
            label: 'Technician Signature',
            required: true
          },
          {
            id: 'wo-customer-signature',
            type: 'signature',
            label: 'Customer Signature (Acknowledges Work Completed)',
            required: true
          }
        ]
      }
    ]
  },

  {
    name: 'Equipment Inspection Checklist',
    description: 'Pre-operation safety and maintenance inspection form',
    category: 'Trades',
    icon: '🔍',
    industry: 'trades',
    sections: [
      {
        id: 'inspect-1',
        title: 'Equipment Identification',
        description: 'Equipment being inspected',
        questions: [
          {
            id: 'insp-date',
            type: 'text',
            label: 'Inspection Date',
            required: true
          },
          {
            id: 'insp-inspector',
            type: 'text',
            label: 'Inspector Name',
            required: true
          },
          {
            id: 'insp-equipment-type',
            type: 'text',
            label: 'Equipment Type / Description',
            required: true
          },
          {
            id: 'insp-make-model',
            type: 'text',
            label: 'Make / Model',
            required: true
          },
          {
            id: 'insp-serial',
            type: 'text',
            label: 'Serial Number / Asset ID',
            required: true
          },
          {
            id: 'insp-hours-miles',
            type: 'text',
            label: 'Current Hours / Mileage',
            required: false
          }
        ]
      },
      {
        id: 'inspect-2',
        title: 'Safety Systems',
        description: 'Check all safety components',
        questions: [
          {
            id: 'insp-safety-guards',
            type: 'radio',
            label: 'Safety Guards / Covers in Place',
            required: true,
            options: ['PASS', 'FAIL', 'N/A']
          },
          {
            id: 'insp-emergency-stop',
            type: 'radio',
            label: 'Emergency Stop Functional',
            required: true,
            options: ['PASS', 'FAIL', 'N/A']
          },
          {
            id: 'insp-warning-labels',
            type: 'radio',
            label: 'Warning Labels Visible & Legible',
            required: true,
            options: ['PASS', 'FAIL', 'N/A']
          },
          {
            id: 'insp-fire-extinguisher',
            type: 'radio',
            label: 'Fire Extinguisher Present & Charged',
            required: true,
            options: ['PASS', 'FAIL', 'N/A']
          },
          {
            id: 'insp-first-aid',
            type: 'radio',
            label: 'First Aid Kit Available',
            required: true,
            options: ['PASS', 'FAIL', 'N/A']
          }
        ]
      },
      {
        id: 'inspect-3',
        title: 'Mechanical Systems',
        description: 'Operational components check',
        questions: [
          {
            id: 'insp-fluid-levels',
            type: 'radio',
            label: 'Fluid Levels (Oil, Coolant, Hydraulic)',
            required: true,
            options: ['PASS', 'FAIL', 'N/A']
          },
          {
            id: 'insp-leaks',
            type: 'radio',
            label: 'No Visible Leaks',
            required: true,
            options: ['PASS', 'FAIL', 'N/A']
          },
          {
            id: 'insp-belts-hoses',
            type: 'radio',
            label: 'Belts & Hoses Condition',
            required: true,
            options: ['PASS', 'FAIL', 'N/A']
          },
          {
            id: 'insp-brakes',
            type: 'radio',
            label: 'Brakes Functional',
            required: true,
            options: ['PASS', 'FAIL', 'N/A']
          },
          {
            id: 'insp-steering',
            type: 'radio',
            label: 'Steering / Controls Responsive',
            required: true,
            options: ['PASS', 'FAIL', 'N/A']
          },
          {
            id: 'insp-tires-tracks',
            type: 'radio',
            label: 'Tires / Tracks / Wheels Condition',
            required: true,
            options: ['PASS', 'FAIL', 'N/A']
          }
        ]
      },
      {
        id: 'inspect-4',
        title: 'Electrical Systems',
        description: 'Electrical and lighting check',
        questions: [
          {
            id: 'insp-battery',
            type: 'radio',
            label: 'Battery Condition & Terminals',
            required: true,
            options: ['PASS', 'FAIL', 'N/A']
          },
          {
            id: 'insp-lights',
            type: 'radio',
            label: 'All Lights Functional',
            required: true,
            options: ['PASS', 'FAIL', 'N/A']
          },
          {
            id: 'insp-horn-backup',
            type: 'radio',
            label: 'Horn / Backup Alarm Working',
            required: true,
            options: ['PASS', 'FAIL', 'N/A']
          },
          {
            id: 'insp-gauges',
            type: 'radio',
            label: 'Gauges / Indicators Working',
            required: true,
            options: ['PASS', 'FAIL', 'N/A']
          }
        ]
      },
      {
        id: 'inspect-5',
        title: 'Overall Assessment',
        description: 'Final inspection summary',
        questions: [
          {
            id: 'insp-overall',
            type: 'radio',
            label: 'Overall Equipment Status',
            required: true,
            options: ['APPROVED FOR USE', 'APPROVED WITH RESTRICTIONS', 'OUT OF SERVICE - REPAIR REQUIRED', 'SCHEDULED FOR MAINTENANCE']
          },
          {
            id: 'insp-defects',
            type: 'textarea',
            label: 'Defects / Issues Found',
            required: false
          },
          {
            id: 'insp-action-required',
            type: 'textarea',
            label: 'Corrective Action Required',
            required: false
          },
          {
            id: 'insp-signature',
            type: 'signature',
            label: 'Inspector Signature',
            required: true
          }
        ]
      }
    ]
  },

  {
    name: 'Daily Field Report',
    description: 'End-of-day project progress and crew activity report',
    category: 'Trades',
    icon: '📊',
    industry: 'trades',
    sections: [
      {
        id: 'dfr-1',
        title: 'Report Information',
        description: 'Basic report details',
        questions: [
          {
            id: 'dfr-date',
            type: 'text',
            label: 'Report Date',
            required: true
          },
          {
            id: 'dfr-project',
            type: 'text',
            label: 'Project Name / Job Number',
            required: true
          },
          {
            id: 'dfr-location',
            type: 'text',
            label: 'Job Site Location',
            required: true
          },
          {
            id: 'dfr-foreman',
            type: 'text',
            label: 'Foreman / Supervisor',
            required: true
          },
          {
            id: 'dfr-weather',
            type: 'radio',
            label: 'Weather Conditions',
            required: true,
            options: ['Clear', 'Partly Cloudy', 'Overcast', 'Rain', 'Snow/Ice', 'Extreme Heat', 'Extreme Cold', 'High Winds']
          }
        ]
      },
      {
        id: 'dfr-2',
        title: 'Crew & Hours',
        description: 'Manpower on site today',
        questions: [
          {
            id: 'dfr-crew-count',
            type: 'text',
            label: 'Total Crew Count',
            required: true
          },
          {
            id: 'dfr-crew-list',
            type: 'textarea',
            label: 'Crew Members Present (Name - Hours)',
            required: true
          },
          {
            id: 'dfr-start-time',
            type: 'text',
            label: 'Work Start Time',
            required: true
          },
          {
            id: 'dfr-end-time',
            type: 'text',
            label: 'Work End Time',
            required: true
          },
          {
            id: 'dfr-total-manhours',
            type: 'text',
            label: 'Total Man-Hours',
            required: true
          }
        ]
      },
      {
        id: 'dfr-3',
        title: 'Work Completed Today',
        description: 'Progress made on this shift',
        questions: [
          {
            id: 'dfr-work-summary',
            type: 'textarea',
            label: 'Summary of Work Completed',
            required: true
          },
          {
            id: 'dfr-areas-worked',
            type: 'textarea',
            label: 'Areas / Zones Worked',
            required: false
          },
          {
            id: 'dfr-milestones',
            type: 'textarea',
            label: 'Milestones Achieved',
            required: false
          },
          {
            id: 'dfr-percent-complete',
            type: 'text',
            label: 'Estimated % Complete (Overall Project)',
            required: false
          }
        ]
      },
      {
        id: 'dfr-4',
        title: 'Materials & Equipment',
        description: 'Resources used today',
        questions: [
          {
            id: 'dfr-materials-used',
            type: 'textarea',
            label: 'Materials Used / Delivered',
            required: false
          },
          {
            id: 'dfr-equipment-used',
            type: 'textarea',
            label: 'Equipment Used',
            required: false
          },
          {
            id: 'dfr-materials-needed',
            type: 'textarea',
            label: 'Materials Needed for Tomorrow',
            required: false
          }
        ]
      },
      {
        id: 'dfr-5',
        title: 'Issues & Safety',
        description: 'Problems, delays, and safety matters',
        questions: [
          {
            id: 'dfr-delays',
            type: 'textarea',
            label: 'Delays / Issues Encountered',
            required: false
          },
          {
            id: 'dfr-visitors',
            type: 'textarea',
            label: 'Site Visitors (Inspectors, Owners, etc.)',
            required: false
          },
          {
            id: 'dfr-safety-incidents',
            type: 'radio',
            label: 'Any Safety Incidents Today?',
            required: true,
            options: ['No Incidents', 'Near Miss - Reported', 'Minor Injury - First Aid', 'Injury - Medical Attention', 'Property Damage']
          },
          {
            id: 'dfr-safety-notes',
            type: 'textarea',
            label: 'Safety Notes / Incident Details',
            required: false
          }
        ]
      },
      {
        id: 'dfr-6',
        title: 'Tomorrow\'s Plan',
        description: 'Schedule for next day',
        questions: [
          {
            id: 'dfr-tomorrow-plan',
            type: 'textarea',
            label: 'Planned Work for Tomorrow',
            required: false
          },
          {
            id: 'dfr-tomorrow-crew',
            type: 'text',
            label: 'Expected Crew Size Tomorrow',
            required: false
          },
          {
            id: 'dfr-additional-notes',
            type: 'textarea',
            label: 'Additional Notes',
            required: false
          },
          {
            id: 'dfr-signature',
            type: 'signature',
            label: 'Foreman / Supervisor Signature',
            required: true
          }
        ]
      }
    ]
  },

  {
    name: 'Vehicle/Fleet Inspection',
    description: 'DOT-style pre-trip and post-trip vehicle inspection',
    category: 'Trades',
    icon: '🚛',
    industry: 'trades',
    sections: [
      {
        id: 'vehicle-1',
        title: 'Vehicle Information',
        description: 'Identify the vehicle being inspected',
        questions: [
          {
            id: 'veh-date',
            type: 'text',
            label: 'Inspection Date',
            required: true
          },
          {
            id: 'veh-time',
            type: 'text',
            label: 'Inspection Time',
            required: true
          },
          {
            id: 'veh-type',
            type: 'radio',
            label: 'Inspection Type',
            required: true,
            options: ['Pre-Trip', 'Post-Trip', 'Periodic', 'Annual']
          },
          {
            id: 'veh-driver',
            type: 'text',
            label: 'Driver / Inspector Name',
            required: true
          },
          {
            id: 'veh-unit-number',
            type: 'text',
            label: 'Unit / Vehicle Number',
            required: true
          },
          {
            id: 'veh-license',
            type: 'text',
            label: 'License Plate',
            required: true
          },
          {
            id: 'veh-odometer',
            type: 'text',
            label: 'Odometer Reading',
            required: true
          }
        ]
      },
      {
        id: 'vehicle-2',
        title: 'Exterior Inspection',
        description: 'Walk-around inspection',
        questions: [
          {
            id: 'veh-body-damage',
            type: 'radio',
            label: 'Body/Cab - No New Damage',
            required: true,
            options: ['OK', 'DEFECT']
          },
          {
            id: 'veh-mirrors',
            type: 'radio',
            label: 'Mirrors - Secure & Clean',
            required: true,
            options: ['OK', 'DEFECT']
          },
          {
            id: 'veh-windows',
            type: 'radio',
            label: 'Windshield & Windows - Clear',
            required: true,
            options: ['OK', 'DEFECT']
          },
          {
            id: 'veh-wipers',
            type: 'radio',
            label: 'Wipers & Washers - Working',
            required: true,
            options: ['OK', 'DEFECT']
          },
          {
            id: 'veh-headlights',
            type: 'radio',
            label: 'Headlights - Working',
            required: true,
            options: ['OK', 'DEFECT']
          },
          {
            id: 'veh-taillights',
            type: 'radio',
            label: 'Taillights & Brake Lights',
            required: true,
            options: ['OK', 'DEFECT']
          },
          {
            id: 'veh-turn-signals',
            type: 'radio',
            label: 'Turn Signals - All Working',
            required: true,
            options: ['OK', 'DEFECT']
          }
        ]
      },
      {
        id: 'vehicle-3',
        title: 'Tires & Wheels',
        description: 'Tire condition and pressure',
        questions: [
          {
            id: 'veh-tread-depth',
            type: 'radio',
            label: 'Tire Tread Depth - Adequate',
            required: true,
            options: ['OK', 'DEFECT']
          },
          {
            id: 'veh-tire-pressure',
            type: 'radio',
            label: 'Tire Pressure - Correct',
            required: true,
            options: ['OK', 'DEFECT']
          },
          {
            id: 'veh-tire-damage',
            type: 'radio',
            label: 'No Cuts, Bulges, or Damage',
            required: true,
            options: ['OK', 'DEFECT']
          },
          {
            id: 'veh-lug-nuts',
            type: 'radio',
            label: 'Lug Nuts - Secure',
            required: true,
            options: ['OK', 'DEFECT']
          },
          {
            id: 'veh-spare',
            type: 'radio',
            label: 'Spare Tire & Jack Present',
            required: true,
            options: ['OK', 'DEFECT', 'N/A']
          }
        ]
      },
      {
        id: 'vehicle-4',
        title: 'Under Hood / Fluids',
        description: 'Engine compartment check',
        questions: [
          {
            id: 'veh-oil-level',
            type: 'radio',
            label: 'Engine Oil Level',
            required: true,
            options: ['OK', 'LOW', 'DEFECT']
          },
          {
            id: 'veh-coolant',
            type: 'radio',
            label: 'Coolant Level',
            required: true,
            options: ['OK', 'LOW', 'DEFECT']
          },
          {
            id: 'veh-brake-fluid',
            type: 'radio',
            label: 'Brake Fluid Level',
            required: true,
            options: ['OK', 'LOW', 'DEFECT']
          },
          {
            id: 'veh-power-steering',
            type: 'radio',
            label: 'Power Steering Fluid',
            required: true,
            options: ['OK', 'LOW', 'DEFECT', 'N/A']
          },
          {
            id: 'veh-belts-hoses',
            type: 'radio',
            label: 'Belts & Hoses - Good Condition',
            required: true,
            options: ['OK', 'DEFECT']
          },
          {
            id: 'veh-leaks',
            type: 'radio',
            label: 'No Visible Leaks',
            required: true,
            options: ['OK', 'DEFECT']
          }
        ]
      },
      {
        id: 'vehicle-5',
        title: 'Interior & Safety Equipment',
        description: 'Cab inspection and safety gear',
        questions: [
          {
            id: 'veh-horn',
            type: 'radio',
            label: 'Horn - Working',
            required: true,
            options: ['OK', 'DEFECT']
          },
          {
            id: 'veh-brakes',
            type: 'radio',
            label: 'Brake Operation - Firm Pedal',
            required: true,
            options: ['OK', 'DEFECT']
          },
          {
            id: 'veh-parking-brake',
            type: 'radio',
            label: 'Parking Brake - Holds',
            required: true,
            options: ['OK', 'DEFECT']
          },
          {
            id: 'veh-seatbelts',
            type: 'radio',
            label: 'Seatbelts - Working',
            required: true,
            options: ['OK', 'DEFECT']
          },
          {
            id: 'veh-gauges',
            type: 'radio',
            label: 'Gauges & Warning Lights',
            required: true,
            options: ['OK', 'DEFECT']
          },
          {
            id: 'veh-fire-ext',
            type: 'radio',
            label: 'Fire Extinguisher - Charged',
            required: true,
            options: ['OK', 'DEFECT', 'N/A']
          },
          {
            id: 'veh-first-aid',
            type: 'radio',
            label: 'First Aid Kit - Stocked',
            required: true,
            options: ['OK', 'DEFECT', 'N/A']
          },
          {
            id: 'veh-triangle',
            type: 'radio',
            label: 'Safety Triangles/Flares',
            required: true,
            options: ['OK', 'DEFECT', 'N/A']
          }
        ]
      },
      {
        id: 'vehicle-6',
        title: 'Defects & Certification',
        description: 'Note any issues and certify inspection',
        questions: [
          {
            id: 'veh-defects-found',
            type: 'radio',
            label: 'Were Any Defects Found?',
            required: true,
            options: ['No Defects', 'Defects Found - See Notes']
          },
          {
            id: 'veh-defect-notes',
            type: 'textarea',
            label: 'Defect Details / Notes',
            required: false
          },
          {
            id: 'veh-safe-operate',
            type: 'radio',
            label: 'Is Vehicle Safe to Operate?',
            required: true,
            options: ['YES - Safe to Operate', 'NO - Do Not Operate Until Repaired']
          },
          {
            id: 'veh-certification',
            type: 'checkbox',
            label: 'Certification',
            required: true,
            options: ['I certify that I have conducted this inspection and the information is accurate']
          },
          {
            id: 'veh-signature',
            type: 'signature',
            label: 'Driver / Inspector Signature',
            required: true
          }
        ]
      }
    ]
  }
];

// Export for use in other modules
window.SAMPLE_TEMPLATES = SAMPLE_TEMPLATES;
