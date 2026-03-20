const test = require('node:test');
const assert = require('node:assert/strict');
const {
  createCapabilityDeck,
  hasUnsafeSuggestion,
  renderCapabilityDeck,
} = require('./telegram-capability-deck.v1');
const {
  createOnboardingMessage,
  resolveTelegramFirstUseResponse,
} = require('./telegram-first-use-playbook.v1');

test('renders the required help sections', () => {
  const rendered = renderCapabilityDeck(createCapabilityDeck());

  assert.match(rendered, /What the system can do/);
  assert.match(rendered, /What the system cannot do/);
  assert.match(rendered, /Safe command examples/);
  assert.match(rendered, /Prompt examples/);
  assert.match(rendered, /Queue and approvals/);
  assert.match(rendered, /approve 42/);
  assert.match(rendered, /Help me understand what this assistant can do\./);
});

test('keeps onboarding help free of unsafe suggestions', () => {
  const onboarding = createOnboardingMessage();

  assert.equal(hasUnsafeSuggestion(onboarding.body), false);
  assert.match(onboarding.approvalNote, /Queued actions remain pending/);
});

test('serves help and onboarding triggers only', () => {
  assert.equal(resolveTelegramFirstUseResponse('help')?.trigger, 'onboarding');
  assert.equal(resolveTelegramFirstUseResponse('/help')?.trigger, 'onboarding');
  assert.equal(resolveTelegramFirstUseResponse('onboarding')?.trigger, 'onboarding');
  assert.equal(resolveTelegramFirstUseResponse('book appointment'), null);
});
