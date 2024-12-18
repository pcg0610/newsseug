import styled from 'styled-components';
import SubTitle from '../mypage/SubTitle';
import ArticleListCardGroup from 'components/common/ArticleListCardGroup';
import useContentsFetch from 'hooks/useContentsFetch';
import { Category, PageType } from 'types/api/article';
import { fetchArticlesByPress } from 'apis/articleApi';
import { PressArticleProps } from 'types/props/press';
import React from 'react';
import Spinner from '../common/Spinner';
import ErrorSection from '../common/ErrorSection';

function PressArticles({
  pressId,
  activeCategory,
}: Readonly<PressArticleProps>) {
  const {
    articleList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    sliceDetails,
    isLoading,
    isError,
  } = useContentsFetch<PageType>({
    queryKey: [
      'pressArticles',
      Category[activeCategory as keyof typeof Category],
      String(pressId),
    ],
    fetchData: fetchArticlesByPress,
    category: Category[activeCategory as keyof typeof Category],
    pressId: pressId,
  });
  return (
    <Wrapper>
      <SubTitle title="업로드한 영상" />
      {isLoading && <Spinner height="200px" />}
      {isError && (
        <ErrorSection
          height="200px"
          text={`${activeCategory} 카테고리의 기사를 불러오는 데 실패했어요`}
        />
      )}
      {articleList.length > 0 ? (
        <ArticleListCardGroup
          articleList={articleList || []}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          sliceDetails={sliceDetails}
          articleFrom="press"
          activeCategory={activeCategory}
          activePress={pressId}
        />
      ) : (
        <ErrorSection
          height="200px"
          text={`${activeCategory} 카테고리의 기사가 아직 없어요...😥`}
        />
      )}
    </Wrapper>
  );
}

export default React.memo(PressArticles);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 15px;
  margin-bottom: 16px;
`;
