<template>
  <div class="settings">
    <div class="setting-content">
      <el-form :model="userSet" label-width="120px">
        <el-form-item :label="$t('setting.theme')">
          <el-radio-group v-model="userSet.theme">
            <el-radio label="light">{{ $t('setting.light') }}</el-radio>
            <el-radio label="dark">{{ $t('setting.dark') }}</el-radio>
            <el-radio label="custom">{{ $t('setting.custom') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('setting.appbar-color')">
          <el-color-picker v-model="userSet.appColor" show-alpha :predefine="predefineColors" />
        </el-form-item>
        <el-form-item :label="$t('setting.background-color')">
          <el-color-picker
            v-model="userSet.backgroundColor"
            show-alpha
            :predefine="predefineColors"
          />
        </el-form-item>
        <el-form-item :label="$t('setting.background-image')">
          <el-input v-model="userSet.backgroundImage" />
        </el-form-item>
        <el-form-item :label="$t('setting.font-family')">
          <el-radio-group v-model="userSet.editorFontFamily">
            <el-radio :label="1">{{ $t('setting.font-song') }}</el-radio>
            <el-radio :label="2">{{ $t('setting.font-system') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('setting.font-color')">
          <el-color-picker
            v-model="userSet.editorFontColor"
            show-alpha
            :predefine="predefineColors"
          />
        </el-form-item>
        <el-form-item :label="$t('setting.font-size')">
          <el-input v-model="userSet.editorFontSize" />
        </el-form-item>
        <el-form-item :label="$t('setting.line-height')">
          <el-input v-model="userSet.editorLineHeight" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit"> {{ $t('setting.save-setting') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { clone } from '../utils/helper'

const { t } = useI18n()

const userSet = ref({
  theme: 'light',
  showSide: true,
  mode: 'normal',
  appColor: 'rgba(255, 69, 0, 0.68)',
  backgroundColor: 'rgba(255, 255, 255, 1)',
  backgroundImage: '',
  lang: 'en',
  server: '',
  editorFontFamily: 1,
  editorFontColor: 'rgba(0, 0, 0, 1)',
  editorLineHeight: 1.6,
  editorFontSize: 16,
  editorPadding: 10
})

const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577'
])

const initSettings = (data: any) => {
  userSet.value = clone(data)
}

const emit = defineEmits(['on-change'])
const onSubmit = () => {
  emit('on-change', userSet.value)
}

defineExpose({ initSettings })
</script>
<style scoped lang="scss">
.setting-content {
  margin: 0 60px;
  .el-button {
    background-color: var(--el-color-primary);
  }
}
</style>
