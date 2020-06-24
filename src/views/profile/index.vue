<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <el-col
          :span="24"
          :xs="24"
        >
          <user-card :user="user" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import Account from './components/Account.vue'
import Activity from './components/Activity.vue'
import Timeline from './components/Timeline.vue'
import UserCard from './components/UserCard.vue'

export interface IProfile {
  name: string
  email: string
  avatar: string
  roles: string
}

const defaultProfile: IProfile = {
  name: 'Loading...',
  email: 'Loading...',
  avatar: 'Loading...',
  roles: 'Loading...'
}

@Component({
  name: 'Profile',
  components: {
    Account,
    Activity,
    Timeline,
    UserCard
  }
})
export default class extends Vue {
  private user = defaultProfile
  private activeTab = 'activity'

  get name() {
    return UserModule.name
  }

  get email() {
    return UserModule.email
  }

  get avatar() {
    return UserModule.avatar
  }

  get roles() {
    return UserModule.roles
  }

  created() {
    this.getUser()
  }

  private getUser() {
    this.user = {
      name: this.name,
      email: this.email,
      avatar: this.avatar,
      roles: this.roles.join(' | ')
    }
  }
}
</script>
