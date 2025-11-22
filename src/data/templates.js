export const documentTemplates = [
    {
        id: 'legal-notice',
        name: 'Legal Notice',
        description: 'Formal notice for legal matters',
        icon: 'FileText',
        fields: [
            { name: 'recipientName', label: 'Recipient Name', type: 'text', required: true },
            { name: 'recipientAddress', label: 'Recipient Address', type: 'textarea', required: true },
            { name: 'subject', label: 'Subject/Matter', type: 'text', required: true },
            { name: 'details', label: 'Details of the Issue', type: 'textarea', required: true },
            { name: 'demand', label: 'Your Demand', type: 'textarea', required: true },
            { name: 'timeline', label: 'Response Timeline (days)', type: 'number', required: true },
        ]
    },
    {
        id: 'rental-agreement',
        name: 'Rental Agreement',
        description: 'Residential or commercial lease agreement',
        icon: 'Home',
        fields: [
            { name: 'landlordName', label: 'Landlord Name', type: 'text', required: true },
            { name: 'tenantName', label: 'Tenant Name', type: 'text', required: true },
            { name: 'propertyAddress', label: 'Property Address', type: 'textarea', required: true },
            { name: 'rentAmount', label: 'Monthly Rent Amount', type: 'number', required: true },
            { name: 'securityDeposit', label: 'Security Deposit', type: 'number', required: true },
            { name: 'leaseDuration', label: 'Lease Duration (months)', type: 'number', required: true },
            { name: 'startDate', label: 'Lease Start Date', type: 'date', required: true },
        ]
    },
    {
        id: 'employment-contract',
        name: 'Employment Contract',
        description: 'Standard employment agreement',
        icon: 'Briefcase',
        fields: [
            { name: 'employerName', label: 'Employer/Company Name', type: 'text', required: true },
            { name: 'employeeName', label: 'Employee Name', type: 'text', required: true },
            { name: 'position', label: 'Job Position', type: 'text', required: true },
            { name: 'salary', label: 'Annual Salary', type: 'number', required: true },
            { name: 'startDate', label: 'Start Date', type: 'date', required: true },
            { name: 'workLocation', label: 'Work Location', type: 'text', required: true },
            { name: 'probationPeriod', label: 'Probation Period (months)', type: 'number', required: false },
        ]
    },
    {
        id: 'nda',
        name: 'Non-Disclosure Agreement',
        description: 'Confidentiality agreement',
        icon: 'Shield',
        fields: [
            { name: 'disclosingParty', label: 'Disclosing Party Name', type: 'text', required: true },
            { name: 'receivingParty', label: 'Receiving Party Name', type: 'text', required: true },
            { name: 'purpose', label: 'Purpose of Disclosure', type: 'textarea', required: true },
            { name: 'duration', label: 'Agreement Duration (years)', type: 'number', required: true },
            { name: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
        ]
    },
    {
        id: 'power-of-attorney',
        name: 'Power of Attorney',
        description: 'Legal authorization document',
        icon: 'UserCheck',
        fields: [
            { name: 'principalName', label: 'Principal Name (Grantor)', type: 'text', required: true },
            { name: 'agentName', label: 'Agent Name (Attorney-in-Fact)', type: 'text', required: true },
            { name: 'powers', label: 'Powers Granted', type: 'textarea', required: true },
            { name: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
            { name: 'expirationDate', label: 'Expiration Date', type: 'date', required: false },
        ]
    },
    {
        id: 'demand-letter',
        name: 'Demand Letter',
        description: 'Formal demand for payment or action',
        icon: 'AlertCircle',
        fields: [
            { name: 'senderName', label: 'Your Name', type: 'text', required: true },
            { name: 'recipientName', label: 'Recipient Name', type: 'text', required: true },
            { name: 'amountOwed', label: 'Amount Owed', type: 'number', required: false },
            { name: 'description', label: 'Description of Claim', type: 'textarea', required: true },
            { name: 'deadline', label: 'Payment/Action Deadline', type: 'date', required: true },
        ]
    }
];

export const getTemplateById = (id) => {
    return documentTemplates.find(template => template.id === id);
};
