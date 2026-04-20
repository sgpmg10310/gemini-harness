# 상세 구현 설계서 (add.md): Nh Ninja V4.3 (에셋 독립형 절차적 생성 및 시스템 안정화)

## 1. 캐릭터 절차적 생성(Procedural Generation) 전략

### 1.1 외부 리소스 의존성 제거
- **배경:** 외부 이미지 로딩 방식은 네트워크 상태나 CORS 정책에 따라 게임이 중단되는 위험이 큼.
- **해결책:** Phaser Graphics API를 사용하여 런타임에 캐릭터 텍스처를 직접 드로잉하고 캐싱함.

### 1.2 절차적 생성 워크플로우 (PreloadScene)
1. `Graphics` 객체 생성: `this.add.graphics()`
2. 캐릭터 데이터(좌표, 색상)를 기반으로 `draw` 루틴 실행 (원, 사각형, 다각형 조합).
3. 텍스처 생성: `graphics.generateTexture('char_key', width, height)`
4. 캐시 등록: 생성된 텍스처는 전역 `TextureManager`에 등록되어 `GameScene`에서 즉시 사용 가능.
5. 메모리 최적화: 텍스처 생성 후 임시 `Graphics` 객체는 `destroy()` 처리.

## 2. 캐릭터 시각 요소 데이터 구조 (Character Data Spec)

캐릭터별 고유성을 보장하기 위해 머리카락, 피부, 의상, 특징점(눈매 등)을 정의하는 색상 및 좌표 데이터를 관리함.

### 2.1 공통 물리 규격
- **크기:** 32x32 픽셀 (Hitbox 기준)

### 2.3 캐릭터별 디자인 데이터 (Visual Data Structure)
- **나루토 (NARUTO):**
  - **Skin (피부):** 0xFFDBAC (원형)
  - **Hair (머리카락):** 0xFFFF00 (노랑색, 뾰족한 삼각형 형태 상단 배치)
  - **Clothes (의상):** 0xFFA500 (주황색 사각형 하단 배치)
  - **Features (특징):** 0x000000 (양쪽 볼 수염 3줄 라인 드로잉)
- **사스케 (SASUKE):**
  - **Skin (피부):** 0xFFDBAC
  - **Hair (머리카락):** 0x2C2C2C (검정색, 비대칭 삼각형 형태)
  - **Clothes (의상):** 0x4B0082 (진보라색/남색 계열)
  - **Features (특징):** 0xFF0000 (붉은색 픽셀로 사륜안 표현)
- **사쿠라 (SAKURA):**
  - **Skin (피부):** 0xFFDBAC
  - **Hair (머리카락):** 0xFFC0CB (분홍색, 둥근 형태)
  - **Clothes (의상):** 0xFF0000 (빨간색 상의)
- **카카시 (KAKASHI):**
  - **Skin (피부):** 0xFFDBAC
  - **Hair (머리카락):** 0xD3D3D3 (은색, 위로 뻗은 삼각형 형태)
  - **Clothes (의상):** 0x006400 (짙은 녹색 조끼), 0x000080 (남색 하의)
  - **Features (특징):** 0x000000 (하단 얼굴 절반 마스크 처리)

## 3. 사망 및 게임 종료 로직 (Physics Integrity)

### 3.1 물리 엔진 인터럽트 무결성 보장
- **문제:** 캐릭터 사망 시 애니메이션 재생 중 물리 연산이 지속되어 위치가 틀어지거나 중복 충돌이 발생하는 현상 방지.
- **해결책 (Interrupt Protocol):**
  1. `die()` 이벤트 발생 시 즉시 `this.body.enable = false` 설정 (충돌 판정 제외).
  2. `this.body.setVelocity(0, 0)` 및 `setAcceleration(0, 0)` 호출 (관성 제거).
  3. 모든 물리 타이머(Tweens, Timers) 중단.

### 3.2 게임 종료 시퀀스
- `Scene` 전체의 물리 엔진을 일시 정지(`physics.pause()`)하기 전, 플레이어 캐릭터의 상태를 '사망(Dead)'으로 먼저 변경하여 상태 일관성 확보.

## 4. 변경 이력
- **V4.0:** 기본 게임 엔진 구축.
- **V4.1:** CORS 우회 프록시 도입 (외부 리소스 유지).
- **V4.3:** Phaser Graphics 기반 절차적 생성 시스템 도입 (외부 리소스 완전 독립), 물리 인터럽트 로직 강화.
