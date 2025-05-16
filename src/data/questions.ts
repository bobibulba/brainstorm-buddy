import { Question } from '../types';

export const questions: Question[] = [
  {
    id: 'problem',
    text: 'What problem does your app solve?',
    category: 'Problem',
    placeholder: 'E.g., "People struggle to find healthy recipes that match their dietary restrictions"'
  },
  {
    id: 'audience',
    text: 'Who will use your app?',
    category: 'Audience',
    placeholder: 'E.g., "Health-conscious individuals with dietary restrictions"'
  },
  {
    id: 'benefit',
    text: 'What\'s the main benefit of your app?',
    category: 'Value',
    placeholder: 'E.g., "Saves time finding suitable recipes and reduces frustration"'
  },
  {
    id: 'features',
    text: 'What are 1-2 key features?',
    category: 'Features',
    placeholder: 'E.g., "Recipe filtering by multiple dietary needs, personalized recommendations"'
  },
  {
    id: 'uniqueness',
    text: 'How will your app be unique?',
    category: 'Differentiation',
    placeholder: 'E.g., "Combines dietary filtering with taste preferences unlike other recipe apps"'
  },
  {
    id: 'goal',
    text: 'What\'s your goal for the app?',
    category: 'Vision',
    placeholder: 'E.g., "Help people enjoy cooking despite dietary restrictions"'
  },
  {
    id: 'monetization',
    text: 'How might you monetize this app?',
    category: 'Business',
    placeholder: 'E.g., "Freemium model with premium recipes and meal planning features"'
  },
  {
    id: 'challenges',
    text: 'What challenges do you anticipate?',
    category: 'Challenges',
    placeholder: 'E.g., "Building a large enough recipe database to be useful"'
  }
];
