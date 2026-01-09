/**
 * Professional Document Generator
 * Generates professional business formation documents
 */

class DocumentGenerator {
  constructor() {
    this.documents = {
      articles: 'Articles of Organization (LLC)',
      operating: 'Operating Agreement (LLC)',
      banking: 'Banking Resolution',
      partnership: 'Partnership Agreement',
      dba: 'Trade Name/DBA Certificate'
    };

    this.fields = {
      articles: [
        { key: 'COMPANY_NAME', label: 'Company Name', type: 'text' },
        { key: 'PURPOSE_DESCRIPTION', label: 'Business Purpose', type: 'textarea' },
        { key: 'AGENT_NAME', label: 'Registered Agent Name', type: 'text' },
        { key: 'STREET_ADDRESS', label: 'Registered Office Street', type: 'text' },
        { key: 'CITY', label: 'City', type: 'text' },
        { key: 'ZIP_CODE', label: 'ZIP Code', type: 'text' },
        { key: 'PRINCIPAL_STREET_ADDRESS', label: 'Principal Office Street', type: 'text' },
        { key: 'PRINCIPAL_CITY', label: 'Principal City', type: 'text' },
        { key: 'PRINCIPAL_STATE', label: 'Principal State', type: 'text' },
        { key: 'PRINCIPAL_ZIP_CODE', label: 'Principal ZIP', type: 'text' },
        { key: 'MANAGEMENT_TYPE', label: 'Management Type', type: 'select', options: ['Member-Managed', 'Manager-Managed'] },
        { key: 'MANAGER_NAMES', label: 'Manager Names (if Manager-Managed)', type: 'textarea' },
        { key: 'MEMBER_1_NAME', label: 'Member 1 Name', type: 'text' },
        { key: 'MEMBER_1_ADDRESS', label: 'Member 1 Address', type: 'text' },
        { key: 'MEMBER_2_NAME', label: 'Member 2 Name', type: 'text' },
        { key: 'MEMBER_2_ADDRESS', label: 'Member 2 Address', type: 'text' },
        { key: 'ADDITIONAL_MEMBERS', label: 'Additional Members', type: 'textarea' },
        { key: 'DURATION_TYPE', label: 'Duration', type: 'select', options: ['Perpetual', 'Specific Date'] },
        { key: 'DISSOLUTION_DATE', label: 'Dissolution Date (if applicable)', type: 'text' },
        { key: 'EFFECTIVE_DATE', label: 'Effective Date', type: 'text' },
        { key: 'ORGANIZER_NAME', label: 'Organizer Name', type: 'text' },
        { key: 'ORGANIZER_PRINTED_NAME', label: 'Organizer Printed Name', type: 'text' },
        { key: 'ORGANIZER_ADDRESS', label: 'Organizer Address', type: 'text' }
      ],
      banking: [
        { key: 'COMPANY_NAME', label: 'Company Name', type: 'text' },
        { key: 'RESOLUTION_DATE', label: 'Resolution Date', type: 'text' },
        { key: 'ENTITY_TYPE', label: 'Entity Type', type: 'select', options: ['all Members', 'the duly appointed Manager(s)'] },
        { key: 'BANK_NAME', label: 'Bank Name', type: 'text' },
        { key: 'BANK_ADDRESS', label: 'Bank Address', type: 'text' },
        { key: 'PERSON_1_NAME', label: 'Authorized Person 1 Name', type: 'text' },
        { key: 'PERSON_1_TITLE', label: 'Person 1 Title', type: 'text' },
        { key: 'PERSON_1_AUTHORITY', label: 'Person 1 Authority', type: 'text' },
        { key: 'PERSON_2_NAME', label: 'Authorized Person 2 Name', type: 'text' },
        { key: 'PERSON_2_TITLE', label: 'Person 2 Title', type: 'text' },
        { key: 'PERSON_2_AUTHORITY', label: 'Person 2 Authority', type: 'text' },
        { key: 'AUTHORITY_TYPE', label: 'Authority Type', type: 'select', options: ['Single Signature', 'Joint Signature'] },
        { key: 'JOINT_NUMBER', label: 'Number Required (if Joint)', type: 'text' },
        { key: 'WITHDRAWAL_LIMIT', label: 'Withdrawal Limit for Joint', type: 'text' },
        { key: 'WIRE_LIMIT', label: 'Wire Transfer Limit for Joint', type: 'text' },
        { key: 'CERTIFYING_PERSON_NAME', label: 'Certifying Person Name', type: 'text' },
        { key: 'CERTIFYING_PERSON_TITLE', label: 'Certifying Person Title', type: 'text' }
      ],
      dba: [
        { key: 'COUNTY_NAME', label: 'County Name', type: 'text' },
        { key: 'TRADE_NAME', label: 'Trade Name/DBA', type: 'text' },
        { key: 'ENTITY_TYPE', label: 'Entity Type', type: 'select', options: ['Sole Proprietorship', 'General Partnership', 'LLC', 'Corporation', 'Limited Partnership', 'Other'] },
        { key: 'BUSINESS_DESCRIPTION', label: 'Business Description', type: 'textarea' },
        { key: 'STREET_ADDRESS', label: 'Business Street Address', type: 'text' },
        { key: 'CITY', label: 'City', type: 'text' },
        { key: 'ZIP_CODE', label: 'ZIP Code', type: 'text' },
        { key: 'HOME_BASED', label: 'Home-Based?', type: 'select', options: ['No', 'Yes'] },
        { key: 'MAILING_ADDRESS', label: 'Mailing Address (if different)', type: 'text' },
        { key: 'OWNER_NAME', label: 'Owner Name (Sole Prop)', type: 'text' },
        { key: 'OWNER_ADDRESS', label: 'Owner Address (Sole Prop)', type: 'text' },
        { key: 'OWNER_SSN', label: 'Owner SSN (Sole Prop)', type: 'text' },
        { key: 'PARTNER_1_NAME', label: 'Partner 1 Name', type: 'text' },
        { key: 'PARTNER_1_ADDRESS', label: 'Partner 1 Address', type: 'text' },
        { key: 'PARTNER_2_NAME', label: 'Partner 2 Name', type: 'text' },
        { key: 'PARTNER_2_ADDRESS', label: 'Partner 2 Address', type: 'text' },
        { key: 'LEGAL_ENTITY_NAME', label: 'Legal Entity Name (LLC/Corp)', type: 'text' },
        { key: 'STATE', label: 'State of Organization', type: 'text' },
        { key: 'ENTITY_ADDRESS', label: 'Entity Principal Office', type: 'text' },
        { key: 'AGENT_NAME', label: 'Registered Agent', type: 'text' },
        { key: 'CONTACT_NAME', label: 'Primary Contact Name', type: 'text' },
        { key: 'PHONE', label: 'Phone Number', type: 'text' },
        { key: 'EMAIL', label: 'Email Address', type: 'text' },
        { key: 'DURATION', label: 'Duration', type: 'select', options: ['Indefinitely', 'Until specific date'] },
        { key: 'END_DATE', label: 'End Date (if applicable)', type: 'text' },
        { key: 'SIGNATORY_NAME', label: 'Signatory Name', type: 'text' },
        { key: 'TITLE', label: 'Signatory Title', type: 'text' }
      ]
    };

    this.currentDoc = 'articles';
    this.formData = {};
    this.showPreview = false;
  }

