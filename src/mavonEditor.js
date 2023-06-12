import Vue from "vue";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import MarkdownItEmoji from "markdown-it-emoji";

const markdownIt = mavonEditor.getMarkdownIt();
markdownIt.use(MarkdownItEmoji);
Vue.component("mavon-editor", mavonEditor);
