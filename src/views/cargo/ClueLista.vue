<template>
  <div>
    <div class="container">
      <div class="top" />
      <div class="head">
        <el-collapse>
          <el-collapse-item
            title="点击筛选"
          >
            <div class="head-box">
              <el-form
                :model="listQuery"
                label-width="120px"
              >
                <el-row :span="4">
                  <el-col :span="6">
                    <el-form-item
                      label="线索编号"
                      prop="clueId"
                    >
                      <el-input
                        v-model="listQuery.clueId"
                        placeholder="请输入线索编号"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      label="姓名"
                      prop="name"
                    >
                      <el-input
                        v-model="listQuery.name"
                        placeholder="请输入姓名"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      label="手机号"
                      prop="phone"
                    >
                      <el-input
                        v-model="listQuery.phone"
                        placeholder="请输入手机号"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      label="线索状态"
                      prop="clueState"
                    >
                      <el-select
                        v-model="listQuery.clueState"
                        placeholder="请选择"
                      >
                        <el-option
                          label="待更进"
                        />
                        <el-option
                          label="已更进"
                        />
                        <el-option
                          label="已转化"
                        />
                        <el-option
                          label="无效"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :span="4">
                  <el-col :span="6">
                    <el-form-item
                      label="线索来源"
                      prop="clueSource"
                    >
                      <el-select
                        v-model="listQuery.clueSource"
                        placeholder="请选择"
                      >
                        <el-option
                          label="渠道自拓"
                        />
                        <el-option
                          label="自有资源"
                        />
                        <el-option
                          label="企查查"
                        />
                        <el-option
                          label="天眼查"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      label="城市"
                      prop="city"
                    >
                      <el-select
                        v-model="listQuery.city"
                        placeholder="请选择"
                      >
                        <el-option
                          label="武汉市"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      label="分配状态"
                      prop="distributionState"
                    >
                      <el-select
                        v-model="listQuery.distributionState"
                        placeholder="请选择"
                      >
                        <el-option
                          label="待分配"
                        />
                        <el-option
                          label="已分配"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      label="销售"
                      prop="lineSaleId"
                    >
                      <el-select
                        v-model="listQuery.lineSaleId"
                        placeholder="请选择"
                      >
                        <el-option
                          label="1"
                        />
                        <el-option
                          label="2"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :span="2">
                  <el-col :span="12">
                    <el-form-item label="创建日期">
                      <el-date-picker
                        v-model="DateValueChild"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="changData()"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-button
                      size="small"
                      @click="resetForm"
                    >
                      重置
                    </el-button>
                    <el-button
                      size="small"
                      type="primary"
                      @click="search"
                    >
                      查询
                    </el-button>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <div class="table-box">
      <div
        class="table"
        style="text-align:right"
      >
        <el-button
          size="small"
          type="primary"
          @click="createClue"
        >
          <i class="el-icon-plus" />
          <span>新增线索</span>
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="goImport"
        >
          <i class="el-icon-download" />
          <span>导入</span>
        </el-button>
        <el-button
          size="small"
          type="primary"
        >
          <i class="el-icon-s-operation" />
          <span>筛选</span>
        </el-button>
      </div>
      <div class="table_center">
        <el-table
          ref="multipleTable"
          v-loading="listLoading"
          :data="tableData"
          :row-style="{height: '20px'}"
          :cell-style="{padding: '5px 0'}"
          size="mini"
          :max-height="tableHeight"
          fit
          border
          stripe
          highlight-current-row
          style="width: 100%"
          align="left"
          row-key="clueId"
          @cell-click="tableClick"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            v-if="isShowDistribution"
            :key="checkList.length + 'selection'"
            type="selection"
            width="55"
            reserve-selection
            align="center"
          />
          <el-table-column
            prop="index"
            label="序号"
          />
          <el-table-column
            prop="clueId"
            label="线索编号"
          />
          <el-table-column
            prop="distributionState"
            label="分配状态"
          />
          <el-table-column
            prop="lineSaleName"
            label="销售"
          />
          <el-table-column
            prop="clueState"
            label="线索状态"
          />
          <el-table-column
            prop="clueSourceName"
            label="线索来源"
          />
          <el-table-column
            prop="city"
            label="城市"
          />
          <el-table-column
            prop="company"
            label="公司"
          />
          <el-table-column
            prop="name"
            label="姓名"
          />
          <el-table-column
            prop="phone"
            label="手机号"
          />
          <el-table-column
            prop="position"
            label="职务"
          />
          <el-table-column
            prop="createDate"
            label="创建日期"
          />
          <el-table-column
            prop="updateDate"
            label="更新日期"
          />
          <el-table-column
            prop="remark"
            label="备注"
          />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listQuery: {
        clueId: '',
        name: '',
        phone: '',
        clueState: '',
        clueSource: '',
        city: '',
        distributionState: '',
        lineSaleId: '',
        DateValueChild: ''
      },
      tableData: [{
        index: '1', // 序号
        clueId: '1', // 线索编号
        distributionState: '已分配', // 分配状态
        lineSaleName: '小明', // 销售
        clueState: '已转化', // 线索状态
        clueSourceName: '企查查', // 线索来源
        city: '武汉市',
        company: '',
        name: '小王',
        phone: '1365****635',
        position: '', // 职务
        createDate: '', // 创建日期
        updateDate: '', // 更新日期
        remark: ''// 备注
      },
      {
        index: '2', // 序号
        clueId: '2', // 线索编号
        distributionState: '已分配', // 分配状态
        lineSaleName: '小明', // 销售
        clueState: '已转化', // 线索状态
        clueSourceName: '企查查', // 线索来源
        city: '武汉市',
        company: '',
        name: '小王',
        phone: '1365****635',
        position: '', // 职务
        createDate: '', // 创建日期
        updateDate: '', // 更新日期
        remark: ''// 备注
      }]
    }
  }
}
</script>

<style scoped>
.container {
  padding: 25px 15px;
}
.el-collapse{
    padding: 0px 30px 0px 0px;
    box-sizing: border-box;
    position: absolute;
    z-index: 1000;
    background: rgb(255, 255, 255);
    box-shadow: rgba(218, 218, 218, 0.85) 4px 4px 10px 0px;
    right: 15px;
    left: 15px;
}
.top {
  background: #2f448a;
  color: #ffffff;
  width: 1296px;
  height: 48px;
  justify-content: center;
  display: inline-block;
  position: relative;
  top: -10px;
}
.el-input {
  width: 140px;
}
.el-collapse-item {
  margin: 0 auto;
}
.head-box {
  text-align: left;
  padding: 15px 40px;
  display: inline-block;
}
.table-box{
  width: 1296px;
  padding: 25px 15px;
}
.table {
  background: #ffffff;
  box-shadow:  rgba(218, 218, 218, 0.5);
  overflow: hidden;
  width: 1296px;
  padding: 10px 15px;
  transform: translateZ(0);
}
.table_center{
   padding: 0 30px;
   width: 1296px;
      padding-bottom: 0;
      box-sizing: border-box;
      background: #ffffff;
}
</style>

<style scoped>
  .container   >>> .el-collapse-item__header {
    justify-content: center;
  }
  .container   >>> .el-collapse-item__arrow  {
    margin-left:0px;
  }
</style>
