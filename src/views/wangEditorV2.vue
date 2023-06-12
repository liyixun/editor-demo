<template>
  <div class="editor-wrapper">
    <div class="editor-left">
      <Toolbar :editor="editorRef" />
      <Editor v-model="editorContent" ref="editor" />
    </div>
    <div class="editor-right" v-html="previewHtml"></div>
  </div>
</template>

<script>
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

export default {
  name: "WangEditorPreview",
  components: {
    Editor,
    Toolbar,
  },
  data() {
    return {
      editorContent: "<p>Hello, World!</p>",
      previewHtml: "",
      editorRef: null,
    };
  },
  mounted() {
    // 保存编辑器实例的引用
    this.editorRef = this.$refs.editor.$editor;

    // 创建工具栏菜单
    this.editorRef?.menus.extend("myCustomMenu", {
      title: "My Custom Menu",
      type: "drop-down",
      icon: "fa fa-cog",
      options: [
        {
          name: "Option 1",
          value: "option1",
        },
        {
          name: "Option 2",
          value: "option2",
        },
        {
          name: "Option 3",
          value: "option3",
        },
      ],
    });
    this.editorRef?.menus.extend("myCustomButton", {
      title: "My Custom Button",
      type: "button",
      icon: "fa fa-plus",
      click: () => {
        // do something
      },
    });

    // 监听编辑器内容变化事件，实时更新预览内容
    this.$refs.editor.$watch("editorContent", () => {
      this.previewHtml = this.$refs.editor.convertContentToPreview(
        this.editorContent
      );
    });
  },
};
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>

<style scoped>
.editor-wrapper {
  display: flex;
  flex-direction: row;
  margin: 20px;
}

.editor-left {
  flex: 1;
  margin-right: 20px;
}

.editor-right {
  flex: 1;
  border: 1px solid #ccc;
  padding: 10px;
}
</style>
