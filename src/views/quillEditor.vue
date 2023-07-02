<template>
  <div class="HomeDetails">
    <quill-editor
      v-model="editContent"
      ref="myQuillEditor"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
    >
    </quill-editor>
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor"; //调用编辑器
import * as Quill from "quill";
import QuillCursors from "quill-cursors";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import * as Y from "yjs";
import { QuillBinding } from "y-quill";
import { WebsocketProvider } from "y-websocket";
// 设置字体大小
const fontSizeStyle = Quill.import("attributors/style/size"); // 引入这个后会把样式写在style上
fontSizeStyle.whitelist = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "36px",
];
Quill.register(fontSizeStyle, true);
// 使用 cursors 插件
Quill.register("modules/cursors", QuillCursors);
// 设置字体样式
const Font = Quill.import("attributors/style/font"); // 引入这个后会把样式写在style上
const fonts = ["SimSun", "SimHei", "Microsoft-YaHei", "KaiTi", "FangSong"];
Font.whitelist = fonts; // 将字体加入到白名单
Quill.register(Font, true);
// 工具栏
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
  [{ align: [] }], // 对齐方式-----[{ align: [] }]
  [{ size: fontSizeStyle.whitelist }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
  [{ font: fonts }], // 字体种类-----[{ font: [] }]
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
  [{ direction: "ltl" }], // 文本方向-----[{'direction': 'rtl'}]
  [{ direction: "rtl" }], // 文本方向-----[{'direction': 'rtl'}]
  [{ indent: "-1" }, { indent: "+1" }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
  [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
  // [{ script: "sub" }, { script: "super" }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
  // ["blockquote", "code-block"], // 引用  代码块-----['blockquote', 'code-block']
  // ["clean"], // 清除文本格式-----['clean']
  // ["link", "image", "video"], // 链接、图片、视频-----['link', 'image', 'video']
  ["link", "image"], // 链接、图片、视频-----['link', 'image', 'video']
];

export default {
  name: "HomeDetails",
  components: { quillEditor },
  props: {
    fillContent: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // 配置方式二
      editorOption: {
        placeholder: "请输入内容",
        modules: {
          cursors: true,
          toolbar: {
            container: toolbarOptions,
            // handlers: {
            //   image: this.handleImgUpload,
            // },
          },
        },
      },
      editContent: this.fillContent || "", // 编辑器内容
      conversion: "", // 演示内容
    };
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor?.quill;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.conversion = this.escapeStringHTML(this.editContent);
    });
    const ydoc = new Y.Doc(); // y 文档对象，保存需要共享的数据
    const ytext = ydoc.getText("quill"); // 创建名为 quill 的 Text 对象
    // 连接到 websocket 服务端
    const provider = new WebsocketProvider(
      "wss://demos.yjs.dev",
      "quill-demo-room",
      ydoc
    );
    ytext.observe((event) => {
      if (event.type === "insert") {
        const index = event.index;
        const value = event.values[0];
        const quill = this.$refs.myQuillEditor.quill;
        quill.insertText(index, value);
      } else if (event.type === "delete") {
        const index = event.index;
        const length = event.length;
        const quill = this.$refs.myQuillEditor.quill;
        quill.deleteText(index, length);
      }
    });

    const quill = new Quill(
      this.$refs.myQuillEditor.$refs.editor
      //   this.editorOption
    );
    quill.on("text-change", (delta, oldDelta, source) => {
      if (source !== "user") return;
      const ytext = ydoc.getText("quill");
      ytext.applyDelta(delta);
    });
    // 数据模型绑定，再绑上光标对象
    // const binding =
    new QuillBinding(ytext, quill, provider.awareness);
  },
  methods: {
    // ========================富文本========================
    onEditorReady() {
      // 准备编辑器
    },
    onEditorBlur() {}, // 失去焦点事件
    onEditorFocus() {}, // 获得焦点事件
    // 内容改变事件
    onEditorChange() {
      this.conversion = this.escapeStringHTML(this.editContent);
    },
    // 转码
    escapeStringHTML(content) {
      content = content?.replace(/&lt;/g, "<");
      content = content?.replace(/&gt;/g, ">");
      return content;
    },
    // ========================富文本END========================
  },
};
</script>
<style>
.ql-editor {
  min-height: 150px;
}

.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}

.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "默认";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="SimSun"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="SimSun"]::before {
  content: "宋体";
}

.ql-snow
  .ql-picker.ql-font
  .ql-picker-label[data-value="Microsoft-YaHei"]::before,
.ql-snow
  .ql-picker.ql-font
  .ql-picker-item[data-value="Microsoft-YaHei"]::before {
  content: "微软雅黑";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="KaiTi"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="KaiTi"]::before {
  content: "楷体";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="FangSong"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="FangSong"]::before {
  content: "仿宋";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="SimHei"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="SimHei"]::before {
  content: "黑体";
}

.ql-toolbar.ql-snow + .ql-container.ql-snow {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-color: #a9c3c1;
}

.ql-toolbar.ql-snow {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.ql-snow .ql-stroke,
.ql-snow .ql-picker {
  color: #999;
  stroke: #999;
}

.ql-snow .ql-fill,
.ql-snow .ql-stroke.ql-fill {
  fill: #999;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="12px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before {
  content: "12px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="14px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before {
  content: "14px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="16px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before {
  content: "16px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="20px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before {
  content: "20px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="24px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before {
  content: "24px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="36px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="36px"]::before {
  content: "36px";
}

.ql-container {
  font-size: 14px;
}
</style>

<style lang="scss" scoped>
.HomeDetails {
  padding: 10px 0 10px 10px;
}
</style>
