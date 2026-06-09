import styled from "@emotion/styled";
import userImg from "@/assets/user.svg";
import alertImg from "@/assets/alert-main.svg";

export default function TopHeader({ userName }) {
  return (
    <Container>
      <Info>
        <Profile src={userImg}></Profile>
        <Text>
          안녕하세요
          <br />
          <span>{userName}</span>님
        </Text>
      </Info>
      <Alert src={alertImg}></Alert>
    </Container>
  );
}

const Container = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
  align-items: center;
`;

const Profile = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 100%;
  cursor: pointer;
`;

const Text = styled.p`
  margin: 0;
  padding: 0;
  line-height: 1.35;
  color: #ffffff;
  font-size: 14px;
  font-weight: 300;

  span {
    font-weight: 600;
  }
`;
const Alert = styled.img`
  cursor: pointer;
`;
const Info = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  justify-content: center;
  align-items: center;
`;
