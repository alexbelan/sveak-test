import {
  Text,
  Avatar,
  Group,
  TypographyStylesProvider,
  Paper,
  Loader,
} from "@mantine/core";
import { IconMessage2 } from "@tabler/icons-react";
import { Comment } from "../../../interfaces";
import { useMemo, useState } from "react";
import { useAppDispatch } from "../../../store";
import { getNestedComments } from "../../../store/slice/story";

interface Props {
  data: Comment;
}

const Comment = ({ data }: Props) => {
  const [loading, setLoading] = useState<boolean>();
  const dispatch = useAppDispatch();

  const hundlerGetComments = async () => {
    setLoading(true);
    dispatch(getNestedComments(data.id));
    setLoading(false);
  };

  const comments = useMemo(() => data.comments, [data.comments]);

  return (
    <>
      <Paper
        onClick={hundlerGetComments}
        withBorder
        radius="md"
        className="comment"
        sx={{
          cursor: data?.kids && data?.kids.length > 0 ? "pointer" : "default",
        }}
      >
        <Group>
          <Avatar
            src="https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80"
            alt={data.by}
            radius="xl"
          />
          <div>
            <Text fz="sm">{data.by}</Text>
          </div>
        </Group>
        <TypographyStylesProvider className="comment-body">
          <div
            className="comment-content"
            dangerouslySetInnerHTML={{
              __html: data.text,
            }}
          />
        </TypographyStylesProvider>
        {data?.kids && data?.kids.length > 0 && (
          <div className="comment-score">
            <IconMessage2 />
            <Text sx={{ marginLeft: "10px" }}>{data?.kids.length}</Text>
          </div>
        )}
      </Paper>
      {(comments || loading) && (
        <div className="block-nested-comments">
          {loading ? (
            <div className="block-loader-nested-comment">
              <Loader />
            </div>
          ) : (
            <>
              {data.comments?.map((comment) => (
                <Comment key={comment.id} data={comment} />
              ))}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Comment;
