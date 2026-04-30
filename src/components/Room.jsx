import styled from "@emotion/styled";

export default function Room({ name, isConnected }) {
  return (
    <Card>
      <RoomName>{name}</RoomName>

      <Status isConnected={isConnected}>
        <div className="dot" />
        <span className="text">{isConnected ? "연결됨" : "연결대기"}</span>
      </Status>
      <Sensing>{isConnected ? "((( 감지중 )))" : ""}</Sensing>
    </Card>
  );
}

const Card = styled.div`
  height: 120px;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
`;
const RoomName = styled.h3`
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #000000;
  line-height: 1.2;
`;
const Status = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;

    background-color: ${(props) => (props.isConnected ? "#34C759" : "#FF3B30")};
  }
  .text {
    font-size: 20px;
    font-weight: 700;
    color: #000000;
  }
`;
const Sensing = styled.div`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #a0a0a0;
  min-height: 22px;
`;
