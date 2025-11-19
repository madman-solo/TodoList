import MyItemsTemplate from "../../components/MyItemsTemplate";
import { useThemeStore } from "../../store";

const MyBackgrounds = () => {
  const { myBackgrounds, removeBackground } = useThemeStore();

  return (
    <MyItemsTemplate
      title="我的背景"
      items={myBackgrounds}
      onDelete={removeBackground}
    />
  );
};

export default MyBackgrounds;

// 下面是泛型写法
// import MyItemsTemplate from "../../components/MyItemsTemplate";
// import { useThemeStore } from "../../store";
// import type { BackgroundItem } from "../../services/api"; // 导入BackgroundItem类型

// const MyBackgrounds = () => {
//   const { myBackgrounds, removeBackground } = useThemeStore();

//   // 明确指定泛型为BackgroundItem
//   return (
//     <MyItemsTemplate<BackgroundItem>
//       title="我的背景"
//       items={myBackgrounds}
//       onDelete={removeBackground}
//     />
//   );
// };

// export default MyBackgrounds;