  /**
   * Get professional styles for documents
   */
  getProfessionalStyles() {
    return `
      @media print {
        body { margin: 0; padding: 0; }
        @page {
          margin: 0.75in;
          size: letter;
        }
      }

      body {
        font-family: 'Garamond', 'Palatino Linotype', 'Book Antiqua', 'Georgia', serif;
        font-size: 12pt;
        line-height: 1.65;
        max-width: 8.5in;
        margin: 0 auto;
        padding: 1in;
        color: #1a1a1a;
        background: white;
      }

      .document-header {
        text-align: center;
        margin-bottom: 3em;
        border-bottom: 3px double #2c3e50;
        padding-bottom: 1.5em;
      }

      .document-header h1 {
        font-size: 18pt;
        font-weight: 700;
        margin: 0.75em 0 0.5em 0;
        letter-spacing: 2.5px;
        text-transform: uppercase;
        color: #2c3e50;
        font-family: 'Georgia', serif;
      }

      .document-header .subtitle {
        font-size: 12pt;
        font-weight: 400;
        margin: 0.4em 0;
        color: #34495e;
        font-style: italic;
      }

      .document-header .jurisdiction {
        font-size: 11pt;
        margin-top: 1.2em;
        font-weight: 500;
        color: #2c3e50;
      }

      .article-section {
        margin: 2em 0;
        page-break-inside: avoid;
      }

      .article-heading {
        font-weight: 700;
        font-size: 12pt;
        text-transform: uppercase;
        margin-bottom: 0.75em;
        color: #2c3e50;
        letter-spacing: 0.5px;
        border-bottom: 1px solid #bdc3c7;
        padding-bottom: 0.3em;
      }

      .article-content {
        margin-left: 0.75in;
        text-align: justify;
        hyphens: auto;
        color: #2c3e50;
      }

      .field-value {
        margin: 0.6em 0;
        padding: 0.4em 0.3em;
        min-height: 1.3em;
        font-weight: 500;
        display: inline-block;
        min-width: 200px;
      }

      .field-block {
        margin: 0.6em 0;
        padding: 0.4em 0.3em;
        min-height: 1.3em;
      }

      .signature-section {
        margin-top: 4em;
        padding-top: 2.5em;
        border-top: 2px solid #34495e;
        page-break-inside: avoid;
      }

      .signature-line {
        margin: 2.5em 0 2em 0.75in;
      }

      .signature-line .label {
        font-weight: 600;
        margin-bottom: 0.5em;
        color: #2c3e50;
        font-size: 10.5pt;
      }

      .signature-line .sig-line {
        border-bottom: 1.5px solid #2c3e50;
        width: 4.5in;
        margin: 1em 0 0.3em 0;
        display: inline-block;
      }

      .document-footer {
        margin-top: 3em;
        padding-top: 1em;
        border-top: 1px solid #bdc3c7;
        font-size: 9.5pt;
        font-style: italic;
        text-align: center;
        color: #7f8c8d;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.5em 0;
        font-size: 11pt;
      }

      table th,
      table td {
        border: 1.5px solid #34495e;
        padding: 0.6em 0.8em;
        text-align: left;
      }

      table th {
        background-color: #ecf0f1;
        font-weight: 700;
        color: #2c3e50;
      }

      .certification-box {
        border: 2px solid #2c3e50;
        padding: 1.5em;
        margin: 2.5em 0;
        background-color: #fafafa;
        page-break-inside: avoid;
      }

      .clerk-section {
        border: 2px solid #34495e;
        padding: 1.5em;
        margin: 3em 0;
        background-color: #f8f9fa;
        page-break-inside: avoid;
      }

      .section-box {
        border: 1.5px solid #95a5a6;
        padding: 1.2em;
        margin: 1.5em 0;
        background-color: #fafafa;
      }

      strong {
        font-weight: 600;
        color: #2c3e50;
      }

      .declaration-box {
        border: 2px solid #2c3e50;
        padding: 1.5em;
        margin: 2.5em 0;
        background-color: #f9f9f9;
        page-break-inside: avoid;
      }

      .indent {
        margin-left: 0.5in;
      }

      .double-indent {
        margin-left: 1in;
      }
    `;
  }

