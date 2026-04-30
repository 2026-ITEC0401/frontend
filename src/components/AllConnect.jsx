import styled from "@emotion/styled";

export default function AllConnect() {
  return (
    <Container>
      <Text>시스템 전체연결</Text>
      <ToggleButton>
        <div className="handle" />
      </ToggleButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #41444b;
  padding: 0px 20px;
`;

const ToggleButton = styled.button`
  width: 90px;
  height: 32px;
  border-radius: 30px;
  background-color: #24262a;
  border: none;
  cursor: pointer;

  display: flex;
  align-items: center;
  padding: 4px;

  .handle {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #ffffff;

    /* 💡 핵심: 동그라미를 오른쪽으로 밀어내는 속성 (현재 켜져있는 상태 구현) */
    transform: translateX(0px);
    transition: transform 0.2s ease-in-out;
    /* 나중에 클릭 시 부드럽게 움직이도록 애니메이션 추가 */
  }
`;

const Text = styled.p`
  color: #ffffff;
  font-size: 24px;
  font-weight: 500;
`;
