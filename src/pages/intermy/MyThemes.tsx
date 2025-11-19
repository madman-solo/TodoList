import MyItemsTemplate from "../../components/MyItemsTemplate";
import { useThemeStore } from "../../store";

const MyThemes = () => {
  const { myThemes, removeTheme } = useThemeStore();

  return (
    <MyItemsTemplate title="我的主题" items={myThemes} onDelete={removeTheme} />
  );
};

export default MyThemes;
