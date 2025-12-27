import gintest from './gintest';
import SignCard from '../SignCard';
import SignCardDark from '../SignCardDark';

export const templates = {
  'Light': SignCard,
  'Dark': SignCardDark,
  'Standard': SignCard, // Keep for backward compat
  'gintest': gintest,
};
