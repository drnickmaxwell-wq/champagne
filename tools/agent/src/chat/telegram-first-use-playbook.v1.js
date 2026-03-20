const {
  createCapabilityDeck,
  hasUnsafeSuggestion,
  isHelpRequest,
  renderCapabilityDeck,
} = require('./telegram-capability-deck.v1');

function createOnboardingMessage() {
  const deck = createCapabilityDeck();
  return {
    trigger: 'onboarding',
    title: 'Champagne Telegram Onboarding',
    body: renderCapabilityDeck(deck),
    approvalNote:
      'Queued actions remain pending until you explicitly approve them. Help text does not auto-approve anything.',
  };
}

function resolveTelegramFirstUseResponse(input = '') {
  if (!isHelpRequest(input)) {
    return null;
  }

  const onboarding = createOnboardingMessage();

  if (hasUnsafeSuggestion(onboarding.body)) {
    throw new Error('Unsafe suggestion detected in onboarding output.');
  }

  return onboarding;
}

module.exports = {
  createOnboardingMessage,
  resolveTelegramFirstUseResponse,
};
