package com.a301.newsseug.domain.article.service;

import com.a301.newsseug.domain.article.model.dto.response.AllArticlesResponse;
import com.a301.newsseug.domain.article.model.dto.response.TodayArticlesResponse;
import com.a301.newsseug.domain.article.model.dto.response.ListArticleResponse;

public interface ArticleService {

    TodayArticlesResponse getHomeArticles();

    AllArticlesResponse getAllArticles();

    ListArticleResponse getArticlesByCategory(String categoryName);

}