<template>
  <div
    class="SuggestContainer"
  >
    <div
      v-if="!tab.length"
      class="title"
    >
      <div class="routerName">
        {{ TitleName ? TitleName : $t('route.' + $route.meta.title) }}
        <span />
      </div>
    </div>
    <div
      v-else
      class="tab-box"
    >
      <el-tabs

        v-model="activeValue"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="item in tab"
          :key="item.id"
          :label="item.label"
          :name="item.name"
        />
      </el-tabs>
    </div>

    <el-collapse accordion>
      <el-collapse-item>
        <template slot="title">
          <span v-if="tags.length"><el-tag
            v-for="(tag, index) in tags"
            :key="tag.name"
            closable
            :type="tag.type"
            @close="closeTags(index)"
          >
            {{ tag.name }}
          </el-tag></span>
          <span v-else>点击筛选</span>
        </template>
        <slot />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'SuggestContainer'
})
export default class extends Vue {
  @Prop({ default: 0 }) private stickyTop!: number
  @Prop({ default: 1 }) private zIndex!: number
  @Prop({ default: '功能栏' }) private title: any // 默认无法识别tab显示
  @Prop({ default: '0' }) private activeName: any // 默认为0 选择第一个
  @Prop({ default: [] }) private tab: any
  @Prop({ default: [] }) private tags: any

  private TitleName: any
  private activeValue: any
  private active = false
  private position = ''
  private isSticky = false
  private width = 'auto'
  private height = 'auto'

  created() {
    this.TitleName = this.getTitle(this.title)
    this.activeValue = this.activeName
  }

  private getTitle(title: any) {
    if (title === '功能栏') {
      if (this.$route.meta.title) {
        return false
      } else {
        return title
      }
    }
    return title
  }

  private handleClick(tab:any, event:any) {
    this.$emit('handle-query', tab.name, 'state')
  }

  private closeTags(i:number) {
    let key = this.tags[i].key
    this.tags.splice(i, 1)
    if (key === 'endDate') {
      this.$emit('handle-query', '', 'startDate')
      this.$emit('handle-date', [])
    }
    this.$emit('handle-query', '', key)
  }

  private handleReset() {
    if (!this.active) {
      return
    }
    this.position = ''
    this.width = 'auto'
    this.active = false
    this.isSticky = false
  }

  private handleResize() {
    if (this.isSticky) {
      this.width = this.$el.getBoundingClientRect().width.toString() + 'px'
    }
  }
}
</script>

<style lang="scss">
.SuggestContainer-m{
  padding: 0;
  .el-collapse-item__header{
    height: auto;
  }
}
.SuggestContainer{
    width: 100%;
    background: #FFFFFF;
    box-shadow: 4px 4px 10px 0 rgba(218,218,218,0.50);
    margin-bottom: 10px;
    box-sizing: border-box;
    .el-collapse-item__header{
      height: auto;
    }
    .title{
        width: 100%;
        border-bottom: 2px solid #F8F9FA;
    }
    .routerName{
        width:max-content;
        height: 50px;
        line-height: 50px;
        padding:0 30px;
        box-sizing: border-box;
        font-size: 15px;
        color: #4A4A4A;
        span{
            width:100%;
            height: 5px;
            background-image: linear-gradient(270deg, #FF9600 0%, #FFB400 100%);
            border-radius: 2.5px;
            border-radius: 2.5px;
            position: relative;
            bottom: 2px;
            display: block;
        }
    }
    .el-collapse-item__header{
      display: block;
      text-align: center;
      color:#666;
      font-size: 14px;
      letter-spacing:1px;
    }
    .tab-box{
      padding:0 30px;
      box-sizing: border-box;
      .el-tabs__header{
        margin: 0;
        height:50px;
        line-height: 50px;
      }
    }
    .el-collapse{
      border-top: none;
    }
    .el-tag{
      margin: 0 10px;
    }
}
</style>
