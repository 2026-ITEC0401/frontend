import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import CompleteHeader from "@/components/CompleteHeader";
import Button from "@/components/Button";
import { type AddressSearchResult } from "@/types/household";
import { mockAddressResults } from "@/mocks/household";

export default function HouseholdAddressPage() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<AddressSearchResult[]>([]);
  const [selected, setSelected] = useState<AddressSearchResult | null>(null);
  const [detail, setDetail] = useState("");
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    setSearched(true);
    setSelected(null);
    // 목업: "능동로" 포함하고 "9999" 없으면 결과 있음
    if (keyword.includes("능동로") && !keyword.includes("9999")) {
      setResults(mockAddressResults);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 pb-16">
      <CompleteHeader onSkip={() => navigate("/")} />

      {/* 공통 헤더 부분 (제목, 검색창) */}
      <div className="flex flex-1 flex-col gap-4 px-5 pt-4">
        {/* 제목 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-head-02 text-gray-500">집 주소 등록</h1>
          </div>
        </div>

        {/* 검색창 */}
        <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-4">
          <Search size={20} className="shrink-0 text-gray-500" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="도로명 또는 건물명"
            aria-label="주소 검색"
            className="h-15 w-full bg-transparent outline-none placeholder:text-gray-200"
          />
        </div>

        {/* 결과 영역 : 상태별로 분기하는 영역 (초기창, 1c, 1b, 1a) */}
        {selected ? (
          // 1c. 주소 선택 완료 (true)
          <div className="flex flex-col gap-3">
            <p className="text-subtitle-03 text-gray-500">선택한 주소</p>

            <div className="rounded-2xl border-2 border-main-200 bg-white p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-md bg-main-200 px-2 py-0.5 text-label-06 text-gray-500">
                  도로명
                </span>
                <span className="text-body-02 text-gray-300">
                  {selected.postal_code}
                </span>
              </div>
              <p className="text-subtitle-02 text-gray-500">
                {selected.road_address}
              </p>
              <p className="mt-1 text-body-02 text-gray-300">
                지번 · {selected.jibun_address}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelected(null)}
              className="self-start text-label-04 text-gray-300 underline"
            >
              다시 검색하기
            </button>

            <input
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="동 · 호수 입력 (선택)"
              aria-label="동 호수"
              maxLength={200}
              className="h-15 w-full rounded-xl border border-border bg-white px-4 outline-none placeholder:text-gray-200 focus:border-main-200"
            />

            <p className="text-body-03 text-gray-300">
              행정안전부 도로명주소 검색 기준
            </p>
          </div>
        ) : searched && results.length === 0 ? (
          // 1b. 검색 결과 없음
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center  rounded-2xl border-2 border-dashed border-gray-200 bg-white py-10 gap-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 mb-4">
                <Search size={24} className="text-gray-500" />
              </div>
              <p className="text-subtitle-01 text-gray-500">
                검색 결과가 없습니다
              </p>
              <p className="text-body-01 text-gray-300">
                도로명과 건물번호를 다시 확인해 주세요.
              </p>
            </div>
          </div>
        ) : results.length > 0 ? (
          // 1a. 검색 결과 목록
          <div className="flex flex-col gap-3">
            <p className="text-body-02 text-gray-300">
              검색 결과 {results.length}건
            </p>

            <div className="flex max-h-96 flex-col gap-2 overflow-y-auto pr-2">
              {results.map((item) => (
                <button
                  key={item.postal_code + item.road_address}
                  type="button"
                  onClick={() => setSelected(item)}
                  className="rounded-2xl border border-border bg-white p-4 text-left"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-md bg-main-200 px-2 py-0.5 text-label-06 text-gray-500">
                      도로명
                    </span>
                    <span className="text-body-01 text-gray-300">
                      {item.postal_code}
                    </span>
                  </div>
                  <p className="text-subtitle-02 text-gray-500">
                    {item.road_address}
                  </p>
                  <p className="mt-1 text-body-01 text-gray-300">
                    지번 · {item.jibun_address}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex-1" />
        {/* 안내 문구 */}
        <div className="rounded-xl border-2 border-main-200 bg-main-100 p-4">
          <p className="text-body-01 text-gray-500">
            건너뛰어도 계정은 유지되고,
            <br />
            다시 열면 이 화면부터 시작합니다.
          </p>
        </div>

        <Button
          variant="dark"
          onClick={() => navigate("/")}
          disabled={!selected}
        >
          이 주소로 등록
        </Button>
      </div>
    </div>
  );
}
