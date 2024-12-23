// frontend/src/services/localEtymologyData.js

export const LOCAL_ETYMOLOGY_DATA = {
  pieRoots: {
    '*bher-': {
      meaning: 'to carry, bring',
      descendants: {
        latin: ['ferre', 'fertile', 'transfer'],
        greek: ['pherein', 'phosphorus'],
        germanic: ['bear', 'birth'],
        sanskrit: ['bharati']
      }
    },
    '*weid-': {
      meaning: 'to see, to know',
      descendants: {
        latin: ['videre', 'vision', 'video'],
        greek: ['idein', 'idea'],
        germanic: ['wit', 'wise'],
        sanskrit: ['veda']
      }
    },
    '*ped-': {
      meaning: 'foot',
      descendants: {
        latin: ['pes', 'pedal', 'pedestrian'],
        greek: ['pous', 'podium'],
        germanic: ['foot', 'fetch'],
        sanskrit: ['pad']
      }
    },
    '*gherd-': {
      meaning: 'enclosure, yard',
      descendants: {
        latin: ['hortus', 'garden'],
        greek: ['khortos'],
        germanic: ['garden', 'yard'],
        slavic: ['gorod']
      }
    }
  },

  historicalForms: {
    'heart': {
      'Proto-Germanic': '*hertō',
      'West Germanic': '*herta',
      'Old English': 'heorte',
      'Middle English': 'herte',
      'Early Modern English': 'heart',
      'Modern English': 'heart'
    },
    'house': {
      'Proto-Germanic': '*hūsą',
      'West Germanic': '*hūs',
      'Old English': 'hūs',
      'Middle English': 'hous',
      'Early Modern English': 'house',
      'Modern English': 'house'
    },
    'water': {
      'Proto-Germanic': '*watōr',
      'West Germanic': '*water',
      'Old English': 'wæter',
      'Middle English': 'water',
      'Early Modern English': 'water',
      'Modern English': 'water'
    }
  },

  soundChanges: {
    'Proto-Germanic': {
      description: "Grimm's Law consonant shifts",
      examples: [
        'p > f',
        't > þ',
        'k > h',
        'b > p',
        'd > t',
        'g > k'
      ]
    },
    'West Germanic': {
      description: 'Loss of word-final -z',
      examples: ['*dagaz > *dag']
    },
    'Old English': {
      description: 'I-mutation and breaking of vowels',
      examples: ['*mūs > mȳs', '*fallan > feallan']
    }
  },

  modernCognates: {
    'heart': {
      'German': 'Herz',
      'Dutch': 'hart',
      'Swedish': 'hjärta',
      'Danish': 'hjerte'
    },
    'house': {
      'German': 'Haus',
      'Dutch': 'huis',
      'Swedish': 'hus',
      'Danish': 'hus'
    },
    'water': {
      'German': 'Wasser',
      'Dutch': 'water',
      'Swedish': 'vatten',
      'Danish': 'vand'
    }
  },

  semanticDevelopment: {
    'nice': [
      'From Latin "nescius" (ignorant)',
      'Old French "nice" (silly, simple)',
      'Middle English (foolish)',
      'Early Modern English (precise, careful)',
      'Modern English (pleasant, agreeable)'
    ],
    'silly': [
      'Old English "sælig" (blessed, happy)',
      'Middle English "seely" (innocent, weak)',
      'Early Modern English (helpless, simple)',
      'Modern English (foolish, absurd)'
    ]
  },

  findPIERoot(word) {
    word = word.toLowerCase();
    for (const [root, info] of Object.entries(this.pieRoots)) {
      for (const descendants of Object.values(info.descendants)) {
        if (descendants.some(desc => desc.toLowerCase() === word || word.includes(desc.toLowerCase()))) {
          return {
            root,
            meaning: info.meaning,
            descendants: info.descendants
          };
        }
      }
    }
    return null;
  },

  getEvolution(word) {
    word = word.toLowerCase();
    if (this.historicalForms[word]) {
      return Object.entries(this.historicalForms[word]).map(([period, form]) => ({
        period,
        form,
        years: this.getYearsForPeriod(period),
        changes: this.soundChanges[period]?.description || null
      }));
    }
    return null;
  },

  getCognates(word) {
    return this.modernCognates[word.toLowerCase()] || null;
  },

  getSemanticDevelopment(word) {
    return this.semanticDevelopment[word.toLowerCase()] || null;
  },

  getYearsForPeriod(period) {
    const periods = {
      'Proto-Germanic': '500 BCE-200 CE',
      'West Germanic': '200-500 CE',
      'Old English': '500-1100 CE',
      'Middle English': '1100-1500 CE',
      'Early Modern English': '1500-1800 CE',
      'Modern English': '1800-present'
    };
    return periods[period] || '';
  }
};