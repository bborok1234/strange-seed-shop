export interface AnalyticsEvent {
  name: string;
  timestamp: string;
  payload: Record<string, string | number | boolean | null>;
}

const EVENT_KEY = "strange-seed-shop:phase0-events";

export function trackEvent(name: string, payload: AnalyticsEvent["payload"] = {}) {
  const event: AnalyticsEvent = {
    name,
    timestamp: new Date().toISOString(),
    payload
  };

  const events = readEvents();
  events.push(event);
  window.localStorage.setItem(EVENT_KEY, JSON.stringify(events.slice(-200)));
}

export function readEvents(): AnalyticsEvent[] {
  const raw = window.localStorage.getItem(EVENT_KEY);
  return raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
}

export function clearEvents() {
  window.localStorage.removeItem(EVENT_KEY);
}
