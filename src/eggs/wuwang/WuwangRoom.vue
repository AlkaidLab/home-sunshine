<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  sponsor: { type: Object, default: null },
  room: { type: Object, required: true },
  members: { type: Array, default: () => [] },
})
const emit = defineEmits(['close'])

const colors = ['#4ade80', '#38bdf8', '#facc15', '#fb7185', '#a78bfa', '#2dd4bf', '#f97316', '#e879f9']
const moods = ['在线', '围观', '摸鱼', '冒泡', '潜水', '路过', '发光', '待机']
const roomNotes = [
  '头像已全部入座',
  '今日房间信号稳定',
  '群友频道保持连接',
  '隐藏名单展开完成',
]

const roomRef = ref(null)
const entered = ref(false)
const activeIndex = ref(0)
const bubbles = ref([])
let rotateTimer = null

const roomTheme = computed(() => props.room.theme || 'forest')
const roomIcon = computed(() => props.room.icon || '◇')
const roomParticles = computed(() => props.room.particles?.length ? props.room.particles : ['◇', '·', '✧'])
const bubbleGlyphs = computed(() => props.room.bubbles?.length ? props.room.bubbles : ['✨', '🎮', '🌙'])

const memberInitial = (member) => {
  const name = member?.name || '?'
  return Array.from(name.replace(/\s+/g, ''))[0] || '?'
}

const memberList = computed(() => {
  const source = props.members?.length ? props.members : []
  return source.map((member, index) => ({
    id: member.name || `member-${index}`,
    name: member.name || `群友 ${index + 1}`,
    avatar: member.avatar || '',
    color: member.color || colors[index % colors.length],
    initial: memberInitial(member),
    mood: moods[index % moods.length],
    seat: String(index + 1).padStart(2, '0'),
  }))
})

const activeMember = computed(() => memberList.value[activeIndex.value] || memberList.value[0])
const sponsorInfo = computed(() => props.sponsor ? {
  name: props.sponsor.name || '赞助者',
  avatar: props.sponsor.avatar || '',
  initial: memberInitial(props.sponsor),
} : null)
const roomDensity = computed(() => Math.min(99, 62 + memberList.value.length))
const spotlightMembers = computed(() => memberList.value.slice(0, 5))
const tickerMembers = computed(() => [...memberList.value.slice(5), ...memberList.value.slice(0, 5)])

const setActiveMember = (index, event) => {
  activeIndex.value = index
  if (!event || !roomRef.value) return

  const roomBox = roomRef.value.getBoundingClientRect()
  const targetBox = event.currentTarget.getBoundingClientRect()
  const bubble = {
    id: `${Date.now()}-${Math.random()}`,
    text: bubbleGlyphs.value[index % bubbleGlyphs.value.length],
    x: targetBox.left - roomBox.left + targetBox.width / 2,
    y: targetBox.top - roomBox.top + targetBox.height / 2,
  }
  bubbles.value = [...bubbles.value, bubble]
  setTimeout(() => {
    bubbles.value = bubbles.value.filter(item => item.id !== bubble.id)
  }, 1100)
}

const nextMember = () => {
  if (!memberList.value.length) return
  activeIndex.value = (activeIndex.value + 1) % memberList.value.length
}

onMounted(() => {
  nextTick(() => {
    entered.value = true
    roomRef.value?.focus()
  })
  rotateTimer = setInterval(nextMember, 4200)
})

onUnmounted(() => {
  if (rotateTimer) clearInterval(rotateTimer)
})
</script>

