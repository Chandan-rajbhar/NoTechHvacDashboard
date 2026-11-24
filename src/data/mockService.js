// Mock Service Layer with LocalStorage persistence and reactive state
import {
  COLOR_SPECTRUM,
  MODULAR_COMPARTMENTS,
  TONNAGE_OPTIONS,
  CONFIGURATION_OPTIONS,
  TIME_SLOTS,
  REGIONS,
  RESERVATIONS_DATA,
  CONTRACTORS_DATA,
  CONTRACTOR_APPROVALS_QUEUE,
  QUESTIONNAIRE_QUESTIONS,
  CONTRACTOR_ASSESSMENTS,
  JOBS_QC_DATA,
  FLAGGED_QC_ISSUES,
  CUSTOMERS_DATA,
  CHATBOT_INQUIRIES,
  CHATBOT_SUGGESTIONS,
  CHATBOT_RESPONSES,
  USERS_AND_ROLES,
  PAYMENTS_DATA,
  SYSTEM_SETTINGS
} from './mockData';

const STORAGE_KEYS = {
  RESERVATIONS: 'notech_reservations_v1',
  CONTRACTORS: 'notech_contractors_v1',
  APPROVALS: 'notech_approvals_v1',
  COMPARTMENTS: 'notech_compartments_v1',
  JOBS: 'notech_jobs_v1',
  FLAGS: 'notech_flags_v1',
  CUSTOMERS: 'notech_customers_v1',
  INQUIRIES: 'notech_inquiries_v1',
  SETTINGS: 'notech_settings_v1',
  PAYMENTS: 'notech_payments_v1',
  COLORS: 'notech_colors_v1',
  PRICING: 'notech_pricing_v1',
  TIME_SLOTS: 'notech_time_slots_v1',
  SLOT_JOBS: 'notech_slot_jobs_v1',
  USERS: 'notech_users_v1',
  CHATBOT_RESPONSES: 'notech_chatbot_responses_v1',
};

// Safe load from LocalStorage or initialize with default
function getStoredOrDefault(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(`Failed to read from localStorage key ${key}`, e);
  }
  return fallback;
}

