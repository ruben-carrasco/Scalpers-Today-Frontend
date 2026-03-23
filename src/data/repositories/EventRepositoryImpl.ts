import { injectable, inject } from 'inversify';
import { TYPES } from '../../core/types';
import { ApiClient } from '../api/ApiClient';
import { ApiEndpointProvider } from '../api/ApiEndpointProvider';
import { IEventRepository } from '../../domain/interfaces/repositories/IEventRepository';
import { EventFilters } from '../../domain/interfaces/repositories/EventFilters';
import { FilteredEventsResult } from '../../domain/interfaces/repositories/FilteredEventsResult';
import { UpcomingEventsResult } from '../../domain/interfaces/repositories/UpcomingEventsResult';
import { EconomicEvent } from '../../domain/entities/EconomicEvent';
import { AIAnalysis } from '../../domain/entities/AIAnalysis';
import { Importance } from '../../domain/entities/Importance';
import { Surprise } from '../../domain/entities/Surprise';
import { HomeSummary } from '../../domain/entities/HomeSummary';
import { DailyBriefing } from '../../domain/entities/DailyBriefing';
import { BriefingStats } from '../../domain/entities/BriefingStats';
import { ApiAIAnalysis, ApiEvent, ApiFilteredEventsResponse, ApiUpcomingResponse, ApiHomeSummary, ApiBriefing } from './types';

@injectable()
export class EventRepositoryImpl implements IEventRepository {
  constructor(
    @inject(TYPES.ApiClient)
    private apiClient: ApiClient,
    @inject(TYPES.ApiEndpointProvider)
    private endpoints: ApiEndpointProvider
  ) {}

  private static readonly IMPACT_MAP: Record<string, 'HIGH' | 'MEDIUM' | 'LOW'> = {
    'ALTO': 'HIGH', 'HIGH': 'HIGH',
    'MEDIO': 'MEDIUM', 'MEDIUM': 'MEDIUM',
    'BAJO': 'LOW', 'LOW': 'LOW',
  };

  private static readonly SENTIMENT_MAP: Record<string, 'BULLISH' | 'BEARISH' | 'NEUTRAL'> = {
    'POSITIVO': 'BULLISH', 'BULLISH': 'BULLISH',
    'NEGATIVO': 'BEARISH', 'BEARISH': 'BEARISH',
    'NEUTRO': 'NEUTRAL', 'NEUTRAL': 'NEUTRAL',
  };

  private mapAnalysis(api: ApiAIAnalysis | null): AIAnalysis | null {
    if (!api) return null;

    let assets: string[] | undefined;
    if (Array.isArray(api.impacted_assets)) {
      assets = api.impacted_assets;
    } else if (typeof api.impacted_assets === 'string' && api.impacted_assets) {
      assets = [api.impacted_assets];
    }

    return {
      summary: api.summary,
      impact: EventRepositoryImpl.IMPACT_MAP[api.impact?.toUpperCase()] ?? 'LOW',
      sentiment: EventRepositoryImpl.SENTIMENT_MAP[api.sentiment?.toUpperCase()] ?? 'NEUTRAL',
      macroContext: api.macro_context,
      technicalLevels: api.technical_levels,
      tradingStrategies: api.trading_strategies,
      impactedAssets: assets,
    };
  }

  private mapEvent(api: ApiEvent): EconomicEvent {
    return {
      id: api.id,
      time: api.time,
      title: api.title,
      country: api.country,
      currency: api.currency,
      importance: ([1, 2, 3].includes(api.importance) ? api.importance : 1) as Importance,
      actual: api.actual,
      forecast: api.forecast,
      previous: api.previous,
      surprise: (api.surprise as Surprise) || null,
      url: api.url,
      aiAnalysis: this.mapAnalysis(api.ai_analysis),
    };
  }

  async getAllEvents(): Promise<EconomicEvent[]> {
    const response = await this.apiClient.get<ApiEvent[]>(this.endpoints.macro);
    return response.map(e => this.mapEvent(e));
  }

  async getFilteredEvents(filters?: EventFilters): Promise<FilteredEventsResult> {
    const params: Record<string, any> = {};
    if (filters?.importance) params.importance = filters.importance;
    if (filters?.country) params.country = filters.country;
    if (filters?.hasData !== undefined) params.has_data = filters.hasData;
    if (filters?.search) params.search = filters.search;

    const response = await this.apiClient.get<ApiFilteredEventsResponse>(
      this.endpoints.eventsFiltered,
      params
    );

    return {
      total: response.total,
      filtersApplied: {
        importance: response.filters_applied.importance ?? undefined,
        country: response.filters_applied.country ?? undefined,
        hasData: response.filters_applied.has_data ?? undefined,
        search: response.filters_applied.search ?? undefined,
      },
      events: response.events.map(e => this.mapEvent(e)),
    };
  }

  async getEventsByImportance(importance: number): Promise<EconomicEvent[]> {
    const response = await this.apiClient.get<{ events: ApiEvent[] }>(
      this.endpoints.eventsByImportance(importance)
    );
    return response.events.map(e => this.mapEvent(e));
  }

  async getUpcomingEvents(limit?: number): Promise<UpcomingEventsResult> {
    const response = await this.apiClient.get<ApiUpcomingResponse>(
      this.endpoints.eventsUpcoming,
      limit ? { limit } : undefined
    );
    return {
      currentTime: response.current_time,
      count: response.count,
      events: response.events.map(e => this.mapEvent(e)),
    };
  }

  async getHomeSummary(): Promise<HomeSummary> {
    const response = await this.apiClient.get<ApiHomeSummary>(this.endpoints.homeSummary);
    return {
      welcome: response.welcome,
      todayStats: {
        totalEvents: response.today_stats.total_events,
        highImpact: response.today_stats.high_impact,
        mediumImpact: response.today_stats.medium_impact,
        lowImpact: response.today_stats.low_impact,
      },
      nextEvent: response.next_event
        ? this.mapEvent(response.next_event)
        : null,
      marketSentiment: {
        overall: response.market_sentiment.overall,
        volatility: response.market_sentiment.volatility,
      },
      highlights: response.highlights.map(h => this.mapEvent(h)),
    };
  }

  async getDailyBriefing(): Promise<DailyBriefing> {
    const response = await this.apiClient.get<ApiBriefing>(this.endpoints.brief);
    return {
      generalOutlook: response.general_outlook,
      impactedAssets: response.impacted_assets,
      cautionaryHours: response.cautionary_hours,
      statistics: {
        sentiment: response.statistics.sentiment,
        volatilityLevel: response.statistics.volatility_level,
        totalEventsToday: response.statistics.total_events_today,
        highImpactCount: response.statistics.high_impact_count,
      },
    };
  }
}
