import Header from "@/components/Header";

// 설정 메인의 메뉴는 모두 노출하되, 아직 구현 전인 화면은 이 자리표시자로 연결한다.
// 화면 구현이 끝나면 App.tsx 라우트를 실제 페이지로 교체한다.
export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 pb-25">
      <Header title={title} />
      <div className="flex flex-1 items-center justify-center text-body-01 text-gray-300">
        준비 중인 화면이에요.
      </div>
    </div>
  );
}
