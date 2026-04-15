import { Importance } from './Importance';
import { Surprise } from './Surprise';
import { AIAnalysis } from './AIAnalysis';

export interface EconomicEvent {
  id: string;
  eventDate?: string;
  time: string;
  title: string;
  country: string;
  currency: string;
  importance: Importance;
  actual: string | null;
  forecast: string | null;
  previous: string | null;
  surprise: Surprise | null;
  url: string | null;
  aiAnalysis: AIAnalysis | null;
}
