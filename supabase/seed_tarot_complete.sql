-- Universal Waite 78-Card Tarot Deck - Complete Data Insert
-- Run this in Supabase SQL Editor after applying the migration

-- ============================================
-- MAJOR ARCANA (22 cards)
-- ============================================
INSERT INTO tarot_deck_data (name_en, name_kr, arcana_type, number, keywords, description_upright, description_reversed)
VALUES
  ('The Fool', '바보', 'major', 0, ARRAY['new beginnings', 'innocence', 'spontaneity', 'free spirit'], '새로운 시작, 순수함, 자유로운 영혼. 미지의 여정을 향한 첫 발걸음.', '무모함, 위험한 선택, 준비 부족'),
  ('The Magician', '마법사', 'major', 1, ARRAY['manifestation', 'resourcefulness', 'power', 'inspired action'], '창조력, 의지력, 능력의 발현. 원하는 것을 현실로 만드는 힘.', '조작, 속임수, 재능의 낭비'),
  ('The High Priestess', '여사제', 'major', 2, ARRAY['intuition', 'sacred knowledge', 'divine feminine', 'subconscious'], '직관, 내면의 지혜, 신성한 여성성. 보이지 않는 진실을 아는 힘.', '비밀, 억압된 감정, 직관 무시'),
  ('The Empress', '여황제', 'major', 3, ARRAY['femininity', 'beauty', 'nature', 'nurturing', 'abundance'], '풍요, 창조성, 자연과의 연결. 양육하고 키우는 에너지.', '의존성, 질식, 창조적 블록'),
  ('The Emperor', '황제', 'major', 4, ARRAY['authority', 'structure', 'control', 'fatherhood'], '권위, 구조, 리더십. 안정적인 기반을 만드는 힘.', '독재, 경직성, 통제 상실'),
  ('The Hierophant', '교황', 'major', 5, ARRAY['spiritual wisdom', 'tradition', 'conformity', 'institutions'], '전통, 영적 지혜, 가르침. 확립된 시스템 안에서의 배움.', '반항, 비전통적, 제도에 대한 의문'),
  ('The Lovers', '연인', 'major', 6, ARRAY['love', 'harmony', 'relationships', 'values alignment'], '사랑, 조화, 중요한 선택. 가치관의 일치.', '불균형, 가치관 충돌, 관계 문제'),
  ('The Chariot', '전차', 'major', 7, ARRAY['control', 'willpower', 'success', 'determination'], '의지력, 승리, 방향성. 상반된 힘을 통제하는 능력.', '통제 상실, 방향성 결여, 공격성'),
  ('Strength', '힘', 'major', 8, ARRAY['strength', 'courage', 'patience', 'compassion'], '내면의 힘, 용기, 인내. 부드러움으로 이기는 힘.', '자기 의심, 나약함, 자제력 부족'),
  ('The Hermit', '은둔자', 'major', 9, ARRAY['soul searching', 'introspection', 'inner guidance', 'solitude'], '내면 탐구, 고독, 영적 깨달음. 홀로 찾는 진리.', '고립, 외로움, 철수'),
  ('Wheel of Fortune', '운명의 수레바퀴', 'major', 10, ARRAY['good luck', 'karma', 'life cycles', 'destiny'], '운명, 변화의 주기, 행운. 삶의 순환.', '불운, 저항, 외부 영향'),
  ('Justice', '정의', 'major', 11, ARRAY['justice', 'fairness', 'truth', 'cause and effect'], '정의, 공정함, 진실. 원인과 결과의 법칙.', '불공정, 책임 회피, 진실 왜곡'),
  ('The Hanged Man', '매달린 사람', 'major', 12, ARRAY['pause', 'surrender', 'letting go', 'new perspective'], '멈춤, 항복, 새로운 관점. 기다림의 지혜.', '지연, 저항, 희생의 거부'),
  ('Death', '죽음', 'major', 13, ARRAY['endings', 'change', 'transformation', 'transition'], '변화, 끝과 시작, 재탄생. 필요한 종결.', '변화에 대한 저항, 정체, 집착'),
  ('Temperance', '절제', 'major', 14, ARRAY['balance', 'moderation', 'patience', 'purpose'], '균형, 조화, 절제. 중용의 길.', '불균형, 과잉, 자제력 부족'),
  ('The Devil', '악마', 'major', 15, ARRAY['shadow self', 'attachment', 'addiction', 'restriction'], '속박, 중독, 그림자. 물질적 집착.', '해방, 자각, 속박으로부터의 탈출'),
  ('The Tower', '탑', 'major', 16, ARRAY['sudden change', 'upheaval', 'chaos', 'revelation'], '급격한 변화, 붕괴, 계시. 거짓 기반의 파괴.', '재난 회피, 변화에 대한 두려움'),
  ('The Star', '별', 'major', 17, ARRAY['hope', 'faith', 'purpose', 'renewal', 'spirituality'], '희망, 영감, 평온. 어둠 뒤의 빛.', '절망, 신념 상실, 단절'),
  ('The Moon', '달', 'major', 18, ARRAY['illusion', 'fear', 'anxiety', 'subconscious', 'intuition'], '환상, 불안, 무의식. 보이지 않는 것에 대한 두려움.', '혼란 해소, 진실 드러남'),
  ('The Sun', '태양', 'major', 19, ARRAY['positivity', 'fun', 'warmth', 'success', 'vitality'], '기쁨, 성공, 활력. 순수한 긍정의 에너지.', '과도한 낙관, 우울, 내면의 아이 상처'),
  ('Judgement', '심판', 'major', 20, ARRAY['judgement', 'rebirth', 'inner calling', 'absolution'], '재탄생, 내면의 부름, 용서. 과거의 평가와 새 시작.', '자기 의심, 내면의 비판, 용서 거부'),
  ('The World', '세계', 'major', 21, ARRAY['completion', 'accomplishment', 'travel', 'fulfillment'], '완성, 성취, 통합. 한 주기의 완결.', '미완성, 지연, 목표 재설정 필요');

