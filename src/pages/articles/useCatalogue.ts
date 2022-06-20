import { useInfiniteScroll } from "hooks/useInfiniteScroll";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import { listArticles, SearchArticle } from "services/api/articles";
import { useCallback, useEffect, useRef, useState } from "react";

const listArticlesAtPage = async (page: number) => {
  console.log(page);
  return listArticles({ page: page });
};

export const useCatalogue = <T extends SearchArticle>() => {
  const [allArticles, setAllArticles] = useState<T[]>([]);
  const {
    status,
    value: lastResponse,
    page,
    goNextPage,
  } = usePaginatedFetch(listArticlesAtPage);
  const totalPages = useRef<number>();

  console.log({ allArticles });

  useEffect(() => {
    if (lastResponse) {
      setAllArticles((prev) => [...prev, ...lastResponse.data] as T[]);
      totalPages.current = lastResponse.meta.pagination.pageCount;
    }
  }, [lastResponse]);

  const handleGetMore = useCallback(() => {
    if (
      status !== "pending" &&
      totalPages.current !== undefined &&
      page < totalPages.current
    ) {
      goNextPage();
    }
  }, [status, page, goNextPage]);

  const { ref } = useInfiniteScroll(handleGetMore);

  return {
    status,
    articles: allArticles,
    ref,
  };
};
