import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import scrapPlusIcon from 'assets/scrapPlusIcon.svg';
import scrapCheckIcon from 'assets/scrapCheckIcon.svg';
import { ScrapModalProps } from 'types/article';

function ScrapModal({
  isOpen,
  onRequestClose,
  onCreateModalOpen,
}: ScrapModalProps) {
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const windowHeight = window.screen.height;
  const defaultHeight = windowHeight * 0.6;

  useEffect(() => {
    if (isOpen) {
      controls.start({ y: 0, height: defaultHeight });
      document.body.style.overflow = 'hidden';
    } else {
      controls.start({ y: '100%' });
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [controls, defaultHeight, isOpen]);

  useEffect(() => {
    // 초기 상태로 모든 아이템의 체크 상태를 false로 설정
    setCheckedItems(new Array(25).fill(false));
  }, []);

  const handleClick = (index: number) => {
    setCheckedItems((prev) =>
      prev.map((checked, i) => (i === index ? !checked : checked)),
    );
  };

  const handlePan = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (!contentRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const isAtTop = scrollTop <= 0;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight;

    if (isAtTop && info.delta.y > 0) {
      controls.set({ y: Math.max(0, info.delta.y) });
    } else if (isAtBottom && info.delta.y < 0) {
      return;
    } else {
      contentRef.current.scrollTop -= info.delta.y;
    }
  };

  const handlePanEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (!contentRef.current) return;

    const { scrollTop } = contentRef.current;
    const isAtTop = scrollTop <= 0;

    if (isAtTop && info.velocity.y > 20) {
      controls.start({ y: '100%' }).then(onRequestClose);
    } else {
      controls.start({ y: 0 });
    }
  };

  const handleOverlayClick = () => {
    controls.start({ y: '100%' }).then(onRequestClose);
  };

  const handleCreateFolderClick = () => {
    onCreateModalOpen();
  };

  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
      onClick={handleOverlayClick}
    >
      <ModalContent
        initial={{ y: '100%' }}
        animate={controls}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ height: defaultHeight }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={1}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <DraggableBar />
        <ModalHeader>
          <ModalTitle>추가할 폴더 선택</ModalTitle>
          <CreateScrap onClick={handleCreateFolderClick}>
            <img src={scrapPlusIcon} alt="새 폴더 생성" />
            <span>새 폴더</span>
          </CreateScrap>
        </ModalHeader>
        <ContentWrapper ref={contentRef}>
          <ModalBody>
            {[...Array(25)].map((_, index) => (
              <ScrapItem key={index} onClick={() => handleClick(index)}>
                <HiddenCheckbox />
                <StyledCheckbox $checked={checkedItems[index]}>
                  <svg width="16px" height="16px" viewBox="0 0 24 24">
                    <polyline
                      points="20 6 9 17 4 12"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </StyledCheckbox>
                <ScrapName>폴더 {index + 1}</ScrapName>
              </ScrapItem>
            ))}
          </ModalBody>
        </ContentWrapper>
        <ModalFooter>
          <Btn onClick={handleOverlayClick} $isSubmit={false}>
            취소
          </Btn>
          <Btn $isSubmit={true}>완료</Btn>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
}

export default ScrapModal;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1001;
`;

const ModalContent = styled(motion.div)`
  background: ${({ theme }) => theme.bgColor};
  border-radius: 10px;
  width: 90%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  margin: 20px 0;
  border: none;
`;

const ContentWrapper = styled.div`
  overflow-y: auto;
  flex-grow: 1;
  overscroll-behavior: contain;
`;

const DraggableBar = styled.div`
  height: 4px;
  width: 50px;
  background: ${({ theme }) => theme.textColor + '99'};
  margin: 5px auto 2px auto;
  border-radius: 8px;
`;

const ModalHeader = styled.div`
  height: 44px;
  width: 100%;
  margin: 0;
  padding: 18px 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  border-bottom: 1px solid ${({ theme }) => theme.relaxColor.light};
  top: 0;
  background: ${({ theme }) => theme.bgColor};
  z-index: 1;
`;

const ModalTitle = styled.h1`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
`;

const CreateScrap = styled.button`
  border: none;
  outline: none;
  background: none;
  color: ${({ theme }) => theme.scrapModalColor};
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px;
  border-radius: 20px;
  &:active {
    background-color: ${({ theme }) => theme.textColor + '3b'};
    transition: none;
  }

  &:not(:active) {
    transition: background-color 0.5s;
  }
`;

const ModalBody = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ScrapItem = styled.div`
  width: 100%;
  padding: 14px 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  line-height: 140%;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.bgColor};
  &:active {
    background-color: ${({ theme }) => theme.textColor + '30'};
    border: 1px solid ${({ theme }) => theme.textColor + '30'};
    transition: 0.2s;
  }

  &:not(:active) {
    transition: border 0.8s;
  }
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const StyledCheckbox = styled.div<{ $checked: boolean }>`
  display: inline-block;
  width: 16px;
  height: 16px;
  background: ${({ $checked, theme }) =>
    $checked ? theme.mainColor : theme.bgColor};
  border-radius: 3px;
  border: 2px solid
    ${({ $checked, theme }) => ($checked ? theme.mainColor : theme.textColor)};
  transition: all 150ms;

  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    visibility: ${({ $checked }) => ($checked ? 'visible' : 'hidden')};
    fill: ${({ theme }) => theme.bgColor};
  }
`;

const ScrapName = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const ModalFooter = styled.div`
  height: 50px;
  width: 100%;
  margin: 0;
  padding: 18px;
  box-sizing: border-box;
  position: sticky;
  bottom: 0;
  gap: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-top: 1px solid ${({ theme }) => theme.relaxColor.light};
`;

const Btn = styled.button<{ $isSubmit: boolean }>`
  color: ${({ theme, $isSubmit }) =>
    $isSubmit ? theme.mainColor : theme.textColor};
  font-size: 15px;
  border: none;
  background: ${({ theme }) => theme.bgColor};
  outline: none;
  border-radius: 20px;
  border: none;
  outline: none;
  padding: 5px 10px;
  &:active {
    background-color: ${({ theme }) => theme.textColor + '3b'};
    transition: none;
  }

  &:not(:active) {
    transition: background-color 0.5s;
  }
`;
