import React, { useEffect } from "react";
import { getNews, setNews } from "../store/slice/news";
import { useAppDispatch, useAppSelector } from "../store";
import { Button, Loader } from "@mantine/core";
import CardNews from "../components/CardNews";

const Home = () => {
  const dispatch = useAppDispatch();
  const { loading, news } = useAppSelector((state) => state.news);

  const hundlerGetNewNews = () => {
    if (!loading) {
      dispatch(getNews());
    }
  };

  const hundlerUpdateNews = () => {
    dispatch(setNews([]));
    dispatch(getNews());
  };

  useEffect(() => {
    dispatch(getNews());
  }, []);

  useEffect(() => {
    const interval = setInterval(hundlerGetNewNews, 60000);
    return () => {
      clearInterval(interval);
    };
  }, [news]);

  return (
    <div className="block-screen">
      <div className="block-content">
        <div className="header">
          <Button onClick={hundlerUpdateNews}>Update data</Button>
        </div>
        {loading && !news.length ? (
          <div className="block-loader">
            <Loader />
          </div>
        ) : (
          <>
            {news.map((item) => {
              return <CardNews key={item.id} data={item} />;
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(Home);
