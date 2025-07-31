const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Waitlist operations
  async createWaitlistEntry(data: {
    first_name: string;
    last_name: string;
    email: string;
    referral_code?: string;
  }) {
    return this.request<{ message: string; user: any }>('/waitlist', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getWaitlistEntryByEmail(email: string) {
    return this.request<{ user: any }>(`/waitlist/email/${encodeURIComponent(email)}`);
  }

  async getWaitlistEntryById(id: string) {
    return this.request<{ user: any }>(`/waitlist/${id}`);
  }

  async updateWaitlistEntry(id: string, updates: Record<string, any>) {
    return this.request<{ message: string; user: any }>(`/waitlist/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Leaderboard operations
  async getLeaderboard(limit: number = 10) {
    return this.request<{ leaderboard: any[] }>(`/leaderboard?limit=${limit}`);
  }

  // Rewards operations
  async getReferralRewards() {
    return this.request<{ rewards: any[] }>('/rewards');
  }

  // User achievements
  async getUserAchievements(userId: string) {
    return this.request<{ achievements: any[] }>(`/users/${userId}/achievements`);
  }

  async createUserAchievement(userId: string, data: {
    achievement_type: string;
    points_earned: number;
  }) {
    return this.request<{ message: string }>(`/users/${userId}/achievements`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export types for better TypeScript support
export interface WaitlistEntry {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  referral_count: number;
  points: number;
  tier_level: number;
  referral_link: string;
  referred_by: string | null;
  created_at: string;
  last_referral_at: string | null;
}

export interface LeaderboardEntry {
  id: string;
  first_name: string;
  last_name: string;
  referral_count: number;
  created_at: string;
  tier_level: number;
  points: number;
}

export interface ReferralReward {
  id: string;
  name: string;
  description: string | null;
  points_required: number;
  reward_type: string;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_type: string;
  points_earned: number;
  created_at: string;
} 