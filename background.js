/* eslint-disable no-undef */
chrome.browserAction.onClicked.addListener(() => {
  const url = 'https://orders.gudfood.com.ua/order';
  chrome.tabs.create({ url, active: true });
});
