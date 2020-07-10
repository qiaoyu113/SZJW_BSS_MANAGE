<template>
  <div :class="isPC ? 'CreatLine' : 'CreatLine-m'">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <SectionContainer
        title="详情信息"
        :md="true"
      >
        <el-row class="detail">
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'huozhuname',type: 5,label: '货主名称',tagAttrs: {placeholder: '请输入选择货主',filterable: true},options: [{
              value: '选项1',
              label: '黄金糕'
            }, {
              value: '选项2',
              label: '双皮奶'
            }, {
              value: '选项3',
              label: '蚵仔煎'
            }, {
              value: '选项4',
              label: '龙须面'
            }, {
              value: '选项5',
              label: '北京烤鸭'
            }]}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'linename',type: 1,label: '内部使用线路名称',tagAttrs: {placeholder: '名称应具有辨识度'}}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'upcarnum',type: 1,label: '可上车数',kind: 'number',placeholder: '请输入可上车数'}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'linetype',type: 3,label: '线路类型',radio: [{label: '供给型',type: 1},{label: '替换型',type: 2}]}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'waitday',type: 2,label: '等待上车有效期（天）',placeholder: '请选择时间'}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'remake',type: 1,label: '备注信息/线路描述',kind: 'textarea'}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :pccol="24"
            :params="{prop: 'wending',type: 3,label: '线路稳定性',radio: [{label: '一个月内（不稳定）',type: 1},{label: '两个月内（不稳定）',type: 2},{label: '2-4月（一般稳定）',type: 3},{label: '4个月以上（很稳定）',type: 4}]}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :pccol="12"
            :params="{prop: 'cangweizhi',type: 4,label: '仓位置',kind: '2',iswrite: true}"
          />
        </el-row>
      </SectionContainer>
      <SectionContainer
        title="配送信息"
        :md="true"
      >
        <el-row>
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'cartype',type: 5,label: '选择车型',placeholder: '请选择车型',options: [{
              value: '选项1',
              label: '黄金糕'
            }, {
              value: '选项2',
              label: '双皮奶'
            }, {
              value: '选项3',
              label: '蚵仔煎'
            }, {
              value: '选项4',
              label: '龙须面'
            }, {
              value: '选项5',
              label: '北京烤鸭'
            }]}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'linetype',type: 3,label: '是否需要返仓',radio: [{label: '是',type: 1},{label: '否',type: 2}]}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'linetype',type: 3,label: '是否需要回单',radio: [{label: '是',type: 1},{label: '否',type: 2}]}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'linename',type: 1,label: '预计每日平均配送点位数',placeholder: '请输入',kind: 'number'}"
            :pccol="8"
            :width="200"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'linename',type: 1,label: '预计每日平均总公里数（公里）',placeholder: '请输入',kind: 'number'}"
            :pccol="8"
            :width="240"
          />
          <SelfItem
            :rule-form="ruleForm"
            :pccol="12"
            :params="{prop: 'cangweizhi',type: 4,label: '配送区域',kind: '2',iswrite: true}"
          />
        </el-row>
      </SectionContainer>
      <SectionContainer
        title="结算信息"
        :md="true"
      >
        <el-row>
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'songnum',type: 1,label: '每日配送趟数',placeholder: '请输入',kind: 'number'}"
          />
          <div
            v-for="item in +ruleForm.songnum"
            :key="item"
          >
            <SelfItem

              :rule-form="ruleForm"
              :params="{prop: 'waitday',type: 2,label: '预计工作时间',placeholder: '请选择时间',kind: 'daterange'}"
            />
          </div>

          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'linename',type: 1,label: '预计月出车天数',placeholder: '请输入',kind: 'number'}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'linetype',type: 3,label: '结算方式',radio: [{label: '整车',type: 1},{label: '多点配',type: 2}]}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'linetype',type: 3,label: '结算天数',radio: [{label: '现结',type: 1},{label: '周结',type: 2},{label: '月结',type: 3},{label: '季度结',type: 4}]}"
          />

          <SelfItem
            v-if="ruleForm['linetype'] === 1"
            :rule-form="ruleForm"
            :params="{prop: 'linename',type: 1,label: '货主单趟报价',placeholder: '请输入',kind: 'number'}"
          />
          <SelfItem
            v-if="ruleForm['linetype']"
            :rule-form="ruleForm"
            :params="{prop: 'linename',type: 1,label: '预计货主预报价',placeholder: '请输入',kind: 'number'}"
          />
          <SelfItem
            v-if="ruleForm['linetype'] === 2"
            :rule-form="ruleForm"
            :params="{prop: 'linename',type: 1,label: '每趟保底（元）',placeholder: '请输入',kind: 'number'}"
          />
          <SelfItem
            v-if="ruleForm['linetype'] === 2"
            :rule-form="ruleForm"
            :params="{prop: 'linename',type: 1,label: '每趟提成单价（元）',placeholder: '请输入',kind: 'number'}"
          />
        </el-row>
      </SectionContainer>
      <SectionContainer
        title="货物信息"
        :md="true"
      >
        <el-row>
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'cartype',type: 5,label: '货物类型',placeholder: '请选择货物类型',options: [{
              value: '选项1',
              label: '黄金糕'
            }, {
              value: '选项2',
              label: '双皮奶'
            }, {
              value: '选项3',
              label: '蚵仔煎'
            }, {
              value: '选项4',
              label: '龙须面'
            }, {
              value: '选项5',
              label: '北京烤鸭'
            }]}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'linetype',type: 3,label: '货物总重量',radio: [{label: '是',type: 1},{label: '否',type: 2}]}"
          />
          <SelfItem
            :pccol="24"
            :rule-form="ruleForm"
            :params="{prop: 'linetype',type: 3,label: '是否需要搬运',radio: [{label: '一吨以下',type: 1},{label: '1-3吨',type: 2},{label: '1-3吨',type: 3},{label: '3-5吨',type: 4},{label: '5吨以上',type: 5}]}"
          />
        </el-row>
      </SectionContainer>
      <SectionContainer
        title="线路角色"
        :md="true"
      >
        <el-row>
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'cartype',type: 5,label: '所属销售',placeholder: '请选择所属销售',options: [{
              value: '选项1',
              label: '黄金糕'
            }, {
              value: '选项2',
              label: '双皮奶'
            }, {
              value: '选项3',
              label: '蚵仔煎'
            }, {
              value: '选项4',
              label: '龙须面'
            }, {
              value: '选项5',
              label: '北京烤鸭'
            }]}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'linename',type: 1,label: '线路打分',placeholder: '请输入'}"
          />
          <SelfItem
            :rule-form="ruleForm"
            :params="{prop: 'linename',type: 1,label: '线路角色',placeholder: '请输入'}"
          />
        </el-row>
      </SectionContainer>

      <div class="btn_box">
        <el-button
          v-if="pageStatus === 1"
          type="primary"
          name="CreatLine-btn-creat"
          @click="submitForm('ruleForm')"
        >
          立即创建
        </el-button>
        <el-button
          v-if="pageStatus === 2"
          type="primary"
          name="CreatLine-btn-creat"
          @click="submitForm('ruleForm')"
        >
          重新提交
        </el-button>
        <el-button
          v-if="pageStatus === 3"
          type="primary"
          name="CreatLine-btn-creat"
          @click="submitForm('ruleForm')"
        >
          提交
        </el-button>

        <el-button
          v-if="pageStatus === 4"
          type="primary"
          name="CreatLine-btn-creat"
        >
          审核通过
        </el-button>
        <el-button
          v-if="pageStatus === 4"
          type="primary"
          name="CreatLine-btn-creat"
          @click="auditBack = true"
        >
          审核拒绝
        </el-button>

        <el-button
          v-if="!(pageStatus === 4)"
          name="CreatLine-btn-cancel"
          @click="showDio = true"
        >
          取消
        </el-button>

        <el-button
          v-if="!(pageStatus === 4)"
          name="CreatLine-btn-reset"
          @click="resetForm('ruleForm')"
        >
          重置
        </el-button>
        <el-button
          v-if="pageStatus === 1"
          name="CreatLine-btn-xcxshow"
          @click="resetForm('ruleForm')"
        >
          小程序预览
        </el-button>
      </div>

      <Dialog
        :visible.sync="showDio"
        :title="`取消提交`"
        :center="true"
        :cancel="picCancel"
        :confirm="picConfirm"
      >
        <div>
          <div class="dioBox">
            线路未提交，是否放弃编辑？
          </div>
        </div>
      </Dialog>

      <Dialog
        :visible.sync="auditBack"
        :title="`审核拒绝`"
        :center="true"
        :cancel="auditCancel"
        :confirm="auditConfirm"
      >
        <div>
          <div class="dioBox">
            <span>拒绝原因：</span>
            <el-input
              v-model="auditBackText"
              type="textarea"
              placeholder="请输入拒绝原因"
              maxlength="100"
              show-word-limit
            />
          </div>
        </div>
      </Dialog>
    </el-form>
  </div>
