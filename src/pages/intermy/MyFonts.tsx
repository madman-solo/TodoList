import MyItemsTemplate from "../../components/MyItemsTemplate";
import { useThemeStore } from "../../store";

const MyFonts = () => {
  const { myFonts, removeFont, downloadFont } = useThemeStore();

  return (
    <MyItemsTemplate
      title="我的字体"
      items={myFonts}
      showDownload={true}
      onDownload={downloadFont}
      onDelete={removeFont}
    />
  );
};

export default MyFonts;
