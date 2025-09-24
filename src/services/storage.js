// Simple in-memory storage for offer and leads.
// Restarting the server resets this data.
let offer = null;
let leads = [];

module.exports = {
  setOffer: (data) => { offer = data; },
  getOffer: () => offer,

  addLeads: (data) => { leads = leads.concat(data); },
  getLeads: () => leads,
  updateLeads: (newLeads) => { leads = newLeads; }
};