-- ============================================
-- MINOR ARCANA - WANDS (14 cards)
-- ============================================
INSERT INTO tarot_deck_data (name_en, name_kr, suit, arcana_type, number, keywords, description_upright, description_reversed)
VALUES
  ('Ace of Wands', '완드 에이스', 'wands', 'minor', 1, ARRAY['inspiration', 'new opportunities', 'growth', 'potential'], '새로운 영감, 창조적 에너지, 성장의 기회', '지연된 시작, 창의성 부족'),
  ('Two of Wands', '완드 2', 'wands', 'minor', 2, ARRAY['planning', 'decisions', 'discovery'], '미래 계획, 결정의 순간', '계획 부족, 두려움'),
  ('Three of Wands', '완드 3', 'wands', 'minor', 3, ARRAY['expansion', 'foresight', 'overseas opportunities'], '확장, 진전, 장기적 비전', '지연, 좌절'),
  ('Four of Wands', '완드 4', 'wands', 'minor', 4, ARRAY['celebration', 'harmony', 'homecoming'], '축하, 안정, 성취', '불안정, 갈등'),
  ('Five of Wands', '완드 5', 'wands', 'minor', 5, ARRAY['conflict', 'competition', 'tension'], '경쟁, 갈등, 도전', '내적 갈등, 회피'),
  ('Six of Wands', '완드 6', 'wands', 'minor', 6, ARRAY['success', 'public recognition', 'victory'], '승리, 인정, 자신감', '자만, 인정 부족'),
  ('Seven of Wands', '완드 7', 'wands', 'minor', 7, ARRAY['challenge', 'perseverance', 'defense'], '방어, 인내, 도전 극복', '압도됨, 포기'),
  ('Eight of Wands', '완드 8', 'wands', 'minor', 8, ARRAY['speed', 'action', 'movement'], '빠른 진전, 행동', '지연, 좌절'),
  ('Nine of Wands', '완드 9', 'wands', 'minor', 9, ARRAY['resilience', 'persistence', 'boundaries'], '회복력, 경계, 마지막 노력', '편집증, 방어적'),
  ('Ten of Wands', '완드 10', 'wands', 'minor', 10, ARRAY['burden', 'responsibility', 'hard work'], '부담, 책임, 과로', '짐 내려놓기, 위임'),
  ('Page of Wands', '완드 시종', 'wands', 'minor', 11, ARRAY['exploration', 'excitement', 'freedom'], '탐험, 열정, 자유로운 정신', '무모함, 산만함'),
  ('Knight of Wands', '완드 기사', 'wands', 'minor', 12, ARRAY['energy', 'passion', 'adventure'], '열정, 모험, 충동적 행동', '무모함, 조급함'),
  ('Queen of Wands', '완드 여왕', 'wands', 'minor', 13, ARRAY['confidence', 'independence', 'determination'], '자신감, 독립성, 카리스마', '질투, 이기심'),
  ('King of Wands', '완드 왕', 'wands', 'minor', 14, ARRAY['leadership', 'vision', 'entrepreneur'], '리더십, 비전, 기업가 정신', '독재, 오만');

