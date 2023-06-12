<template>
  <div>
    <mavon-editor v-model="markdown">
      <template slot="left-toolbar-after">
        <button
          type="button"
          @click="$click('test')"
          class="op-icon fa fa-mavon-align-left"
          aria-hidden="true"
          title="自定义"
        ></button>
      </template>
    </mavon-editor>
    <div v-html="compiledMarkdown"></div>
  </div>
</template>

<script>
export default {
  name: "MavonEditorDemo",
  data() {
    return {
      markdown:
        '<video width="320" height="240" controls="true" src="https://www.w3schools.com/html/mov_bbb.mp4"></video>',
      compiledMarkdown: "",
    };
  },
  watch: {
    markdown: function (val) {
      console.log(val);
      this.compiledMarkdown = this.$refs.mavonEditor.getHtml();
    },
  },
  mounted() {
    // this.compiledMarkdown = this.$refs.mavonEditor.render(this.markdown);
    // this.compiledMarkdown = this.$refs.mavonEditor.getHtml();
  },
};
</script>
