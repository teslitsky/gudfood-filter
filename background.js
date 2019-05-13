/* eslint-disable no-undef */
chrome.browserAction.onClicked.addListener(() => {
  const url = 'http://orders.gudfood.com.ua/order';
  chrome.tabs.create({ url, selected: true });
});
