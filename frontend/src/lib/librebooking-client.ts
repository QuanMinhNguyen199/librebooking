export type LibreBookingConfig = {
  baseUrl: string;
  sessionToken?: string;
  userId?: string;
};

export class LibreBookingClient {
  constructor(private readonly config: LibreBookingConfig) {}

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.config.baseUrl}/Web/Services/index.php${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(this.config.sessionToken ? { "X-Booked-SessionToken": this.config.sessionToken } : {}),
        ...(this.config.userId ? { "X-Booked-UserId": this.config.userId } : {}),
        ...init?.headers,
      },
    });
    if (!response.ok) throw new Error(`LibreBooking API error: ${response.status}`);
    return response.json() as Promise<T>;
  }

  authenticate(username: string, password: string) {
    return this.request<{ sessionToken: string; userId: number; isAuthenticated: boolean }>(
      "/Authentication/Authenticate",
      { method: "POST", body: JSON.stringify({ username, password }) },
    );
  }

  listResources(scheduleId?: number) {
    const query = scheduleId ? `?scheduleId=${scheduleId}` : "";
    return this.request<{ resources: unknown[] }>(`/Resources/${query}`);
  }

  listReservations(filters?: { scheduleId?: number; userId?: number }) {
    const query = new URLSearchParams();
    if (filters?.scheduleId) query.set("scheduleId", String(filters.scheduleId));
    if (filters?.userId) query.set("userId", String(filters.userId));
    return this.request<{ reservations: unknown[] }>(`/Reservations/?${query}`);
  }
}
