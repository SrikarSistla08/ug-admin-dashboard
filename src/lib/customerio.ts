// Customer.io API integration
export interface CustomerIOConfig {
  siteId: string;
  apiKey: string;
  region?: 'us' | 'eu';
}

export interface CustomerIOEvent {
  name: string;
  data?: Record<string, unknown>;
  timestamp?: number;
}

export interface CustomerIOEmail {
  to: string;
  subject: string;
  body: string;
  template_id?: string;
  variables?: Record<string, unknown>;
}

export class CustomerIOService {
  private config: CustomerIOConfig;
  private baseUrl: string;

  constructor(config: CustomerIOConfig) {
    this.config = config;
    this.baseUrl = config.region === 'eu' 
      ? 'https://track-eu.customer.io' 
      : 'https://track.customer.io';
  }

  // Track an event for a customer
  async trackEvent(customerId: string, event: CustomerIOEvent): Promise<void> {
    const url = `${this.baseUrl}/api/v1/customers/${customerId}/events`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error(`Customer.io API error: ${response.status} ${response.statusText}`);
    }
  }

  // Send an email to a customer
  async sendEmail(customerId: string, email: CustomerIOEmail): Promise<void> {
    const url = `${this.baseUrl}/api/v1/customers/${customerId}/messages`;
    
    const payload = {
      message_data: {
        to: email.to,
        subject: email.subject,
        body: email.body,
        template_id: email.template_id,
        variables: email.variables,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Customer.io API error: ${response.status} ${response.statusText}`);
    }
  }

  // Send a transactional email
  async sendTransactionalEmail(email: CustomerIOEmail): Promise<void> {
    const url = `${this.baseUrl}/api/v1/send/email`;
    
    const payload = {
      to: email.to,
      subject: email.subject,
      body: email.body,
      template_id: email.template_id,
      variables: email.variables,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Customer.io API error: ${response.status} ${response.statusText}`);
    }
  }

  // Create or update a customer
  async upsertCustomer(customerId: string, attributes: Record<string, unknown>): Promise<void> {
    const url = `${this.baseUrl}/api/v1/customers/${customerId}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(attributes),
    });

    if (!response.ok) {
      throw new Error(`Customer.io API error: ${response.status} ${response.statusText}`);
    }
  }
}

// Create singleton instance with environment variables
export const customerIOService = new CustomerIOService({
  siteId: process.env.NEXT_PUBLIC_CUSTOMER_IO_SITE_ID || 'demo-site-id',
  apiKey: process.env.CUSTOMER_IO_API_KEY || 'demo-api-key',
  region: (process.env.CUSTOMER_IO_REGION as 'us' | 'eu') || 'us',
});