function saveStored(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Failed to save to localStorage key ${key}`, e);
  }
}

export const MockService = {
  // Static Constants & Pricing Options
  getTimeSlots: () => getStoredOrDefault(STORAGE_KEYS.TIME_SLOTS, TIME_SLOTS),
  saveTimeSlots: (slots) => saveStored(STORAGE_KEYS.TIME_SLOTS, slots),
  createTimeSlot: (newSlot) => {
    const list = MockService.getTimeSlots();
    if (!list.includes(newSlot)) {
      const updated = [...list, newSlot];
      saveStored(STORAGE_KEYS.TIME_SLOTS, updated);
      return updated;
    }
    return list;
  },
  deleteTimeSlot: (slotName) => {
    const list = MockService.getTimeSlots();
    const updated = list.filter(s => s !== slotName);
    saveStored(STORAGE_KEYS.TIME_SLOTS, updated);
    return updated;
  },

  // Pricing / Tonnage
  getTonnageOptions: () => getStoredOrDefault(STORAGE_KEYS.PRICING, TONNAGE_OPTIONS),
  updateTonnageOption: (id, updates) => {
    const list = MockService.getTonnageOptions();
    const updated = list.map(item => item.id === id ? { ...item, ...updates } : item);
    saveStored(STORAGE_KEYS.PRICING, updated);
    return updated;
  },
  createTonnageOption: (newOption) => {
    const list = MockService.getTonnageOptions();
    const item = {
      id: newOption.id || `${parseFloat(newOption.tonnage || 3.5).toFixed(1)}`,
      label: newOption.label || `${newOption.tonnage} Ton`,
      coverage: newOption.coverage || '1,400 – 1,800 sq ft',
      idealFor: newOption.idealFor || 'Custom Residential Build',
      basePrice: Number(newOption.basePrice) || 6400,
      monthlyPrice: Number(newOption.monthlyPrice) || Math.round((Number(newOption.basePrice) || 6400) / 24),
      isPopular: !!newOption.isPopular,
      status: newOption.status || 'Active',
    };
    const updated = [...list, item];
    saveStored(STORAGE_KEYS.PRICING, updated);
    return item;
  },
  deleteTonnageOption: (id) => {
    const list = MockService.getTonnageOptions();
    const updated = list.filter(item => item.id !== id);
    saveStored(STORAGE_KEYS.PRICING, updated);
    return updated;
  },

  getConfigOptions: () => CONFIGURATION_OPTIONS,
  getRegions: () => REGIONS,
  getQuestionnaire: () => QUESTIONNAIRE_QUESTIONS,
  getAssessments: () => CONTRACTOR_ASSESSMENTS,
  getChatbotSuggestions: () => CHATBOT_SUGGESTIONS,
  getChatbotResponses: () => getStoredOrDefault(STORAGE_KEYS.CHATBOT_RESPONSES, CHATBOT_RESPONSES),
  saveChatbotResponses: (responses) => saveStored(STORAGE_KEYS.CHATBOT_RESPONSES, responses),
  getUsersAndRoles: () => getStoredOrDefault(STORAGE_KEYS.USERS, USERS_AND_ROLES),
  createUser: (newUser) => {
    const list = MockService.getUsersAndRoles();
    const item = {
      id: `u${list.length + 1}`,
      name: newUser.name,
      role: newUser.role || 'Operations Staff',
      badge: newUser.role === 'Super Admin' ? 'Master Authority' : 'Local Mechanical Certified',
      email: newUser.email,
      avatar: newUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
      permissions: newUser.permissions || ['Manage Production Batches & Quotas', 'Customer Communication'],
      joinedDate: new Date().toISOString().split('T')[0]
    };
    const updated = [...list, item];
    saveStored(STORAGE_KEYS.USERS, updated);
    return item;
  },
  deleteUser: (id) => {
    const list = MockService.getUsersAndRoles();
    const updated = list.filter(u => u.id !== id);
    saveStored(STORAGE_KEYS.USERS, updated);
    return updated;
  },

  // Colors
  getColors: () => getStoredOrDefault(STORAGE_KEYS.COLORS, COLOR_SPECTRUM),
  saveColors: (colors) => saveStored(STORAGE_KEYS.COLORS, colors),

  // Reservations
  getReservations: () => getStoredOrDefault(STORAGE_KEYS.RESERVATIONS, RESERVATIONS_DATA),
  updateReservation: (id, updates) => {
    const list = MockService.getReservations();
    const updated = list.map(item => item.id === id ? { ...item, ...updates } : item);
    saveStored(STORAGE_KEYS.RESERVATIONS, updated);
    return updated;
  },
  deleteReservation: (id) => {
    const list = MockService.getReservations();
    const updated = list.filter(item => item.id !== id);
    saveStored(STORAGE_KEYS.RESERVATIONS, updated);
    return updated;
  },
  createReservation: (newRes) => {
    const list = MockService.getReservations();
    const item = {
      ...newRes,
      id: `NT-RES-2026-${Math.floor(100 + Math.random() * 900)}`,
      batchNumber: `NT-BATCH-2026-${Math.floor(100 + Math.random() * 900)}`,
      status: newRes.status || 'In Production',
      productionProgressPercent: newRes.productionProgressPercent || 25,
      productionStage: newRes.productionStage || 'Reservation',
      feeStatus: newRes.feeStatus || 'Paid',
      reservationFee: newRes.reservationFee || 200,
      timeline: [
        { step: '$200 Deposit Confirmed', date: new Date().toLocaleString(), completed: true },
        { step: 'Production Batch Assigned', date: new Date().toLocaleString(), completed: true },
        { step: 'Chassis & Sub-Assembly Initiated', date: 'Pending', completed: false, current: true },
        { step: 'Confirmation Email Dispatched', date: 'Pending', completed: false },
      ]
    };
    const updated = [item, ...list];
    saveStored(STORAGE_KEYS.RESERVATIONS, updated);
    return item;
  },

  // Compartments
  getCompartments: () => getStoredOrDefault(STORAGE_KEYS.COMPARTMENTS, MODULAR_COMPARTMENTS),
  updateCompartment: (id, updates) => {
    const list = MockService.getCompartments();
    const updated = list.map(item => item.id === id ? { ...item, ...updates } : item);
    saveStored(STORAGE_KEYS.COMPARTMENTS, updated);
    return updated;
  },

  // Contractors
  getContractors: () => getStoredOrDefault(STORAGE_KEYS.CONTRACTORS, CONTRACTORS_DATA),
  updateContractor: (id, updates) => {
    const list = MockService.getContractors();
    const updated = list.map(item => item.id === id ? { ...item, ...updates } : item);
    saveStored(STORAGE_KEYS.CONTRACTORS, updated);
    return updated;
  },
  deleteContractor: (id) => {
    const list = MockService.getContractors();
    const updated = list.filter(item => item.id !== id);
    saveStored(STORAGE_KEYS.CONTRACTORS, updated);
    return updated;
  },
  createContractor: (newContractor) => {
    const list = MockService.getContractors();
    const certNum = Math.floor(1000 + Math.random() * 9000);
    const item = {
      id: `c${list.length + 1}`,
      name: newContractor.name,
      company: newContractor.company,
      rating: Number(newContractor.rating) || 5.0,
      reviewCount: 0,
      epaLicense: newContractor.epaLicense || 'EPA-Universal #8829101',
      stateLicense: newContractor.stateLicense || 'HVAC-LIC #CA-891022',
      experienceYears: Number(newContractor.experienceYears) || 5,
      distanceMiles: Number(newContractor.distanceMiles) || 10,
      phone: newContractor.phone || '(555) 000-0000',
      email: newContractor.email || 'contractor@example.com',
      avatar: newContractor.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
      verifiedByLocalMechanical: true,
      localMechanicalCertId: `LM-CERT-2026-${certNum}`,
      approvalDate: new Date().toISOString().split('T')[0],
      insuranceVerified: true,
      insuranceCarrier: newContractor.insuranceCarrier || 'Travelers Commercial (Local Mechanical Listed)',
      status: newContractor.status || 'Available',
      specialties: newContractor.specialties || ['Modular Compartment Swaps', 'Airflow Diagnostics'],
      recentFeedback: 'Newly certified by Local Mechanical.',
      unselectCount: 0,
      unselectReports: [],
      videoCompleted: true,
      questionnaireScore: 10,
      totalJobsCompleted: 0,
      flaggedIssues: 0
    };
    const updated = [item, ...list];
    saveStored(STORAGE_KEYS.CONTRACTORS, updated);
    return item;
  },

  // Contractor Approvals Queue
  getApprovals: () => getStoredOrDefault(STORAGE_KEYS.APPROVALS, CONTRACTOR_APPROVALS_QUEUE),
  updateApproval: (id, updates) => {
    const list = MockService.getApprovals();
    const updated = list.map(item => item.id === id ? { ...item, ...updates } : item);
    saveStored(STORAGE_KEYS.APPROVALS, updated);
    return updated;
  },
  approveContractor: (appId) => {
    const list = MockService.getApprovals();
    const app = list.find(a => a.id === appId);
    if (!app) return list;

    const certId = `LM-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const updatedApprovals = list.map(a => a.id === appId ? {
      ...a,
      status: 'Approved',
      certificateId: certId,
      statusNotes: `Approved by Local Mechanical. Certificate ${certId} issued.`,
      allVerified: true,
      documents: a.documents.map(d => ({ ...d, verified: true, verifiedAt: new Date().toISOString().split('T')[0] }))
    } : a);
    saveStored(STORAGE_KEYS.APPROVALS, updatedApprovals);

    // Also add or activate in Contractors directory
    const contractors = MockService.getContractors();
    const existing = contractors.find(c => c.name.toLowerCase().includes(app.contractorName.toLowerCase()));
    if (!existing) {
      const newContractor = {
        id: `c${contractors.length + 1}`,
        name: app.contractorName,
        company: app.company,
        rating: 5.0,
        reviewCount: 0,
        epaLicense: 'EPA-Universal #8829101',
        stateLicense: 'HVAC-LIC #CA-891022',
        experienceYears: 8,
        distanceMiles: 6.2,
        phone: app.phone,
        email: app.email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
        verifiedByLocalMechanical: true,
        localMechanicalCertId: certId,
        approvalDate: new Date().toISOString().split('T')[0],
        insuranceVerified: true,
        insuranceCarrier: 'Travelers Commercial (Local Mechanical Listed)',
        status: 'Available',
        specialties: ['Modular Compartment Swaps', 'Airflow Diagnostics'],
        recentFeedback: 'Newly certified by Local Mechanical.',
        unselectCount: 0,
        unselectReports: [],
        videoCompleted: true,
        questionnaireScore: app.questionnaireScore || 10,
        totalJobsCompleted: 0,
        flaggedIssues: 0
      };
      saveStored(STORAGE_KEYS.CONTRACTORS, [newContractor, ...contractors]);
    }
    return updatedApprovals;
  },

  // Jobs & QC
  getJobs: () => getStoredOrDefault(STORAGE_KEYS.JOBS, JOBS_QC_DATA),
  updateJob: (id, updates) => {
    const list = MockService.getJobs();
    const updated = list.map(item => item.id === id ? { ...item, ...updates } : item);
    saveStored(STORAGE_KEYS.JOBS, updated);
    return updated;
  },
  getSlotJobs: (fallback) => getStoredOrDefault(STORAGE_KEYS.SLOT_JOBS, fallback),
  saveSlotJobs: (jobs) => saveStored(STORAGE_KEYS.SLOT_JOBS, jobs),
  getFlags: () => getStoredOrDefault(STORAGE_KEYS.FLAGS, FLAGGED_QC_ISSUES),
  resolveFlag: (flagId) => {
    const list = MockService.getFlags();
    const updated = list.map(f => f.id === flagId ? { ...f, status: 'Resolved' } : f);
    saveStored(STORAGE_KEYS.FLAGS, updated);
    return updated;
  },

  // Customers
  getCustomers: () => getStoredOrDefault(STORAGE_KEYS.CUSTOMERS, CUSTOMERS_DATA),
  updateCustomer: (id, updates) => {
    const list = MockService.getCustomers();
    const updated = list.map(c => c.id === id ? { ...c, ...updates } : c);
    saveStored(STORAGE_KEYS.CUSTOMERS, updated);
    return updated;
  },
  createCustomer: (newCust) => {
    const list = MockService.getCustomers();
    const item = {
      id: `cust-${list.length + 101}`,
      name: newCust.name,
      email: newCust.email,
      phone: newCust.phone || '(555) 123-4567',
      address: newCust.address || '100 Main Street',
      city: newCust.city || 'Sacramento',
      state: newCust.state || 'CA',
      zip: newCust.zip || '95814',
      batchNumber: newCust.batchNumber || `NT-BATCH-2026-${Math.floor(100 + Math.random() * 900)}`,
      reservationId: `NT-RES-2026-${Math.floor(100 + Math.random() * 900)}`,
      tonnage: newCust.tonnage || '3.0 Ton',
      configuration: newCust.configuration || 'Upflow Configuration',
      panelColor: newCust.panelColor || '#373A3C',
      panelColorName: newCust.panelColorName || 'Dark Gray (Default)',
      assignedContractor: newCust.assignedContractor || 'Marcus Vance, Vance Mechanical Services',
      installStatus: newCust.installStatus || 'In Production',
      joinedDate: new Date().toISOString().split('T')[0],
      unselectHistory: [],
      notes: [{ date: new Date().toISOString().split('T')[0], author: 'System', text: 'Customer account created via Admin Console' }]
    };
    const updated = [item, ...list];
    saveStored(STORAGE_KEYS.CUSTOMERS, updated);
    return item;
  },
  deleteCustomer: (id) => {
    const list = MockService.getCustomers();
    const updated = list.filter(c => c.id !== id);
    saveStored(STORAGE_KEYS.CUSTOMERS, updated);
    return updated;
  },
  addCustomerNote: (id, text, author = 'Admin') => {
    const list = MockService.getCustomers();
    const updated = list.map(c => {
      if (c.id === id) {
        return {
          ...c,
          notes: [{ date: new Date().toISOString().split('T')[0], author, text }, ...(c.notes || [])]
        };
      }
      return c;
    });
    saveStored(STORAGE_KEYS.CUSTOMERS, updated);
    return updated;
  },

  // Inquiries
  getInquiries: () => getStoredOrDefault(STORAGE_KEYS.INQUIRIES, CHATBOT_INQUIRIES),
  addInquiryReply: (id, text) => {
    const list = MockService.getInquiries();
    const updated = list.map(inq => {
      if (inq.id === id) {
        return {
          ...inq,
          status: 'In Progress',
          replies: [...(inq.replies || []), { author: 'Admin Operations', text, date: new Date().toLocaleString() }]
        };
      }
      return inq;
    });
    saveStored(STORAGE_KEYS.INQUIRIES, updated);
    return updated;
  },

  // Payments
  getPayments: () => getStoredOrDefault(STORAGE_KEYS.PAYMENTS, PAYMENTS_DATA),
  refundPayment: (txId) => {
    const list = MockService.getPayments();
    const updated = list.map(p => p.id === txId ? { ...p, status: 'Refunded' } : p);
    saveStored(STORAGE_KEYS.PAYMENTS, updated);
    return updated;
  },

  // Settings
  getSettings: () => getStoredOrDefault(STORAGE_KEYS.SETTINGS, SYSTEM_SETTINGS),
  updateSettings: (updates) => {
    const current = MockService.getSettings();
    const updated = { ...current, ...updates };
    saveStored(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // Reset to factory mock data
  resetAll: () => {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  }
};
