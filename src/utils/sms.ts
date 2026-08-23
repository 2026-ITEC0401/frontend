// sms:·tel: 딥링크는 플랫폼마다 구분자와 다중 수신자 표기가 다르다.
// iOS  : sms:번호&body=...            / 다중 sms:/open?addresses=번호,번호&body=...
// 그 외 : sms:번호?body=...            / 다중 sms:번호,번호?body=...

function isIOS(): boolean {
  const ua = navigator.userAgent;
  // iPadOS 13+ 는 Mac으로 보고하므로 터치 지원 여부로 함께 판별한다
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (ua.includes("Mac") && navigator.maxTouchPoints > 1)
  );
}

export function isIOSDevice(): boolean {
  return isIOS();
}

export function buildSmsHref(recipients: string[], body?: string): string {
  const to = recipients.join(",");
  const isMulti = recipients.length > 1;

  if (isIOS()) {
    const base = isMulti ? `sms:/open?addresses=${to}` : `sms:${to}`;
    if (!body) return base;
    // 단일·다중 모두 iOS는 구분자로 &를 쓴다
    return `${base}&body=${encodeURIComponent(body)}`;
  }

  if (!body) return `sms:${to}`;
  return `sms:${to}?body=${encodeURIComponent(body)}`;
}
