# Nh Ninja V4.2 (Emergency Patch) 시스템 구성도

## 1. 아키텍처 개요
Nh Ninja는 Phaser 3 게임 엔진을 기반으로 하는 웹 브라우저 게임입니다. 씬(Scene) 기반 아키텍처를 사용하여 게임의 흐름을 관리하며, 상태 기반 렌더링을 통해 자산 로딩 상태에 유연하게 대응합니다.

## 2. 파일 구조
- `index.html`: 게임 컨테이너 및 외부 라이브러리(Phaser) 로드.
- `styles.css`: 레이아웃 스타일 및 배경 애니메이션.
- `script.js`: 게임의 핵심 로직 (씬 관리, 물리 엔진, 캐릭터 제어).

## 3. 주요 컴포넌트 및 흐름
1. **PreloadScene**: 자산 프리로딩, 로딩 진행 바, 로드 에러 처리 및 타임아웃.
2. **TitleScene**: 메인 메뉴, 애니메이션 타이틀, 시작 버튼.
3. **SelectScene**: 캐릭터 선택 시스템, 동적 폴백 렌더링.
4. **GameScene**: 
   - **Physics**: Arcade Physics 기반 충돌 및 이동 처리.
   - **Entities**: 플레이어, 적(Enemy), 쿠나이(Projectile).
   - **UI**: 동적 HP Bar, 점수 시스템.
   - **Logic**: 실시간 HP 체크, 게임 오버 시퀀스(`isGameOver` 플래그).

## 4. 데이터 흐름
- `ASSETS` 상수를 통해 외부 자산 URL 관리.
- `chars` 배열을 통해 캐릭터 속성(이름, 색상, 설명) 관리.
- `spawnData`를 통해 적 유닛의 위치 기반 동적 스폰 관리.

## 5. 예외 처리 시스템
- **Asset Fallback**: 이미지가 없는 경우 `graphics`와 `tint`를 이용한 대체 렌더링.
- **Network Safety**: 로딩 실패 시 10초 후 강제 시작.
- **State Integrity**: `isGameOver` 상태 변수를 통한 씬 전환 무결성 보장.
