import styled from "@emotion/styled";

// children : 페이지들
export default function AppLayout({ children }) {
  return <MobileContainer>{children}</MobileContainer>;
}

const MobileContainer = styled.div`
  width: 100%;
  max-width: 390px;
  min-height: 100vh;
  margin: 0 auto;
  background-color: #c0c0c0;
  position: relative;
  overflow: auto;
`;
