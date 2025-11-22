// Mock AI service for document generation
// This simulates AI-generated legal documents without requiring external API calls

const generateLegalNotice = (data) => {
    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    return `LEGAL NOTICE

Date: ${today}

To,
${data.recipientName}
${data.recipientAddress}

Subject: ${data.subject}

Dear Sir/Madam,

Under instructions from and on behalf of my client, I hereby serve you with this Legal Notice in the following terms:

${data.details}

My client demands that ${data.demand}

You are hereby called upon to comply with the above demand within ${data.timeline} days from the receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you at your risk as to costs and consequences, for which this notice shall serve as a sufficient warning.

Please treat this matter with utmost urgency.

Yours faithfully,
[Advocate Name]
[Advocate Details]`;
};

const generateRentalAgreement = (data) => {
    return `RENTAL AGREEMENT

This Rental Agreement is entered into on ${data.startDate} between:

LANDLORD: ${data.landlordName}
TENANT: ${data.tenantName}

PROPERTY ADDRESS:
${data.propertyAddress}

TERMS AND CONDITIONS:

1. RENT: The monthly rent for the premises shall be Rs. ${data.rentAmount}/- (Rupees ${numberToWords(data.rentAmount)} only), payable on or before the 5th day of each month.

2. SECURITY DEPOSIT: The Tenant has paid a security deposit of Rs. ${data.securityDeposit}/- (Rupees ${numberToWords(data.securityDeposit)} only) which shall be refundable at the end of the tenancy, subject to deductions for any damages or unpaid dues.

3. LEASE DURATION: This agreement is valid for a period of ${data.leaseDuration} months commencing from ${data.startDate}.

4. MAINTENANCE: The Tenant shall maintain the premises in good condition and shall be responsible for minor repairs and day-to-day maintenance.

5. UTILITIES: The Tenant shall pay for all utilities including electricity, water, and gas consumed during the tenancy period.

6. TERMINATION: Either party may terminate this agreement by giving one month's written notice to the other party.

7. USE OF PREMISES: The premises shall be used solely for residential purposes and shall not be used for any illegal or immoral activities.

IN WITNESS WHEREOF, the parties have executed this agreement on the date mentioned above.

LANDLORD                                    TENANT
${data.landlordName}                        ${data.tenantName}

Signature: ______________                   Signature: ______________

WITNESSES:
1. Name: ______________ Signature: ______________
2. Name: ______________ Signature: ______________`;
};

const generateEmploymentContract = (data) => {
    return `EMPLOYMENT CONTRACT

This Employment Agreement is made on ${data.startDate} between:

EMPLOYER: ${data.employerName}
EMPLOYEE: ${data.employeeName}

1. POSITION: The Employee is hired for the position of ${data.position}.

2. COMPENSATION: The Employee shall receive an annual salary of Rs. ${data.salary}/- (Rupees ${numberToWords(data.salary)} only), payable monthly.

3. WORK LOCATION: The Employee shall be based at ${data.workLocation}.

${data.probationPeriod ? `4. PROBATION PERIOD: The Employee shall be on probation for ${data.probationPeriod} months from the date of joining.` : ''}

5. DUTIES AND RESPONSIBILITIES:
   - Perform duties as assigned by the employer
   - Maintain confidentiality of company information
   - Comply with company policies and procedures

6. WORKING HOURS: The Employee shall work standard business hours as determined by the employer.

7. LEAVE ENTITLEMENT: The Employee shall be entitled to leave as per company policy.

8. TERMINATION: Either party may terminate this agreement by providing one month's written notice or payment in lieu thereof.

9. CONFIDENTIALITY: The Employee agrees to maintain strict confidentiality regarding all proprietary information of the employer.

10. NON-COMPETE: The Employee agrees not to engage in any competing business during the term of employment and for a period of one year thereafter.

This agreement shall be governed by the laws of India.

EMPLOYER                                    EMPLOYEE
${data.employerName}                        ${data.employeeName}

Signature: ______________                   Signature: ______________
Date: ${data.startDate}`;
};