  /**
   * Get template HTML for Articles of Organization
   */
  getArticlesTemplate() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Articles of Organization</title>
  <style>${this.getProfessionalStyles()}</style>
</head>
<body>
  <div class="document-header">
    <h1>Articles of Organization</h1>
    <div class="subtitle">Limited Liability Company</div>
    <div class="jurisdiction">Commonwealth of Kentucky<br>Secretary of State</div>
  </div>

  <div class="article-section">
    <div class="article-heading">Article I — Name of Limited Liability Company</div>
    <div class="article-content">
      The name of the Limited Liability Company is:
      <div class="field-block">[COMPANY_NAME]</div>
    </div>
  </div>

  <div class="article-section">
    <div class="article-heading">Article II — Purpose and Powers</div>
    <div class="article-content">
      The purpose for which this Limited Liability Company is organized:
      <div class="field-block">[PURPOSE_DESCRIPTION]</div>
    </div>
  </div>

  <div class="article-section">
    <div class="article-heading">Article III — Registered Agent and Registered Office</div>
    <div class="article-content">
      The name and address of the registered agent and registered office in the Commonwealth of Kentucky are as follows:
      <div style="margin: 1.5em 0;">
        <strong>Registered Agent:</strong>
        <div class="field-block">[AGENT_NAME]</div>
      </div>
      <div style="margin: 1.5em 0;">
        <strong>Registered Office Address:</strong>
        <div class="field-block">[STREET_ADDRESS]</div>
        <div class="field-block">[CITY], Kentucky [ZIP_CODE]</div>
      </div>
      <div style="margin-top: 1.5em;">
        The registered agent named above has consented in writing to the appointment.
      </div>
    </div>
  </div>

