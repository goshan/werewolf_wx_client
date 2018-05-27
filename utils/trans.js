const turn_map = {
  init: "准备",
  check_role: "查看身份",
  day: "白天",
  wolf: "夜晚 狼人行动",
  long_wolf: "夜晚 大灰狼行动",
  witch: "夜晚 女巫行动",
  seer: "夜晚 预言家行动",
  savior: "夜晚 守卫行动",
  magician: "夜晚 魔术师行动",
  augur: "夜晚 占卜师行动"
}

const role_map = {
  seer: "预言家",
  witch: "女巫",
  hunter: "猎人",
  savior: "守卫",
  idiot: "白痴",
  magician: "魔术师",
  augur: "占卜师",
  chief_wolf: "白狼王",
  lord_wolf: "狼王",
  long_wolf: "大灰狼",
  ghost_rider: "恶灵骑士",
  villager: "村民",
  normal_wolf: "狼人"
}

const panel_tip_map = {
  kill: "请从下方存活玩家中选择一名猎杀，不选择视为空刀",
  poison: "请从下方存活玩家中选择一名毒杀，不选择视为不采取行动",
  confirm: "请从下方存活玩家中选择一名查验",
  guard: "请从下方存活玩家中选择一名守护，不选择视为空守",
  exchange: "请从下方存活玩家中选择两名交换，不选择视为不交换",
  lock: "请从下方存活玩家中选择一名锁定，不选择视为不锁定",
  kill_more: "请从下方存活玩家中选择一名追刀，不可以空刀",
  throw: "请选择玩家放逐"
}

const dialog_message_map = {
  prescribe: "今晚被猎杀的是{killed}号玩家，请操作",
  prescribe_unknow: "无法获知今晚被猎杀玩家信息，请操作",
  prescribe_none: "今晚没有玩家被猎杀，请操作",
  confirm: "{pos}号玩家的身份是【{role?evil:狼人,virtuous:好人}】",
  lock: "今晚是否锁定玩家",
  kill_more: "今晚是否追刀"
}

const dialog_button_map = {
  antidot: ["救人", 'btn-success'],
  poison: ["毒人", 'btn-purple'],
  rest: ["不行动", 'btn-default'],
  confirm_finish: ["明白", 'btn-default'],
  lock: ["锁定", 'btn-warn'],
  kill_more: ["追刀", 'btn-danger']
}

const turn = function(turn) {
  return turn_map[turn]
}

const role = function(role) {
  return {
    text: role_map[role],
    image: "/assets/role/"+role+".jpg"
  }
}

const panel_tip = function(skill, params) {
  var template = panel_tip_map[skill]
  return insert_params(template, params)
}

const skill_dialog = function(skill, params) {
  var template = dialog_message_map[skill]
  return insert_params(template, params)
}

const skill_dialog_button = function(skill) {
  return dialog_button_map[skill]
}

// private

const insert_params = function(template, params) {
  // change {key} to params[key]
  var res = template.replace(/\{([^\{\}\?:,]+)\}/g, function(x, y) {
    return params[y] ? params[y] : '??'
  })
  // change {key?a:val_a,b:val_b} to val_a if params[key] == a or val_b if params[key] == b
  res = res.replace(/\{([^\{\}\?:,]+)\?(([^\{\}\?:,]+:[^\{\}\?:,]+,?)+)\}/g, function(x, y, z) {
    var c_m = z.match(/([^\{\}\?:,]+):([^\{\}\?:,]+)/g)
    for (var r in c_m) {
      var r_a = c_m[r].split(':')
      if (params[y] == r_a[0]) {
        return r_a[1]
      }
    }
  })
  return res
}

module.exports = {
  turn: turn,
  role: role,
  panel_tip: panel_tip,
  skill_dialog: skill_dialog,
  skill_dialog_button: skill_dialog_button
}
