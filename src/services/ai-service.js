// Mock AI Service for generating legal documents
// This simulates AI document generation with a delay

export const generateDocument = async (templateId, formData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate document based on template
    const documents = {
        'legal-notice': generateLegalNotice(formData),
        'rental-agreement': generateRentalAgreement(formData),
        'employment-contract': generateEmploymentContract(formData),
        'nda': generateNDA(formData),
        'power-of-attorney': generatePowerOfAttorney(formData),
        'demand-letter': generateDemandLetter(formData),
    };

    return {
        document: documents[templateId] || 'Document template not found.',
    };
};

const generateLegalNotice = (data) => {
    return `LEGAL NOTICE

Date: ${new Date().toLocaleDateString()}

To,
${data.recipientName}
${data.recipientAddress}

Subject: ${data.subject}

Dear Sir/Madam,

${data.details}

This notice is being sent to you under the provisions of applicable law. You are hereby required to comply with the demands stated herein within ${data.timeframe || '15 days'} from the date of receipt of this notice.

Failure to comply with this notice will compel my client to initiate appropriate legal proceedings against you, and in such an event, you shall be liable for all costs, charges, and consequences thereof.

Please treat this matter with the urgency it deserves.

Yours faithfully,
${data.senderName}
${data.senderAddress}`;
};

const generateRentalAgreement = (data) => {
    return `RENTAL AGREEMENT

This Rental Agreement is made on ${new Date().toLocaleDateString()}

BETWEEN:
${data.landlordName} (hereinafter referred to as "Landlord")
Address: ${data.landlordAddress}

AND:
${data.tenantName} (hereinafter referred to as "Tenant")
Address: ${data.tenantAddress}

PROPERTY DETAILS:
${data.propertyAddress}

TERMS AND CONDITIONS:

1. RENT: The monthly rent for the property is Rs. ${data.monthlyRent}/- (Rupees ${data.monthlyRent} only), payable on or before the ${data.rentDueDate || '5th'} day of each month.

2. SECURITY DEPOSIT: The Tenant has paid a security deposit of Rs. ${data.securityDeposit}/- (Rupees ${data.securityDeposit} only) to the Landlord.

3. DURATION: This agreement is valid for a period of ${data.duration || '11 months'} commencing from ${data.startDate}.

4. MAINTENANCE: The Tenant shall maintain the property in good condition and shall be responsible for any damages caused during the tenancy period.

5. TERMINATION: Either party may terminate this agreement by giving ${data.noticePeriod || '30 days'} written notice to the other party.

IN WITNESS WHEREOF, the parties have executed this agreement on the date mentioned above.

Landlord's Signature: _________________
${data.landlordName}

Tenant's Signature: _________________
${data.tenantName}

Witnesses:
1. _________________ 
2. _________________`;
};

const generateEmploymentContract = (data) => {
    return `EMPLOYMENT CONTRACT

This Employment Contract is entered into on ${new Date().toLocaleDateString()}

BETWEEN:
${data.companyName} (hereinafter referred to as "Employer")
Address: ${data.companyAddress}

AND:
${data.employeeName} (hereinafter referred to as "Employee")
Address: ${data.employeeAddress}

TERMS OF EMPLOYMENT:

1. POSITION: The Employee is appointed as ${data.position}.

2. COMMENCEMENT DATE: The employment shall commence on ${data.startDate}.

3. SALARY: The Employee shall receive a monthly salary of Rs. ${data.salary}/- (Rupees ${data.salary} only).

4. WORKING HOURS: The Employee shall work ${data.workingHours || '9 hours per day, 5 days a week'}.

5. PROBATION PERIOD: The Employee shall be on probation for ${data.probationPeriod || '3 months'}.

6. DUTIES AND RESPONSIBILITIES:
${data.responsibilities}

7. CONFIDENTIALITY: The Employee agrees to maintain confidentiality of all proprietary information of the Employer.

8. TERMINATION: Either party may terminate this contract by giving ${data.noticePeriod || '30 days'} written notice.

IN WITNESS WHEREOF, the parties have executed this contract on the date mentioned above.

For ${data.companyName}
Authorized Signatory: _________________

Employee's Signature: _________________
${data.employeeName}`;
};

