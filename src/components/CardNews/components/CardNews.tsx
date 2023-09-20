import { Card, Group, List, Text } from "@mantine/core";
import {
  IconUserCircle,
  IconStar,
  IconCalendarEvent,
} from "@tabler/icons-react";
import { News } from "../../../interfaces";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

interface Props {
  data: News;
}

const CardNews = ({ data }: Props) => {
  const navigate = useNavigate();

  const date = useMemo(() => {
    const dataDate = new Date(data.time * 1000);
    const day = dataDate.getDate();
    const month = dataDate.getMonth() + 1;
    return `${dataDate.getFullYear()}/${month < 10 ? `0${month}` : month}/${
      day < 10 ? `0${day}` : day
    }`;
  }, [data.time]);

  return (
    <Card
      onClick={() => navigate(`/${data.id}`)}
      sx={{
        cursor: "pointer",
      }}
      mb="lg"
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
    >
      <Text weight={500}>{data.title}</Text>
      <Group mt="10px">
        <List>
          <List.Item icon={<IconUserCircle size="24px" />}>{data.by}</List.Item>
          <List.Item icon={<IconStar size="24px" />}>{data.score}</List.Item>
          <List.Item icon={<IconCalendarEvent size="24px" />}>{date}</List.Item>
        </List>
      </Group>
    </Card>
  );
};

export default CardNews;
