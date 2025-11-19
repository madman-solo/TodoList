// types/react-emoji-picker.d.ts
declare module "react-emoji-picker" {
  import { Component } from "react";

  interface EmojiPickerProps {
    onSelect: (emoji: string) => void;
    style?: React.CSSProperties;
    // 可根据需要添加其他可能用到的属性
  }

  class EmojiPicker extends Component<EmojiPickerProps> {}

  export default EmojiPicker;
}
