# 상세 구현 설계서 (add.md): Nh Ninja "World & Story" 아트 및 서사 설계

## 1. 환경 및 아트 시스템 (Ninja World Atmosphere)

### 1.1 Bright Parallax Background (밝은 다층 배경)
어두운 `0x050515` 단색 배경에서 벗어나, 생동감 있는 낮 시간대의 풍경을 코드로 그려냄.

- **Sky (하늘):** 화면 최하단 레이어. 위쪽은 짙은 푸른색(`0x4facfe`), 아래쪽은 밝은 하늘색(`0x00f2fe`)으로 그라데이션 렌더링.
- **Mountains (원경의 산):** 
    - `Phaser.Graphics`의 `fillPoints`를 이용해 연속된 뾰족한 다각형(Polygon)을 렌더링하여 웅장한 산맥 구성.
    - 색상: `0x7b92a6` (청회색)
    - 스크롤 속도: `0.1x` (가장 느리게 이동)
- **Clouds (중경의 뭉게구름):** 
    - `fillEllipse`와 `fillCircle`을 겹쳐 그린 푹신한 흰색 구름 스프라이트 템플릿 제작.
    - 스크롤 속도: `0.3x` + 자체 `TileSprite` x축 이동(바람을 타고 흘러가는 연출).

### 1.2 지형(Platforms)의 재디자인
- **기존:** 어두운 회색/검정 톤의 사각형.
- **변경:** 
    - 상단(Top): 밝은 녹색 잔디 (`0x32cd32`).
    - 하단(Bottom): 황토색 흙 (`0x8b4513`).
    - 측면 디테일 추가를 통해 동양적인 흙길과 풀밭 연출.

### 1.3 벚꽃 파티클 엔진 (Cherry Blossom Effects)
- 연분홍색(`0xffb7c5`)과 진분홍색(`0xff69b4`)의 2x2, 3x3 픽셀을 생성.
- `Phaser.GameObjects.Particles`를 사용하여 화면 우측 상단에서 좌측 하단으로 상시 흩날리도록 구성.
- `gravityY`, `gravityX`, `rotate`, `alpha` 값에 랜덤성을 부여하여 자연스러운 바람 효과 구현.

## 2. 서사 및 컷씬 시스템 (Storytelling & Cutscenes)

새로운 씬인 `StoryScene`을 `SelectScene`과 `GameScene` 사이에 추가함.

### 2.1 시나리오 스크립트 (Dialogue Data)
- **배경 스토리:** "탈주 닌자들이 마을의 금지된 두루마리(Forbidden Scroll)를 훔쳐 달아났다."
- **대사 데이터 구조:**
  ```json
  [
    { speaker: "HOKAGE", text: "마을의 금지된 두루마리를 탈취당했다..." },
    { speaker: "YOU", text: "제가 반드시 되찾아 오겠습니다!" },
    { speaker: "HOKAGE", text: "서둘러라! 그들이 국경을 넘기 전에!" }
  ]
  ```

### 2.2 대화창 UI (Dialogue Box)
- **구조:** 화면 하단(Y: 450~600)에 검은색 반투명(`0x000000, 0.8`) 박스. 흰색 테두리(`0xffffff`).
- **타이핑 애니메이션 (Typewriter Effect):** 대사가 한 글자씩(약 30ms 간격) 출력되어 몰입감 제공.
- **상호작용:** 마우스 클릭 또는 `Space` 키 입력 시 다음 대사로 넘어가거나, 타이핑 중일 땐 즉시 전체 문장 출력.
- 대사가 모두 끝나면 화면이 암전(Fade Out)되며 밝은 `GameScene`으로 전환.

## 3. 오디오 및 감각(Feel) 연출
- **스토리 씬:** 진지하고 장엄한 분위기의 음악.
- **게임 씬:** 기존의 경쾌한 음악에 밝은 그래픽이 결합되어 '모험'의 느낌 극대화.
- 스킬 해금 등 중요한 순간에 사운드 피드백(혹은 시각적 Flash 효과) 강화.
