chrome.action.onClicked.addListener(async () => {
  const url = 'https://orders.gudfood.com.ua/order';
  await chrome.tabs.create({ url, active: true });
});