-- ============================================
-- MINOR ARCANA - CUPS (14 cards)
-- ============================================
INSERT INTO tarot_deck_data (name_en, name_kr, suit, arcana_type, number, keywords, description_upright, description_reversed)
VALUES
  ('Ace of Cups', '컵 에이스', 'cups', 'minor', 1, ARRAY['love', 'new relationships', 'compassion', 'creativity'], '새로운 사랑, 감정의 시작, 창의성', '감정 억압, 막힌 창의성'),
  ('Two of Cups', '컵 2', 'cups', 'minor', 2, ARRAY['unity', 'partnership', 'connection'], '파트너십, 조화, 상호 존중', '불균형, 긴장된 관계'),
  ('Three of Cups', '컵 3', 'cups', 'minor', 3, ARRAY['celebration', 'friendship', 'community'], '축하, 우정, 공동체', '과잉, 고립'),
  ('Four of Cups', '컵 4', 'cups', 'minor', 4, ARRAY['meditation', 'contemplation', 'apathy'], '명상, 무관심, 재평가', '새로운 기회 인식'),
  ('Five of Cups', '컵 5', 'cups', 'minor', 5, ARRAY['regret', 'loss', 'disappointment'], '후회, 상실, 슬픔', '수용, 앞으로 나아감'),
  ('Six of Cups', '컵 6', 'cups', 'minor', 6, ARRAY['nostalgia', 'childhood memories', 'innocence'], '향수, 순수함, 과거 회상', '과거에 집착'),
  ('Seven of Cups', '컵 7', 'cups', 'minor', 7, ARRAY['choices', 'illusion', 'fantasy'], '환상, 선택의 혼란', '명확성, 결정'),
  ('Eight of Cups', '컵 8', 'cups', 'minor', 8, ARRAY['disappointment', 'abandonment', 'withdrawal'], '떠남, 포기, 새로운 길 탐색', '두려움, 회피'),
  ('Nine of Cups', '컵 9', 'cups', 'minor', 9, ARRAY['contentment', 'satisfaction', 'gratitude'], '만족, 소원 성취', '탐욕, 불만족'),
  ('Ten of Cups', '컵 10', 'cups', 'minor', 10, ARRAY['harmony', 'happiness', 'alignment'], '조화, 행복, 가족', '불화, 가치관 충돌'),
  ('Page of Cups', '컵 시종', 'cups', 'minor', 11, ARRAY['creativity', 'intuition', 'curiosity'], '창의적 메시지, 직관', '감정적 미성숙'),
  ('Knight of Cups', '컵 기사', 'cups', 'minor', 12, ARRAY['romance', 'charm', 'imagination'], '낭만, 매력, 제안', '비현실적, 변덕'),
  ('Queen of Cups', '컵 여왕', 'cups', 'minor', 13, ARRAY['compassion', 'calm', 'comfort'], '공감, 직관, 양육', '감정적 불안정'),
  ('King of Cups', '컵 왕', 'cups', 'minor', 14, ARRAY['emotional balance', 'diplomacy', 'compassion'], '감정적 성숙, 외교', '감정 조작, 변덕');

-- ============================================
-- MINOR ARCANA - SWORDS (14 cards)
-- ============================================
INSERT INTO tarot_deck_data (name_en, name_kr, suit, arcana_type, number, keywords, description_upright, description_reversed)
VALUES
  ('Ace of Swords', '검 에이스', 'swords', 'minor', 1, ARRAY['breakthrough', 'clarity', 'sharp mind'], '명확성, 진실, 새로운 아이디어', '혼란, 잔인함'),
  ('Two of Swords', '검 2', 'swords', 'minor', 2, ARRAY['difficult decisions', 'stalemate', 'avoidance'], '어려운 선택, 교착 상태', '결정, 진실 직면'),
  ('Three of Swords', '검 3', 'swords', 'minor', 3, ARRAY['heartbreak', 'sorrow', 'grief'], '상심, 슬픔, 배신', '치유, 용서'),
  ('Four of Swords', '검 4', 'swords', 'minor', 4, ARRAY['rest', 'recovery', 'contemplation'], '휴식, 회복, 명상', '소진, 번아웃'),
  ('Five of Swords', '검 5', 'swords', 'minor', 5, ARRAY['conflict', 'defeat', 'win at all costs'], '갈등, 패배, 공허한 승리', '화해, 용서'),
  ('Six of Swords', '검 6', 'swords', 'minor', 6, ARRAY['transition', 'change', 'moving on'], '전환, 이동, 회복', '저항, 정체'),
  ('Seven of Swords', '검 7', 'swords', 'minor', 7, ARRAY['deception', 'strategy', 'escape'], '기만, 전략, 도피', '양심, 진실'),
  ('Eight of Swords', '검 8', 'swords', 'minor', 8, ARRAY['restriction', 'powerlessness', 'victim mentality'], '속박, 무력감, 제한', '해방, 자유'),
  ('Nine of Swords', '검 9', 'swords', 'minor', 9, ARRAY['anxiety', 'worry', 'nightmares'], '불안, 걱정, 악몽', '희망, 회복'),
  ('Ten of Swords', '검 10', 'swords', 'minor', 10, ARRAY['painful endings', 'betrayal', 'rock bottom'], '고통스러운 끝, 배신', '회복, 재생'),
  ('Page of Swords', '검 시종', 'swords', 'minor', 11, ARRAY['curiosity', 'restlessness', 'mental energy'], '호기심, 정신적 에너지', '험담, 조급함'),
  ('Knight of Swords', '검 기사', 'swords', 'minor', 12, ARRAY['action', 'impulsiveness', 'defending beliefs'], '행동, 충동, 직접적', '무모함, 공격성'),
  ('Queen of Swords', '검 여왕', 'swords', 'minor', 13, ARRAY['independent', 'unbiased', 'clear boundaries'], '독립적, 명확함, 진실', '냉담, 잔인함'),
  ('King of Swords', '검 왕', 'swords', 'minor', 14, ARRAY['intellectual power', 'authority', 'truth'], '지적 권위, 진실, 명확성', '조작, 냉혹함');

