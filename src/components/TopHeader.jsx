import styled from "@emotion/styled";
import logoImg from "@/assets/logo.svg";
import userImg from "@/assets/user.svg";

export default function TopHeader() {
  return (
    <Container>
      <Logo src={logoImg}></Logo>
      <Profile src={userImg}></Profile>
    </Container>
  );
}

const Container = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Logo = styled.img`
  width: auto;
  cursor: pointer;
`;
const Profile = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #d9d9d9;
  cursor: pointer;
  object-fit: cover;
`;
