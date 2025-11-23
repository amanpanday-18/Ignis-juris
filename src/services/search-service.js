import { AdvocateService } from './advocate-service';
import { JudgementService } from './judgement-service';
import { BareActService } from './bare-act-service';
import { NewsService } from './news-service';

export const SearchService = {
    // Perform a global search across all services
    async searchAll(query) {
        if (!query || query.trim() === '') {
            return {
                advocates: [],
                judgements: [],
                bareActs: [],
                news: []
            };
        }

        try {
            const [advocates, judgements, bareActs, news] = await Promise.all([
                AdvocateService.search(query).catch(() => []),
                JudgementService.search(query).catch(() => []),
                BareActService.getAll({ search: query }).catch(() => []),
                NewsService.search(query).catch(() => [])
            ]);

            return {
                advocates,
                judgements,
                bareActs,
                news,
                totalResults: advocates.length + judgements.length + bareActs.length + news.length
            };
        } catch (error) {
            console.error('Error performing search:', error);
            throw error;
        }
    }
};
