import styled from "@emotion/styled";
import livingRoom from "@/assets/living.svg";
import bedRoom from "@/assets/bed.svg";
import bathRoom from "@/assets/wash.png";
import frontDoor from "@/assets/door.svg";

const roomImages = {
  거실: livingRoom,
  안방: bedRoom,
  화장실: bathRoom,
  현관: frontDoor,
};

export default function Room({ name, isConnected }) {
  return (
    <Card>
      <ImgWrapper>
        <Img src={roomImages[name]} alt={`${name} 아이콘`} roomName={name} />
      </ImgWrapper>
      <Info>
        <TextWrapper>
          <Status isConnected={isConnected}>
            <div className="dot" />
          </Status>
          <RoomName>{name}</RoomName>
        </TextWrapper>
      </Info>
    </Card>
  );
}
const Img = styled.img`
  max-height: 100%;
  object-fit: contain;
`;
const TextWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;
const Info = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Card = styled.div`
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
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  line-height: 1.2;
`;
const Status = styled.div`
  /* 점을 공중에 띄워서 TextWrapper의 왼쪽 바깥으로 밀어냅니다 */
  position: absolute;
  right: 100%;
  margin-right: 8px; /* 기존의 gap 역할을 대신합니다 */

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${(props) => (props.isConnected ? "#34C759" : "#FF3B30")};
  }
`;

const ImgWrapper = styled.div`
  height: 90px; /* 가장 키가 큰 이미지(현관 도어락)가 들어갈 수 있을 만큼의 넉넉한 고정 높이를 줍니다. */
  width: 100%;
  display: flex;
  align-items: center; /* 이미지가 박스 안에서 세로 중앙에 오게 합니다 */
  justify-content: center; /* 가로 중앙 정렬 */
`;
