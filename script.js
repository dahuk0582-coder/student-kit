// Student Toolkit - UI 요소 참조 준비

const charTextInput = document.getElementById("charTextInput");
const includeSpaceCheck = document.getElementById("includeSpaceCheck");
const clearCharBtn = document.getElementById("clearCharBtn");
const charCountResult = document.getElementById("charCountResult");

const ddayTitleInput = document.getElementById("ddayTitleInput");
const ddayDateInput = document.getElementById("ddayDateInput");
const calcDdayBtn = document.getElementById("calcDdayBtn");
const ddayResult = document.getElementById("ddayResult");

const orderNamesInput = document.getElementById("orderNamesInput");
const shuffleOrderBtn = document.getElementById("shuffleOrderBtn");
const randomOrderResult = document.getElementById("randomOrderResult");

const teamMembersInput = document.getElementById("teamMembersInput");
const teamSplitModeRadios = document.querySelectorAll('input[name="teamSplitMode"]');
const teamSizeInput = document.getElementById("teamSizeInput");
const makeTeamBtn = document.getElementById("makeTeamBtn");
const teamResult = document.getElementById("teamResult");

const speechScriptInput = document.getElementById("speechScriptInput");
const speechSpeedSelect = document.getElementById("speechSpeedSelect");
const calcSpeechBtn = document.getElementById("calcSpeechBtn");
const speechTimeResult = document.getElementById("speechTimeResult");

const stopwatchDisplay = document.getElementById("stopwatchDisplay");
const startStopwatchBtn = document.getElementById("startStopwatchBtn");
const stopStopwatchBtn = document.getElementById("stopStopwatchBtn");
const resetStopwatchBtn = document.getElementById("resetStopwatchBtn");
const stopwatchStatus = document.getElementById("stopwatchStatus");

const heightInput = document.getElementById("heightInput");
const weightInput = document.getElementById("weightInput");
const calcBmiBtn = document.getElementById("calcBmiBtn");
const bmiResult = document.getElementById("bmiResult");

const checklistItemInput = document.getElementById("checklistItemInput");
const addChecklistBtn = document.getElementById("addChecklistBtn");
const checklistContainer = document.getElementById("checklistContainer");
const checklistSummary = document.getElementById("checklistSummary");

// --- 1. 글자 수 계산기 기능 ---

function updateCharCount() {
  if (!charTextInput || !includeSpaceCheck || !charCountResult) {
    return;
  }

  const rawText = charTextInput.value;
  if (includeSpaceCheck.checked) {
    charCountResult.textContent = `공백 포함 ${rawText.length}자`;
  } else {
    const noSpaceText = rawText.replace(/\s+/g, "");
    charCountResult.textContent = `공백 제외 ${noSpaceText.length}자`;
  }
}

if (charTextInput) {
  charTextInput.addEventListener("input", updateCharCount);
}

if (includeSpaceCheck) {
  includeSpaceCheck.addEventListener("change", updateCharCount);
}

if (clearCharBtn) {
  clearCharBtn.addEventListener("click", function () {
    if (charTextInput) {
      charTextInput.value = "";
      charTextInput.focus();
    }
    updateCharCount();
  });
}

updateCharCount();

// --- 2. D-day 계산기 기능 ---

function getKstTodayUtcMidnight() {
  const nowKst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return Date.UTC(
    nowKst.getUTCFullYear(),
    nowKst.getUTCMonth(),
    nowKst.getUTCDate()
  );
}

function parseDateInputUtcMidnight(dateString) {
  const parts = dateString.split("-");
  if (parts.length !== 3) {
    return NaN;
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  if (!year || !month || !day) {
    return NaN;
  }

  const utcMs = Date.UTC(year, month - 1, day);
  const checkDate = new Date(utcMs);
  if (
    checkDate.getUTCFullYear() !== year ||
    checkDate.getUTCMonth() !== month - 1 ||
    checkDate.getUTCDate() !== day
  ) {
    return NaN;
  }

  return utcMs;
}

function updateDdayResult() {
  if (!ddayDateInput || !ddayResult) {
    return;
  }

  const rawDate = ddayDateInput.value;
  const titleText = ddayTitleInput ? ddayTitleInput.value.trim() : "";
  const prefix = titleText ? `[${titleText}] ` : "";

  if (!rawDate) {
    ddayResult.textContent = "목표 날짜를 선택해 주세요.";
    return;
  }

  const targetUtcMs = parseDateInputUtcMidnight(rawDate);
  if (Number.isNaN(targetUtcMs)) {
    ddayResult.textContent = "유효한 날짜를 선택해 주세요.";
    return;
  }

  const todayUtcMs = getKstTodayUtcMidnight();
  const msPerDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.round((targetUtcMs - todayUtcMs) / msPerDay);

  if (diffDays > 0) {
    ddayResult.textContent = `${prefix}D-${diffDays} (${diffDays}일 남았습니다)`;
  } else if (diffDays === 0) {
    ddayResult.textContent = `${prefix}D-Day (오늘입니다)`;
  } else {
    const passedDays = Math.abs(diffDays);
    ddayResult.textContent = `${prefix}D+${passedDays} (${passedDays}일 지났습니다)`;
  }
}

function resetDday() {
  if (ddayTitleInput) {
    ddayTitleInput.value = "";
  }
  if (ddayDateInput) {
    ddayDateInput.value = "";
  }
  if (ddayResult) {
    ddayResult.textContent = "목표 날짜를 선택해 주세요.";
  }
}

if (ddayDateInput) {
  ddayDateInput.addEventListener("change", updateDdayResult);
}

if (calcDdayBtn) {
  calcDdayBtn.addEventListener("click", resetDday);
}

// --- 3. 랜덤 순서 정하기 기능 ---

let lastOrderKey = "";

function parseLineNames(rawText) {
  const lines = rawText.split(/\r?\n/);
  const names = [];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed !== "") {
      names.push(trimmed);
    }
  }

  return names;
}

