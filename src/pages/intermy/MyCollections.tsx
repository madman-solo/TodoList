import MyItemsTemplate from "../../components/MyItemsTemplate";
import { useThemeStore } from "../../store";

const MyCollections = () => {
  const { favoriteFonts, removeFavorite } = useThemeStore();

  return (
    <MyItemsTemplate
      title="我的收藏"
      items={favoriteFonts}
      onDelete={removeFavorite}
    />
  );
};

export default MyCollections;
