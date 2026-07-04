import type { LoomiTranslations } from "./types.js";

export const zh_CN: LoomiTranslations = {
  common: { close: "关闭", dismiss: "关闭", remove: "移除", clear: "清除", loading: "正在加载" },
  validation: {
    requiredField: "请填写此字段。",
    selectOption: "请选择一个选项。",
    selectFile: "请选择一个文件。",
    enterNumber: "请输入数字。",
    selectTime: "请选择时间。",
  },
  datepicker: {
    placeholder: "选择日期",
    previousMonth: "上个月",
    nextMonth: "下个月",
    previousYears: "前 12 年",
    nextYears: "后 12 年",
    chooseMonth: "选择月份",
    chooseYear: "选择年份",
    dialog: "日期选择器",
  },
  filepicker: { placeholderLine1: "选择文件或拖放以上传", placeholderLine2: "%s，最大 %s", cropTitle: "裁剪图片", cropApply: "应用", cropCancel: "取消", fileTooLargeTitle: "文件过大", fileTooLarge: "\":name\" 超过 :limit 限制。" },
  select: { placeholder: "请选择", emptyPlaceholder: "没有可用选项", searchPlaceholder: "搜索..." },
  countries: { placeholder: "选择国家", emptyPlaceholder: "未找到国家", searchPlaceholder: "搜索国家...", phoneNumberLabel: "电话号码", selectCountryCode: "选择国家代码" },
  table: { searchPlaceholder: "搜索...", noDataMessage: "没有可显示的记录", actionsTitle: "操作" },
  pagination: { totalLabel: "显示第 :a 到 :b 条，共 :c 条", noRecords: "没有记录", pageOf: "第 :page 页，共 :pages 页" },
  modal: { ok: "确定", cancel: "取消", dialog: "对话框" },
  drawer: { dialog: "抽屉" },
  pin: { errorMessage: "验证码无效", digitLabel: "第 :number 位", validating: "正在验证代码…", valid: "验证码已通过" },
  colorpicker: { pickColor: "选择颜色" },
  input: { togglePassword: "切换密码可见性" },
  number: { increment: "增加", decrement: "减少" },
  processing: { processing: "处理中" },
  sortable: { dropHere: "拖放到此处" },
  themeSwitcher: { light: "浅色", dark: "深色", system: "系统", theme: "主题", selectedTheme: "主题：:theme" },
  timepicker: { placeholder: "HH:MM", hour: "小时", minute: "分钟", ampm: "上午/下午", toggleFormat: "切换12/24小时制" },
  timezonepicker: { placeholder: "选择时区", emptyPlaceholder: "未找到时区", searchPlaceholder: "搜索时区...", detectLabel: "使用我的时区" },
  creditcard: { cardholderLabel: "持卡人", expiresLabel: "有效期至", namePlaceholder: "姓名", numberLabel: "卡号", cvcLabel: "安全码", flipToBack: "显示安全码", flipToFront: "返回卡片正面" },
  rating: { label: "评分", valueLabel: "评分 :value / :max" },
  mention: { emptyPlaceholder: "没有匹配项" },
};

export default zh_CN;
