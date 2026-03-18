export default class Alert {
  constructor() {
    this.alerts = [];
  }

  async loadAlerts() {
    try {
      const response = await fetch('/json/alerts.json');
      if (response.ok) {
        this.alerts = await response.json();
      } else {
        console.log('No alerts to display');
      }
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  }

  renderAlerts() {
    if (this.alerts.length === 0) return;
    
    // Create alert list section
    const alertSection = document.createElement('section');
    alertSection.className = 'alert-list';
    
    // Create a paragraph for each alert
    this.alerts.forEach(alert => {
      const alertP = document.createElement('p');
      alertP.textContent = alert.message;
      alertP.style.backgroundColor = alert.background;
      alertP.style.color = alert.color;
      alertP.style.padding = '10px';
      alertP.style.margin = '0';
      alertP.style.textAlign = 'center';
      alertP.style.fontWeight = 'bold';
      
      alertSection.appendChild(alertP);
    });
    
    // Insert at the beginning of main
    const main = document.querySelector('main');
    if (main) {
      main.prepend(alertSection);
    }
  }

  async init() {
    await this.loadAlerts();
    this.renderAlerts();
  }
}