  <div class="article-section">
    <div class="article-heading">Article IV — Principal Office</div>
    <div class="article-content">
      The address of the principal office of the Limited Liability Company is:
      <div class="field-block">[PRINCIPAL_STREET_ADDRESS]</div>
      <div class="field-block">[PRINCIPAL_CITY], [PRINCIPAL_STATE] [PRINCIPAL_ZIP_CODE]</div>
    </div>
  </div>

  <div class="article-section">
    <div class="article-heading">Article V — Management Structure</div>
    <div class="article-content">
      This Limited Liability Company shall be: <strong>[MANAGEMENT_TYPE]</strong>
      <div style="margin-top: 1.5em;">
        <strong>Manager(s) (if applicable):</strong>
        <div class="field-block">[MANAGER_NAMES]</div>
      </div>
    </div>
  </div>

  <div class="article-section">
    <div class="article-heading">Article VI — Organizer and Initial Members</div>
    <div class="article-content">
      The name and address of each organizer and initial member:
      <div style="margin: 1.5em 0;">
        <strong>Member 1:</strong>
        <div class="field-block">[MEMBER_1_NAME]</div>
        <div class="field-block">[MEMBER_1_ADDRESS]</div>
      </div>
      <div style="margin: 1.5em 0;">
        <strong>Member 2:</strong>
        <div class="field-block">[MEMBER_2_NAME]</div>
        <div class="field-block">[MEMBER_2_ADDRESS]</div>
      </div>
      <div style="margin: 1.5em 0;">
        <strong>Additional Members:</strong>
        <div class="field-block">[ADDITIONAL_MEMBERS]</div>
      </div>
    </div>
  </div>

  <div class="article-section">
    <div class="article-heading">Article VII — Duration</div>
    <div class="article-content">
      The duration of this Limited Liability Company shall be: <strong>[DURATION_TYPE]</strong>
      <div class="field-block">[DISSOLUTION_DATE]</div>
    </div>
  </div>

  <div class="article-section">
    <div class="article-heading">Article VIII — Effective Date</div>
    <div class="article-content">
      These Articles of Organization shall be effective on: <strong>[EFFECTIVE_DATE]</strong>
    </div>
  </div>

  <div class="signature-section">
    <div class="article-heading">Organizer Execution</div>
    <div class="signature-line">
      <div class="label">Organizer Name:</div>
      <div class="field-block">[ORGANIZER_NAME]</div>
    </div>
    <div class="signature-line">
      <div class="label">Signature:</div>
      <div class="sig-line"></div>
    </div>
    <div class="signature-line">
      <div class="label">Printed Name:</div>
      <div class="field-block">[ORGANIZER_PRINTED_NAME]</div>
    </div>
    <div class="signature-line">
      <div class="label">Address:</div>
      <div class="field-block">[ORGANIZER_ADDRESS]</div>
    </div>
  </div>

