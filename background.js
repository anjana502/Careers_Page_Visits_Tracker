const CAREER_KEYWORDS = ["careers", "jobs", "openings", "hiring", "vacancies", "workday", "greenhouse", "lever.co", "ashbyhq"];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;

  const url = new URL(tab.url);
  const domain = url.hostname;
  const fullUrl = url.origin + url.pathname;
  const isCareerPage = CAREER_KEYWORDS.some(k => tab.url.toLowerCase().includes(k));

  if (!isCareerPage) return;

  chrome.storage.local.get(["visits"], (result) => {
    const visits = result.visits || {};
    const now = Date.now();

    const thirtyDays = 3 * 86400000;
    for (const url in visits) {
      if (now - visits[url].lastVisit > thirtyDays) {
        delete visits[url];
      }
    }

    if (visits[fullUrl]) {
  const lastVisit = visits[fullUrl].lastVisit;
  const daysAgo = Math.floor((now - lastVisit) / 86400000);
  const visitCount = visits[fullUrl].visitCount;
  const msg = daysAgo === 0
    ? `You visited this page earlier today. (${visitCount} total visits)`
    : `You last visited ${daysAgo} day(s) ago. (${visitCount} total visits)`;

  // Badge
  chrome.action.setBadgeText({ text: `${visitCount}`, tabId });
  chrome.action.setBadgeBackgroundColor({ color: daysAgo > 7 ? "#22c55e" : "#f59e0b" });

  // Pop-up notification
  chrome.notifications.create(`visit_${tabId}_${now}`, {
    type: "basic",
    iconUrl: "icons/icon128.png",
    title: "Career Site Revisit",
    message: msg,
    priority: 2
  });
}

    // Update visit record
    visits[fullUrl] = {
      lastVisit: now,
      domain,
      title: tab.title || domain,
      visitCount: (visits[fullUrl]?.visitCount || 0) + 1,
    };
    chrome.storage.local.set({ visits });
  });
});
