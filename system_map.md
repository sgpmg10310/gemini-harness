# Nh Ninja V4.3 (Procedural Mastery) 시스템 구성도

## 1. 아키텍처 개요
Nh Ninja V4.3은 Phaser 3 게임 엔진을 기반으로 하며, 외부 이미지 리소스에 대한 의존성을 100% 제거한 **'에셋 독립형 절차적 생성(Procedural Generation)'** 아키텍처를 채택하고 있습니다. 모든 캐릭터와 적 유닛은 런타임에 코드로 드로잉되어 텍스처로 캐싱됩니다.

## 2. 파일 구조
- `index.html`: 게임 컨테이너 및 Phaser-Arcade-Physics 라이브러리 로드.
- `styles.css`: 모던한 UI 레이아웃, 배경 그라디언트 애니메이션.
- `script.js`:
    - `TextureGenerator`: Graphics API를 사용한 캐릭터/적/쿠나이 텍스처 생성 클래스.
    - `PreloadScene`: 런타임 텍스처 생성 및 필수 오디오 프리로딩.
    - `TitleScene`: 메인 메뉴 및 사운드 관리.
    - `SelectScene`: 캐릭터 선택 인터페이스 및 데이터 전달.
    - `GameScene`: 핵심 게임 루프, 물리 인터럽트, 스코어링 시스템.

## 3. 주요 컴포넌트 및 로직
1. **TextureGenerator (Core)**:
    - `drawCharacter()`: 캐릭터별 고유 외형(머리카락, 의상, 눈, 서클렛, 특수 효과)을 기하학적 도형으로 구현.
    - `generateTexture()`: 생성된 그래픽을 비트맵 텍스처로 전환하여 렌더링 성능 최적화.
2. **Enhanced Physics (Stability)**:
    - **Interrupt Protocol**: HP 0 또는 낙사 발생 시 `isGameOver` 플래그 활성화 및 `this.player.body.setEnable(false)`를 호출하여 물리 연산을 즉시 중단.
    - **Collision Logic**: 플레이어-적, 쿠나이-적 간의 오버랩 판정 및 데미지 시스템.
3. **Scene State Management**:
    - `init(data)`를 통한 씬 간 캐릭터 속성 데이터의 안정적 전송.
    - `delayedCall`과 카메라 페이드 효과를 조합한 안정적인 씬 전환.

## 4. 데이터 구성
- **Character Data**: 각 닌자별 고유 ID, 이름, 색상 값 및 시각적 특징(Spiky, Bob, Tilt hair 등) 정의.
- **Spawn System**: `spawnData`를 이용한 플레이어 위치 기반 적 유닛의 동적 가시성 스폰.

## 5. 시스템 복원력 및 무결성
- **Zero-Asset Resilience**: 외부 이미지 서버 장애 시에도 게임의 시각적 품질이 100% 유지됨.
- **Physics Integrity**: 사망 시 관성이나 중력에 의한 추가 이동을 방지하여 게임 오버 시점의 논리적 무결성 확보.
- **Input Isolation**: 게임 종료 시 모든 키보드 입력을 즉시 차단하여 예기치 않은 동작 방지.