  <div class="document-footer">
    Filed with the Kentucky Secretary of State pursuant to KRS Chapter 275
  </div>
</body>
</html>`;
  }

  /**
   * Get template HTML for Banking Resolution
   */
  getBankingTemplate() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Banking Resolution</title>
  <style>${this.getProfessionalStyles()}</style>
</head>
<body>
  <div class="document-header">
    <h1>Banking Resolution</h1>
    <div class="subtitle" style="font-size: 14pt; font-weight: 600; margin-top: 1em;">[COMPANY_NAME]</div>
    <div class="subtitle">A Kentucky Limited Liability Company</div>
    <div style="margin-top: 1.5em; font-size: 11pt;">
      <strong>Date of Resolution:</strong> <span class="field-value">[RESOLUTION_DATE]</span>
    </div>
  </div>

  <div class="article-section">
    <div class="article-heading">Resolution of the Members/Managers</div>
    <div class="article-content">
      The undersigned, being <strong>[ENTITY_TYPE]</strong> of <strong>[COMPANY_NAME]</strong>
      (the "Company"), a Kentucky Limited Liability Company, hereby adopt and approve the following
      banking resolution:
    </div>
  </div>

  <div class="article-section">
    <div class="article-heading">I. Authorization to Establish Banking Relationships</div>
    <div class="article-content">
      <strong>RESOLVED,</strong> that the Company is hereby authorized to establish and maintain
      banking accounts and relationships with the following financial institution:
      <div style="margin: 1.5em 0;">
        <strong>Financial Institution Name:</strong>
        <div class="field-block">[BANK_NAME]</div>
      </div>
      <div style="margin: 1.5em 0;">
        <strong>Financial Institution Address:</strong>
        <div class="field-block">[BANK_ADDRESS]</div>
      </div>
    </div>
  </div>

  <div class="article-section">
    <div class="article-heading">II. Authorized Signatories</div>
    <div class="article-content">
      <strong>RESOLVED FURTHER,</strong> that the following individuals are hereby authorized
      to act on behalf of the Company in all banking matters:
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Title</th>
            <th>Authority</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>[PERSON_1_NAME]</td>
            <td>[PERSON_1_TITLE]</td>
            <td>[PERSON_1_AUTHORITY]</td>
          </tr>
          <tr>
            <td>[PERSON_2_NAME]</td>
            <td>[PERSON_2_TITLE]</td>
            <td>[PERSON_2_AUTHORITY]</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="article-section">
    <div class="article-heading">III. Signature Authority Requirements</div>
    <div class="article-content">
      <strong>RESOLVED FURTHER,</strong> that the signature authority for banking transactions
      shall be as follows:
      <div style="margin: 1.5em 0;">
        <strong>Authority Type:</strong> <span class="field-value">[AUTHORITY_TYPE]</span>
      </div>
      <div style="margin: 1.5em 0;">
        For transactions requiring joint signatures, the following requirements shall apply:
        <ul style="margin-top: 1em; line-height: 1.8;">
          <li>Number of signatures required: <strong>[JOINT_NUMBER]</strong></li>
          <li>Withdrawals exceeding: <strong>$[WITHDRAWAL_LIMIT]</strong> require joint authorization</li>
          <li>Wire transfers exceeding: <strong>$[WIRE_LIMIT]</strong> require joint authorization</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="certification-box">
    <div class="article-heading" style="margin-top: 0; border-bottom: none;">Certification</div>
    <div style="margin: 1.5em 0;">
      The undersigned hereby certifies that the foregoing resolution was duly adopted and
      remains in full force and effect as of the date set forth below.
    </div>
    <div class="signature-line">
      <div class="label">Certified by:</div>
      <div class="field-block">[CERTIFYING_PERSON_NAME]</div>
    </div>
    <div class="signature-line">
      <div class="label">Title:</div>
      <div class="field-block">[CERTIFYING_PERSON_TITLE]</div>
    </div>
    <div class="signature-line">
      <div class="label">Signature:</div>
      <div class="sig-line"></div>
    </div>
    <div class="signature-line">
      <div class="label">Date:</div>
      <div style="border-bottom: 1.5px solid #2c3e50; width: 2.5in; display: inline-block;"></div>
    </div>
  </div>

  <div class="document-footer">
    This Banking Resolution is executed pursuant to the Operating Agreement of [COMPANY_NAME]
    and the laws of the Commonwealth of Kentucky
  </div>
</body>
</html>`;
  }

  /**
   * Get template HTML for DBA Certificate
   */
  getDBATemplate() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificate of Assumed Name</title>
  <style>${this.getProfessionalStyles()}</style>