</template>
<script lang="ts">
import { Form as ElForm, Input } from 'element-ui'
import Dialog from '@/components/Dialog/index.vue'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import DetailItem from '@/components/DetailItem/index.vue'
import SectionContainer from '@/components/SectionContainer/index.vue'
import SelfItem from '@/components/base/SelfItem.vue'
import '@/styles/common.scss'
@Component({
  name: 'CreatLine',
  components: {
    SelfItem,
    SectionContainer,
    Dialog
  }
})
export default class CreatLine extends Vue {
  private pageStatus:number = 0
  private pccol:number=6
  private showDio:boolean = false
  private auditBack:boolean = false
  private auditBackText:string = ''
  private ruleForm:any = {
    huozhuname: '',
    linename: '',
    linetype: 1,
    upcarnum: '',
    wending: '',
    usename: '',
    remake: '',
    cangweizhi: [],
    waitday: '',
    songnum: 2
  }
  private rules:any = {
    huozhuname: [
      { required: true, message: '请输入活动名称', trigger: 'blur' }
    ],
    linename: [
      { required: true, message: '请输入活动名称', trigger: 'blur' },
      { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],
    upcarnum: [
      { required: true, message: '请选择活动区域', trigger: 'change' }
    ],
    usename: [
      { required: true, message: '请选择活动区域', trigger: 'change' }
    ],
    remake: [
      { required: true, message: '请选择活动区域', trigger: 'change' }
    ],
    cangweizhi: [
      { required: true, message: '请选择活动区域', trigger: 'change' }
    ],
    waitday: [
      { required: true, message: '请选择活动资源', trigger: 'change' }
    ],
    wending: [
      { required: true, message: '请选择活动资源', trigger: 'change' }
    ]
  }

  @Watch('ruleForm', { deep: true })
  private changeRuleForm(value:any) {
    console.log(value.songnum)
  }
  private submitForm(formName:any) {
    (this.$refs[formName] as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        console.log(this.ruleForm)
        alert('submit!')
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  private resetForm(formName:any) {
    (this.$refs[formName] as ElForm).resetFields()
  }

  private picCancel(done: any) {
    done()
  }
  private picConfirm(done: any) {
    done(this.$router.go(-1))
  }
  private auditConfirm(done: any) {
    done(this.$router.go(-1))
  }
  private auditCancel(done:any) {
    this.auditBack = false
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  created() {
    let routeArr = this.$route.path.split('/')
    if (routeArr[2] === 'creatline') {
      this.pageStatus = 1
    } else if (routeArr[2] === 'lineedit') {
      this.pageStatus = 2
    } else if (routeArr[2] === 'linecopy') {
      this.pageStatus = 3
    } else if (routeArr[2] === 'lineaudit') {
      this.pageStatus = 4
    }
  }
}
</script>
<style lang="scss" scoped>
.CreatLine {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .btn-content{
    color: #4a4a4a;
    font-weight: 400;
  }
  .btn_box{
    padding-top: 40px;
    box-sizing: border-box;
  }
    .dioBox{
      display: flex;
      align-items: flex-start;
      margin-bottom: 20px;
      padding: 0 20px;
      .el-input{
        width: 200px!important;
      }
  }
}
</style>
<style lang="scss" scoped>
.CreatLine-m {
  width: 100%;
  .el-form-item__label{
    color: #4a4a4a;
    font-weight: 400;
  }
  .btn_box{
    padding: 30px 20px 0 20px;
    box-sizing: border-box;
    .el-button{
      width: 100%;
    }
    .el-button{
      margin: 0 0 20px 0;
    }
  }
    .dioBox{
    margin-bottom: 20px;
    padding: 0 20px;
    .el-input{
      width: 200px!important;
    }
  }
}
</style>
<style lang="scss" scoped>
@media screen and (min-width: 701px) {
  .SelfItem .el-select {
    width: 100%;
  }
  .SelfItem  .el-input, .el-date-editor, .el-textarea {
    width: 75%;
  }
  // .el-cascader{
  //   width: 100%;
  // }
}

@media screen and (max-width: 700px) {
  .el-select {
    width: 100%;
  }
  .el-input{
    width: 90%;
  }
}
</style>
