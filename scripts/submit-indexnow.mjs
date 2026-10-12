#!/usr/bin/env node
/**
 * Submit changed URLs to IndexNow (Bing / Yandex / etc.).
 * Requires the key file to be live at https://genjutsu.online/{key}.txt
 */
const SITE = "https://genjutsu.online";
const KEY = "c7bbca6cfad0957619cafe1363f0aef4";

const URL_LIST = [
  `${SITE}/`,
  `${SITE}/guides`,
  `${SITE}/guides/what-can-genjutsu-do`,
  `${SITE}/guides/how-to-use-genjutsu`,
  `${SITE}/motion-transfer`,
  `${SITE}/pricing`,
  `${SITE}/genjutsu`,
  `${SITE}/examples`,
  `${SITE}/sitemap.xml`,
];

async function pingSitemaps() {
  const sitemap = `${SITE}/sitemap.xml`;
  const pings = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemap)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemap)}`,
  ];
  for (const url of pings) {
    try {
      const res = await fetch(url, { method: "GET", redirect: "follow" });
      console.log(`sitemap ping ${url.split("?")[0]} → ${res.status}`);
    } catch (err) {
      console.error(`sitemap ping failed: ${url}`, err.message);
    }
  }
}

async function submitIndexNow() {
  const keyCheck = await fetch(`${SITE}/${KEY}.txt`);
  const keyBody = (await keyCheck.text()).trim();
  if (!keyCheck.ok || keyBody !== KEY) {
    throw new Error(
      `IndexNow key file not live yet (${keyCheck.status}). Deploy first, then re-run.`,
    );
  }

  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
  ];
  const body = {
    host: "genjutsu.online",
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList: URL_LIST,
  };

  for (const endpoint of endpoints) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
    const text = await res.text().catch(() => "");
    console.log(
      `IndexNow ${endpoint} → ${res.status}${text ? ` ${text.slice(0, 200)}` : ""}`,
    );
  }
}

await pingSitemaps();
try {
  await submitIndexNow();
} catch (err) {
  console.error(String(err.message || err));
  process.exitCode = 1;
}