function shuffleArrayInPlace(list) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = list[i];
    list[i] = list[j];
    list[j] = temp;
  }
  return list;
}

function renderShuffledOrder() {
  if (!orderNamesInput || !randomOrderResult) {
    return;
  }

  const names = parseLineNames(orderNamesInput.value);

  if (names.length === 0) {
    lastOrderKey = "";
    randomOrderResult.style.whiteSpace = "pre-line";
    randomOrderResult.textContent = "이름을 한 줄에 한 명씩 입력해 주세요.";
    return;
  }

  let shuffled = shuffleArrayInPlace(names.slice());

  if (names.length >= 2) {
    let attempts = 0;
    while (shuffled.join("\n") === lastOrderKey && attempts < 5) {
      shuffled = shuffleArrayInPlace(names.slice());
      attempts++;
    }
  }

  lastOrderKey = shuffled.join("\n");

  const formattedLines = [];
  for (let i = 0; i < shuffled.length; i++) {
    formattedLines.push(`${i + 1}. ${shuffled[i]}`);
  }

  randomOrderResult.style.whiteSpace = "pre-line";
  randomOrderResult.textContent = formattedLines.join("\n");
}

if (shuffleOrderBtn) {
  shuffleOrderBtn.addEventListener("click", renderShuffledOrder);
}

// --- 4. 팀 구성하기 기능 ---

function getSelectedTeamSplitMode() {
  for (let i = 0; i < teamSplitModeRadios.length; i++) {
    if (teamSplitModeRadios[i].checked) {
      return teamSplitModeRadios[i].value;
    }
  }
  return "teamCount";
}

function buildBalancedTeams() {
  if (!teamMembersInput || !teamSizeInput || !teamResult) {
    return;
  }

  const members = parseLineNames(teamMembersInput.value);
  const mode = getSelectedTeamSplitMode();
  const rawSize = Number(teamSizeInput.value);

  teamResult.style.whiteSpace = "pre-line";

  if (members.length === 0) {
    teamResult.textContent = "오류: 학생 이름을 한 줄에 한 명씩 입력해 주세요.";
    return;
  }

  if (!Number.isInteger(rawSize) || rawSize < 1) {
    teamResult.textContent = "오류: 팀 수 또는 팀당 인원은 1 이상의 정수로 입력해 주세요.";
    return;
  }

  if (mode === "teamCount" && rawSize > members.length) {
    teamResult.textContent = `오류: 입력한 인원(${members.length}명)보다 많은 팀(${rawSize}팀)을 만들 수 없습니다.`;
    return;
  }

  const shuffled = shuffleArrayInPlace(members.slice());
  let totalTeams = 1;

  if (mode === "teamCount") {
    totalTeams = rawSize;
  } else {
    totalTeams = Math.ceil(shuffled.length / rawSize);
  }

  // 라운드 로빈 방식으로 중복 없이 최대한 균등하게 배정
  const teams = [];
  for (let t = 0; t < totalTeams; t++) {
    teams.push([]);
  }

  for (let i = 0; i < shuffled.length; i++) {
    teams[i % totalTeams].push(shuffled[i]);
  }

  const outputLines = [];
  for (let t = 0; t < teams.length; t++) {
    outputLines.push(`팀 ${t + 1} (${teams[t].length}명): ${teams[t].join(", ")}`);
  }

  teamResult.textContent = outputLines.join("\n");
}

if (makeTeamBtn) {
  makeTeamBtn.addEventListener("click", buildBalancedTeams);
}

// --- 5. 발표 시간 계산기 기능 ---

