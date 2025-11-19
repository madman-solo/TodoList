import MyItemsTemplate from "../../components/MyItemsTemplate";
import { useThemeStore } from "../../store";

const MyLikes = () => {
  const { likedItems, removeLike } = useThemeStore();

  return (
    <MyItemsTemplate
      title="我的点赞"
      items={likedItems}
      onDelete={removeLike}
    />
  );
};

export default MyLikes;
