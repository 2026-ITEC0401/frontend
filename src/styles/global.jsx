import { Global, css } from "@emotion/react";

const globalStyle = css`
  @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css");

  body {
    margin: 0;
    padding: 0;
    background-color: #ffffff;

    font-family:
      "Pretendard Variable",
      Pretendard,
      -apple-system,
      BlinkMacSystemFont,
      system-ui,
      Roboto,
      "Helvetica Neue",
      "Segoe UI",
      "Apple SD Gothic Neo",
      "Noto Sans KR",
      "Malgun Gothic",
      "Apple Color Emoji",
      "Segoe UI Emoji",
      "Segoe UI Symbol",
      sans-serif;

    *,
    *::before,
    *::after {
      font-family: inherit;
    }
  }
`;

export default function GlobalStyle() {
  return <Global styles={globalStyle} />;
}
