/**
 * Sample Form Templates
 * Pre-built templates that users can import to get started quickly
 * These templates are generic and auto-branded with user's company info
 */

const SAMPLE_TEMPLATES = [

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