</head>
<body>
  <div class="document-header">
    <h1>Certificate of Assumed Name</h1>
    <div class="subtitle">(Doing Business As)</div>
    <div class="jurisdiction">Commonwealth of Kentucky<br>[COUNTY_NAME] County Clerk</div>
  </div>

  <div class="article-section">
    <div class="article-heading">I. Trade Name Information</div>
    <div class="article-content">
      <div style="margin: 1.5em 0;">
        <strong>1. Assumed Business Name (Trade Name/DBA):</strong>
        <div class="field-block" style="font-weight: 600; font-size: 13pt;">[TRADE_NAME]</div>
      </div>
      <div style="margin: 1.5em 0;">
        <strong>2. Entity Type:</strong>
        <div class="field-block">[ENTITY_TYPE]</div>
      </div>
      <div style="margin: 1.5em 0;">
        <strong>3. Nature of Business:</strong>
        <div class="field-block">[BUSINESS_DESCRIPTION]</div>
      </div>
    </div>
  </div>

  <div class="article-section">
    <div class="article-heading">II. Business Location</div>
    <div class="article-content">
      <div style="margin: 1.5em 0;">
        <strong>Principal Business Address:</strong>
        <div class="field-block">[STREET_ADDRESS]</div>
        <div class="field-block">[CITY], Kentucky [ZIP_CODE]</div>
      </div>
      <div style="margin: 1.5em 0;">
        <strong>Home-Based Business:</strong> <span class="field-value">[HOME_BASED]</span>
      </div>
      <div style="margin: 1.5em 0;">
        <strong>Mailing Address (if different from business address):</strong>
        <div class="field-block">[MAILING_ADDRESS]</div>
      </div>
    </div>
  </div>

  <div class="article-section">
    <div class="article-heading">III. Owner/Entity Information</div>
    <div class="article-content">
      <div class="section-box">
        <strong>For Sole Proprietorship:</strong>
        <div style="margin: 1em 0;">
          <div>Owner Name: <div class="field-block">[OWNER_NAME]</div></div>
          <div>Owner Address: <div class="field-block">[OWNER_ADDRESS]</div></div>
          <div>SSN/Tax ID: <div class="field-block">[OWNER_SSN]</div></div>
        </div>
      </div>

      <div class="section-box">
        <strong>For General Partnership:</strong>
        <div style="margin: 1em 0;">
          <div>Partner 1: <div class="field-block">[PARTNER_1_NAME]</div></div>
          <div>Address: <div class="field-block">[PARTNER_1_ADDRESS]</div></div>
        </div>
        <div style="margin: 1em 0;">
          <div>Partner 2: <div class="field-block">[PARTNER_2_NAME]</div></div>
          <div>Address: <div class="field-block">[PARTNER_2_ADDRESS]</div></div>
        </div>
      </div>

      <div class="section-box">
        <strong>For LLC/Corporation:</strong>
        <div style="margin: 1em 0;">
          <div>Legal Entity Name: <div class="field-block">[LEGAL_ENTITY_NAME]</div></div>
          <div>State of Formation: <div class="field-block">[STATE]</div></div>
          <div>Principal Office: <div class="field-block">[ENTITY_ADDRESS]</div></div>
          <div>Registered Agent: <div class="field-block">[AGENT_NAME]</div></div>
        </div>
      </div>
    </div>
  </div>

  <div class="article-section">
    <div class="article-heading">IV. Contact Information</div>
    <div class="article-content">
      <div style="margin: 1em 0;">
        <strong>Primary Contact Person:</strong>
        <div class="field-block">[CONTACT_NAME]</div>
      </div>
      <div style="margin: 1em 0;">
        <strong>Telephone:</strong>
        <div class="field-block">[PHONE]</div>
      </div>
      <div style="margin: 1em 0;">
        <strong>Email:</strong>
        <div class="field-block">[EMAIL]</div>
      </div>
    </div>
  </div>

  <div class="article-section">
    <div class="article-heading">V. Duration</div>
    <div class="article-content">
      This certificate shall remain in effect: <strong>[DURATION]</strong>
      <div class="field-block">[END_DATE]</div>
    </div>
  </div>

  <div class="declaration-box">
    <div class="article-heading" style="margin-top: 0; border-bottom: none;">Declaration Under Penalty of Perjury</div>
    <div style="margin: 1.5em 0; line-height: 1.8;">
      The undersigned declares and affirms, under penalty of perjury, that the information
      provided in this Certificate of Assumed Name is true, accurate, and complete to the
      best of their knowledge and belief.
    </div>
  </div>

  <div class="signature-section">
    <div class="article-heading">Execution</div>
    <div class="signature-line">
      <div class="label">Signatory Name:</div>
      <div class="field-block">[SIGNATORY_NAME]</div>
    </div>
    <div class="signature-line">
      <div class="label">Title/Capacity:</div>
      <div class="field-block">[TITLE]</div>
    </div>
    <div class="signature-line">
      <div class="label">Signature:</div>
      <div class="sig-line"></div>
    </div>
    <div class="signature-line">
      <div class="label">Date:</div>
      <div style="border-bottom: 1.5px solid #2c3e50; width: 2.5in; display: inline-block;"></div>
    </div>
  </div>

  <div class="clerk-section">
    <div class="article-heading" style="margin-top: 0; border-bottom: none;">For County Clerk Use Only</div>
    <div style="margin: 1em 0;">
      <strong>Filing Date:</strong> _________________________________
    </div>
    <div style="margin: 1em 0;">
      <strong>Certificate Number:</strong> _________________________________
    </div>
    <div style="margin: 1em 0;">
      <strong>Filing Fee Received:</strong> $_________________________________
    </div>
    <div style="margin: 2em 0 1em 0;">
      <strong>County Clerk Signature:</strong>
      <div style="border-bottom: 1.5px solid #2c3e50; width: 4in; margin-top: 0.5em;"></div>
    </div>
  </div>

  <div class="document-footer">
    Filed pursuant to Kentucky Revised Statutes (KRS) 365.015 — Trade Names
  </div>
</body>
</html>`;
  }

  /**
   * Get template for selected document type
   */
  getTemplate(docType) {
    switch (docType) {
      case 'articles':
        return this.getArticlesTemplate();
      case 'banking':
        return this.getBankingTemplate();
      case 'dba':
        return this.getDBATemplate();
      default:
        return '<html><body><h1>Template not available</h1></body></html>';
    }
  }

  /**
   * Fill template with form data
   */
  fillTemplate(docType, data) {
    let template = this.getTemplate(docType);
    Object.keys(data).forEach(key => {
      const value = data[key] || '';
      const regex = new RegExp(`\\[${key}\\]`, 'g');
      template = template.replace(regex, value);
    });
    return template;
  }

  /**
   * Print document
   */
  printDocument(docType, data) {
    const html = this.fillTemplate(docType, data);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}

// Create singleton instance
window.DocumentGenerator = new DocumentGenerator();
