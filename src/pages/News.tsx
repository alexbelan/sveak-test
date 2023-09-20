import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import { getStory, updateComments } from "../store/slice/story";
import {
  IconLink,
  IconCalendarEvent,
  IconUserCircle,
  IconMessage2,
} from "@tabler/icons-react";
import { Button, List, Loader, Title } from "@mantine/core";
import Comment from "../components/Comment";

const News = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { story, loading, comments, loadingComments } = useAppSelector(
    (state) => state.story
  );

  const date = useMemo(() => {
    if (story) {
      const dataDate = new Date(story.time * 1000);
      const day = dataDate.getDate();
      const month = dataDate.getMonth() + 1;
      return `${dataDate.getFullYear()}/${month < 10 ? `0${month}` : month}/${
        day < 10 ? `0${day}` : day
      }`;
    } else {
      return null;
    }
  }, [story?.time]);

  const hundlerUpdateComments = () => {
    if (!loading) {
      dispatch(updateComments());
    }
  };

  const hundlerBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    dispatch(getStory(+location.pathname.replace("/", "")));

    const updateCommentsInterval = setInterval(hundlerUpdateComments, 60000);

    return () => {
      clearInterval(updateCommentsInterval);
    };
  }, []);

  return (
    <div className="block-screen">
      <div className="block-content">
        {loading ? (
          <div className="block-screen">
            <Loader />
          </div>
        ) : (
          <div>
            <div>
              <Title>{story?.title}</Title>
              <Button
                sx={{ marginTop: "10px", marginBottom: "10px" }}
                onClick={hundlerBack}
              >
                Back
              </Button>
              <List>
                <List.Item icon={<IconUserCircle />}>{story?.by}</List.Item>
                <List.Item icon={<IconLink />}>
                  <a href={story?.url} target="_blank">
                    {story?.url}
                  </a>
                </List.Item>
                <List.Item icon={<IconCalendarEvent />}>{date}</List.Item>
                <List.Item icon={<IconMessage2 />}>
                  {story?.kids ? story?.kids.length : 0}
                </List.Item>
              </List>
            </div>
            <div>
              {comments && (
                <>
                  <Button
                    sx={{ marginTop: "10px", marginBottom: "10px" }}
                    onClick={hundlerUpdateComments}
                  >
                    Update comments
                  </Button>
                  <div>
                    {loadingComments ? (
                      <div>
                        <Loader className="block-screen" />
                      </div>
                    ) : (
                      <>
                        {comments?.map((comment) => (
                          <Comment key={comment.id} data={comment} />
                        ))}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(News);