const generateNDA = (data) => {
    return `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into on ${data.effectiveDate} between:

DISCLOSING PARTY: ${data.disclosingParty}
RECEIVING PARTY: ${data.receivingParty}

WHEREAS, the Disclosing Party possesses certain confidential and proprietary information;

WHEREAS, the Receiving Party desires to receive such information for the purpose of: ${data.purpose};

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, the parties agree as follows:

1. CONFIDENTIAL INFORMATION: "Confidential Information" means any information disclosed by the Disclosing Party to the Receiving Party, whether orally, in writing, or in any other form.

2. OBLIGATIONS OF RECEIVING PARTY:
   a) The Receiving Party shall maintain the confidentiality of all Confidential Information
   b) The Receiving Party shall not disclose Confidential Information to any third party without prior written consent
   c) The Receiving Party shall use the Confidential Information solely for the stated purpose

3. TERM: This Agreement shall remain in effect for a period of ${data.duration} years from the Effective Date.

4. RETURN OF INFORMATION: Upon termination of this Agreement, the Receiving Party shall return or destroy all Confidential Information.

5. NO LICENSE: Nothing in this Agreement grants any license or right to the Receiving Party with respect to any intellectual property.

6. GOVERNING LAW: This Agreement shall be governed by the laws of India.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

DISCLOSING PARTY                            RECEIVING PARTY
${data.disclosingParty}                     ${data.receivingParty}

Signature: ______________                   Signature: ______________`;
};

const generatePowerOfAttorney = (data) => {
    return `POWER OF ATTORNEY

KNOW ALL MEN BY THESE PRESENTS that I, ${data.principalName} (hereinafter called the "Principal"), do hereby constitute, nominate and appoint ${data.agentName} (hereinafter called the "Attorney") to be my true and lawful Attorney.

TO DO in my name and on my behalf all or any of the following acts, deeds and things:

${data.powers}

This Power of Attorney shall come into effect from ${data.effectiveDate}${data.expirationDate ? ` and shall remain in force until ${data.expirationDate}` : ' and shall remain in force until revoked by me in writing'}.

I hereby agree to ratify and confirm all acts, deeds and things lawfully done by my said Attorney pursuant to these presents.

IN WITNESS WHEREOF I have hereunto set my hand on this day.

PRINCIPAL
${data.principalName}

Signature: ______________

WITNESSES:
1. Name: ______________ Signature: ______________
2. Name: ______________ Signature: ______________

ACCEPTED BY ATTORNEY:
${data.agentName}

Signature: ______________`;
};

const generateDemandLetter = (data) => {
    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    return `DEMAND LETTER

Date: ${today}

To,
${data.recipientName}

Dear Sir/Madam,

RE: FORMAL DEMAND

I am writing to you on behalf of ${data.senderName} regarding the following matter:

${data.description}

${data.amountOwed ? `The total amount due is Rs. ${data.amountOwed}/- (Rupees ${numberToWords(data.amountOwed)} only).` : ''}

You are hereby formally demanded to ${data.amountOwed ? 'pay the above-mentioned amount' : 'take the necessary action'} on or before ${data.deadline}.

Failure to comply with this demand within the stipulated time will leave us with no option but to initiate appropriate legal proceedings against you without any further notice, and you shall be liable for all costs and consequences thereof.

We trust you will treat this matter with the seriousness it deserves and take immediate action to resolve this issue.

Yours faithfully,
${data.senderName}`;
};

// Helper function to convert numbers to words (simplified)
const numberToWords = (num) => {
    // This is a simplified version - you can enhance it for better conversion
    return num.toString();
};

export const generateDocument = async (templateId, formData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    let document = '';

    switch (templateId) {
        case 'legal-notice':
            document = generateLegalNotice(formData);
            break;
        case 'rental-agreement':
            document = generateRentalAgreement(formData);
            break;
        case 'employment-contract':
            document = generateEmploymentContract(formData);
            break;
        case 'nda':
            document = generateNDA(formData);
            break;
        case 'power-of-attorney':
            document = generatePowerOfAttorney(formData);
            break;
        case 'demand-letter':
            document = generateDemandLetter(formData);
            break;
        default:
            throw new Error('Unknown template type');
    }

    return {
        success: true,
        document,
        metadata: {
            templateId,
            generatedAt: new Date().toISOString(),
            formData
        }
    };
};