-- ============================================
-- MINOR ARCANA - PENTACLES (14 cards)
-- ============================================
INSERT INTO tarot_deck_data (name_en, name_kr, suit, arcana_type, number, keywords, description_upright, description_reversed)
VALUES
  ('Ace of Pentacles', '펜타클 에이스', 'pentacles', 'minor', 1, ARRAY['opportunity', 'prosperity', 'new venture'], '새로운 재정적 기회, 번영', '기회 상실, 탐욕'),
  ('Two of Pentacles', '펜타클 2', 'pentacles', 'minor', 2, ARRAY['balance', 'adaptability', 'time management'], '균형, 우선순위, 적응', '불균형, 과부하'),
  ('Three of Pentacles', '펜타클 3', 'pentacles', 'minor', 3, ARRAY['teamwork', 'collaboration', 'learning'], '협업, 기술, 학습', '불협화음, 낮은 품질'),
  ('Four of Pentacles', '펜타클 4', 'pentacles', 'minor', 4, ARRAY['control', 'stability', 'possession'], '통제, 안정, 소유', '탐욕, 집착'),
  ('Five of Pentacles', '펜타클 5', 'pentacles', 'minor', 5, ARRAY['hardship', 'poverty', 'insecurity'], '어려움, 재정 문제', '회복, 개선'),
  ('Six of Pentacles', '펜타클 6', 'pentacles', 'minor', 6, ARRAY['generosity', 'charity', 'sharing'], '관대함, 나눔, 균형', '이기심, 빚'),
  ('Seven of Pentacles', '펜타클 7', 'pentacles', 'minor', 7, ARRAY['perseverance', 'investment', 'reward'], '인내, 투자, 장기적 비전', '조급함, 낮은 수익'),
  ('Eight of Pentacles', '펜타클 8', 'pentacles', 'minor', 8, ARRAY['apprenticeship', 'skill development', 'quality'], '기술 개발, 노력, 품질', '완벽주의, 낮은 품질'),
  ('Nine of Pentacles', '펜타클 9', 'pentacles', 'minor', 9, ARRAY['abundance', 'luxury', 'self-sufficiency'], '풍요, 독립, 성취', '과시, 재정 의존'),
  ('Ten of Pentacles', '펜타클 10', 'pentacles', 'minor', 10, ARRAY['wealth', 'inheritance', 'family'], '부, 유산, 안정', '재정 손실, 가족 분쟁'),
  ('Page of Pentacles', '펜타클 시종', 'pentacles', 'minor', 11, ARRAY['manifestation', 'opportunity', 'new venture'], '새로운 기회, 학습', '게으름, 목표 부족'),
  ('Knight of Pentacles', '펜타클 기사', 'pentacles', 'minor', 12, ARRAY['efficiency', 'routine', 'conservatism'], '근면, 신뢰성, 책임', '게으름, 완벽주의'),
  ('Queen of Pentacles', '펜타클 여왕', 'pentacles', 'minor', 13, ARRAY['nurturing', 'practical', 'providing'], '양육, 실용성, 풍요', '자기 중심, 질투'),
  ('King of Pentacles', '펜타클 왕', 'pentacles', 'minor', 14, ARRAY['wealth', 'business', 'leadership'], '부, 성공, 리더십', '탐욕, 물질주의');

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this to verify all 78 cards were inserted:
-- SELECT arcana_type, COUNT(*) as count FROM tarot_deck_data GROUP BY arcana_type;
-- Expected: major=22, minor=56