<template>
  <div
    ref="roomRef"
    class="wr-room"
    :class="[entered ? 'wr-room--entered' : '', `wr-room--${roomTheme}`]"
    tabindex="0"
  >
    <div class="wr-bg" aria-hidden="true">
      <span
        v-for="n in 18"
        :key="n"
        :style="{
          '--x': `${(n * 17) % 100}%`,
          '--delay': `${(n % 8) * 0.5}s`,
          '--dur': `${7 + (n % 6)}s`,
        }"
      >{{ roomParticles[n % roomParticles.length] }}</span>
    </div>

    <span
      v-for="bubble in bubbles"
      :key="bubble.id"
      class="wr-pop"
      :style="{ left: bubble.x + 'px', top: bubble.y + 'px' }"
      aria-hidden="true"
    >{{ bubble.text }}</span>

    <button type="button" class="wr-close" @click="emit('close')" title="关闭">✕</button>

    <div class="wr-inner">
      <header class="wr-header">
        <div class="wr-title-block">
          <span class="wr-kicker">群友房间</span>
          <h3><span>{{ roomIcon }}</span>群友房间</h3>
          <p>{{ memberList.length }} 位群友已入座</p>
        </div>

        <div class="wr-stats" aria-label="房间状态">
          <div>
            <span>群友</span>
            <strong>{{ memberList.length }}</strong>
          </div>
          <div>
            <span>热闹值</span>
            <strong>{{ roomDensity }}%</strong>
          </div>
          <div>
            <span>状态</span>
            <strong>在线</strong>
          </div>
        </div>
      </header>

      <section class="wr-stage">
        <div class="wr-host" v-if="sponsorInfo">
          <span class="wr-host-label">入口头像</span>
          <span class="wr-host-avatar">
            <img v-if="sponsorInfo.avatar" :src="sponsorInfo.avatar" :alt="sponsorInfo.name" />
            <span v-else>{{ sponsorInfo.initial }}</span>
          </span>
          <strong>{{ sponsorInfo.name }}</strong>
        </div>

        <div class="wr-focus" v-if="activeMember">
          <span class="wr-focus-ring" aria-hidden="true"></span>
          <span class="wr-focus-avatar" :style="{ '--member-color': activeMember.color }">
            <img v-if="activeMember.avatar" :src="activeMember.avatar" :alt="activeMember.name" />
            <span v-else>{{ activeMember.initial }}</span>
          </span>
          <div>
            <span>当前焦点</span>
            <strong>{{ activeMember.name }}</strong>
            <small>{{ activeMember.mood }} · Seat {{ activeMember.seat }}</small>
          </div>
        </div>

        <div class="wr-note-list">
          <span
            v-for="note in roomNotes"
            :key="note"
          >{{ note }}</span>
        </div>
      </section>

      <section class="wr-spotlight" v-if="spotlightMembers.length">
        <button
          v-for="(member, index) in spotlightMembers"
          :key="member.id"
          type="button"
          class="wr-spotlight-seat"
          :class="{ 'wr-member-active': activeMember?.id === member.id }"
          :style="{ '--member-color': member.color, '--seat-index': index }"
          @click="setActiveMember(index, $event)"
        >
          <span>
            <img v-if="member.avatar" :src="member.avatar" :alt="member.name" />
            <i v-else>{{ member.initial }}</i>
          </span>
          <strong>{{ member.name }}</strong>
        </button>
      </section>

      <section class="wr-wall">
        <button
          v-for="(member, index) in memberList"
          :key="member.id"
          type="button"
          class="wr-member"
          :class="{ 'wr-member-active': activeMember?.id === member.id }"
          :style="{ '--member-color': member.color, '--member-delay': `${index * 0.035}s` }"
          @click="setActiveMember(index, $event)"
        >
          <span class="wr-member-avatar">
            <img v-if="member.avatar" :src="member.avatar" :alt="member.name" />
            <i v-else>{{ member.initial }}</i>
          </span>
          <span class="wr-member-info">
            <strong>{{ member.name }}</strong>
            <small>{{ member.mood }}</small>
          </span>
        </button>
      </section>

      <div class="wr-ticker" v-if="tickerMembers.length" aria-hidden="true">
        <div>
          <span
            v-for="member in tickerMembers"
            :key="`ticker-${member.id}`"
          >{{ member.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.wr-room {
  margin-top: 2rem;
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid color-mix(in srgb, var(--room-accent) 28%, transparent);
  color: #f7fbff;
  outline: none;
  opacity: 0;
  transform: translateY(12px) scale(0.98);
  transition: opacity 0.35s ease, transform 0.35s ease;
  --room-accent: #58e6a3;
  --room-accent-2: #7dd3fc;
  --room-panel: rgba(255,255,255,0.06);
  --room-line: rgba(255,255,255,0.12);
  background: #08111c;

  &--entered {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  &--forest {
    --room-accent: #75e89b;
    --room-accent-2: #facc15;
    background: radial-gradient(ellipse at 18% 12%, rgba(117, 232, 155, 0.16), transparent 42%), linear-gradient(180deg, #07120d, #0b1d13 56%, #07110d);
  }

  &--firefly {
    --room-accent: #facc15;
    --room-accent-2: #38bdf8;
    background: radial-gradient(circle at 18% 20%, rgba(250, 204, 21, 0.16), transparent 34%), linear-gradient(180deg, #080d20, #10172f);
  }

  &--rain {
    --room-accent: #38bdf8;
    --room-accent-2: #fbbf24;
    background: repeating-linear-gradient(115deg, transparent 0 18px, rgba(186, 230, 253, 0.06) 18px 19px, transparent 19px 34px), linear-gradient(180deg, #07111d, #111827);
  }

  &--arcade {
    --room-accent: #f472b6;
    --room-accent-2: #22d3ee;
    background: linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(180deg, #15091e, #080817);
    background-size: 22px 22px, 22px 22px, auto;
  }

  &--stargate {
    --room-accent: #93c5fd;
    --room-accent-2: #c084fc;
    background: radial-gradient(circle at 50% 50%, rgba(147, 197, 253, 0.18), transparent 24%), linear-gradient(180deg, #070b1b, #10162f);
  }

  &--library {
    --room-accent: #d8b46a;
    --room-accent-2: #fef3c7;
    background: repeating-linear-gradient(180deg, transparent 0 52px, rgba(216, 180, 106, 0.08) 52px 53px), linear-gradient(180deg, #15110c, #100d0a);
  }

  &--aurora {
    --room-accent: #5eead4;
    --room-accent-2: #f472b6;
    background: linear-gradient(112deg, transparent 0%, rgba(94, 234, 212, 0.16) 30%, transparent 50%, rgba(244, 114, 182, 0.13) 74%, transparent 100%), linear-gradient(180deg, #05131a, #07131c);
  }

  &--kitchen {
    --room-accent: #fb923c;
    --room-accent-2: #facc15;
    background: radial-gradient(ellipse at 50% 100%, rgba(251, 146, 60, 0.16), transparent 46%), linear-gradient(180deg, #1a0e08, #120c08);
  }
}

.wr-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.wr-bg span {
  position: absolute;
  left: var(--x);
  top: -24px;
  color: var(--room-accent);
  opacity: 0.28;
  animation: room-drift var(--dur) linear infinite;
  animation-delay: var(--delay);
}

@keyframes room-drift {
  to { transform: translateY(680px) rotate(220deg); opacity: 0; }
}

.wr-pop {
  position: absolute;
  z-index: 10;
  pointer-events: none;
  transform: translate(-50%, -50%);
  animation: room-pop 1.1s ease-out forwards;
  font-size: 1.2rem;
}

@keyframes room-pop {
  0% { opacity: 0; transform: translate(-50%, -30%) scale(0.6); }
  30% { opacity: 1; transform: translate(-50%, -70%) scale(1.1); }
  100% { opacity: 0; transform: translate(-50%, -130%) scale(0.9); }
}

.wr-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 5;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--room-line);
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.78);
  cursor: pointer;
}

.wr-inner {
  position: relative;
  z-index: 1;
  padding: 1.5rem;
}

.wr-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-right: 4.8rem;
  margin-bottom: 1rem;
}

.wr-kicker,
.wr-stats span,
.wr-host-label,
.wr-focus span,
.wr-note-list span {
  color: color-mix(in srgb, var(--room-accent) 72%, white);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.wr-title-block h3 {
  margin: 0.35rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.9rem;
  color: #fff;
}

.wr-title-block p {
  margin: 0;
  color: rgba(255,255,255,0.55);
  font-size: 0.82rem;
}

.wr-stats {
  align-self: end;
  display: grid;
  grid-template-columns: repeat(3, minmax(74px, 1fr));
  gap: 0.55rem;
}

.wr-stats div {
  min-width: 0;
  padding: 0.65rem;
  border: 1px solid var(--room-line);
  background: var(--room-panel);
}

.wr-stats strong {
  display: block;
  margin-top: 0.2rem;
  color: #fff;
  font-size: 1rem;
}

.wr-stage,
.wr-wall,
.wr-spotlight,
.wr-ticker {
  border: 1px solid var(--room-line);
  background: var(--room-panel);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
}

.wr-stage {
  min-height: 180px;
  display: grid;
  grid-template-columns: 168px minmax(0, 1fr) 210px;
  gap: 1rem;
  align-items: stretch;
  padding: 1rem;
  margin-bottom: 1rem;
}

.wr-host,
.wr-focus,
.wr-note-list {
  min-width: 0;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.045);
}

.wr-host {
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 0.55rem;
  text-align: center;
}

.wr-host-avatar {
  width: 74px;
  height: 74px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid color-mix(in srgb, var(--room-accent) 40%, transparent);
}

.wr-host-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wr-host strong {
  max-width: 120px;
  color: #fff;
  font-size: 0.86rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wr-focus {
  position: relative;
  display: grid;
  grid-template-columns: 118px minmax(0, 1fr);
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  overflow: hidden;
}

.wr-focus-ring {
  position: absolute;
  left: 36px;
  width: 116px;
  height: 116px;
  border: 1px dashed color-mix(in srgb, var(--room-accent) 36%, transparent);
  border-radius: 50%;
  animation: focus-spin 10s linear infinite;
}

@keyframes focus-spin {
  to { transform: rotate(360deg); }
}

.wr-focus-avatar,
.wr-member-avatar,
.wr-spotlight-seat span,
.avatar-token {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  background:
    radial-gradient(circle at 30% 20%, rgba(255,255,255,0.42), transparent 30%),
    linear-gradient(135deg, color-mix(in srgb, var(--member-color) 68%, white), var(--member-color));
  color: rgba(8, 13, 18, 0.82);
  font-weight: 900;
  box-shadow: 0 0 12px color-mix(in srgb, var(--member-color) 34%, transparent);
}

.wr-focus-avatar {
  position: relative;
  width: 92px;
  height: 92px;
  font-size: 1.4rem;
}

.wr-focus-avatar img,
.wr-member-avatar img,
.wr-spotlight-seat img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wr-focus strong {
  display: block;
  margin: 0.2rem 0;
  color: #fff;
  font-size: 1.2rem;
}

.wr-focus small {
  color: rgba(255,255,255,0.52);
  font-size: 0.78rem;
}

.wr-note-list {
  display: grid;
  align-content: center;
  gap: 0.55rem;
  padding: 1rem;
}

.wr-note-list span {
  color: rgba(255,255,255,0.48);
  line-height: 1.4;
  text-transform: none;
  letter-spacing: 0;
}

.wr-spotlight {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.75rem;
  padding: 0.85rem;
  margin-bottom: 1rem;
}

.wr-spotlight-seat {
  min-width: 0;
  display: grid;
  justify-items: center;
  gap: 0.45rem;
  padding: 0.75rem 0.45rem;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.wr-spotlight-seat:hover,
.wr-member:hover,
.wr-member-active {
  border-color: color-mix(in srgb, var(--member-color, var(--room-accent)) 42%, transparent);
  background: color-mix(in srgb, var(--member-color, var(--room-accent)) 12%, rgba(255,255,255,0.04));
}

.wr-spotlight-seat:hover,
.wr-member:hover {
  transform: translateY(-2px);
}

.wr-spotlight-seat span {
  width: 54px;
  height: 54px;
}

.wr-spotlight-seat strong {
  max-width: 100%;
  font-size: 0.72rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wr-wall {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(112px, 1fr));
  gap: 0.7rem;
  padding: 0.85rem;
}

.wr-member {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.72);
  cursor: pointer;
  opacity: 0;
  transform: translateY(10px);
  animation: member-in 0.35s ease forwards;
  animation-delay: var(--member-delay);
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

@keyframes member-in {
  to { opacity: 1; transform: translateY(0); }
}

.wr-member-avatar {
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
}

.wr-member-info {
  min-width: 0;
  display: grid;
  gap: 0.1rem;
  text-align: left;
}

.wr-member-info strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.78rem;
}

.wr-member-info small {
  color: rgba(255,255,255,0.42);
  font-size: 0.68rem;
}

.wr-ticker {
  margin-top: 1rem;
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
}

.wr-ticker div {
  display: flex;
  gap: 1.4rem;
  padding: 0.7rem 0;
  white-space: nowrap;
  animation: ticker 28s linear infinite;
}

.wr-ticker span {
  color: rgba(255,255,255,0.36);
  font-size: 0.74rem;
}

@keyframes ticker {
  to { transform: translateX(-50%); }
}

@media (max-width: 860px) {
  .wr-inner {
    padding: 1rem;
  }

  .wr-header {
    flex-direction: column;
    padding-top: 3rem;
    padding-right: 0;
  }

  .wr-stats {
    align-self: stretch;
  }

  .wr-stage {
    grid-template-columns: 1fr;
  }

  .wr-focus {
    grid-template-columns: 92px minmax(0, 1fr);
  }

  .wr-focus-ring {
    left: 26px;
    width: 96px;
    height: 96px;
  }

  .wr-spotlight {
    grid-template-columns: repeat(5, minmax(56px, 1fr));
    overflow-x: auto;
  }
}

@media (max-width: 560px) {
  .wr-title-block h3 {
    font-size: 1.45rem;
  }

  .wr-stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .wr-stats div {
    padding: 0.55rem 0.45rem;
  }

  .wr-wall {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .wr-member {
    gap: 0.5rem;
    padding: 0.55rem;
  }
}
</style>
