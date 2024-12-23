// frontend/src/services/etymologyService.js

// frontend/src/services/etymologyService.js

import { etymologyAPI } from './etymologyAPI';
import { LOCAL_ETYMOLOGY_DATA } from './localEtymologyData'; // We'll create this next
//import {analyzeWord} from './etymologyService.js'

export class EtymologyService {
  async getWordEtymology(word) {
    try {
      // First try to get data from external API
      const apiData = await etymologyAPI.getWordEtymology(word);
      if (apiData) {
        return this.formatApiData(apiData);
      }

      // Fall back to local data if API fails or returns no data
      return this.getLocalEtymology(word);
    } catch (error) {
      console.error('Etymology service error:', error);
      return this.getLocalEtymology(word);
    }
  }

  formatApiData(apiData) {
    // This will convert external API data to match your expected format
    return {
      word: apiData.word,
      pie: apiData.protoIndoEuropeanRoot,
      evolution: this.formatEvolutionData(apiData.evolution),
      modernCognates: apiData.cognates,
      semanticDevelopment: apiData.meaningDevelopment
    };
  }

  getLocalEtymology(word) {
    // Your existing local etymology logic
    return {
      word,
      pie: LOCAL_ETYMOLOGY_DATA.findPIERoot(word),
      evolution: LOCAL_ETYMOLOGY_DATA.getEvolution(word),
      modernCognates: LOCAL_ETYMOLOGY_DATA.getCognates(word),
      semanticDevelopment: LOCAL_ETYMOLOGY_DATA.getSemanticDevelopment(word)
    };
  }

  formatEvolutionData(evolution) {
    // Convert API evolution data to your format
    return evolution?.map(stage => ({
      period: stage.timePeriod,
      years: stage.dateRange,
      form: stage.wordForm,
      changes: stage.soundChanges
    })) || [];
  }
}

export const etymologyService = new EtymologyService();