function updateSpeechTime() {
  if (!speechScriptInput || !speechSpeedSelect || !speechTimeResult) {
    return;
  }

  const noSpaceChars = speechScriptInput.value.replace(/\s+/g, "");
  const charCount = noSpaceChars.length;
  const speedPerMinute = Number(speechSpeedSelect.value) || 300;
  const totalSeconds = Math.round((charCount / speedPerMinute) * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  speechTimeResult.style.whiteSpace = "pre-line";
  speechTimeResult.textContent =
    `예상 발표 시간: ${minutes}분 ${seconds}초 (공백 제외 ${charCount}자, ${speedPerMinute}자/분 기준)\n` +
    `※ 예상치이며 실제 발표 시간과 다를 수 있습니다.`;
}

if (speechScriptInput) {
  speechScriptInput.addEventListener("input", updateSpeechTime);
}

if (speechSpeedSelect) {
  speechSpeedSelect.addEventListener("change", updateSpeechTime);
}

if (calcSpeechBtn) {
  calcSpeechBtn.addEventListener("click", updateSpeechTime);
}

updateSpeechTime();

// --- 6. 스톱워치 기능 ---

let stopwatchSeconds = 0;
let stopwatchIntervalId = null;

function renderStopwatch() {
  const minutes = Math.floor(stopwatchSeconds / 60);
  const seconds = stopwatchSeconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  if (stopwatchDisplay) {
    stopwatchDisplay.textContent = `${mm}:${ss}`;
  }
}

function startStopwatch() {
  if (stopwatchIntervalId !== null) {
    return;
  }

  stopwatchIntervalId = setInterval(function () {
    stopwatchSeconds += 1;
    renderStopwatch();
  }, 1000);

  if (stopwatchStatus) {
    stopwatchStatus.textContent = "측정 중";
  }
}

function stopStopwatch() {
  if (stopwatchIntervalId !== null) {
    clearInterval(stopwatchIntervalId);
    stopwatchIntervalId = null;
  }

  if (stopwatchStatus) {
    stopwatchStatus.textContent = "일시 정지";
  }
}

function resetStopwatch() {
  if (stopwatchIntervalId !== null) {
    clearInterval(stopwatchIntervalId);
    stopwatchIntervalId = null;
  }

  stopwatchSeconds = 0;
  renderStopwatch();

  if (stopwatchStatus) {
    stopwatchStatus.textContent = "대기 중";
  }
}

if (startStopwatchBtn) {
  startStopwatchBtn.addEventListener("click", startStopwatch);
}

if (stopStopwatchBtn) {
  stopStopwatchBtn.addEventListener("click", stopStopwatch);
}

if (resetStopwatchBtn) {
  resetStopwatchBtn.addEventListener("click", resetStopwatch);
}

renderStopwatch();

// --- 7. BMI 계산기 기능 ---

function classifyBmi(bmiValue) {
  if (bmiValue < 18.5) {
    return "저체중";
  } else if (bmiValue < 23) {
    return "정상";
  } else if (bmiValue < 25) {
    return "비만 전단계";
  } else if (bmiValue < 30) {
    return "1단계 비만";
  } else if (bmiValue < 35) {
    return "2단계 비만";
  } else {
    return "3단계 비만";
  }
}

function calculateBmi() {
  if (!heightInput || !weightInput || !bmiResult) {
    return;
  }

  const heightCm = Number(heightInput.value);
  const weightKg = Number(weightInput.value);
  const disclaimer = "※ BMI는 참고용 지표이며 건강 진단이 아닙니다.";

  bmiResult.style.whiteSpace = "pre-line";

  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
    bmiResult.textContent = `키(cm)와 체중(kg)을 0보다 큰 숫자로 올바르게 입력해 주세요.\n${disclaimer}`;
    return;
  }

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const roundedBmi = bmi.toFixed(1);
  const category = classifyBmi(bmi);

  bmiResult.textContent = `BMI: ${roundedBmi} (${category})\n${disclaimer}`;
}

if (calcBmiBtn) {
  calcBmiBtn.addEventListener("click", calculateBmi);
}

// --- 8. 준비물 체크리스트 기능 ---

function updateChecklistSummary() {
  if (!checklistContainer || !checklistSummary) {
    return;
  }

  const items = checklistContainer.querySelectorAll(".checklist-item");
  const totalCount = items.length;
  let completedCount = 0;

  for (let i = 0; i < items.length; i++) {
    if (items[i].classList.contains("is-completed")) {
      completedCount += 1;
    }
  }

  checklistSummary.textContent = `전체 ${totalCount}개 / 완료 ${completedCount}개`;
}

function addChecklistItem() {
  if (!checklistItemInput || !checklistContainer) {
    return;
  }

  const itemText = checklistItemInput.value.trim();
  if (itemText === "") {
    checklistItemInput.focus();
    return;
  }

  const li = document.createElement("li");
  li.classList.add("checklist-item");

  const label = document.createElement("label");
  label.classList.add("checklist-label");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  const span = document.createElement("span");
  span.classList.add("checklist-text");
  span.textContent = itemText;

  checkbox.addEventListener("change", function () {
    li.classList.toggle("is-completed", checkbox.checked);
    updateChecklistSummary();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.classList.add("checklist-delete-btn");
  deleteBtn.textContent = "삭제";

  deleteBtn.addEventListener("click", function () {
    li.remove();
    updateChecklistSummary();
  });

  label.append(checkbox, span);
  li.append(label, deleteBtn);
  checklistContainer.append(li);

  checklistItemInput.value = "";
  checklistItemInput.focus();
  updateChecklistSummary();
}

if (addChecklistBtn) {
  addChecklistBtn.addEventListener("click", addChecklistItem);
}

updateChecklistSummary();