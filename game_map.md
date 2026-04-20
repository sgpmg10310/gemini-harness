# 최종 게임 구성도 (game_map.md) - Nh Ninja V4

## 1. 월드 구조 (World Structure)
- **전체 너비:** 8,000px (횡스크롤 액션 최적화)
- **전체 높이:** 600px
- **배경 테마:** 사막 유적 (Desert Ruins)
- **지형:** `0xEDC9AF` 색상의 샌드 플랫폼이 800px 단위로 연속 배치됨.

## 2. 스테이지 진행 (Stage Flow)
1. **Title Scene:** 'START MISSION' 버튼을 통한 진입.
2. **Select Scene:** 4종의 닌자(나루토, 사스케, 사쿠라, 카카시) 중 선택.
3. **Game Scene:**
    - **0px ~ 1,000px:** 튜토리얼 영역 (기본 조작 및 S 점프 테스트).
    - **1,000px ~ 7,500px:** 닌자 부대 교전 지역 (30명의 적 닌자 동적 스폰).
    - **7,500px ~ 8,000px:** 보스 전용 구역 (Ultimate Shinobi Boss 등장).
4. **Result Scene:** 미션 성공 시 'Mission Complete' 출력 후 선택 화면으로 복귀.

## 3. 캐릭터 및 시스템 명세
### 3.1 플레이어 (High-Res Assets)
- **나루토:** 밸런스형, 주황색 테마.
- **사스케:** 고속 이동형, 보라색 테마.
- **사쿠라:** 방어 및 생존형, 핑크색 테마.
- **카카시:** 기술 특화형, 녹색 테마.

### 3.2 핵심 스킬 (QWASE System)
- **Q (Special 1):** 물리 엔진 기반 전방 대시 공격 (챠크라 40).
- **W (Kunai):** 직선 투사체 발사 (원거리 공격).
- **E (Special 2):** 원형 범위 폭발 공격 (챠크라 50).
- **A (Guard):** 무적 판정 및 가드 상태 (실시간 활성화).
- **S (Jump):** 2단 점프 물리 핸들링.

## 4. 적 유닛 (Enemy Units)
- **Enemy Type 1:** 기본 보병 닌자.
- **Enemy Type 2:** 정예 닌자 (높은 이동 속도).
- **Final Boss:** 대형 체력바를 가진 보스 캐릭터 (7,800px 지점 상주).

## 5. 전역 상태 변수
- `playerScore`: 적 처치 시 50점 누적.
- `playerHP`: 0 도달 시 타이틀 화면으로 패배 복귀.
- `playerChakra`: 자동 회복(초당 12), 스킬 사용 시 소모.
- `isMissionComplete`: 보스 처치 시 True 전환 및 무적 부여.