const generateNDA = (data) => {
    return `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement is made on ${new Date().toLocaleDateString()}

BETWEEN:
${data.disclosingParty} (hereinafter referred to as "Disclosing Party")

AND:
${data.receivingParty} (hereinafter referred to as "Receiving Party")

PURPOSE: ${data.purpose}

WHEREAS the Disclosing Party wishes to disclose certain confidential information to the Receiving Party for the purpose stated above;

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, the parties agree as follows:

1. CONFIDENTIAL INFORMATION: The term "Confidential Information" means all information disclosed by the Disclosing Party to the Receiving Party, whether orally or in writing, that is designated as confidential or that reasonably should be understood to be confidential.

2. OBLIGATIONS: The Receiving Party agrees to:
   a) Hold the Confidential Information in strict confidence
   b) Not disclose the Confidential Information to any third parties
   c) Use the Confidential Information solely for the purpose stated above
   d) Protect the Confidential Information with the same degree of care as it protects its own confidential information

3. DURATION: This Agreement shall remain in effect for ${data.duration || '2 years'} from the date of execution.

4. RETURN OF INFORMATION: Upon termination of this Agreement, the Receiving Party shall return or destroy all Confidential Information.

5. GOVERNING LAW: This Agreement shall be governed by the laws of ${data.jurisdiction || 'India'}.

IN WITNESS WHEREOF, the parties have executed this Agreement on the date mentioned above.

Disclosing Party: _________________
${data.disclosingParty}

Receiving Party: _________________
${data.receivingParty}`;
};

const generatePowerOfAttorney = (data) => {
    return `POWER OF ATTORNEY

Know all men by these presents that I, ${data.principalName}, aged ${data.principalAge} years, residing at ${data.principalAddress}, do hereby appoint ${data.attorneyName}, aged ${data.attorneyAge} years, residing at ${data.attorneyAddress}, as my true and lawful Attorney.

PURPOSE: ${data.purpose}

POWERS GRANTED:
I hereby authorize my said Attorney to:
${data.powers}

DURATION: This Power of Attorney shall remain in force for ${data.duration || 'one year'} from the date of execution, unless revoked earlier.

REVOCATION: I reserve the right to revoke this Power of Attorney at any time by giving written notice to my Attorney.

INDEMNITY: I hereby agree to indemnify and keep indemnified my said Attorney against all claims, demands, proceedings, losses, damages, costs, and expenses arising out of or in connection with the exercise of powers granted herein.

IN WITNESS WHEREOF, I have executed this Power of Attorney on ${new Date().toLocaleDateString()}.

Principal's Signature: _________________
${data.principalName}

Witnesses:
1. _________________
   Name:
   Address:

2. _________________
   Name:
   Address:

ACCEPTED:

Attorney's Signature: _________________
${data.attorneyName}`;
};

const generateDemandLetter = (data) => {
    return `DEMAND LETTER

Date: ${new Date().toLocaleDateString()}

To,
${data.recipientName}
${data.recipientAddress}

Subject: Demand for ${data.subject}

Dear Sir/Madam,

I am writing this letter on behalf of my client, ${data.clientName}, to demand ${data.demandDetails}.

BACKGROUND:
${data.background}

AMOUNT CLAIMED: Rs. ${data.amount}/- (Rupees ${data.amount} only)

You are hereby given ${data.timeframe || '7 days'} from the date of receipt of this letter to comply with the above demand. The payment should be made by ${data.paymentMethod || 'bank transfer or demand draft'}.

If you fail to comply with this demand within the stipulated time, my client will be constrained to initiate appropriate legal proceedings against you without any further notice. In such an event, you shall be liable for all costs, charges, interest, and consequences thereof.

Please treat this matter with the urgency it deserves and avoid unnecessary litigation.

Yours faithfully,
${data.senderName}
${data.senderAddress}
${data.senderContact || ''}`;
};
